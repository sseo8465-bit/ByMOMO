// 이용안내 페이지 — 반응형 + 이솝 스타일
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

export const dynamic = 'force-dynamic';

export default function GuidePage() {
  return (
    <>
      <GNB />

      <section className="bg-[var(--cream)] page-padding pt-10 pb-8 md:pt-14 md:pb-10 text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Guide
        </p>
        <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-semibold text-[var(--walnut)] leading-[1.3] tracking-[0.02em]">
          이용안내
        </h1>
      </section>

      <section className="page-padding section-spacing">
        <div className="max-w-[680px] mx-auto text-[11px] md:text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] leading-[1.9] tracking-[0.02em] space-y-10">
          <div>
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--walnut)] mb-3">
              주문 안내
            </h2>
            <p>
              By MOMO의 모든 간식은 주문 확인 후 신선하게 제조됩니다.
              프로필을 입력하시면 우리 아이에게 맞는 간식을 추천받을 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--walnut)] mb-3">
              배송 안내
            </h2>
            <p>
              제조 완료 후 1~3 영업일 이내 출고되며, 출고 후 1~2일 내 수령 가능합니다.
              신선도 유지를 위해 냉장 택배로 발송됩니다.
            </p>
          </div>

          <div>
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--walnut)] mb-3">
              교환·반품 안내
            </h2>
            <p>
              수제 식품 특성상 단순 변심에 의한 반품은 어렵습니다.
              상품 하자 또는 오배송의 경우 수령 후 3일 이내 고객센터로 연락 부탁드립니다.
            </p>
          </div>

          <div className="bg-[var(--cream)] p-6 text-center">
            <p className="text-[10px] text-[var(--warm-taupe)] tracking-[0.03em]">
              상세 안내는 정식 오픈 시 업데이트됩니다.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
