// About (Our Story) 페이지 — 이솝 잡지기사 스타일 브랜드 서사
// 반응형 + 이솝 스타일: page-padding, section-spacing, 축소 폰트
import Image from "next/image";
import GNB from "@/shared/components/GNB";
import Footer from "@/shared/components/Footer";

export default function AboutPage() {
  return (
    <>
      <GNB activeItem="story" />

      {/* ── 매거진 헤더 ── */}
      <section className="page-padding section-spacing text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-5">
          Our Story
        </p>
        <h1 className="font-[var(--font-serif)] text-[24px] md:text-[32px] font-medium text-[var(--walnut)] italic leading-[1.5] tracking-[0.02em]">
          &ldquo;내 아이를 위한 고집이,
          <br />
          당신의 아이를 위한
          <br />
          기준이 되기까지.&rdquo;
        </h1>
      </section>

      <div className="page-padding"><div className="h-px bg-[var(--oatmeal)]" /></div>

      {/* ── 본문 섹션 — 반응형 2컬럼 레이아웃 ── */}
      <section className="page-padding section-spacing">
        <div className="max-w-[680px] mx-auto">
          <p className="text-[13px] md:text-[14px] text-[var(--charcoal)] leading-[1.8] tracking-[0.02em]">
            알러지, 노화, 심장병.
            <br />
            시중의 어떤 제품도 대안이 되지 못했습니다.
          </p>
          <p className="text-[13px] md:text-[14px] text-[var(--charcoal)] leading-[1.8] mt-6 tracking-[0.02em]">
            그날부터 직접 재료를 골랐습니다.
            <br />
            못 먹는 건 덜어내고,
            <br />
            오직 모모에게 필요한 것으로 가득 채운
            <br />
            &ldquo;단 하나뿐인 레시피&rdquo;.
          </p>
          <p className="text-[13px] md:text-[14px] text-[var(--charcoal)] leading-[1.8] mt-6 tracking-[0.02em]">
            모모가 냄새를 맡자마자 꼬리를 흔들던 그 순간이
            <br />
            By MOMO의 시작입니다.
          </p>
        </div>
      </section>

      {/* Image — 반응형 높이, 각진 모서리 */}
      <div className="page-padding">
        <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden relative">
          <Image
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1400&h=600&fit=crop&crop=center"
            alt="반려견과 함께"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      {/* ── Pull Quote 섹션 ── */}
      <section className="page-padding section-spacing text-center">
        <p className="font-[var(--font-serif)] text-[20px] md:text-[26px] text-[var(--walnut)] italic leading-[1.5] mb-3 tracking-[0.02em]">
          가장 좋은 성분은,
          <br />
          보호자의 마음으로 고른 재료입니다.
        </p>
        <p className="text-[12px] md:text-[13px] text-[var(--warm-gray)] leading-[1.7] tracking-[0.03em]">
          세상에 단 하나뿐인 아이에게 전하는
          <br />
          가장 안심되는 선물.
        </p>
      </section>

      {/* ── 브랜드 철학 섹션 ── */}
      <section className="page-padding section-spacing">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Brand Philosophy
        </p>
        <h2 className="font-[var(--font-serif)] text-[20px] md:text-[24px] font-semibold text-[var(--walnut)] mb-8 tracking-[0.02em]">
          세 가지 약속
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {[
            {
              title: "먹을 수 있는 것만으로",
              desc: "알러지·나이·체중. 먼저 확인하고 고릅니다.",
            },
            {
              title: "내 아이에게 맞춘 레시피",
              desc: "프로파일에 맞춰 간식 커스터마이징해 드립니다.",
            },
            {
              title: "누구에게나 특별하도록",
              desc: "모든 주문을 선물 박스에 포장해 드립니다.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 bg-[var(--cream)]"
            >
              <p className="text-[13px] font-semibold text-[var(--walnut)] mb-2 tracking-[0.02em]">
                {item.title}
              </p>
              <p className="text-[11px] text-[var(--warm-gray)] leading-[1.8] tracking-[0.02em]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CS 섹션 — 문의 안내 ── */}
      <section className="page-padding section-spacing text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-6">
          Customer Support
        </p>
        <p className="font-[var(--font-serif)] text-[16px] md:text-[18px] text-[var(--walnut)] leading-[1.6] mb-3 tracking-[0.02em]">
          문의는 카카오톡으로 받고 있습니다.
        </p>
        <p className="text-[11px] md:text-[12px] text-[var(--warm-gray)] leading-[1.8] mb-8 tracking-[0.03em]">
          아이의 이름과 연락처를 남겨주시면
          <br />
          순서대로 답변드리겠습니다.
        </p>
        <a
          href="https://pf.kakao.com/_placeholder"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-[var(--font-ui)] text-[12px] text-[var(--walnut)] tracking-[0.06em] underline underline-offset-4 decoration-[var(--walnut)]/40 hover:decoration-[var(--walnut)] transition-colors"
        >
          카카오톡 문의하기 →
        </a>
        <p className="text-[10px] text-[var(--warm-taupe)] mt-6 tracking-[0.03em]">
          발송 메시지 기준 24시간 이내 답변
        </p>
      </section>

      <Footer />
    </>
  );
}
