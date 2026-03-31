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
  '피부·모질': '윤기 나는 털과 건강한 피부를 위한 간식',
  '관절·뼈': '산책이 즐거운 날을 위한 간식',
  '소화·장건강': '편안한 하루를 위한 간식',
  '심장': '건강한 매일을 위한 간식',
  '비만·체중관리': '가벼운 몸과 즐거운 산책을 위한 간식',
  '구강': '깨끗한 입 안을 위한 간식',
  '눈·시력': '맑은 눈을 위한 간식',
};

// ── 건강 고민 → 태그 매핑 (기대효과 중심 순화) ──
const HEALTH_TAG_MAP: Record<string, { label: string; keywords: string[] }> = {
  '피부·모질': { label: '윤기 나는 털을 위해', keywords: ['연어', '오메가'] },
  '관절·뼈': { label: '가벼운 산책을 위해', keywords: ['글루코사민'] },
  '소화·장건강': { label: '편안한 소화를 위해', keywords: ['단호박', '고구마'] },
  '심장': { label: '건강한 매일을 위해', keywords: ['오메가'] },
  '비만·체중관리': { label: '가벼운 몸을 위해', keywords: ['저알러지'] },
  '구강': { label: '깨끗한 입 안을 위해', keywords: [] },
  '눈·시력': { label: '맑은 눈을 위해', keywords: [] },
};

// ── 큐레이션 근거(Reason-to-believe) 생성 ──
// 프로필 데이터를 기반으로 "왜 이 간식들을 골랐는지" 에디토리얼 스타일로 설명
const PROTEIN_LABEL: Record<string, string> = {
  duck: '오리', salmon: '연어', beef: '소고기', chicken: '닭고기',
};

// 한국어 조사 헬퍼 — 받침 유무에 따라 은/는, 을/를, 과/와 분기
function hasJongseong(str: string): boolean {
  const lastChar = str.charCodeAt(str.length - 1);
  if (lastChar < 0xAC00 || lastChar > 0xD7A3) return false;
  return (lastChar - 0xAC00) % 28 !== 0;
}
function pickJosa(word: string, withJong: string, withoutJong: string): string {
  return hasJongseong(word) ? withJong : withoutJong;
}

// ── 건강 고민 → 큐레이션 근거 ──
// 톤: 이솝 미니멀리즘. 합니다체 + 짧은 문장. 한 문장이 한 줄을 넘지 않도록.
// 구조: { benefit: 성분 효과 문장, closing: 반려견 이름 포함 다정한 마무리 }
const CONCERN_RATIONALE: Record<string, { benefit: string; closing: string }> = {
  '피부·모질': {
    benefit: '오메가3의 영양이 {name}의 모질을 윤기 있게 가꿔줄 거예요.',
    closing: '건강한 털이 말해주는 변화를 경험해 보세요.',
  },
  '관절·뼈': {
    benefit: '글루코사민이 {name}의 관절을 부드럽게 지탱합니다.',
    closing: '가벼운 산책이 다시 즐거워지길 바랍니다.',
  },
  '소화·장건강': {
    benefit: '예민한 속을 달래주는 단호박과 고구마의 조화입니다.',
    closing: '{name}의 소화가 한결 가벼워지는 것을 경험해 보세요.',
  },
  '심장': {
    benefit: '오메가 지방산이 {name}의 심장 건강을 든든히 채웁니다.',
    closing: '매일의 활력이 달라지길 바랍니다.',
  },
  '비만·체중관리': {
    benefit: '단일 단백질 기반, 가볍지만 충분한 영양을 담았습니다.',
    closing: '{name}의 몸이 한결 가벼워지길 바랍니다.',
  },
  '구강': {
    benefit: '씹는 과정에서 자연스러운 치석 관리를 돕습니다.',
    closing: '{name}의 깨끗한 입 안을 위해 준비했습니다.',
  },
  '눈·시력': {
    benefit: '블루베리의 항산화 성분을 듬뿍 담았습니다.',
    closing: '{name}의 맑은 눈이 오래도록 빛나길 바랍니다.',
  },
};

