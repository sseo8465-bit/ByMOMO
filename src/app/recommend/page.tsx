'use client';

export const dynamic = 'force-dynamic';

// 맞춤 추천 결과 페이지 — 이솝 감성 리모델링 (v3)
// ⑦ skipped 파라미터로 맞춤/건너뛰기 분기
// ⑧ 뒤로가기 → 프로필 Step 3
// ⑨ 카드 전체 클릭 + 이솝 퀵 장바구니 텍스트 버튼 + 토스트 알림 + 하단 CTA 동적 문구
import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import SafeFilter from '@/shared/components/SafeFilter';
import { useProfile } from '@/domains/profile/profile.context';
import { useCart } from '@/domains/cart/cart.context';
import { getRecommendations } from '@/domains/profile/profile.logic';
import type { Product } from '@/shared/types';

export default function RecommendPage() {
  const { profile } = useProfile();
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const isSkipped = searchParams.get('skipped') === 'true';

  // 장바구니에 담은 상품 추적
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  // 토스트 알림 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // 개별 카드 "장바구니에 추가됨" 텍스트 애니메이션 상태
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());

  // 프로필 기반 추천 목록
  const recommendations = useMemo(() => getRecommendations(profile), [profile]);

  // 토스트 자동 닫기
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 개별 상품 장바구니 담기 — 이솝 스타일 텍스트 버튼 클릭 시
  const handleQuickAdd = useCallback((e: React.MouseEvent, product: Product) => {
    // 카드 전체 클릭(Link)과 충돌 방지
    e.preventDefault();
    e.stopPropagation();

    addItem({ product, quantity: 1 });
    setAddedItems((prev) => {
      const next = new Set(prev);
      next.add(product.id);
      return next;
    });

    // 텍스트 애니메이션: 1초간 "장바구니에 추가됨" 표시 후 원복
    setAnimatingItems((prev) => {
      const next = new Set(prev);
      next.add(product.id);
      return next;
    });
    setTimeout(() => {
      setAnimatingItems((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1000);

    // 토스트 알림
    setToastMessage('장바구니에 담겼습니다');
  }, [addItem]);

  // 모든 추천 간식 한 번에 담기
  const handleAddAll = useCallback(() => {
    recommendations.forEach((product) => {
      if (!addedItems.has(product.id)) {
        addItem({ product, quantity: 1 });
      }
    });
    setAddedItems(new Set(recommendations.map((p) => p.id)));
    setToastMessage('모든 추천 간식이 담겼습니다');
  }, [recommendations, addedItems, addItem]);

  const addedCount = addedItems.size;

  return (
    <>
      <GNB />

      {/* ── 토스트 알림 — 화면 상단 중앙 ── */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[var(--walnut-dark)] text-[var(--cream)] text-[13px] font-[var(--font-ui)] rounded-[var(--radius-soft)] shadow-lg animate-toast">
          {toastMessage}
        </div>
      )}

      {/* ── AI 추천 결과 헤더 — 와이어프레임 v2.1 (크림 배경) ── */}
      <section className="bg-[var(--cream)] px-6 pt-8 pb-6 text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          {isSkipped ? 'Quick Recommendation' : 'AI Recommendation'}
        </p>
        <h1 className="font-[var(--font-serif)] text-[36px] font-semibold text-[var(--walnut)] leading-[1.2] mb-2">
          {profile.name || '우리 아이'}
        </h1>
        <p className="font-[var(--font-ui)] text-[13px] text-[var(--warm-gray)] tracking-[0.02em]">
          {profile.breed && `${profile.breed}`}
          {profile.age ? ` · ${profile.age}세` : ''}
          {profile.weight ? ` · ${profile.weight}kg` : ''}
        </p>

        {/* 건너뛰기 모드일 때 안내 */}
        {isSkipped && (
          <p className="text-[11px] text-[var(--warm-taupe)] mt-3 leading-[1.6]">
            기본 정보만으로 추천합니다.
            <br />
            더 정확한 추천은{' '}
            <Link href="/profile/preference" className="underline text-[var(--walnut)]">
              취향 입력
            </Link>
            을 완료해 주세요.
          </p>
        )}
      </section>

      {/* ── SafeFilter — 제외 성분 표시 ── */}
      {profile.dislikedIngredients.length > 0 && (
        <div className="px-6 py-4">
          <SafeFilter
            dogName={profile.name}
            excludedIngredients={profile.dislikedIngredients}
          />
        </div>
      )}

      {/* ── 추천 상품 리스트 — 이솝 스타일 ── */}
      {recommendations.length > 0 ? (
        <div className="px-6 pt-6 pb-4">
          {/* 상품 카드 리스트 */}
          <div className="flex flex-col gap-10">
            {recommendations.map((product) => (
              <div key={product.id} className="text-center">
                {/* 추천 라벨 */}
                <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--warm-taupe)] mb-4">
                  추천 제품
                </p>

                {/* 카드 전체 클릭 — 상세 페이지 이동 */}
                <Link href={`/product/${product.id}`} className="block">
                  {/* 상품 이미지 — 넉넉한 여백, 웜 화이트 배경, 미세 곡률 */}
                  <div className="relative h-[220px] bg-[var(--warm-white)] mb-5 rounded-[var(--radius-card)]">
                    <Image
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 430px) calc(100vw - 48px)"
                    />
                  </div>

                  {/* 상품명 — 세리프, 중앙정렬 */}
                  <h3 className="font-[var(--font-serif)] text-[18px] font-medium text-[var(--charcoal)] leading-[1.4] mb-1">
                    {product.name}
                  </h3>

                  {/* 설명 — 작고 가벼운 회색 */}
                  <p className="text-[12px] text-[var(--warm-gray)] leading-[1.6] mb-4 line-clamp-2">
                    {product.description}
                  </p>
                </Link>

                {/* ── 이솝 퀵 장바구니 텍스트 버튼 ── */}
                {/* 투명 배경, Sans-serif Light, 넓은 자간, 충분한 클릭 여백 */}
                <button
                  onClick={(e) => handleQuickAdd(e, product)}
                  className="inline-block py-3 px-6 bg-transparent transition-all duration-300"
                >
                  <span
                    className={`font-[var(--font-ui)] text-[11px] tracking-[0.08em] transition-all duration-300 ${
                      animatingItems.has(product.id)
                        ? 'text-[var(--walnut)] font-medium'
                        : 'text-[var(--warm-gray)] font-light'
                    }`}
                    style={{ fontWeight: animatingItems.has(product.id) ? 500 : 300 }}
                  >
                    {animatingItems.has(product.id)
                      ? '장바구니에 추가됨'
                      : `장바구니 담기 — ₩${product.price.toLocaleString('ko-KR')}`}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* ── 프로필 재입력 링크 — Step 3으로 이동 ── */}
          <div className="text-center mt-8 mb-4">
            <Link
              href="/profile/preference"
              className="text-[12px] text-[var(--warm-gray)] hover:text-[var(--walnut)] font-[var(--font-ui)] tracking-[0.02em] transition-colors"
            >
              개별 상품 선택하기
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-6">
          <p className="text-[14px] text-[var(--warm-gray)] mb-6">
            조건에 맞는 상품이 없습니다.
          </p>
          <Link
            href="/profile/preference"
            className="inline-block px-6 py-3 border border-[var(--walnut)] text-[var(--walnut)] rounded-lg text-[13px] font-[var(--font-ui)] hover:bg-[var(--walnut)] hover:text-[var(--cream)] transition-colors"
          >
            다시 입력하기
          </Link>
        </div>
      )}

      {/* ── 하단 CTA — 동적 문구 ── */}
      {recommendations.length > 0 && (
        <div className="sticky bottom-0 bg-[var(--warm-white)] border-t border-[var(--oatmeal)] px-6 py-4">
          {addedCount > 0 ? (
            <Link href="/cart" className="block">
              <button className="w-full py-3.5 bg-[var(--walnut)] text-[var(--cream)] rounded-lg text-[14px] font-[var(--font-ui)] font-medium tracking-[0.03em] hover:bg-[var(--walnut-dark)] transition-colors">
                장바구니 보기 ({addedCount})
              </button>
            </Link>
          ) : (
            <button
              onClick={handleAddAll}
              className="w-full py-3.5 bg-[var(--walnut)] text-[var(--cream)] rounded-[var(--radius-soft)] text-[14px] font-[var(--font-ui)] font-medium tracking-[0.03em] hover:bg-[var(--walnut-dark)] transition-colors"
            >
              모든 추천 간식 담기 ({recommendations.length})
            </button>
          )}
        </div>
      )}

      <Footer />
    </>
  );
}
