'use client';

// ──────────────────────────────────────────────
// 맞춤 추천 결과 페이지 — 이솝/PVCS 에디토리얼 스타일
// user-research-synthesis: 개인화 가치 제안 강화
// response-drafting: 광활한 여백, 미니멀 타이포, 테두리 없는 카드
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

// ── 건강 고민 → 추천 큐레이션 문구 매핑 ──
// user-research-synthesis: "뭉치의 눈물 자국을 지워줄 레시피" 같은 구체적 큐레이션
const CURATION_PHRASES: Record<string, string> = {
  '피부·모질': '건강한 피부와 윤기 나는 털을 위한',
  '관절·뼈': '튼튼한 관절과 활발한 산책을 위한',
  '소화·장건강': '편안한 소화와 장 건강을 위한',
  '심장': '건강한 심장 박동을 위한',
  '비만·체중관리': '균형 잡힌 체중 관리를 위한',
  '구강': '깨끗한 치아 건강을 위한',
  '눈·시력': '맑은 눈을 위한',
};

// ── 건강 고민 → 태그 매핑 ──
const HEALTH_TAG_MAP: Record<string, { label: string; keywords: string[] }> = {
  '피부·모질': { label: '피부·모질 개선', keywords: ['연어', '오메가'] },
  '관절·뼈': { label: '관절 건강', keywords: ['글루코사민'] },
  '소화·장건강': { label: '소화 건강', keywords: ['단호박', '고구마'] },
  '심장': { label: '심장 건강', keywords: ['오메가'] },
  '비만·체중관리': { label: '체중 관리', keywords: ['저알러지'] },
  '구강': { label: '구강 건강', keywords: [] },
  '눈·시력': { label: '눈 건강', keywords: [] },
};

function getProductTags(product: Product, healthConcerns: string[], dislikedIngredients: string[]): string[] {
  const tags: string[] = [];
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
  if (dislikedIngredients.length > 0) tags.push('알러지 성분 제외');
  if (product.proteinType !== 'mixed') tags.push('단일 단백질');
  return [...new Set(tags)];
}

