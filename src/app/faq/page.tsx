// FAQ 페이지 — 반응형 + 이솝 스타일
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

export const dynamic = 'force-dynamic';

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

      {/* ── 페이지 헤더 ── */}
      <section className="bg-[var(--cream)] page-padding pt-10 pb-8 md:pt-14 md:pb-10 text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Support
        </p>
        <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-semibold text-[var(--walnut)] leading-[1.3] tracking-[0.02em]">
          자주 묻는 질문
        </h1>
      </section>

      {/* ── FAQ 본문 ── */}
      <section className="page-padding section-spacing">
        <div className="max-w-[680px] mx-auto space-y-0">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="border-b border-[var(--oatmeal)] py-7 md:py-8 first:pt-0"
            >
              <h3 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--walnut)] mb-3 leading-[1.6] tracking-[0.02em]">
                Q. {item.question}
              </h3>
              <p className="text-[11px] md:text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] leading-[1.9] tracking-[0.02em]">
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
