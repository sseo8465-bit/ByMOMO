// 홈 페이지 — 히어로 + Best Picks + Trust Bar + Our Story 프리뷰
// 반응형 + 이솝 스타일: 넓은 여백, 각진 이미지, 축소 폰트, 텍스트 버튼
import Link from "next/link";
import Image from "next/image";
import GNB from "@/shared/components/GNB";
import Footer from "@/shared/components/Footer";
import { MOCK_PRODUCTS } from "@/shared/mock/products";

// ── 상품별 해시태그 매핑 — 이솝 스타일 미니멀 태그 ──
const PRODUCT_TAGS: Record<string, string[]> = {
  'duck-single': ['#알러지프리', '#단일단백질'],
  'salmon-omega': ['#피부건강', '#오메가3'],
  'birthday-set': ['#선물추천', '#기념일'],
  'beef-senior': ['#시니어케어', '#관절건강'],
};

// ── 인기 레시피 3종 (메인 하단 노출) ──
const POPULAR_RECIPES = [
  {
    product: MOCK_PRODUCTS.find((p) => p.id === 'duck-single')!,
    tags: ['#알러지케어', '#예민한아이'],
    label: '알러지가 걱정될 때',
  },
  {
    product: MOCK_PRODUCTS.find((p) => p.id === 'salmon-omega')!,
    tags: ['#피부모질', '#윤기'],
    label: '건조한 피부가 걱정될 때',
  },
  {
    product: MOCK_PRODUCTS.find((p) => p.id === 'beef-senior')!,
    tags: ['#노령견추천', '#관절케어'],
    label: '나이 든 아이를 위해',
  },
];

export default function HomePage() {
  const bestPicks = MOCK_PRODUCTS.slice(0, 3);

  return (
    <>
      <GNB />

      {/* ── 히어로 섹션 — 반응형 높이, 넓은 여백 ── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[280px] md:h-[480px] lg:h-[560px]">
          <Image
            src="https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=1400&h=700&fit=crop&crop=center"
            alt="최상급 원재료 스틸라이프 — 연어, 블루베리, 귀리"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--walnut-dark)]/50 to-[var(--walnut-dark)]/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[var(--space-page-x)]">
            <h1 className="font-[var(--font-serif)] text-[24px] md:text-[36px] lg:text-[42px] font-medium text-[var(--cream)] leading-[1.4] mb-3 tracking-[0.02em]">
              내 아이를 위한
              <br />단 하나뿐인 선물
            </h1>
            <p className="text-[14px] md:text-[15px] text-[var(--warm-taupe-light)] leading-[1.7] mb-6 tracking-[0.03em]">
              알러지·나이·체중을 확인한 안심 간식만 추천합니다.
            </p>
            <Link
              href="/profile"
              className="inline-block px-8 py-4 min-h-[54px] bg-[var(--cream)] text-[var(--walnut)] text-[12px] md:text-[13px] font-medium font-[var(--font-ui)] tracking-[0.06em] hover:bg-[var(--warm-white)] transition-colors"
            >
              우리 아이 맞춤 추천 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* ── Best Picks 섹션 — 반응형 그리드 ── */}
      <section className="page-padding section-spacing">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-8 md:mb-10">
          Best Picks
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {bestPicks.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group"
            >
              <div className="aspect-[4/3] relative bg-[var(--cream)] overflow-hidden mb-4 rounded-[6px]">
                <Image
                  src={product.imageUrl}
                  alt={product.imageAlt}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <p className="text-[14px] font-medium text-[var(--charcoal)] leading-tight mb-1.5 tracking-[0.02em]">
                {product.name}
              </p>
              {/* ── 해시태그 ── */}
              {PRODUCT_TAGS[product.id] && (
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {PRODUCT_TAGS[product.id].map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-[var(--font-ui)] text-[var(--warm-taupe)] bg-[var(--cream)] px-2 py-0.5 rounded-full tracking-[0.02em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[13px] font-[var(--font-ui)] text-[var(--warm-taupe)] tracking-[0.03em]">
                ₩{product.price.toLocaleString("ko-KR")}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trust Bar 섹션 — 반응형 여백 ── */}
      <section className="page-padding mb-0">
        <div className="border-t border-[var(--oatmeal)]">
          {[
            "소량 수제 · 주문 후 제조",
            "1~2일 이내 출고",
            "첨가물 · 방부제 無",
          ].map((text) => (
            <div
              key={text}
              className="py-3.5 md:py-4 border-b border-[var(--oatmeal)] text-[12px] md:text-[13px] text-[var(--warm-gray)] text-center tracking-[0.06em]"
            >
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story Preview 섹션 — 반응형 여백 ── */}
      <section className="bg-[var(--cream)] page-padding section-spacing text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-5">
          Our Story
        </p>
        <p className="font-[var(--font-serif)] text-[20px] md:text-[26px] text-[var(--walnut)] italic leading-[1.6] mb-4 tracking-[0.02em]">
          &ldquo;성분표를 뒤집어 읽기 시작한 날이 있었습니다.&rdquo;
        </p>
        <p className="text-[13px] md:text-[14px] text-[var(--warm-gray)] leading-[1.8] mb-6 tracking-[0.02em] max-w-[380px] mx-auto">
          그날 이후, 직접 고르고 만들기로 했습니다.
        </p>
        <Link
          href="/about"
          className="inline-block font-[var(--font-ui)] text-[12px] text-[var(--walnut)] tracking-[0.06em] underline underline-offset-4 decoration-[var(--walnut)]/40 hover:decoration-[var(--walnut)] transition-colors"
        >
          브랜드 스토리 보기 →
        </Link>
      </section>

      {/* ── 지금 가장 사랑받는 레시피 — 해시태그 카드 3종 ── */}
      <section className="page-padding section-spacing">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
            Popular Recipes
          </p>
          <h2 className="font-[var(--font-serif)] text-[20px] md:text-[26px] font-medium text-[var(--walnut)] tracking-[0.02em]">
            지금 가장 사랑받는 레시피
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {POPULAR_RECIPES.map(({ product, tags, label }) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group"
            >
              {/* 이미지 — 라운딩 + 호버 스케일 */}
              <div className="aspect-[4/3] relative bg-[var(--cream)] overflow-hidden rounded-[6px] mb-4">
                <Image
                  src={product.imageUrl}
                  alt={product.imageAlt}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* 상황 라벨 — "알러지가 걱정될 때" */}
              <p className="text-[11px] font-[var(--font-ui)] text-[var(--warm-taupe)] tracking-[0.04em] mb-1">
                {label}
              </p>

              {/* 상품명 */}
              <p className="text-[15px] md:text-[16px] font-semibold text-[var(--charcoal)] leading-tight mb-2 tracking-[0.02em]">
                {product.name}
              </p>

              {/* 해시태그 */}
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-[var(--font-ui)] text-[var(--warm-taupe)] bg-[var(--cream)] px-2.5 py-1 rounded-full tracking-[0.02em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
