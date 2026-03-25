'use client';

// 회원가입 페이지 — 카카오 로그인 SDK 연동
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import Button from '@/shared/components/Button';
import { useAuth } from '@/domains/auth/auth.context';

export default function SignupPage() {
  const router = useRouter();
  const { loginWithKakao } = useAuth();

  const handleKakaoLogin = () => {
    loginWithKakao();
    // 로그인 성공 후 리디렉트는 auth.context에서 처리
    // 여기서는 심플하게 카트로 이동
    router.push('/cart');
  };

  const handleContinueAsGuest = () => {
    router.push('/cart');
  };

  return (
    <>
      <GNB />

      <div className="flex-1 flex items-center justify-center px-6 py-16 min-h-[60vh]">
        <div className="w-full flex flex-col items-center text-center">
          {/* ── 헤더 ── */}
          <h1 className="font-[var(--font-serif)] text-[28px] font-medium text-[var(--walnut)] leading-[1.5] mb-3">
            간편 가입
          </h1>
          <p className="text-[15px] text-[var(--warm-gray)] leading-[1.7] mb-10">
            가입하시면 프로필 저장 + 첫 구매 5% 할인
          </p>

          {/* ── 가입 혜택 안내 ── */}
          <div className="w-full bg-[var(--cream)] rounded-xl p-5 mb-10">
            <div className="flex flex-col gap-2 text-[14px] text-[var(--charcoal)]">
              <p>✓ 프로필 저장 → 다음 주문 시 바로 추천</p>
              <p>✓ 첫 구매 5% 할인 쿠폰</p>
              <p>✓ 구독 서비스 사전 알림</p>
            </div>
          </div>

          {/* 카카오 로그인 */}
          <div className="w-full flex flex-col gap-3">
            <Button variant="kakao" onClick={handleKakaoLogin}>
              카카오로 시작하기
            </Button>
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
