// 개인정보처리방침 페이지 — 반응형 + 이솝 스타일
import type { Metadata } from "next";
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "개인정보처리방침",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <GNB />

      <section className="bg-[var(--cream)] page-padding pt-10 pb-8 md:pt-14 md:pb-10 text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Privacy Policy
        </p>
        <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-semibold text-[var(--walnut)] leading-[1.3] tracking-[0.02em]">
          개인정보처리방침
        </h1>
      </section>

      <section className="page-padding section-spacing">
        <div className="max-w-[680px] mx-auto text-[11px] md:text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] leading-[1.9] tracking-[0.02em] space-y-8">
          <div>
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--walnut)] mb-3">
              1. 수집하는 개인정보 항목
            </h2>
            <p>
              회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다:
              성명, 연락처, 배송 주소, 결제 정보, 반려견 프로필 정보(이름, 견종, 나이, 체중, 건강 정보).
            </p>
          </div>

          <div>
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--walnut)] mb-3">
              2. 개인정보의 이용 목적
            </h2>
            <p>
              수집된 개인정보는 상품 주문·배송, 맞춤 간식 추천, 고객 상담,
              마케팅 및 서비스 개선 목적으로 이용됩니다.
            </p>
          </div>

          <div>
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--walnut)] mb-3">
              3. 개인정보의 보유 및 파기
            </h2>
            <p>
              회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
            </p>
          </div>

          <div className="bg-[var(--cream)] p-6 text-center">
            <p className="text-[10px] text-[var(--warm-taupe)] tracking-[0.03em]">
              상세 방침은 정식 오픈 시 업데이트됩니다.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