// ── 큐레이션 근거 생성 ──
// 톤: 이솝 미니멀리즘. 합니다체. 짧은 문장. 접속사로 잇지 않고 마침표로 끊기.
// 리듬: 제외 성분 → 성분 효과 → 시니어 배려 → 다정한 마무리
function generateCurationRationale(
  profile: { name: string; dislikedIngredients: string[]; healthConcerns: string[]; age: number | null },
  recommendations: Product[],
): string | null {
  const lines: string[] = [];
  const dogName = profile.name || '우리 아이';

  const hasExclusions =
    profile.dislikedIngredients.length > 0 &&
    !profile.dislikedIngredients.includes('없음');
  const hasHealthConcerns =
    profile.healthConcerns.length > 0 &&
    !profile.healthConcerns.includes('해당 없음');
  const isSenior = profile.age !== null && profile.age >= 7;

  if (!hasExclusions && !hasHealthConcerns && !isSenior) return null;

  // 1. 제외 성분 — "~ 대신, ~를 담았습니다."
  if (hasExclusions) {
    const excluded = profile.dislikedIngredients;
    const usedProteins = [
      ...new Set(
        recommendations
          .filter((p) => p.proteinType !== 'mixed')
          .map((p) => PROTEIN_LABEL[p.proteinType])
          .filter(Boolean),
      ),
    ];
    const excludedText = excluded.join(', ');
    if (usedProteins.length > 0) {
      const last = usedProteins[usedProteins.length - 1];
      const proteinJoined = usedProteins.length > 1
        ? usedProteins.slice(0, -1).map((p, i, arr) =>
            i === arr.length - 1 ? `${p}${pickJosa(p, '과', '와')} ` : `${p}, `
          ).join('') + last
        : last;
      lines.push(`${excludedText} 대신, 신선한 ${proteinJoined}${pickJosa(last, '을', '를')} 담았습니다.`);
    } else {
      lines.push(`${excludedText}${pickJosa(excludedText, '은', '는')} 제외하고, 안심할 수 있는 재료만 엄선했습니다.`);
    }
  }

  // 2. 건강 고민 — 성분 효과 (benefit 문장, {name} 치환)
  if (hasHealthConcerns) {
    const primaryConcern = profile.healthConcerns[0];
    const rationale = CONCERN_RATIONALE[primaryConcern];
    if (rationale) {
      lines.push(rationale.benefit.replace('{name}', dogName));
    }
  }

  // 3. 시니어 — 식감 배려
  if (isSenior) {
    lines.push(`나이가 있는 ${dogName}를 위해, 한결 부드러운 식감으로 준비했습니다.`);
  }

  // 4. 다정한 마무리 (건강 고민이 있으면 closing, 없으면 범용)
  if (hasHealthConcerns) {
    const primaryConcern = profile.healthConcerns[0];
    const rationale = CONCERN_RATIONALE[primaryConcern];
    if (rationale) {
      lines.push(rationale.closing.replace('{name}', dogName));
    }
  } else {
    lines.push(`${dogName}의 하루가 한결 편안해지길 바랍니다.`);
  }

  return lines.join('\n');
}

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
  if (dislikedIngredients.length > 0) tags.push('가려움 없는 편안한 간식');
  if (product.proteinType !== 'mixed') tags.push('예민한 아이도 안심');
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

  // 큐레이션 문구 생성 — profile.name 개인화 극대화
  const dogName = profile.name || '우리 아이';

  const curationText = useMemo(() => {
    if (profile.healthConcerns.length > 0) {
      const phrase = CURATION_PHRASES[profile.healthConcerns[0]];
      if (phrase) return `${dogName}, ${phrase}`;
    }
    return `${dogName}에게 하나하나 골라봤어요`;
  }, [profile, dogName]);

  // 큐레이션 근거 (Reason-to-believe)
  const curationRationale = useMemo(
    () => generateCurationRationale(profile, recommendations),
    [profile, recommendations],
  );

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleQuickAdd = useCallback((product: Product) => {
    addItem({ product, quantity: 1 });
    setAddedItems((prev) => new Set(prev).add(product.id));
    setToastMessage('장바구니에 담았어요');
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
    setToastMessage('추천 간식을 모두 담았어요');
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

      {/* ── 헤더 — 개인화된 큐레이션 문구 강조 (Serif 명조 + 위계 강화) ── */}
      <section className="page-padding section-spacing text-center">
        <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--warm-taupe)] mb-5">
          {isSkipped ? 'Quick Picks' : 'Curated for You'}
        </p>

        {/* 큐레이션 문구 — Classic Serif(명조) + 크게 강조 */}
        <h1 className="font-[var(--font-serif-kr)] text-[26px] md:text-[36px] lg:text-[42px] font-semibold text-[var(--walnut)] leading-[1.35] mb-5 tracking-[-0.01em]">
          {curationText}
        </h1>

        {/* 프로필 요약 — 보조 정보로 작게 */}
        <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] text-[var(--warm-taupe)] tracking-[0.06em]">
          {profile.breed && `${profile.breed}`}
          {profile.age ? ` · ${profile.age}세` : ''}
          {profile.weight ? ` · ${profile.weight}kg` : ''}
        </p>

        {/* ── 큐레이션 근거 — 시적 여백 + 가벼운 행간 (4050 고객 배려) ── */}
        {curationRationale && !isSkipped && (
          <div className="max-w-[420px] mx-auto mt-8 font-[var(--font-ui)] text-[13px] md:text-[14px] text-[var(--charcoal)] leading-[2.2] tracking-[0.03em] font-light">
            {curationRationale.split('\n').slice(0, 3).map((line, i, arr) => {
              const isLast = i === arr.length - 1;
              return (
                <p
                  key={i}
                  className={`${i > 0 ? 'mt-3' : ''} ${isLast ? 'text-[var(--warm-taupe)] italic' : ''}`}
                >
                  {line}
                </p>
              );
            })}
          </div>
        )}

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
          <p className="text-[13px] text-[var(--warm-taupe)] mt-4 tracking-[0.03em] leading-[1.6]">
            {dogName}의 취향까지 알려주시면 더 잘 맞는 간식을 찾아드릴 수 있어요.{' '}
            <Link href="/profile/preference" className="underline text-[var(--walnut)] hover:text-[var(--walnut-dark)]">
              취향 알려주기
            </Link>
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
                  {/* 이미지 — 살짝 둥근 모서리 + cream 배경 */}
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-square bg-[var(--cream)] mb-5 md:mb-6 overflow-hidden rounded-[6px]">
                      <Image
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </Link>

                  {/* 상품명 — 폰트 대비 강화 */}
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-[var(--font-serif)] text-[16px] md:text-[18px] font-semibold text-[var(--walnut-dark)] mb-2 tracking-[0.01em] hover:text-[var(--walnut)] transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* 미니멀 해시태그 — 이미지 위 문구 대신 정갈한 태그 */}
                  {productTags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                      {productTags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="font-[var(--font-ui)] text-[9px] md:text-[10px] tracking-[0.04em] text-[var(--warm-taupe)] bg-[var(--cream)] px-2.5 py-0.5 rounded-full"
                        >
                          #{tag.replace(/\s/g, '')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 장바구니 담기 — 텍스트 버튼 */}
                  <button
                    onClick={() => handleQuickAdd(product)}
                    disabled={isAdded}
                    className={`font-[var(--font-ui)] text-[12px] md:text-[13px] tracking-[0.06em] transition-colors ${
                      isAdded
                        ? 'text-[var(--warm-taupe)] cursor-default'
                        : 'text-[var(--walnut-dark)] font-medium hover:text-[var(--walnut)] cursor-pointer'
                    }`}
                  >
                    {isAdded
                      ? `${dogName}의 장바구니에 담겼어요`
                      : `담기 — ₩${product.price.toLocaleString('ko-KR')}`
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
              조건 바꿔보기 →
            </Link>
          </div>
        </section>
      ) : (
        /* 빈 상태 */
        <div className="text-center page-padding py-20">
          <p className="font-[var(--font-serif)] text-[18px] md:text-[22px] text-[var(--walnut)] mb-3">
            {dogName}에게 딱 맞는 간식을 아직 준비하지 못했어요.
          </p>
          <p className="text-[14px] text-[var(--warm-taupe)] mb-8 tracking-[0.03em] leading-[1.6]">
            제외한 재료나 취향을 바꿔주시면 더 골라드릴 수 있어요.
          </p>
          <Link
            href="/profile/preference"
            className="font-[var(--font-ui)] text-[11px] tracking-[0.08em] uppercase text-[var(--walnut)] hover:text-[var(--walnut-dark)]"
          >
            취향 다시 입력하기 →
          </Link>
        </div>
      )}

      {/* ── 하단 고정 CTA — 딥 에스프레소 + 넓은 자간 + 둥근 모서리 ── */}
      {recommendations.length > 0 && (
        <div className="sticky bottom-0 bg-[var(--warm-white)]/95 backdrop-blur-sm border-t border-[var(--oatmeal)] page-padding py-5">
          <div className="max-w-[420px] mx-auto">
            {addedCount > 0 ? (
              <Link
                href="/cart"
                className="block w-full py-4 rounded-[8px] bg-[var(--charcoal)] text-[var(--cream)] text-[13px] md:text-[14px] font-[var(--font-ui)] font-medium tracking-[0.14em] uppercase text-center hover:bg-[var(--walnut-dark)] transition-colors"
              >
                장바구니 보기 ({addedCount})
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleAddAll}
                className="w-full py-4 rounded-[8px] bg-[var(--charcoal)] text-[var(--cream)] text-[13px] md:text-[14px] font-[var(--font-ui)] font-medium tracking-[0.14em] uppercase hover:bg-[var(--walnut-dark)] transition-colors"
              >
                {profile.name ? `${profile.name}${pickJosa(profile.name, '을', '를')} 위해 고른 간식 모두 담기` : '고른 간식 모두 담기'} ({recommendations.length})
              </button>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
