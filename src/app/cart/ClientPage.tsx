'use client';

// ──────────────────────────────────────────────
// 장바구니 페이지
// 역할: 담긴 상품 확인, 수량 조절, 선물 포장 프리뷰, 결제 진행
// 플로우: 로그인 → 바로 결제 / 비로그인 → BottomSheet(가입 안내) → 결제
// ──────────────────────────────────────────────
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Button from '@/shared/components/Button';
import Footer from '@/shared/components/Footer';
import GiftPreview from '@/shared/components/GiftPreview';
import BottomSheet from '@/shared/components/BottomSheet';
import BenefitList from '@/shared/components/BenefitList';  // 혜택 공통 컴포넌트 (signup과 동일)
import { useCart } from '@/domains/cart/cart.context';
import { useAuth } from '@/domains/auth/auth.context';

// ── 가격 포맷 유틸 — 원화 표시 통일 ──
// 여러 곳에서 동일 패턴 반복 → 함수로 추출
function formatPrice(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

// ── 수량 조절 버튼 공통 스타일 — 중복 제거 ──
const quantityButtonStyle =
  'w-7 h-7 flex items-center justify-center border border-[var(--oatmeal)] rounded text-[14px] text-[var(--walnut)] hover:border-[var(--walnut)] hover:bg-[var(--cream)] transition-colors';

export default function CartPage() {
  // ── 장바구니 상태 (Context에서 가져옴) ──
  const { items, removeItem, updateQuantity, totalAmount } = useCart();

  // ── 인증 상태 ──
  const { isLoggedIn, loginWithKakao } = useAuth();

  // ── 라우터 ──
  const router = useRouter();

  // ── BottomSheet 표시 여부 (비회원 결제 시 노출) ──
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // ── 결제 버튼 클릭 핸들러 ──
  // 로그인 상태: 바로 결제 페이지로 / 비로그인: BottomSheet 오픈
  const handleCheckout = () => {
    if (isLoggedIn) {
      router.push('/checkout');
    } else {
      setShowBottomSheet(true);
    }
  };

  // ── 카카오 로그인 핸들러 (BottomSheet 내부) ──
  const handleKakaoLogin = async () => {
    await loginWithKakao();       // 로그인 완료 대기
    setShowBottomSheet(false);    // BottomSheet 닫기
    router.push('/checkout');     // 결제 페이지로 이동
  };

  // ── 비회원 결제 핸들러 ──
  const handleGuestCheckout = () => {
    setShowBottomSheet(false);
    router.push('/checkout');
  };

  // ── 빈 장바구니 상태 ──
  if (items.length === 0) {
    return (
      <>
        <GNB activeItem="cart" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 min-h-[60vh]">
          {/* 빈 상태 안내 문구 */}
          <p className="text-[15px] text-[var(--warm-gray)] mb-6">
            장바구니가 비어 있습니다.
          </p>
          {/* 맞춤 간식 찾기 CTA */}
          <Link href="/profile">
            <Button variant="primary" className="min-w-[200px]">
              맞춤 간식 찾기
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <GNB activeItem="cart" />

      <div className="px-6 py-10">
        {/* ── 페이지 타이틀 ── */}
        <h1 className="font-[var(--font-serif)] text-[22px] font-semibold text-[var(--charcoal)] mb-10">
          장바구니
        </h1>

        {/* ── 장바구니 상품 목록 ── */}
        <div className="flex flex-col gap-4 mb-10">
          {items.map((item) => {
            // 상품별 변수 추출 — 가독성 향상
            const itemName = item.product.name;           // 상품명
            const itemPrice = item.product.price;         // 상품 단가
            const itemQuantity = item.quantity;            // 수량
            const itemTotal = itemPrice * itemQuantity;    // 소계 (단가 × 수량)
            const itemId = item.product.id;               // 상품 고유 ID
            const itemImageUrl = item.product.imageUrl;   // 상품 이미지 URL
            const itemImageAlt = item.product.imageAlt;   // 상품 이미지 대체 텍스트

            return (
              <div
                key={itemId}
                className="flex gap-3 pb-4 border-b border-[var(--oatmeal)]"
              >
                {/* 상품 썸네일 이미지 */}
                <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={itemImageUrl}
                    alt={itemImageAlt}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </div>

                {/* 상품 정보 + 수량 조절 영역 */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* 상품명 */}
                    <h3 className="text-[15px] font-medium text-[var(--charcoal)] mb-0.5">
                      {itemName}
                    </h3>
                    {/* 소계 가격 (단가 × 수량) */}
                    <p className="text-[14px] font-[var(--font-ui)] font-semibold text-[var(--walnut)]">
                      {formatPrice(itemTotal)}
                    </p>
                  </div>

                  {/* 수량 조절 + 삭제 버튼 */}
                  <div className="flex items-center gap-3">
                    {/* 수량 감소 버튼 (최소 1) */}
                    <button
                      onClick={() => updateQuantity(itemId, Math.max(1, itemQuantity - 1))}
                      className={quantityButtonStyle}
                      aria-label={`${itemName} 수량 줄이기`}
                    >
                      −
                    </button>
                    {/* 현재 수량 표시 */}
                    <span className="text-[14px] font-[var(--font-ui)] font-medium w-4 text-center">
                      {itemQuantity}
                    </span>
                    {/* 수량 증가 버튼 */}
                    <button
                      onClick={() => updateQuantity(itemId, itemQuantity + 1)}
                      className={quantityButtonStyle}
                      aria-label={`${itemName} 수량 늘리기`}
                    >
                      +
                    </button>
                    {/* 삭제 버튼 — 우측 정렬 */}
                    <button
                      onClick={() => removeItem(itemId)}
                      className="ml-auto text-[12px] text-[var(--warm-gray)] hover:text-[var(--walnut)] transition-colors"
                      aria-label={`${itemName} 삭제`}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 선물 포장 프리뷰 컴포넌트 ── */}
        <GiftPreview className="mb-10" />

        {/* ── 주문 요약 — checkout과 동일한 cream 배경 ── */}
        <div className="bg-[var(--cream)] rounded-[10px] p-5 mb-10">
          {/* 상품 합계 */}
          <div className="flex justify-between py-1.5">
            <span className="text-[13px] text-[var(--warm-gray)]">상품 합계</span>
            <span className="text-[13px] font-[var(--font-ui)] font-medium text-[var(--charcoal)]">
              {formatPrice(totalAmount)}
            </span>
          </div>
          {/* 배송비 */}
          <div className="flex justify-between py-1.5">
            <span className="text-[13px] text-[var(--warm-gray)]">배송비</span>
            <span className="text-[13px] font-[var(--font-ui)] font-medium text-[var(--charcoal)]">무료</span>
          </div>
          {/* 선물 포장 — 기본 포함 강조 (walnut 색상) */}
          <div className="flex justify-between py-1.5">
            <span className="text-[13px] font-medium text-[var(--walnut)]">선물 포장</span>
            <span className="text-[13px] font-[var(--font-ui)] font-medium text-[var(--walnut)]">기본 포함</span>
          </div>
          {/* 총 결제 금액 — 구분선 위 강조 */}
          <div className="flex justify-between pt-3 mt-2 border-t border-[var(--oatmeal)]">
            <span className="text-[16px] font-semibold text-[var(--charcoal)]">총 결제 금액</span>
            <span className="text-[16px] font-[var(--font-ui)] font-semibold text-[var(--charcoal)]">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* ── 결제 버튼 ── */}
        <Button variant="primary" onClick={handleCheckout}>
          결제하기
        </Button>
      </div>

      {/* ── 비회원 결제 BottomSheet — 회원 혜택 안내 ── */}
      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="회원 혜택 안내"
      >
        <div className="flex flex-col gap-4">
          {/* 혜택 목록 — 공통 컴포넌트 (signup과 동일 데이터) */}
          <BenefitList />

          {/* 카카오 로그인 — 메인 CTA */}
          <Button variant="kakao" onClick={handleKakaoLogin}>
            카카오로 시작하기
          </Button>

          {/* 비회원 구매 — 서브 CTA */}
          <Button variant="ghost" onClick={handleGuestCheckout}>
            비회원 구매
          </Button>
        </div>
      </BottomSheet>

      <Footer />
    </>
  );
}
