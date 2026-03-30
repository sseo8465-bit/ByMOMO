'use client';

// 장바구니 페이지 — 반응형 + 이솝 스타일
// 역할: 담긴 상품 확인, 수량 조절, 선물 포장 프리뷰, 결제 진행
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Button from '@/shared/components/Button';
import Footer from '@/shared/components/Footer';
import GiftPreview from '@/shared/components/GiftPreview';
import BottomSheet from '@/shared/components/BottomSheet';
import BenefitList from '@/shared/components/BenefitList';
import { useCart } from '@/domains/cart/cart.context';
import { useAuth } from '@/domains/auth/auth.context';

function formatPrice(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();
  const { isLoggedIn, loginWithKakao } = useAuth();
  const router = useRouter();
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const handleCheckout = () => {
    if (isLoggedIn) {
      router.push('/checkout');
    } else {
      setShowBottomSheet(true);
    }
  };

  const handleKakaoLogin = async () => {
    await loginWithKakao();
    setShowBottomSheet(false);
    router.push('/checkout');
  };

  const handleGuestCheckout = () => {
    setShowBottomSheet(false);
    router.push('/checkout');
  };

  // ── 빈 장바구니 상태 ──
  if (items.length === 0) {
    return (
      <>
        <GNB activeItem="cart" />
        <div className="flex-1 flex flex-col items-center justify-center page-padding py-20 min-h-[60vh]">
          <p className="text-[14px] text-[var(--warm-gray)] mb-8 tracking-[0.03em]">
            장바구니가 비어 있어요.
          </p>
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

      {/* lg:pb-0 — 모바일에서는 Bottom Sticky CTA 높이만큼 여백 확보 */}
      <div className="page-padding section-spacing pb-36 lg:pb-[var(--space-section-y)]">
        {/* ── 페이지 타이틀 ── */}
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Cart
        </p>
        <h1 className="font-[var(--font-serif)] text-[20px] md:text-[24px] font-semibold text-[var(--charcoal)] mb-10 tracking-[0.02em]">
          장바구니
        </h1>

        {/* ── 반응형 2컬럼 레이아웃 (데스크탑) ── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* 좌측: 상품 목록 */}
          <div className="flex-1">
            <div className="flex flex-col gap-0">
              {items.map((item) => {
                const itemName = item.product.name;
                const itemPrice = item.product.price;
                const itemQuantity = item.quantity;
                const itemTotal = itemPrice * itemQuantity;
                const itemId = item.product.id;
                const itemImageUrl = item.product.imageUrl;
                const itemImageAlt = item.product.imageAlt;

                return (
                  <div
                    key={itemId}
                    className="flex gap-4 md:gap-6 py-6 border-b border-[var(--oatmeal)]"
                  >
                    {/* 상품 썸네일 — 각진 이미지 */}
                    <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex-shrink-0 overflow-hidden">
                      <Image
                        src={itemImageUrl}
                        alt={itemImageAlt}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>

                    {/* 상품 정보 */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[13px] font-medium text-[var(--charcoal)] mb-1 tracking-[0.02em]">
                          {itemName}
                        </h3>
                        <p className="text-[12px] font-[var(--font-ui)] font-semibold text-[var(--walnut)] tracking-[0.03em]">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>

                      {/* 수량 조절 + 삭제 */}
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => updateQuantity(itemId, Math.max(1, itemQuantity - 1))}
                          className="w-7 h-7 flex items-center justify-center border border-[var(--oatmeal)] text-[13px] text-[var(--walnut)] hover:border-[var(--walnut)] transition-colors"
                          aria-label={`${itemName} 수량 줄이기`}
                        >
                          −
                        </button>
                        <span className="text-[12px] font-[var(--font-ui)] font-medium w-4 text-center">
                          {itemQuantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(itemId, itemQuantity + 1)}
                          className="w-7 h-7 flex items-center justify-center border border-[var(--oatmeal)] text-[13px] text-[var(--walnut)] hover:border-[var(--walnut)] transition-colors"
                          aria-label={`${itemName} 수량 늘리기`}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(itemId)}
                          className="ml-auto text-[11px] text-[var(--warm-gray)] hover:text-[var(--walnut)] transition-colors tracking-[0.03em] underline underline-offset-4 decoration-[var(--warm-gray)]/40"
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

            {/* 선물 포장 프리뷰 */}
            <GiftPreview className="mt-10" />
          </div>

          {/* 우측: 주문 요약 (데스크탑 사이드바) */}
          <div className="lg:w-[360px] lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="bg-[var(--cream)] p-6 md:p-8 mb-6">
                <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-5">
                  Order Summary
                </p>
                <div className="flex justify-between py-2">
                  <span className="text-[11px] text-[var(--warm-gray)] tracking-[0.03em]">상품 합계</span>
                  <span className="text-[11px] font-[var(--font-ui)] font-medium text-[var(--charcoal)]">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[11px] text-[var(--warm-gray)] tracking-[0.03em]">배송비</span>
                  <span className="text-[11px] font-[var(--font-ui)] font-medium text-[var(--charcoal)]">무료</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[11px] font-medium text-[var(--walnut)] tracking-[0.03em]">선물 포장</span>
                  <span className="text-[11px] font-[var(--font-ui)] font-medium text-[var(--walnut)]">기본 포함</span>
                </div>
                <div className="flex justify-between pt-4 mt-3 border-t border-[var(--oatmeal)]">
                  <span className="text-[14px] font-semibold text-[var(--charcoal)]">총 결제 금액</span>
                  <span className="text-[14px] font-[var(--font-ui)] font-semibold text-[var(--charcoal)]">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              <Button variant="primary" onClick={handleCheckout}>
                결제하기 — {formatPrice(totalAmount)}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 모바일 Bottom Sticky CTA — 엄지손가락으로 누르기 편한 위치 ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-[var(--warm-white)] border-t border-[var(--oatmeal)] px-5 py-4 safe-area-bottom">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] tracking-[0.03em]">
            총 {items.length}개 상품
          </span>
          <span className="text-[15px] font-[var(--font-ui)] font-semibold text-[var(--charcoal)]">
            {formatPrice(totalAmount)}
          </span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full min-h-[54px] py-4 bg-[var(--walnut-dark)] text-[var(--cream)] text-[14px] font-[var(--font-ui)] font-semibold tracking-[0.04em] hover:bg-[var(--walnut)] active:scale-[0.97] active:brightness-90 transition-colors"
        >
          결제하기
        </button>
      </div>

      {/* ── 비회원 결제 BottomSheet (회원 혜택 안내 모달) ── */}
      {/* 구성: 혜택 목록 → 회원 로그인 → 카카오 로그인 → 회원가입 링크 → 비회원 구매 */}
      {/* 디자인: 이솝/PVCS 에디토리얼 스타일 — 축소 폰트, 넓은 자간 */}
      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="회원 혜택 안내"
      >
        <div className="flex flex-col gap-3">
          {/* 혜택 목록 — 에디토리얼 스타일 (dot 불렛, 축소 폰트) */}
          <BenefitList />

          {/* ── 회원 로그인 버튼 — Solid Walnut (최상위 위계) ── */}
          <button
            onClick={() => {
              setShowBottomSheet(false);
              router.push('/my');
            }}
            className="w-full py-3.5 bg-[var(--walnut)] text-[var(--cream)] text-[12px] font-[var(--font-ui)] font-medium tracking-[0.08em] uppercase hover:bg-[var(--walnut-dark)] transition-colors"
          >
            회원 로그인
          </button>

          {/* 회원가입 안내 */}
          <p className="text-center font-[var(--font-ui)] text-[11px] text-[var(--warm-gray)] tracking-[0.04em] mt-1">
            아직 By MOMO의 회원이 아니신가요?{' '}
            <Link
              href="/register"
              className="text-[var(--walnut)] underline underline-offset-4 decoration-[var(--walnut)]/40 hover:decoration-[var(--walnut)] transition-colors"
              onClick={() => setShowBottomSheet(false)}
            >
              회원가입
            </Link>
          </p>

          {/* ── 구분선 ── */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 border-t border-[var(--oatmeal)]" />
            <span className="font-[var(--font-ui)] text-[9px] tracking-[0.1em] uppercase text-[var(--warm-taupe)]">또는</span>
            <div className="flex-1 border-t border-[var(--oatmeal)]" />
          </div>

          {/* ── 비회원 주문 — Outline 스타일 (보조 위계) ── */}
          <button
            onClick={handleGuestCheckout}
            className="w-full py-3 border border-[var(--walnut)] text-[var(--walnut)] text-[11px] font-[var(--font-ui)] font-medium tracking-[0.08em] uppercase bg-transparent hover:bg-[var(--cream)] transition-colors"
          >
            비회원 주문하기
          </button>

          {/* ── 카카오 로그인 — Outline 스타일 (보조 위계) ── */}
          <button
            onClick={handleKakaoLogin}
            className="w-full py-3 border border-[#FEE500] text-[var(--charcoal)] text-[11px] font-[var(--font-ui)] font-medium tracking-[0.06em] bg-transparent hover:bg-[#FEE500]/10 transition-colors"
          >
            카카오로 시작하기
          </button>
        </div>
      </BottomSheet>

      <Footer />
    </>
  );
}