export default function RecommendPage() {
  const { profile } = useProfile();
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const isSkipped = searchParams.get('skipped') === 'true';

  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recommendations = useMemo(() => getRecommendations(profile), [profile]);

  // 큐레이션 문구 생성
  const curationText = useMemo(() => {
    if (profile.healthConcerns.length > 0) {
      const phrase = CURATION_PHRASES[profile.healthConcerns[0]];
      if (phrase) return `${profile.name || '우리 아이'}의 ${phrase} 레시피`;
    }
    return `${profile.name || '우리 아이'}를 위해 엄선한 레시피`;
  }, [profile]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleQuickAdd = useCallback((product: Product) => {
    addItem({ product, quantity: 1 });
    setAddedItems((prev) => new Set(prev).add(product.id));
    setToastMessage('장바구니에 담겼습니다');
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        // 2초 후에도 유지 (재클릭 방지)
        return next;
      });
    }, 2000);
  }, [addItem]);

  const handleAddAll = useCallback(() => {
    recommendations.forEach((product) => {
      if (!addedItems.has(product.id)) addItem({ product, quantity: 1 });
    });
    setAddedItems(new Set(recommendations.map((p) => p.id)));
    setToastMessage('모든 추천 간식이 담겼습니다');
  }, [recommendations, addedItems, addItem]);

  const addedCount = addedItems.size;

  return (
    <>
      <GNB />

      {/* 토스트 */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[var(--walnut-dark)] text-[var(--cream)] text-[12px] font-[var(--font-ui)] tracking-[0.04em] shadow-lg animate-toast">
          {toastMessage}
        </div>
      )}

      {/* ── 헤더 — 개인화된 큐레이션 문구 강조 ── */}
      <section className="page-padding section-spacing text-center">
        <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--warm-taupe)] mb-5">
          {isSkipped ? 'Quick Picks' : 'Curated for You'}
        </p>

        {/* 큐레이션 문구 — 가치 제안 먼저 (user-research-synthesis) */}
        <h1 className="font-[var(--font-serif)] text-[24px] md:text-[32px] lg:text-[38px] font-medium text-[var(--walnut)] leading-[1.3] mb-4 tracking-[0.01em]">
          {curationText}
        </h1>

        {/* 프로필 요약 */}
        <p className="font-[var(--font-ui)] text-[11px] md:text-[12px] text-[var(--warm-gray)] tracking-[0.06em]">
          {profile.breed && `${profile.breed}`}
          {profile.age ? ` · ${profile.age}세` : ''}
          {profile.weight ? ` · ${profile.weight}kg` : ''}
        </p>

        {/* 제외 성분 */}
        {profile.dislikedIngredients.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {profile.dislikedIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className="inline-flex items-center gap-1.5 text-[var(--warm-taupe)] text-[10px] md:text-[11px] font-[var(--font-ui)] tracking-[0.06em]"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                  <line x1="1" y1="1" x2="7" y2="7" stroke="var(--warm-taupe)" strokeWidth="1" strokeLinecap="round" />
                  <line x1="7" y1="1" x2="1" y2="7" stroke="var(--warm-taupe)" strokeWidth="1" strokeLinecap="round" />
                </svg>
                {ingredient} 제외
              </span>
            ))}
          </div>
        )}

        {isSkipped && (
          <p className="text-[11px] text-[var(--warm-taupe)] mt-4 tracking-[0.03em]">
            더 정확한 추천은{' '}
            <Link href="/profile/preference" className="underline text-[var(--walnut)] hover:text-[var(--walnut-dark)]">
              취향 입력
            </Link>
            을 완료해 주세요.
          </p>
        )}
      </section>

      {/* ── 상품 그리드 — PVCS 스타일 (테두리 없는 카드, 광활한 여백) ── */}
      {recommendations.length > 0 ? (
        <section className="page-padding pb-16 md:pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
            {recommendations.map((product) => {
              const productTags = getProductTags(product, profile.healthConcerns, profile.dislikedIngredients);
              const isAdded = addedItems.has(product.id);

              return (
                <article key={product.id} className="group text-center">
                  {/* 추천 태그 */}
                  {productTags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                      {productTags.map((tag) => (
                        <span
                          key={tag}
                          className="font-[var(--font-ui)] text-[9px] md:text-[10px] tracking-[0.1em] uppercase text-[var(--walnut)] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 이미지 — 테두리 없이, cream 배경 위에 부유하는 느낌 */}
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-square bg-[var(--cream)] mb-5 md:mb-6 overflow-hidden">
                      <Image
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </Link>

                  {/* 상품명 */}
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-[var(--font-serif)] text-[15px] md:text-[17px] font-medium text-[var(--charcoal)] mb-2 tracking-[0.01em] hover:text-[var(--walnut)] transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* 원재료 — 이솝 성분 표기 */}
                  <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] text-[var(--warm-gray)] mb-4 tracking-[0.04em]">
                    {product.ingredients.join(' · ')}
                  </p>

                  {/* 장바구니 담기 — 텍스트 버튼 */}
                  <button
                    onClick={() => handleQuickAdd(product)}
                    disabled={isAdded}
                    className={`font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.08em] uppercase transition-colors ${
                      isAdded
                        ? 'text-[var(--warm-taupe)] cursor-default'
                        : 'text-[var(--walnut)] hover:text-[var(--walnut-dark)] cursor-pointer'
                    }`}
                  >
                    {isAdded
                      ? '담겼습니다'
                      : `장바구니 담기 — ₩${product.price.toLocaleString('ko-KR')}`
                    }
                  </button>
                </article>
              );
            })}
          </div>

          {/* 추천 조건 변경 */}
          <div className="text-center mt-12">
            <Link
              href="/profile/preference"
              className="font-[var(--font-ui)] text-[11px] text-[var(--warm-taupe)] hover:text-[var(--walnut)] tracking-[0.06em] transition-colors"
            >
              추천 조건 변경하기 →
            </Link>
          </div>
        </section>
      ) : (
        /* 빈 상태 */
        <div className="text-center page-padding py-20">
          <p className="font-[var(--font-serif)] text-[18px] md:text-[22px] text-[var(--walnut)] mb-3">
            조건에 딱 맞는 간식을 찾지 못했습니다.
          </p>
          <p className="text-[12px] text-[var(--warm-gray)] mb-8 tracking-[0.03em]">
            제외 성분이나 취향을 조정하시면 더 다양한 추천을 받으실 수 있습니다.
          </p>
          <Link
            href="/profile/preference"
            className="font-[var(--font-ui)] text-[11px] tracking-[0.08em] uppercase text-[var(--walnut)] hover:text-[var(--walnut-dark)]"
          >
            취향 다시 입력하기 →
          </Link>
        </div>
      )}

      {/* ── 하단 고정 CTA ── */}
      {recommendations.length > 0 && (
        <div className="sticky bottom-0 bg-[var(--warm-white)]/95 backdrop-blur-sm border-t border-[var(--oatmeal)] page-padding py-4">
          <div className="max-w-[480px] mx-auto">
            {addedCount > 0 ? (
              <Link href="/cart" className="block">
                <button className="w-full py-3.5 bg-[var(--walnut)] text-[var(--cream)] text-[12px] md:text-[13px] font-[var(--font-ui)] font-medium tracking-[0.06em] uppercase hover:bg-[var(--walnut-dark)] transition-colors">
                  장바구니 보기 ({addedCount})
                </button>
              </Link>
            ) : (
              <button
                onClick={handleAddAll}
                className="w-full py-3.5 bg-[var(--walnut)] text-[var(--cream)] text-[12px] md:text-[13px] font-[var(--font-ui)] font-medium tracking-[0.06em] uppercase hover:bg-[var(--walnut-dark)] transition-colors"
              >
                모든 추천 간식 담기 ({recommendations.length})
              </button>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
