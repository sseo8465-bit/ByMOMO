'use client';

// ──────────────────────────────────────────────
// 회원가입 페이지
// 역할: 카카오 로그인 또는 비회원 진행 선택
// 플로우: 카카오 로그인 성공 → 장바구니 / 비회원 → 장바구니
// ──────────────────────────────────────────────
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import Button from '@/shared/components/Button';
import BenefitList from '@/shared/components/BenefitList';  // 혜택 공통 컴포넌트
import { useAuth } from '@/domains/auth/auth.context';

export default function SignupPage() {
  const router = useRouter();
  const { loginWithKakao } = useAuth();

  // ── 카카오 로그인 핸들러 — 비동기 처리 (로그인 완료 후 이동) ──
  const handleKakaoLogin = async () => {
    await loginWithKakao();
    router.push('/cart');  // 로그인 완료 후 장바구니로 이동
  };

  // ── 비회원 계속 핸들러 — 로그인 없이 장바구니로 이동 ──
  const handleContinueAsGuest = () => {
    router.push('/cart');
  };

  return (
    <>
      <GNB />

      {/* ── 메인 콘텐츠 — 수직 중앙 정렬 ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 min-h-[60vh]">
        <div className="w-full flex flex-col items-center text-center">

          {/* ── 페이지 타이틀 — 세리프 폰트 ── */}
          <h1 className="font-[var(--font-serif)] text-[28px] font-medium text-[var(--walnut)] leading-[1.5] mb-3">
            간편 가입
          </h1>

          {/* 서브 카피 — 핵심 혜택 요약 */}
          <p className="text-[15px] text-[var(--warm-gray)] leading-[1.7] mb-10">
            가입하시면 프로필 저장과 첫 구매 5% 할인을 드립니다.
          </p>

          {/* ── 혜택 안내 — 공통 컴포넌트 사용 (cart BottomSheet과 동일) ── */}
          <BenefitList className="w-full mb-10" />

          {/* ── 로그인 버튼 그룹 ── */}
          <div className="w-full flex flex-col gap-3">
            {/* 카카오 로그인 — 메인 CTA */}
            <Button variant="kakao" onClick={handleKakaoLogin}>
              카카오로 시작하기
            </Button>
            {/* 비회원 진행 — 서브 CTA */}
            <Button variant="ghost" onClick={handleContinueAsGuest}>
              비회원으로 계속
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
