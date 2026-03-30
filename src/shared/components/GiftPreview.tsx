'use client';

// ──────────────────────────────────────────────
// 선물 포장 프리뷰 카드 — v3 이솝 스타일
// Unsplash 외부 이미지 제거 → pure CSS 선물 박스 비주얼
// 반려견 이름, 주문 정보, 알러지 상태 표시
// 사용처: /cart, /checkout
// ──────────────────────────────────────────────

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
    : '제외 재료 없음';

  return (
    <div className={`bg-[var(--cream)] overflow-hidden text-center ${className}`}>
      {/* ── Pure CSS 선물 박스 비주얼 ── */}
      <div className="relative h-[140px] md:h-[180px] bg-[var(--oatmeal)] flex items-center justify-center overflow-hidden">
        {/* 배경 그라데이션 */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, var(--oatmeal) 0%, var(--cream) 50%, var(--oatmeal) 100%)',
          }}
        />

        {/* 선물 박스 */}
        <div className="relative" aria-hidden="true">
          {/* 박스 본체 */}
          <div
            className="w-[72px] h-[52px] md:w-[88px] md:h-[64px] relative"
            style={{ backgroundColor: 'var(--warm-taupe-light)' }}
          >
            {/* 박스 뚜껑 */}
            <div
              className="absolute -top-[10px] md:-top-[12px] -left-[4px] -right-[4px] h-[10px] md:h-[12px]"
              style={{ backgroundColor: 'var(--latte-light)' }}
            />

            {/* 세로 리본 */}
            <div
              className="absolute top-[-10px] md:top-[-12px] left-1/2 -translate-x-1/2 w-[10px] md:w-[12px] bottom-0"
              style={{ backgroundColor: 'var(--walnut)' }}
            />

            {/* 가로 리본 */}
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[10px] md:h-[12px]"
              style={{ backgroundColor: 'var(--walnut)' }}
            />

            {/* 리본 교차점 장식 */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[14px] h-[14px] md:w-[16px] md:h-[16px]"
              style={{ backgroundColor: 'var(--walnut-dark)' }}
            />
          </div>

          {/* 리본 보우 (상단) */}
          <div className="absolute -top-[26px] md:-top-[32px] left-1/2 -translate-x-1/2 flex items-end gap-[2px]">
            {/* 왼쪽 루프 */}
            <div
              className="w-[14px] h-[18px] md:w-[16px] md:h-[22px] border-[2px] md:border-[2.5px]"
              style={{
                borderColor: 'var(--walnut)',
                backgroundColor: 'transparent',
                borderRadius: '50% 50% 0 0',
                transform: 'rotate(-15deg)',
              }}
            />
            {/* 오른쪽 루프 */}
            <div
              className="w-[14px] h-[18px] md:w-[16px] md:h-[22px] border-[2px] md:border-[2.5px]"
              style={{
                borderColor: 'var(--walnut)',
                backgroundColor: 'transparent',
                borderRadius: '50% 50% 0 0',
                transform: 'rotate(15deg)',
              }}
            />
          </div>
        </div>

        {/* By MOMO 워터마크 */}
        <p
          className="absolute bottom-3 right-4 font-[var(--font-serif)] text-[10px] md:text-[11px] italic tracking-[0.04em]"
          style={{ color: 'var(--warm-taupe-light)' }}
        >
          By MOMO
        </p>
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
