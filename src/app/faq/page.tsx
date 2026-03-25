// ──────────────────────────────────────────────
// FAQ 페이지 — 자주 묻는 질문과 답변
// Footer 네비게이션 링크(/faq)에서 진입
// ──────────────────────────────────────────────
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

export const dynamic = 'force-dynamic';

// ── FAQ 항목 데이터 — 한 곳에서 관리 ──
const FAQ_ITEMS = [
  {
    question: '수제간식의 유통기한은 어떻게 되나요?',
    answer:
      '제조일로부터 냉장 보관 시 약 2주, 냉동 보관 시 약 1개월입니다. 개봉 후에는 가급적 빠르게 급여해 주세요.',
  },
  {
    question: '알레르기가 있는 아이도 먹을 수 있나요?',
    answer:
      '프로필에 못 먹는 재료를 등록하시면, 해당 성분이 포함된 간식은 추천에서 자동 제외됩니다. 심각한 알레르기가 있는 경우 수의사와 상담 후 급여를 권장합니다.',
  },
  {
    question: '배송은 얼마나 걸리나요?',
    answer:
      '주문 확인 후 제조하여 1~3 영업일 내 출고됩니다. 출고 후 1~2일 내 수령 가능하며, 냉장 택배로 발송됩니다.',
  },
  {
    question: '구독 서비스는 어떻게 이용하나요?',
    answer:
      '구독 서비스는 정식 오픈 후 제공될 예정입니다. 사전 알림을 신청하시면 오픈 시 안내드리겠습니다.',
  },
] as const;

export default function FaqPage() {
  return (
    <>
      <GNB />

      {/* ── 페이지 헤더 — 이솝 스타일 크림 배경 ── */}
      <section className="bg-[var(--cream)] px-6 pt-8 pb-6 text-center">
        {/* 아이브로우 라벨 */}
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Support
        </p>
        {/* 페이지 타이틀 */}
        <h1 className="font-[var(--font-serif)] text-[28px] font-semibold text-[var(--walnut)] leading-[1.3]">
          자주 묻는 질문
        </h1>
      </section>

      {/* ── FAQ 본문 — FAQ_ITEMS 배열에서 자동 생성 ── */}
      <section className="px-6 py-10">
        <div className="space-y-6">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="border-b border-[var(--oatmeal)] pb-6 last:border-b-0"
            >
              {/* 질문 */}
              <h3 className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)] mb-2 leading-[1.5]">
                Q. {item.question}
              </h3>
              {/* 답변 */}
              <p className="text-[13px] text-[var(--warm-gray)] font-[var(--font-ui)] leading-[1.8]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
