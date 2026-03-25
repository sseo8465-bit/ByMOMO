'use client';

// ──────────────────────────────────────────────
// 맞춤 추천 결과 페이지 — 에디토리얼 룩 리디자인
// ① 상품 카드별 추천 배지 + 성분 태그 (Safe Filter 해체)
// ② 이솝 에디토리얼 카드: 넉넉한 여백, 작은 이미지, 가느다란 텍스트
// ③ 개별 장바구니 담기 텍스트 버튼 (카드 내 바로 담기)
// ④ 하단 CTA: 전체 담기 + 장바구니 보기 동적 전환
// ──────────────────────────────────────────────
import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import { useProfile } from '@/domains/profile/profile.context';
import { useCart } from '@/domains/cart/cart.context';
import { getRecommendations } from '@/domains/profile/profile.logic';
import type { Product } from '@/shared/types';

// ── 건강 고민 → 추천 이유 태그 매핑 ──
// 프로필에 선택한 건강 고민을 기반으로 각 상품에 관련 태그를 표시
const HEALTH_TAG_MAP: Record<string, { label: string; keywords: string[] }> = {
  '피부·모질': { label: '피부·모질 개선', keywords: ['연어', '오메가'] },
  '관절·뼈': { label: '관절 건강', keywords: ['글루코사민'] },
  '소화·장건강': { label: '소화 건강', keywords: ['단호박', '고구마'] },
  '심장': { label: '심장 건강', keywords: ['오메가'] },
  '비만·체중관리': { label: '체중 관리', keywords: ['저알러지'] },
  '구강': { label: '구강 건강', keywords: [] },
  '눈·시력': { label: '눈 건강', keywords: [] },
};

