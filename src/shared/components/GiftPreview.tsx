'use client';

// ──────────────────────────────────────────────
// 선물 포장 프리뷰 카드 — 와이어프레임 v2.1
// 반려견 이름, 주문 정보, 알러지 상태 표시
// ──────────────────────────────────────────────

import Image from 'next/image';
import { useCart } from '@/domains/cart/cart.context';
import { useProfile } from '@/domains/profile/profile.context';

interface GiftPreviewProps {
  className?: string;
}

export default function GiftPreview({ className = '' }: GiftPreviewProps) {
  const { items } = useCart();
  const { profile } = useProfile();

  const dogName = profile.name || '우리 아이';
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const productNames = items.map((item) => item.product.name).join(', ');
  const today = new Date();
  const dateLabel = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

  // 알러지 상태
  const allergyStatus = profile.dislikedIngredients.length > 0
    ? `${profile.dislikedIngredients.join(', ')} 제외`
    : '알러지 프리';

  return (
    <div className={`bg-[var(--cream)] overflow-hidden text-center ${className}`}>
      {/* 선물 포장 이미지 */}
      <div className="relative h-[140px] md:h-[180px]">
        <Image
          src="https://images.unsplash.com/photo-1549465220-1a8b9238f59e?w=600&h=280&fit=crop&crop=center"
          alt="By MOMO 선물 포장"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="px-6 py-6 md:py-8">
        {/* Eyebrow 라벨 */}
        <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] font-medium tracking-[0.18em] uppercase text-[var(--warm-taupe)] mb-3">
          Gift Package
        </p>

        {/* 반려견 이름 */}
        <p className="font-[var(--font-serif)] text-[20px] md:text-[24px] font-medium text-[var(--walnut)] mb-2 tracking-[0.01em]">
          For {dogName}
        </p>

        {/* 주문 정보 */}
        <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] text-[var(--warm-gray)] mb-1 tracking-[0.04em]">
          {productNames || 'By MOMO 수제간식'} · {totalItems}개
        </p>

        {/* 알러지 상태 · 날짜 */}
        <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] text-[var(--warm-taupe)] mb-4 tracking-[0.04em]">
          {allergyStatus} · {dateLabel}
        </p>

        {/* 구분선 + 안내 문구 */}
        <div className="border-t border-[var(--oatmeal)] pt-4">
          <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] text-[var(--warm-taupe)] italic leading-[1.7] tracking-[0.02em]">
            별도의 옵션 없이 모든 주문을 선물 박스에 담아 보냅니다.
          </p>
        </div>
      </div>
    </div>
  );
}
