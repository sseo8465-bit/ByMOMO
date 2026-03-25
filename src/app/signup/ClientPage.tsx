'use client';

// 회원가입 페이지 — 반응형 + 이솝 스타일
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import Button from '@/shared/components/Button';
import BenefitList from '@/shared/components/BenefitList';
import { useAuth } from '@/domains/auth/auth.context';

export default function SignupPage() {
  const router = useRouter();
  const { loginWithKakao } = useAuth();

  const handleKakaoLogin = async () => {
    await loginWithKakao();
    router.push('/cart');
  };

  const handleContinueAsGuest = () => {
    router.push('/cart');
  };

  return (
    <>
      <GNB />

      <div className="flex-1 flex items-center justify-center page-padding py-20 min-h-[60vh]">
        <div className="w-full max-w-[400px] flex flex-col items-center text-center">

          <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-4">
            Join Us
          </p>

          <h1 className="font-[var(--font-serif)] text-[24px] md:text-[28px] font-medium text-[var(--walnut)] leading-[1.5] mb-4 tracking-[0.02em]">
            간편 가입
          </h1>

          <p className="text-[12px] text-[var(--warm-gray)] leading-[1.8] mb-10 tracking-[0.03em]">
            가입하시면 프로필 저장과 첫 구매 5% 할인을 드립니다.
          </p>

          <BenefitList className="w-full mb-10" />

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
