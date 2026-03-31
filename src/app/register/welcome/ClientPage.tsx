'use client';

// ──────────────────────────────────────────────
// 회원가입 완료(웰컴) 페이지 — By MOMO 브랜드 스타일
// 가입 성공 후 리다이렉트되어 고객에게 가입 완료를 알려주는 페이지
// URL 파라미터로 이름·이메일·회원유형을 전달받아 표시
// ──────────────────────────────────────────────

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import Logo from '@/shared/components/Logo';

// ── 웰컴 콘텐츠 ──
// useSearchParams 사용 시 Suspense 경계 필요 (Next.js 15 요구사항)
function WelcomeContent() {
  const searchParams = useSearchParams();

  // URL 파라미터에서 가입 정보 추출
  const name = searchParams.get('name') || '회원';
  const email = searchParams.get('email') || '';
  const memberType = searchParams.get('type') || '일반회원';

  return (
    <div className="page-padding section-spacing">
      <div className="max-w-[480px] mx-auto text-center">

        {/* ── 로고 ── */}
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        {/* ── 상단 영문 라벨 ── */}
        <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--warm-taupe)] mb-4">
          Welcome
        </p>

        {/* ── 메인 타이틀 ── */}
        <h1 className="font-[var(--font-serif)] text-[26px] md:text-[32px] font-medium text-[var(--charcoal)] tracking-[0.01em] mb-10">
          WELCOME!
        </h1>

        {/* ── 환영 메시지 ── */}
        <div className="mb-10">
          <p className="font-[var(--font-ui)] text-[14px] md:text-[15px] text-[var(--charcoal)] leading-[1.8] tracking-[0.02em] mb-2">
            회원가입이 완료되었습니다.
          </p>
          <p className="font-[var(--font-ui)] text-[14px] md:text-[15px] text-[var(--charcoal)] leading-[1.8] tracking-[0.02em]">
            {name}님은 <span className="font-semibold">[{memberType}]</span> 회원이십니다.
          </p>
        </div>

        {/* ── 구분선 ── */}
        <div className="border-t border-[var(--oatmeal)] my-8" />

        {/* ── 가입 정보 요약 ── */}
        <div className="text-left space-y-5 mb-10">
          {email && (
            <div className="flex">
              <span className="w-[80px] font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--warm-taupe)] tracking-[0.04em] flex-shrink-0">
                이메일
              </span>
              <span className="font-[var(--font-ui)] text-[13px] md:text-[14px] text-[var(--charcoal)] tracking-[0.02em]">
                {email}
              </span>
            </div>
          )}
          <div className="flex">
            <span className="w-[80px] font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--warm-taupe)] tracking-[0.04em] flex-shrink-0">
              이 름
            </span>
            <span className="font-[var(--font-ui)] text-[13px] md:text-[14px] text-[var(--charcoal)] tracking-[0.02em]">
              {name}
            </span>
          </div>
        </div>

        {/* ── 메인으로 버튼 — 이솝/PVCS 스타일 아웃라인 ── */}
        <Link
          href="/"
          className="block w-full py-4 md:py-5 text-center text-[13px] md:text-[14px] font-[var(--font-ui)] font-bold tracking-[0.06em] border border-[var(--charcoal)] text-[var(--charcoal)] hover:bg-[var(--charcoal)] hover:text-white transition-colors"
        >
          메인으로
        </Link>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ──
// Suspense로 감싸야 useSearchParams가 서버사이드에서 에러 없이 동작
export default function WelcomeClientPage() {
  return (
    <>
      <GNB />
      <Suspense fallback={
        <div className="page-padding section-spacing text-center">
          <p className="font-[var(--font-ui)] text-[14px] text-[var(--warm-taupe)]">로딩 중...</p>
        </div>
      }>
        <WelcomeContent />
      </Suspense>
      <Footer />
    </>
  );
}
