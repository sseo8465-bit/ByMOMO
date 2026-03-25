'use client';

// ──────────────────────────────────────────────
// 주문 완료 페이지
// 역할: 결제 성공 후 주문번호 표시 + CTA 제공
// CTA 우선순위: 홈으로 (primary) > 구독 알아보기 (soft)
// ──────────────────────────────────────────────
import { useState } from 'react';
import Link from 'next/link';
import GNB from '@/shared/components/GNB';
import Button from '@/shared/components/Button';
import Footer from '@/shared/components/Footer';

// ── SVG 체크 아이콘 — 이솝 톤에 맞는 미니멀 체크마크 ──
// 이모지(✓) 대신 SVG 사용 → 브랜드 일관성 유지
function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--walnut)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function OrderCompletePage() {
  // ── 주문번호 생성 — 타임스탬프 기반 고유 번호 ──
  const [orderNumber] = useState(
    () => `MOMO-${new Date().getTime().toString().slice(-8)}`
  );

  return (
    <>
      <GNB />

      {/* ── 주문 완료 메인 영역 — 수직 중앙 정렬 ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 min-h-[60vh] text-center">

        {/* ── 성공 아이콘 — 크림색 원 안에 SVG 체크 ── */}
        <div className="w-14 h-14 rounded-full bg-[var(--cream)] flex items-center justify-center mb-5">
          <CheckIcon />
        </div>

        {/* 주문 완료 타이틀 — 세리프 폰트 */}
        <h1 className="font-[var(--font-serif)] text-[28px] font-medium text-[var(--walnut)] mb-2">
          주문이 완료되었습니다
        </h1>

        {/* 안내 문구 — 브랜드 톤: 정중하고 따뜻하게 */}
        <p className="text-[14px] text-[var(--warm-gray)] mb-10">
          카카오톡으로 주문 알림이 발송됩니다.
        </p>

        {/* ── 주문번호 표시 카드 ── */}
        <div className="bg-[var(--cream)] rounded-xl px-6 py-4 mb-10">
          {/* 라벨 — 아이브로우 스타일 (대문자, 넓은 자간) */}
          <p className="text-[10px] text-[var(--warm-taupe)] font-[var(--font-ui)] uppercase tracking-[0.15em] mb-1">
            Order No.
          </p>
          {/* 실제 주문번호 */}
          <p className="font-[var(--font-ui)] text-[15px] font-semibold text-[var(--charcoal)]">
            {orderNumber}
          </p>
        </div>

        {/* ── CTA 버튼 그룹 ── */}
        <div className="w-full flex flex-col gap-3 max-w-[280px]">
          {/* 메인 CTA — 홈으로 */}
          <Link href="/">
            <Button variant="primary" className="w-full">
              홈으로
            </Button>
          </Link>
          {/* 서브 CTA — 구독 페이지로 */}
          <Link href="/subscription">
            <Button variant="soft" className="w-full">
              구독 알아보기
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
