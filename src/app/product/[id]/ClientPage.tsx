'use client';

// ──────────────────────────────────────────────
// 상품 상세 페이지 — 이솝 스타일 에디토리얼
// 이미지:텍스트 = 6:4, 3탭(성분근거/급여가이드/리뷰)
// 반응형: 모바일 세로 → 데스크톱 가로 분할
// ──────────────────────────────────────────────

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import { MOCK_PRODUCTS } from '@/shared/mock/products';
import { useCart } from '@/domains/cart/cart.context';

// ── 탭 타입 ──
type TabKey = 'ingredients' | 'guide' | 'reviews';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'ingredients', label: '성분근거' },
  { key: 'guide', label: '급여가이드' },
  { key: 'reviews', label: '리뷰' },
];

// ── 원재료별 효능 매핑 ──
const INGREDIENT_BENEFITS: Record<string, { benefit: string; detail: string }> = {
  '오리가슴살': { benefit: '저알러지 단백질', detail: '단일 단백질원으로 알러지 위험 최소화. AAFCO 기준 조단백질 함량 충족.' },
  '고구마': { benefit: '소화 건강', detail: '식이섬유가 풍부하여 장 건강에 도움. 글루텐프리 탄수화물원.' },
  '블루베리': { benefit: '항산화', detail: '안토시아닌 함유. 세포 노화 방지 및 면역력 강화에 기여.' },
  '연어': { benefit: '오메가3 · 피부 모질', detail: 'EPA/DHA 풍부. 건조한 피부, 윤기 없는 털 개선에 효과적.' },
  '귀리': { benefit: '식이섬유', detail: '베타글루칸 함유. 포만감 유지 및 혈당 관리에 도움.' },
  '아마씨': { benefit: '오메가3 보충', detail: 'ALA 오메가3 식물성 급원. 피부 장벽 강화.' },
  '소고기': { benefit: '양질의 단백질', detail: '필수 아미노산 프로필 우수. 근육 유지 및 성장에 필수.' },
  '단호박': { benefit: '소화 · 비타민A', detail: '베타카로틴 풍부. 시력 보호 및 면역 기능 지원.' },
  '글루코사민': { benefit: '관절 건강', detail: '연골 재생 촉진. 시니어 반려견의 관절 유연성 유지에 도움.' },
};

// ── 영양 성분 더미 데이터 (상품별) ──
const NUTRITION_DATA: Record<string, { label: string; value: string }[]> = {
  'duck-single': [
    { label: '조단백질', value: '28% 이상' },
    { label: '조지방', value: '12% 이상' },
    { label: '수분', value: '10% 이하' },
    { label: '조섬유', value: '4% 이하' },
    { label: '조회분', value: '8% 이하' },
    { label: '칼로리', value: '340 kcal/100g' },
  ],
  'salmon-omega': [
    { label: '조단백질', value: '26% 이상' },
    { label: '조지방', value: '15% 이상' },
    { label: '수분', value: '10% 이하' },
    { label: '조섬유', value: '3% 이하' },
    { label: '조회분', value: '7% 이하' },
    { label: '칼로리', value: '360 kcal/100g' },
  ],
  'birthday-set': [
    { label: '조단백질', value: '27% 이상' },
    { label: '조지방', value: '13% 이상' },
    { label: '수분', value: '10% 이하' },
    { label: '조섬유', value: '4% 이하' },
    { label: '조회분', value: '8% 이하' },
    { label: '칼로리', value: '350 kcal/100g' },
  ],
  'beef-senior': [
    { label: '조단백질', value: '25% 이상' },
    { label: '조지방', value: '10% 이상' },
    { label: '수분', value: '12% 이하' },
    { label: '조섬유', value: '5% 이하' },
    { label: '조회분', value: '9% 이하' },
    { label: '칼로리', value: '320 kcal/100g' },
  ],
};

// ── 급여 가이드 데이터 ──
const FEEDING_GUIDE = [
  { weight: '~3kg', daily: '10~15g', note: '말티즈, 치와와' },
  { weight: '3~7kg', daily: '15~25g', note: '푸들, 시츄' },
  { weight: '7~15kg', daily: '25~40g', note: '코카 스파니엘, 코기' },
  { weight: '15~25kg', daily: '40~60g', note: '진돗개, 보더 콜리' },
  { weight: '25kg~', daily: '60~80g', note: '골든 리트리버, 래브라도' },
];

