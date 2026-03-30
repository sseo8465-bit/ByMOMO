'use client';

// 프로필 플로우 공통 레이아웃 — StepIndicator + GNB 포함
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import StepIndicator from '@/shared/components/StepIndicator';

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();

  // URL 경로로 현재 스텝 결정
  const getCurrentStep = (): number => {
    if (pathname === '/profile/preference') return 3;
    if (pathname === '/profile/health') return 2;
    return 1;
  };

  return (
    <>
      <GNB activeItem="shop" />

      <div className="px-6 py-10">
        <StepIndicator currentStep={getCurrentStep()} />
      </div>

      {/* ── 페이지 전환 시 부드러운 fade-in 효과 — key로 리렌더 트리거 ── */}
      <div key={pathname} className="px-6 py-10 animate-fade-in">
        {children}
      </div>

      <Footer />
    </>
  );
}
