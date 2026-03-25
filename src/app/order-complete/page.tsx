'use client';

export const dynamic = 'force-dynamic';

// 주문 완료 페이지 — CTA 우선순위: 홈 > 구독 알아보기
import { useState } from 'react';
import Link from 'next/link';
import GNB from '@/shared/components/GNB';
import Button from '@/shared/components/Button';
import Footer from '@/shared/components/Footer';

export default function OrderCompletePage() {
  const [orderNumber] = useState(
    () => `MOMO-${new Date().getTime().toString().slice(-8)}`
  );

  return (
    <>
      <GNB />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 min-h-[60vh] text-center">
        {/* ── 성공 아이콘 ── */}
        <div className="w-14 h-14 rounded-full bg-[var(--cream)] flex items-center justify-center mb-5">
          <span className="text-[24px]">✓</span>
        </div>

        <h1 className="font-[var(--font-serif)] text-[28px] font-medium text-[var(--walnut)] mb-2">
          주문이 완료되었습니다
        </h1>
        <p className="text-[14px] text-[var(--warm-gray)] mb-10">
          카카오톡으로 주문 알림이 발송됩니다.
        </p>

        {/* ── 주문번호 ── */}
        <div className="bg-[var(--cream)] rounded-xl px-6 py-4 mb-10">
          <p className="text-[10px] text-[var(--warm-taupe)] font-[var(--font-ui)] uppercase tracking-[0.15em] mb-1">
            Order No.
          </p>
          <p className="font-[var(--font-ui)] text-[15px] font-semibold text-[var(--charcoal)]">
            {orderNumber}
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="w-full flex flex-col gap-3 max-w-[280px]">
          <Link href="/">
            <Button variant="primary" className="w-full">
              홈으로
            </Button>
          </Link>
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
