'use client';

// ──────────────────────────────────────────────
// 주문 완료 페이지 — 와이어프레임 v2.1
// 주문 요약: 주문번호, 상품, 금액, 예상배송
// CTA 우선순위: 정기배송 알림 → 주문내역 확인 → 홈으로
// ──────────────────────────────────────────────

import { useState, useMemo } from 'react';
import Link from 'next/link';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--walnut)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 8 11 19 6 14" />
    </svg>
  );
}

export default function OrderCompletePage() {
  const [orderNumber] = useState(
    () => `MOMO-${new Date().getTime().toString().slice(-8)}`
  );

  // 예상 배송일 (주문일 + 3~5일)
  const deliveryEstimate = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() + 3);
    const end = new Date();
    end.setDate(end.getDate() + 5);
    const fmt = (d: Date) =>
      `${d.getMonth() + 1}/${d.getDate()}(${['일', '월', '화', '수', '목', '금', '토'][d.getDay()]})`;
    return `${fmt(start)} ~ ${fmt(end)}`;
  }, []);

  return (
    <>
      <GNB />

      <div className="page-padding section-spacing">
        <div className="max-w-[480px] mx-auto text-center">

          {/* ── 성공 아이콘 ── */}
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--cream)] flex items-center justify-center mb-6">
            <CheckIcon />
          </div>

          {/* 타이틀 */}
          <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--walnut)] mb-3 tracking-[0.01em]">
            주문이 완료되었습니다
          </h1>

          <p className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--warm-gray)] mb-10 tracking-[0.03em]">
            카카오톡으로 주문 알림이 발송됩니다.
          </p>

          {/* ── 주문 요약 카드 ── */}
          <div className="text-left mb-10">
            <div className="border-t border-[var(--oatmeal)]">
              {/* 주문번호 */}
              <div className="flex items-center justify-between py-4 border-b border-[var(--oatmeal)]">
                <span className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.12em] uppercase text-[var(--warm-taupe)]">
                  주문번호
                </span>
                <span className="font-[var(--font-ui)] text-[13px] md:text-[14px] font-medium text-[var(--charcoal)] tracking-[0.02em]">
                  {orderNumber}
                </span>
              </div>

              {/* 주문 상품 (Phase 1: 더미) */}
              <div className="flex items-center justify-between py-4 border-b border-[var(--oatmeal)]">
                <span className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.12em] uppercase text-[var(--warm-taupe)]">
                  상품
                </span>
                <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] tracking-[0.02em]">
                  By MOMO 수제간식
                </span>
              </div>

              {/* 결제 금액 */}
              <div className="flex items-center justify-between py-4 border-b border-[var(--oatmeal)]">
                <span className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.12em] uppercase text-[var(--warm-taupe)]">
                  결제 금액
                </span>
                <span className="font-[var(--font-ui)] text-[13px] md:text-[14px] font-medium text-[var(--charcoal)] tracking-[0.02em]">
                  결제 완료
                </span>
              </div>

              {/* 예상 배송 */}
              <div className="flex items-center justify-between py-4 border-b border-[var(--oatmeal)]">
                <span className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.12em] uppercase text-[var(--warm-taupe)]">
                  예상 배송
                </span>
                <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] tracking-[0.02em]">
                  {deliveryEstimate}
                </span>
              </div>
            </div>
          </div>

          {/* ── CTA 그룹 ── */}
          <div className="flex flex-col gap-3 max-w-[360px] mx-auto">
            {/* 1순위: 정기 배송 알림 받기 → (primary) */}
            <Link href="/subscription" className="block">
              <button className="w-full py-4 bg-[var(--walnut)] text-[var(--cream)] text-[12px] md:text-[13px] font-[var(--font-ui)] tracking-[0.08em] uppercase hover:bg-[var(--walnut-dark)] transition-colors">
                정기 배송 알림 받기 →
              </button>
            </Link>

            {/* 2순위: 주문 내역 확인 (outline) */}
            <Link href="/my" className="block">
              <button className="w-full py-3.5 border border-[var(--walnut)] text-[var(--walnut)] text-[12px] md:text-[13px] font-[var(--font-ui)] tracking-[0.08em] uppercase bg-transparent hover:bg-[var(--cream)] transition-colors">
                주문 내역 확인
              </button>
            </Link>

            {/* 3순위: 홈으로 돌아가기 (text link) */}
            <Link
              href="/"
              className="block text-center mt-2 font-[var(--font-ui)] text-[11px] md:text-[12px] text-[var(--warm-taupe)] hover:text-[var(--walnut)] tracking-[0.06em] transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