// ── 더미 리뷰 데이터 ──
interface Review {
  id: string;
  name: string;
  dogName: string;
  dogBreed: string;
  rating: number;
  date: string;
  text: string;
}

const MOCK_REVIEWS: Record<string, Review[]> = {
  'duck-single': [
    { id: 'r1', name: '김**', dogName: '콩이', dogBreed: '말티즈 · 3살', rating: 5, date: '2026.03.10', text: '알러지가 심한 아이인데 오리 단일 단백질이라 안심하고 줄 수 있어요. 향도 자극적이지 않고 자연스러워요.' },
    { id: 'r2', name: '이**', dogName: '뭉치', dogBreed: '푸들 · 5살', rating: 5, date: '2026.03.05', text: '수의사 선생님이 단일 단백질 간식 추천해주셔서 구매했어요. 입도 잘 안 대는 편인데 이건 바로 먹더라구요.' },
    { id: 'r3', name: '박**', dogName: '모찌', dogBreed: '비숑 · 2살', rating: 4, date: '2026.02.28', text: '성분이 깨끗해서 좋아요. 양이 조금 적다고 느낄 수 있지만 품질 생각하면 합리적입니다.' },
  ],
  'salmon-omega': [
    { id: 'r4', name: '최**', dogName: '보리', dogBreed: '포메라니안 · 4살', rating: 5, date: '2026.03.12', text: '피부가 건조했는데 한 달 꾸준히 급여하니까 털 윤기가 확실히 달라졌어요.' },
    { id: 'r5', name: '정**', dogName: '두부', dogBreed: '말티푸 · 2살', rating: 5, date: '2026.03.01', text: '연어 간식 중에 가장 깔끔한 원재료예요. 아이가 잘 먹습니다.' },
  ],
  'birthday-set': [
    { id: 'r6', name: '한**', dogName: '초코', dogBreed: '웰시코기 · 3살', rating: 5, date: '2026.03.15', text: '입양 1주년 기념으로 선물했어요. 포장이 정말 예쁘고 세 가지 맛 다 잘 먹었습니다!' },
    { id: 'r7', name: '윤**', dogName: '루비', dogBreed: '시츄 · 7살', rating: 5, date: '2026.03.08', text: '지인 강아지 생일 선물로 보냈는데 포장부터 감동이라고 하더라구요. 재구매 의사 100%.' },
  ],
  'beef-senior': [
    { id: 'r8', name: '송**', dogName: '해피', dogBreed: '말티즈 · 11살', rating: 5, date: '2026.03.14', text: '노견이라 딱딱한 건 못 먹는데, 이건 부드럽고 글루코사민까지 들어있어서 관절에도 좋을 것 같아요.' },
    { id: 'r9', name: '강**', dogName: '별이', dogBreed: '골든 리트리버 · 9살', rating: 4, date: '2026.03.02', text: '시니어 전용이라 안심이에요. 다만 대형견이다 보니 양이 좀 부족한 느낌.' },
  ],
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabKey>('ingredients');
  const [isAdded, setIsAdded] = useState(false);

  const product = MOCK_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <>
        <GNB />
        <div className="flex-1 flex items-center justify-center page-padding py-20">
          <div className="text-center">
            <p className="text-[13px] text-[var(--warm-gray)] mb-6">상품을 찾을 수 없습니다.</p>
            <button
              onClick={() => router.back()}
              className="font-[var(--font-ui)] text-[11px] tracking-[0.1em] uppercase text-[var(--walnut)] hover:text-[var(--walnut-dark)]"
            >
              ← 뒤로 가기
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = useCallback(() => {
    addItem({ product, quantity: 1 });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }, [addItem, product]);

  const nutrition = NUTRITION_DATA[product.id] || NUTRITION_DATA['duck-single'];
  const reviews = MOCK_REVIEWS[product.id] || [];

  // ── 별점 렌더 ──
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-[var(--walnut)]' : 'text-[var(--oatmeal)]'}>
        ★
      </span>
    ));
  };

  return (
    <>
      <GNB activeItem="shop" />

      {/* ── 상품 히어로 — 모바일: 세로 / 데스크톱: 가로 6:4 ── */}
      <section className="md:flex md:min-h-[70vh]">
        {/* 이미지 (60%) */}
        <div className="relative h-[50vh] md:h-auto md:w-[60%] bg-[var(--cream)]">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </div>

        {/* 상품 정보 (40%) */}
        <div className="md:w-[40%] page-padding py-10 md:py-16 md:flex md:flex-col md:justify-center">
          {/* 뒤로 가기 */}
          <button
            onClick={() => router.back()}
            className="font-[var(--font-ui)] text-[11px] tracking-[0.08em] uppercase text-[var(--warm-taupe)] hover:text-[var(--walnut)] mb-6 md:mb-8"
          >
            ← Back
          </button>

          {/* 상품명 */}
          <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--walnut)] mb-3 leading-[1.3] tracking-[0.01em]">
            {product.name}
          </h1>

          {/* 가격 */}
          <p className="font-[var(--font-ui)] text-[14px] md:text-[15px] font-medium text-[var(--charcoal)] mb-5 tracking-[0.02em]">
            ₩{product.price.toLocaleString('ko-KR')}
          </p>

          {/* 설명 */}
          <p className="text-[12px] md:text-[13px] text-[var(--warm-gray)] leading-[1.8] mb-8 tracking-[0.02em]">
            {product.description}
          </p>

          {/* 원재료 리스트 — 이솝 성분 표기 스타일 */}
          <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] text-[var(--warm-taupe)] tracking-[0.06em] mb-8">
            {product.ingredients.join(' · ')}
          </p>

          {/* 장바구니 담기 */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-4 text-[12px] md:text-[13px] font-[var(--font-ui)] tracking-[0.08em] uppercase transition-colors ${
              isAdded
                ? 'bg-[var(--cream)] text-[var(--warm-taupe)] cursor-default'
                : 'bg-[var(--walnut)] text-[var(--cream)] hover:bg-[var(--walnut-dark)] cursor-pointer'
            }`}
          >
            {isAdded ? '장바구니에 담겼습니다' : '장바구니 담기'}
          </button>

          {/* 맞춤 추천 링크 */}
          <div className="text-center mt-4">
            <Link
              href="/profile"
              className="font-[var(--font-ui)] text-[11px] text-[var(--warm-taupe)] hover:text-[var(--walnut)] tracking-[0.06em] transition-colors"
            >
              맞춤 간식 추천 받기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3탭 시스템 — 성분근거 / 급여가이드 / 리뷰 ── */}
      <section className="border-t border-[var(--oatmeal)]">
        {/* 탭 헤더 */}
        <div className="page-padding border-b border-[var(--oatmeal)]">
          <div className="flex items-center justify-center gap-8 md:gap-16">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.1em] uppercase py-5 transition-colors border-b-[1.5px] ${
                  activeTab === key
                    ? 'text-[var(--walnut)] font-medium border-[var(--walnut)]'
                    : 'text-[var(--warm-taupe)] font-normal border-transparent hover:text-[var(--walnut)]'
                }`}
              >
                {label}
                {key === 'reviews' && ` (${reviews.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="page-padding section-spacing max-w-[720px] mx-auto">

          {/* ── 성분근거 탭 ── */}
          {activeTab === 'ingredients' && (
            <div className="animate-fade-in">
              {/* 영양 성분표 */}
              <div className="mb-12">
                <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-5">
                  Nutrition Facts
                </p>
                <div className="border-t border-[var(--oatmeal)]">
                  {nutrition.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-[var(--oatmeal)]">
                      <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] tracking-[0.02em]">
                        {label}
                      </span>
                      <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--warm-gray)] tracking-[0.02em]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 원재료별 효능 상세 */}
              <div>
                <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-5">
                  Ingredient Details
                </p>
                <div className="space-y-6">
                  {product.ingredients.map((name) => {
                    const info = INGREDIENT_BENEFITS[name];
                    return (
                      <div key={name} className="border-b border-[var(--oatmeal)] pb-5">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="font-[var(--font-ui)] text-[13px] md:text-[14px] font-medium text-[var(--charcoal)] tracking-[0.02em]">
                            {name}
                          </span>
                          <span className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.08em] uppercase text-[var(--warm-taupe)]">
                            {info?.benefit || '영양 보충'}
                          </span>
                        </div>
                        <p className="text-[11px] md:text-[12px] text-[var(--warm-gray)] leading-[1.7] tracking-[0.02em]">
                          {info?.detail || '엄선된 원재료로 반려견의 건강한 식단을 보완합니다.'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── 급여가이드 탭 ── */}
          {activeTab === 'guide' && (
            <div className="animate-fade-in">
              {/* 체중별 급여량 */}
              <div className="mb-12">
                <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-5">
                  Daily Feeding Guide
                </p>
                <div className="border-t border-[var(--oatmeal)]">
                  {/* 헤더 */}
                  <div className="grid grid-cols-3 py-3 border-b border-[var(--oatmeal)]">
                    <span className="font-[var(--font-ui)] text-[10px] tracking-[0.1em] uppercase text-[var(--warm-taupe)]">체중</span>
                    <span className="font-[var(--font-ui)] text-[10px] tracking-[0.1em] uppercase text-[var(--warm-taupe)]">1일 급여량</span>
                    <span className="font-[var(--font-ui)] text-[10px] tracking-[0.1em] uppercase text-[var(--warm-taupe)]">해당 견종</span>
                  </div>
                  {/* 데이터 행 */}
                  {FEEDING_GUIDE.map(({ weight, daily, note }) => (
                    <div key={weight} className="grid grid-cols-3 py-3 border-b border-[var(--oatmeal)]">
                      <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] tracking-[0.02em]">{weight}</span>
                      <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--walnut)] tracking-[0.02em]">{daily}</span>
                      <span className="font-[var(--font-ui)] text-[11px] md:text-[12px] text-[var(--warm-gray)] tracking-[0.02em]">{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 보관 방법 */}
              <div className="mb-12">
                <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-5">
                  Storage
                </p>
                <div className="space-y-3 text-[12px] md:text-[13px] text-[var(--warm-gray)] leading-[1.8] tracking-[0.02em]">
                  <p>직사광선을 피해 서늘한 곳에 보관해 주세요.</p>
                  <p>개봉 후에는 밀봉하여 냉장 보관을 권장합니다.</p>
                  <p>개봉 후 2주 이내에 급여해 주세요.</p>
                </div>
              </div>

              {/* 급여 시 주의사항 */}
              <div>
                <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-5">
                  Precautions
                </p>
                <div className="space-y-3 text-[12px] md:text-[13px] text-[var(--warm-gray)] leading-[1.8] tracking-[0.02em]">
                  <p>간식은 1일 칼로리의 10% 이내로 급여해 주세요.</p>
                  <p>처음 급여 시 소량부터 시작하여 알러지 반응을 확인해 주세요.</p>
                  <p>급여 중 이상 증상이 있을 경우 급여를 중단하고 수의사와 상담해 주세요.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── 리뷰 탭 ── */}
          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-6">
                Reviews ({reviews.length})
              </p>

              {reviews.length === 0 ? (
                <p className="text-[13px] text-[var(--warm-gray)] text-center py-12">
                  아직 리뷰가 없습니다. 첫 번째 리뷰를 남겨주세요.
                </p>
              ) : (
                <div className="space-y-0">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-[var(--oatmeal)] py-6">
                      {/* 리뷰 헤더 */}
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--charcoal)] tracking-[0.02em]">
                            {review.name}
                          </span>
                          <span className="font-[var(--font-ui)] text-[11px] text-[var(--warm-taupe)] ml-2 tracking-[0.02em]">
                            {review.dogName} · {review.dogBreed}
                          </span>
                        </div>
                        <span className="font-[var(--font-ui)] text-[10px] text-[var(--warm-taupe)] tracking-[0.02em]">
                          {review.date}
                        </span>
                      </div>

                      {/* 별점 */}
                      <div className="text-[11px] mb-3 tracking-[0.1em]">
                        {renderStars(review.rating)}
                      </div>

                      {/* 리뷰 본문 */}
                      <p className="text-[12px] md:text-[13px] text-[var(--warm-gray)] leading-[1.8] tracking-[0.02em]">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
