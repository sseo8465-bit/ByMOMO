// 홈 페이지 — 히어로 + Best Picks + Trust Bar + Our Story 프리뷰
import Link from "next/link";
import Image from "next/image";
import GNB from "@/shared/components/GNB";
import Footer from "@/shared/components/Footer";
import { MOCK_PRODUCTS } from "@/shared/mock/products";

export default function HomePage() {
  const bestPicks = MOCK_PRODUCTS.slice(0, 3);

  return (
    <>
      <GNB />

      {/* ── 히어로 섹션 ── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[200px]">
          <Image
            src="https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=780&h=400&fit=crop&crop=center"
            alt="신선한 재료 클로즈업"
            fill
            sizes="(max-width: 430px) 100vw, 430px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--walnut-dark)]/60 to-[var(--walnut-dark)]/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="font-[var(--font-serif)] text-[28px] font-medium text-[var(--cream)] leading-[1.5] mb-2">
              내 아이를 위한
              <br />단 하나뿐인 선물
            </h1>
            <p className="text-[14px] text-[var(--warm-taupe-light)] leading-[1.7] mb-5">
              알러지·나이·체중을 확인한 안심 간식만 추천합니다.
            </p>
            <Link
              href="/profile"
              className="inline-block px-7 py-3 bg-[var(--cream)] text-[var(--walnut)] rounded-lg text-[13px] font-medium font-[var(--font-ui)] hover:bg-[var(--warm-white)] transition-colors"
            >
              맞춤 간식 찾기
            </Link>
          </div>
        </div>
      </section>

      {/* ── Best Picks 섹션 ── */}
      <section className="px-6 py-10">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Best Picks
        </p>
      </section>
      <div className="flex gap-4 overflow-x-auto px-6 pb-6 scrollbar-hide">
        {bestPicks.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="min-w-[140px] flex-shrink-0 bg-[var(--warm-white)] rounded-[var(--radius-card)] border border-[var(--oatmeal)] overflow-hidden hover:shadow-sm transition-shadow"
          >
            <div className="h-[120px] relative bg-[var(--cream)]">
              <Image
                src={product.imageUrl}
                alt={product.imageAlt}
                fill
                className="object-cover"
                sizes="140px"
              />
            </div>
            <div className="p-3">
              <p className="text-[12px] font-medium text-[var(--charcoal)] leading-tight mb-1">
                {product.name}
              </p>
              <p className="text-[12px] font-[var(--font-ui)] text-[var(--walnut)]">
                ₩{product.price.toLocaleString("ko-KR")}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Trust Bar 섹션 ── */}
      <section className="px-6 mb-10">
        {[
          "소량 수제 · 주문 후 제조",
          "1~2일 이내 출고",
          "첨가물 · 방부제 無",
        ].map((text) => (
          <div
            key={text}
            className="py-2.5 border-b border-[var(--oatmeal)] text-[11px] text-[var(--warm-gray)] text-center"
          >
            {text}
          </div>
        ))}
      </section>

      {/* ── Our Story Preview 섹션 ── */}
      <section className="bg-[var(--cream)] px-6 py-10 text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-4">
          Our Story
        </p>
        <p className="font-[var(--font-serif)] text-[22px] text-[var(--walnut)] italic leading-[1.5] mb-5">
          &ldquo;내 아이를 위한 고집이,
          <br />
          당신의 아이를 위한
          <br />
          기준이 되기까지.&rdquo;
        </p>
        <Link
          href="/about"
          className="inline-block px-5 py-2.5 border border-[var(--walnut)] text-[var(--walnut)] rounded-md text-[13px] font-medium font-[var(--font-ui)] hover:bg-[var(--walnut)] hover:text-[var(--cream)] transition-colors"
        >
          브랜드 스토리 보기
        </Link>
      </section>

      <Footer />
    </>
  );
}