// ── 상품별 추천 태그 생성 함수 ──
// 프로필 건강 고민 + 상품 설명/재료를 매칭하여 태그 배열 반환
function getProductTags(
  product: Product,
  healthConcerns: string[],
  dislikedIngredients: string[],
): string[] {
  const tags: string[] = [];

  // 건강 고민 기반 태그
  healthConcerns.forEach((concern) => {
    const mapping = HEALTH_TAG_MAP[concern];
    if (!mapping) return;
    const hasMatch = mapping.keywords.some(
      (kw) =>
        product.description.toLowerCase().includes(kw.toLowerCase()) ||
        product.ingredients.some((ing) => ing.toLowerCase().includes(kw.toLowerCase())),
    );
    if (hasMatch) tags.push(mapping.label);
  });

  // 알러지 제외 태그 — 제외 성분이 있을 때만 표시
  if (dislikedIngredients.length > 0) {
    tags.push('알러지 성분 제외');
  }

  // 단일 단백질 태그
  if (product.proteinType !== 'mixed') {
    tags.push('단일 단백질');
  }

  return [...new Set(tags)]; // 중복 제거
}

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

  // 토스트 자동 닫기 (2초)
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // ── 개별 상품 장바구니 담기 ──
  const handleQuickAdd = useCallback(
    (e: React.MouseEvent, product: Product) => {
      e.preventDefault();
      e.stopPropagation();

      addItem({ product, quantity: 1 });
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.add(product.id);
        return next;
      });

      // 텍스트 애니메이션: 1.2초간 "장바구니에 추가됨" 표시
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
      }, 1200);

      setToastMessage('장바구니에 담겼습니다');
    },
    [addItem],
  );

  // ── 모든 추천 간식 한 번에 담기 ──
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

  // ── 가격 포맷 유틸 ──
  const formatPrice = (price: number) => `₩${price.toLocaleString('ko-KR')}`;

  return (
    <>
      <GNB />

      {/* ── 토스트 알림 — 화면 상단 중앙, 다크 배경 ── */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[var(--walnut-dark)] text-[var(--cream)] text-[13px] font-[var(--font-ui)] rounded-[var(--radius-soft)] shadow-lg animate-toast">
          {toastMessage}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          섹션 1: 추천 결과 헤더 — 크림 배경, 반려견 이름 강조
          ══════════════════════════════════════════════ */}
      <section className="bg-[var(--cream)] px-6 pt-10 pb-8 text-center">
        {/* 아이브로우 라벨 */}
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-4">
          {isSkipped ? 'Quick Recommendation' : 'Curated for You'}
        </p>
        {/* 반려견 이름 — 세리프 대형 */}
        <h1 className="font-[var(--font-serif)] text-[32px] font-semibold text-[var(--walnut)] leading-[1.2] mb-3">
          {profile.name || '우리 아이'}를 위한 추천
        </h1>
        {/* 프로필 요약 */}
        <p className="font-[var(--font-ui)] text-[12px] text-[var(--warm-gray)] tracking-[0.02em]">
          {profile.breed && `${profile.breed}`}
          {profile.age ? ` · ${profile.age}세` : ''}
          {profile.weight ? ` · ${profile.weight}kg` : ''}
        </p>

        {/* 건너뛰기 모드 안내 */}
        {isSkipped && (
          <p className="text-[11px] text-[var(--warm-taupe)] mt-4 leading-[1.6]">
            기본 정보만으로 추천합니다. 더 정확한 추천은{' '}
            <Link href="/profile/preference" className="underline text-[var(--walnut)]">
              취향 입력
            </Link>
            을 완료해 주세요.
          </p>
        )}

        {/* ── 제외 성분 인라인 표시 — SafeFilter 대체 ── */}
        {profile.dislikedIngredients.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {profile.dislikedIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className="inline-flex items-center gap-1 bg-[var(--warm-white)] text-[var(--warm-gray)] rounded-full px-3 py-1 text-[11px] font-[var(--font-ui)]"
              >
                {/* X 아이콘 — 제외 표시 */}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <line x1="2" y1="2" x2="8" y2="8" stroke="var(--warm-taupe)" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="8" y1="2" x2="2" y2="8" stroke="var(--warm-taupe)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {ingredient}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════
          섹션 2: 에디토리얼 상품 카드 리스트
          ══════════════════════════════════════════════ */}
      {recommendations.length > 0 ? (
        <div className="pt-4 pb-8">
          <div className="flex flex-col">
            {recommendations.map((product, index) => {
              /* 각 상품에 맞는 추천 이유 태그 생성 */
              const productTags = getProductTags(
                product,
                profile.healthConcerns,
                profile.dislikedIngredients,
              );
              const isAdded = addedItems.has(product.id);
              const isAnimating = animatingItems.has(product.id);

              return (
                <article
                  key={product.id}
                  className={`text-center px-8 py-10 ${
                    index < recommendations.length - 1 ? 'border-b border-[var(--oatmeal)]' : ''
                  }`}
                >
                  {/* ── 추천 이유 태그 — 상품 카드 최상단 ── */}
                  {productTags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                      {productTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2.5 py-1 bg-[var(--cream)] text-[var(--walnut)] text-[10px] font-[var(--font-ui)] font-medium tracking-[0.05em] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ── 상품 이미지 — 에디토리얼: 중앙 정렬, 충분한 여백 ── */}
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative w-[180px] h-[180px] mx-auto mb-8 rounded-[var(--radius-card)] overflow-hidden bg-[var(--warm-white)]">
                      <Image
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        fill
                        className="object-contain p-3"
                        sizes="180px"
                      />
                    </div>
                  </Link>

                  {/* ── 상품명 — 세리프, 가느다란 무게감 ── */}
                  <Link href={`/product/${product.id}`} className="block">
                    <h3 className="font-[var(--font-serif)] text-[18px] font-normal text-[var(--charcoal)] leading-[1.4] mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* ── 설명 — 작고 가벼운 회색, 2줄 제한 ── */}
                  <p className="text-[12px] text-[var(--warm-gray)] leading-[1.7] mb-1 line-clamp-2 max-w-[280px] mx-auto">
                    {product.description}
                  </p>

                  {/* ── 주요 성분 표시 — 이솝 '주요 성분' 스타일 ── */}
                  <p className="text-[10px] text-[var(--warm-taupe)] font-[var(--font-ui)] tracking-[0.05em] mb-6">
                    {product.ingredients.join(' · ')}
                  </p>

                  {/* ── 장바구니 담기 텍스트 버튼 — 이솝 스타일 ── */}
                  {/* 투명 배경, 가느다란 글씨, 가격 포함 */}
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    disabled={isAdded && !isAnimating}
                    className="inline-block py-2.5 px-4 bg-transparent transition-all duration-300"
                    aria-label={`${product.name} 장바구니 담기`}
                  >
                    <span
                      className={`font-[var(--font-ui)] text-[11px] tracking-[0.08em] transition-all duration-300 ${
                        isAnimating
                          ? 'text-[var(--walnut)] font-medium'
                          : isAdded
                            ? 'text-[var(--warm-taupe)] font-light'
                            : 'text-[var(--warm-gray)] font-light'
                      }`}
                      style={{ fontWeight: isAnimating ? 500 : 300 }}
                    >
                      {isAnimating
                        ? '장바구니에 추가됨'
                        : isAdded
                          ? '추가 완료'
                          : `장바구니 담기 — ${formatPrice(product.price)}`}
                    </span>
                  </button>
                </article>
              );
            })}
          </div>

          {/* ── 취향 재입력 링크 ── */}
          <div className="text-center mt-6">
            <Link
              href="/profile/preference"
              className="text-[11px] text-[var(--warm-gray)] hover:text-[var(--walnut)] font-[var(--font-ui)] tracking-[0.02em] transition-colors underline underline-offset-4"
            >
              추천 조건 변경하기
            </Link>
          </div>
        </div>
      ) : (
        /* ── 빈 상태 — 추천 결과가 없을 때 ── */
        <div className="text-center py-20 px-6">
          {/* SVG 돋보기 아이콘 */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mx-auto mb-5" aria-hidden="true">
            <circle cx="18" cy="18" r="11" stroke="var(--warm-taupe)" strokeWidth="1.5" />
            <line x1="26" y1="26" x2="34" y2="34" stroke="var(--warm-taupe)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="font-[var(--font-serif)] text-[16px] text-[var(--walnut)] mb-2 leading-[1.5]">
            조건에 딱 맞는 간식을 찾지 못했습니다.
          </p>
          <p className="text-[12px] text-[var(--warm-gray)] mb-8 leading-[1.6]">
            제외 성분이나 취향을 조정하시면 더 다양한 추천을 받으실 수 있습니다.
          </p>
          <Link
            href="/profile/preference"
            className="inline-block px-6 py-3 border border-[var(--walnut)] text-[var(--walnut)] rounded-[var(--radius-soft)] text-[13px] font-[var(--font-ui)] tracking-[0.02em] hover:bg-[var(--walnut)] hover:text-[var(--cream)] transition-colors"
          >
            취향 다시 입력하기
          </Link>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          섹션 3: 하단 고정 CTA — 전체 담기 / 장바구니 보기
          ══════════════════════════════════════════════ */}
      {recommendations.length > 0 && (
        <div className="sticky bottom-0 bg-[var(--warm-white)]/95 backdrop-blur-sm border-t border-[var(--oatmeal)] px-6 py-4">
          {addedCount > 0 ? (
            <Link href="/cart" className="block">
              <button className="w-full py-3.5 bg-[var(--walnut)] text-[var(--cream)] rounded-[var(--radius-soft)] text-[14px] font-[var(--font-ui)] font-medium tracking-[0.03em] hover:bg-[var(--walnut-dark)] transition-colors">
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
