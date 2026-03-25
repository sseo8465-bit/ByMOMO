'use client';

export const dynamic = 'force-dynamic';

// 장바구니 페이지 — GiftPreview + BottomSheet (비회원 결제 플로우)
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Button from '@/shared/components/Button';
import Footer from '@/shared/components/Footer';
import GiftPreview from '@/shared/components/GiftPreview';
import BottomSheet from '@/shared/components/BottomSheet';
import { useCart } from '@/domains/cart/cart.context';
import { useAuth } from '@/domains/auth/auth.context';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();
  const { isLoggedIn, loginWithKakao } = useAuth();
  const router = useRouter();
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const handleCheckout = () => {
    if (isLoggedIn) {
      // 로그인 상태: 바로 결제 페이지로
      router.push('/checkout');
    } else {
      // 비로그인 상태: BottomSheet 오픈
      setShowBottomSheet(true);
    }
  };

  const handleKakaoLogin = () => {
    loginWithKakao();
    setShowBottomSheet(false);
    router.push('/checkout');
  };

  const handleGuestCheckout = () => {
    setShowBottomSheet(false);
    router.push('/checkout');
  };

  // 빈 장바구니
  if (items.length === 0) {
    return (
      <>
        <GNB activeItem="cart" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 min-h-[60vh]">
          <p className="text-[15px] text-[var(--warm-gray)] mb-6">
            장바구니가 비어 있습니다.
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

      <div className="px-6 py-10">
        {/* ── 헤더 ── */}
        <h1 className="font-[var(--font-serif)] text-[22px] font-semibold text-[var(--charcoal)] mb-10">
          장바구니
        </h1>

        {/* ── 장바구니 아이템 리스트 ── */}
        <div className="flex flex-col gap-4 mb-10">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-3 pb-4 border-b border-[var(--oatmeal)]"
            >
              {/* 상품 이미지 */}
              <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.imageAlt}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </div>

              {/* 상품 정보 + 수량 조절 */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[15px] font-medium text-[var(--charcoal)] mb-0.5">
                    {item.product.name}
                  </h3>
                  <p className="text-[14px] font-[var(--font-ui)] font-semibold text-[var(--walnut)]">
                    ₩{(item.product.price * item.quantity).toLocaleString('ko-KR')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center border border-[var(--oatmeal)] rounded text-[14px] text-[var(--walnut)] hover:border-[var(--walnut)]"
                  >
                    −
                  </button>
                  <span className="text-[14px] font-[var(--font-ui)] font-medium w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center border border-[var(--oatmeal)] rounded text-[14px] text-[var(--walnut)] hover:border-[var(--walnut)]"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="ml-auto text-[12px] text-[var(--warm-gray)] hover:text-[var(--walnut)] transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 선물 포장 프리뷰 ── */}
        <GiftPreview className="mb-10" />

        {/* ── 주문 요약 — 와이어프레임 v2.1 일치 ── */}
        <div className="bg-white p-5 mb-10">
          <div className="flex justify-between py-1.5">
            <span className="text-[13px] text-[var(--warm-gray)]">상품 합계</span>
            <span className="text-[13px] font-[var(--font-ui)] font-medium text-[var(--charcoal)]">
              ₩{totalAmount.toLocaleString('ko-KR')}
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[13px] text-[var(--warm-gray)]">배송비</span>
            <span className="text-[13px] font-[var(--font-ui)] font-medium text-[var(--charcoal)]">무료</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[13px] font-medium text-[var(--walnut)]">선물 포장</span>
            <span className="text-[13px] font-[var(--font-ui)] font-medium text-[var(--walnut)]">기본 포함</span>
          </div>
          <div className="flex justify-between pt-3 mt-2 border-t border-[var(--oatmeal)]">
            <span className="text-[16px] font-semibold text-[var(--charcoal)]">총 결제 금액</span>
            <span className="text-[16px] font-[var(--font-ui)] font-semibold text-[var(--charcoal)]">
              ₩{totalAmount.toLocaleString('ko-KR')}
            </span>
          </div>
        </div>

        {/* 결제하기 버튼 */}
        <Button variant="primary" onClick={handleCheckout}>
          결제하기
        </Button>
      </div>

      {/* 비회원 결제 BottomSheet */}
      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="회원 혜택 안내"
      >
        <div className="flex flex-col gap-4">
          {/* ── 혜택 안내 ── */}
          <div className="bg-[var(--cream)] rounded-lg p-4">
            <div className="flex flex-col gap-2 text-[14px] text-[var(--charcoal)]">
              <p>✓ 첫 구매 5% 할인 쿠폰</p>
              <p>✓ 프로필 저장 → 재주문 시 바로 추천</p>
              <p>✓ 구독 서비스 사전 알림</p>
            </div>
          </div>

          {/* 카카오 로그인 */}
          <Button variant="kakao" onClick={handleKakaoLogin}>
            카카오로 시작하기
          </Button>

          {/* 비회원 구매 */}
          <Button variant="ghost" onClick={handleGuestCheckout}>
            비회원 구매
          </Button>
        </div>
      </BottomSheet>

      <Footer />
    </>
  );
}
