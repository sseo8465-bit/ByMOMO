'use client';

// ──────────────────────────────────────────────
// /shop — 전체 상품 컬렉션 페이지
// PVCS/이솝 스타일: 광활한 여백, 테두리 없는 카드, 미니멀 타이포
// 반응형: 모바일 1열 → 태블릿 2열 → 데스크톱 3~4열
// ──────────────────────────────────────────────

import Image from 'next/image';
import Link from 'next/link';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import { MOCK_PRODUCTS } from '@/shared/mock/products';
import { useCart } from '@/domains/cart/cart.context';
import { useState, useCallback } from 'react';

// ── 카테고리 필터 ──
const CATEGORIES = [
  { key: 'all', label: '전체보기' },
  { key: 'treat', label: '트릿' },
  { key: 'set', label: '세트' },
  { key: 'senior', label: '시니어' },
] as const;

// ── 상품→카테고리 매핑 ──
function getCategory(productId: string): string {
  if (productId.includes('birthday') || productId.includes('set')) return 'set';
  if (productId.includes('senior')) return 'senior';
  return 'treat';
}

// ── 상품별 태그(가치 제안) ──
function getProductTag(productId: string): string {
  const tagMap: Record<string, string> = {
    'duck-single': '단일 단백질 · 저알러지',
    'salmon-omega': '오메가3 · 피부 모질',
    'birthday-set': '선물 포장 · 3종 세트',
    'beef-senior': '관절 건강 · 글루코사민',
  };
  return tagMap[productId] || '프리미엄 수제간식';
}

export default function ShopCollectionPage() {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const filteredProducts = activeCategory === 'all'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => getCategory(p.id) === activeCategory);

  const handleAddToCart = useCallback((product: typeof MOCK_PRODUCTS[0]) => {
    addItem({ product, quantity: 1 });
    setAddedIds((prev) => new Set(prev).add(product.id));
    // 2초 후 added 표시 해제
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  }, [addItem]);

  return (
    <>
      <GNB activeItem="shop" />

      {/* ── 페이지 헤더 — 이솝 스타일 넓은 여백 ── */}
      <section className="page-padding section-spacing text-center">
        {/* 아이브로우 */}
        <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--warm-taupe)] mb-4">
          Collection
        </p>
        {/* 메인 헤드라인 */}
        <h1 className="font-[var(--font-serif)] text-[26px] md:text-[34px] lg:text-[40px] font-medium text-[var(--walnut)] mb-4 leading-[1.3] tracking-[0.01em]">
          By MOMO가 제안하는<br className="md:hidden" /> 아이를 위한 레시피
        </h1>
        <p className="text-[12px] md:text-[13px] text-[var(--warm-gray)] leading-[1.7] tracking-[0.03em] max-w-[480px] mx-auto">
          모든 원재료를 투명하게 공개합니다.<br />
          알러지, 나이, 체중까지 확인한 안심 수제간식.
        </p>
      </section>

      {/* ── 카테고리 필터 — hairline 스타일 ── */}
      <div className="page-padding border-t border-b border-[var(--oatmeal)]">
        <div className="flex items-center justify-center gap-8 md:gap-12 py-4">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.1em] uppercase transition-colors pb-0.5 ${
                activeCategory === key
                  ? 'text-[var(--walnut)] font-medium border-b border-[var(--walnut)]'
                  : 'text-[var(--warm-taupe)] font-normal hover:text-[var(--walnut)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 맞춤 추천 배너 — 자연스러운 노출 ── */}
      <div className="page-padding py-8 md:py-10">
        <Link
          href="/profile"
          className="block bg-[var(--cream)] rounded-none md:rounded-sm py-6 md:py-8 px-8 text-center group hover:bg-[var(--oatmeal)] transition-colors"
        >
          <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-2">
            Personalized
          </p>
          <p className="font-[var(--font-serif)] text-[17px] md:text-[20px] text-[var(--walnut)] mb-2 tracking-[0.01em]">
            우리 아이에게 딱 맞는 간식을 찾으시나요?
          </p>
          <span className="font-[var(--font-ui)] text-[11px] md:text-[12px] text-[var(--warm-taupe)] tracking-[0.08em] uppercase group-hover:text-[var(--walnut)] transition-colors">
            맞춤 추천 받기 →
          </span>
        </Link>
      </div>

      {/* ── 상품 그리드 — PVCS 스타일 (테두리 없는 카드) ── */}
      <section className="page-padding pb-16 md:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
          {filteredProducts.map((product) => {
            const isAdded = addedIds.has(product.id);
            return (
              <article key={product.id} className="group">
                {/* ── 상품 이미지 — 테두리/그림자 없음, 공중에 떠 있는 느낌 ── */}
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative aspect-square bg-[var(--cream)] mb-5 md:mb-6 overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </Link>

                {/* ── 상품 정보 — 최소한의 타이포 ── */}
                <div className="text-center">
                  {/* 태그 (가치 제안) — 가격보다 먼저 */}
                  <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.12em] uppercase text-[var(--warm-taupe)] mb-2">
                    {getProductTag(product.id)}
                  </p>

                  {/* 상품명 */}
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-[var(--font-serif)] text-[15px] md:text-[17px] font-medium text-[var(--charcoal)] mb-3 tracking-[0.01em] hover:text-[var(--walnut)] transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* 원재료 리스트 — 이솝 성분 표기 스타일 */}
                  <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] text-[var(--warm-gray)] mb-4 tracking-[0.04em]">
                    {product.ingredients.join(' · ')}
                  </p>

                  {/* 장바구니 담기 텍스트 버튼 — 이솝 스타일 */}
                  <button
                    onClick={() => handleAddToCart(product)}
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
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Footer />
    </>
  );
}
