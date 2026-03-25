// ──────────────────────────────────────────────
// 개인정보처리방침 페이지 — 개인정보 수집·이용·파기 안내
// Footer 약관 링크(/privacy)에서 진입
// ──────────────────────────────────────────────
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

export const dynamic = 'force-dynamic';

export default function PrivacyPage() {
  return (
    <>
      <GNB />

      {/* ── 페이지 헤더 — 이솝 스타일 크림 배경 ── */}
      <section className="bg-[var(--cream)] px-6 pt-8 pb-6 text-center">
        {/* 아이브로우 라벨 */}
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Privacy Policy
        </p>
        {/* 페이지 타이틀 */}
        <h1 className="font-[var(--font-serif)] text-[28px] font-semibold text-[var(--walnut)] leading-[1.3]">
          개인정보처리방침
        </h1>
      </section>

      {/* ── 방침 본문 ── */}
      <section className="px-6 py-10">
        <div className="text-[13px] text-[var(--warm-gray)] font-[var(--font-ui)] leading-[1.8] space-y-6">
          {/* 수집 항목 */}
          <div>
            <h2 className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)] mb-2">
              1. 수집하는 개인정보 항목
            </h2>
            <p>
              회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다:
              성명, 연락처, 배송 주소, 결제 정보, 반려견 프로필 정보(이름, 견종, 나이, 체중, 건강 정보).
            </p>
          </div>

          {/* 이용 목적 */}
          <div>
            <h2 className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)] mb-2">
              2. 개인정보의 이용 목적
            </h2>
            <p>
              수집된 개인정보는 상품 주문·배송, 맞춤 간식 추천, 고객 상담,
              마케팅 및 서비스 개선 목적으로 이용됩니다.
            </p>
          </div>

          {/* 보유 및 파기 */}
          <div>
            <h2 className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)] mb-2">
              3. 개인정보의 보유 및 파기
            </h2>
            <p>
              회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
            </p>
          </div>

          {/* 준비 중 안내 */}
          <div className="bg-[var(--cream)] rounded-[var(--radius-card)] p-5 text-center">
            <p className="text-[12px] text-[var(--warm-taupe)]">
              상세 방침은 정식 오픈 시 업데이트됩니다.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
