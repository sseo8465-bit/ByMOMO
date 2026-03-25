// ──────────────────────────────────────────────
// 이용안내 페이지 — 주문·배송·반품 절차 안내
// Footer 네비게이션 링크(/guide)에서 진입
// ──────────────────────────────────────────────
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

export const dynamic = 'force-dynamic';

export default function GuidePage() {
  return (
    <>
      <GNB />

      {/* ── 페이지 헤더 — 이솝 스타일 크림 배경 ── */}
      <section className="bg-[var(--cream)] px-6 pt-8 pb-6 text-center">
        {/* 아이브로우 라벨 */}
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Guide
        </p>
        {/* 페이지 타이틀 */}
        <h1 className="font-[var(--font-serif)] text-[28px] font-semibold text-[var(--walnut)] leading-[1.3]">
          이용안내
        </h1>
      </section>

      {/* ── 안내 본문 ── */}
      <section className="px-6 py-10">
        <div className="text-[13px] text-[var(--warm-gray)] font-[var(--font-ui)] leading-[1.8] space-y-8">
          {/* 주문 안내 */}
          <div>
            <h2 className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)] mb-2">
              주문 안내
            </h2>
            <p>
              By MOMO의 모든 간식은 주문 확인 후 신선하게 제조됩니다.
              프로필을 입력하시면 우리 아이에게 맞는 간식을 추천받을 수 있습니다.
            </p>
          </div>

          {/* 배송 안내 */}
          <div>
            <h2 className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)] mb-2">
              배송 안내
            </h2>
            <p>
              제조 완료 후 1~3 영업일 이내 출고되며, 출고 후 1~2일 내 수령 가능합니다.
              신선도 유지를 위해 냉장 택배로 발송됩니다.
            </p>
          </div>

          {/* 교환·반품 안내 */}
          <div>
            <h2 className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)] mb-2">
              교환·반품 안내
            </h2>
            <p>
              수제 식품 특성상 단순 변심에 의한 반품은 어렵습니다.
              상품 하자 또는 오배송의 경우 수령 후 3일 이내 고객센터로 연락 부탁드립니다.
            </p>
          </div>

          {/* 준비 중 안내 */}
          <div className="bg-[var(--cream)] rounded-[var(--radius-card)] p-5 text-center">
            <p className="text-[12px] text-[var(--warm-taupe)]">
              상세 안내는 정식 오픈 시 업데이트됩니다.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
