// 선물 포장 프리뷰 카드 — 와이어프레임 v2.1 일치
// 장바구니 페이지 내 선물 포장 미리보기 (이솝 감성)
'use client';

import Image from 'next/image';
import { useCart } from '@/domains/cart/cart.context';

interface GiftPreviewProps {
  className?: string;
}

export default function GiftPreview({ className = '' }: GiftPreviewProps) {
  const { items } = useCart();

  // 장바구니 첫 번째 상품 정보로 선물 미리보기 구성
  const firstItem = items[0];
  const productName = firstItem?.product.name ?? 'By MOMO 수제간식';
  const today = new Date();
  const dateLabel = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className={`bg-[var(--cream)] rounded-xl overflow-hidden text-center ${className}`}>
      {/* 선물 포장 이미지 */}
      <div className="relative h-[140px]">
        <Image
          src="https://images.unsplash.com/photo-1549465220-1a8b9238f59e?w=600&h=280&fit=crop&crop=center"
          alt="By MOMO 선물 포장"
          fill
          className="object-cover"
          sizes="(max-width: 430px) 100vw"
        />
      </div>

      <div className="px-5 py-5">
        {/* Eyebrow 라벨 */}
        <p className="font-[var(--font-ui)] text-[9px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Gift Package
        </p>

        {/* 반려견 이름 또는 상품명 */}
        <p className="font-[var(--font-serif)] text-[20px] font-semibold text-[var(--walnut)] mb-1">
          {productName}
        </p>

        {/* 부가 정보 */}
        <p className="text-[11px] text-[var(--warm-gray)] mb-3">
          {productName} · 알러지 프리 · {dateLabel}
        </p>

        {/* 구분선 + 안내 문구 */}
        <div className="border-t border-[var(--oatmeal)] pt-3">
          <p className="text-[11px] text-[var(--warm-taupe)] italic leading-[1.6]">
            별도의 옵션 없이 모든 주문을 선물 박스에 담아 보냅니다.
          </p>
        </div>
      </div>
    </div>
  );
}
