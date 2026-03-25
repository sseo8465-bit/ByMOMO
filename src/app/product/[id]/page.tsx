'use client';

export const dynamic = 'force-dynamic';

// 상품 상세 페이지 — 원재료 공개 + 장바구니 담기
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Button from '@/shared/components/Button';
import Footer from '@/shared/components/Footer';
import IngredientTable from '@/shared/components/IngredientTable';
import { MOCK_PRODUCTS } from '@/shared/mock/products';
import { useCart } from '@/domains/cart/cart.context';

// 원재료별 효능 매핑 (Phase 1 더미 데이터)
const INGREDIENT_BENEFITS: Record<string, string> = {
  '오리가슴살': '저알러지 단백질',
  '고구마': '소화 건강',
  '블루베리': '항산화',
  '연어': '오메가3 · 피부 모질',
  '귀리': '식이섬유',
  '아마씨': '오메가3 보충',
  '소고기': '양질의 단백질',
  '단호박': '소화 · 비타민A',
  '글루코사민': '관절 건강',
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productId = params.id as string;

  const product = MOCK_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <>
        <GNB />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="text-center">
            <p className="text-[15px] text-[var(--warm-gray)] mb-4">상품을 찾을 수 없습니다.</p>
            <Button variant="primary" onClick={() => router.back()}>
              뒤로 가기
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addItem({ product, quantity: 1 });
    router.push('/cart');
  };

  // 원재료 테이블용 데이터 생성
  const ingredientData = product.ingredients.map((name) => ({
    name,
    benefit: INGREDIENT_BENEFITS[name] || '영양 보충',
  }));

  return (
    <>
      <GNB />

      {/* ── 뒤로 가기 버튼 ── */}
      <div className="px-6 py-3">
        <button
          onClick={() => router.back()}
          className="text-[14px] text-[var(--warm-gray)] hover:text-[var(--walnut)] transition-colors font-[var(--font-ui)]"
        >
          ← 뒤로
        </button>
      </div>

      {/* 상품 이미지 */}
      <div className="relative h-[280px] bg-[var(--cream)]">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 430px) 100vw"
          priority
        />
      </div>

      {/* ── 상품 정보 섹션 ── */}
      <div className="px-6 py-10">
        <h1 className="font-[var(--font-serif)] text-[22px] font-semibold text-[var(--charcoal)] mb-2">
          {product.name}
        </h1>
        <p className="font-[var(--font-ui)] text-[17px] font-semibold text-[var(--walnut)] mb-4">
          ₩{product.price.toLocaleString('ko-KR')}
        </p>
        <p className="text-[15px] text-[var(--warm-gray)] leading-[1.7] mb-6">
          {product.description}
        </p>

        {/* ── 원재료 투명 공개 테이블 ── */}
        <div className="mb-10">
          <IngredientTable ingredients={ingredientData} />
        </div>

        {/* 장바구니 담기 */}
        <Button variant="primary" onClick={handleAddToCart}>
          장바구니 담기
        </Button>

        {/* ── 맞춤 간식 찾기 링크 ── */}
        <div className="text-center mt-4">
          <Link
            href="/profile"
            className="text-[14px] text-[var(--warm-gray)] hover:text-[var(--walnut)] underline font-[var(--font-ui)] transition-colors"
          >
            맞춤 간식 찾기
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
