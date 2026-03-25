// About (Our Story) 페이지 — 이솝 잡지기사 스타일 브랜드 서사
import Image from "next/image";
import GNB from "@/shared/components/GNB";
import Footer from "@/shared/components/Footer";

export default function AboutPage() {
  return (
    <>
      <GNB activeItem="story" />

      {/* ── 매거진 헤더 ── */}
      <section className="px-6 py-10 text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-5">
          Our Story
        </p>
        <h1 className="font-[var(--font-serif)] text-[28px] font-medium text-[var(--walnut)] italic leading-[1.5]">
          &ldquo;내 아이를 위한 고집이,
          <br />
          당신의 아이를 위한
          <br />
          기준이 되기까지.&rdquo;
        </h1>
      </section>

      <div className="mx-6 h-px bg-[var(--oatmeal)]" />

      {/* ── 본문 섹션 — 텍스트 다이어트 적용 */}
      <section className="px-6 py-10">
        <p className="text-[15px] text-[var(--charcoal)] leading-[1.7]">
          알러지, 노화, 심장병.
          <br />
          시중의 어떤 제품도 대안이 되지 못했습니다.
        </p>
        <p className="text-[15px] text-[var(--charcoal)] leading-[1.7] mt-5">
          그날부터 직접 재료를 골랐습니다.
          <br />
          못 먹는 건 덜어내고,
          <br />
          오직 모모에게 필요한 것으로 가득 채운
          <br />
          &ldquo;단 하나뿐인 레시피&rdquo;.
        </p>
        <p className="text-[15px] text-[var(--charcoal)] leading-[1.7] mt-5">
          모모가 냄새를 맡자마자 꼬리를 흔들던 그 순간이
          <br />
          By MOMO의 시작입니다.
        </p>
      </section>

      {/* Image */}
      <div className="mx-6 h-[200px] rounded-[var(--radius-card)] overflow-hidden relative">
        <Image
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&h=400&fit=crop&crop=center"
          alt="반려견과 함께"
          fill
          className="object-cover"
          sizes="(max-width: 430px) calc(100vw - 48px)"
        />
      </div>

      {/* ── Pull Quote 섹션 ── */}
      <section className="px-6 py-10 text-center">
        <p className="font-[var(--font-serif)] text-[22px] text-[var(--walnut)] italic leading-[1.5] mb-3">
          가장 좋은 성분은,
          <br />
          보호자의 마음으로 고른 재료입니다.
        </p>
        <p className="text-[14px] text-[var(--warm-gray)] leading-[1.6]">
          세상에 단 하나뿐인 아이에게 전하는
          <br />
          가장 안심되는 선물.
        </p>
      </section>

      {/* ── 브랜드 철학 섹션 ── */}
      <section className="px-6 py-10">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-2">
          Brand Philosophy
        </p>
        <h2 className="font-[var(--font-serif)] text-[22px] font-semibold text-[var(--walnut)] mb-4">
          세 가지 약속
        </h2>
      </section>
      <div className="px-6 mb-10 flex flex-col gap-4">
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
            className="p-5 bg-[var(--cream)] rounded-[10px]"
          >
            <p className="text-[14px] font-semibold text-[var(--walnut)] mb-1">
              {item.title}
            </p>
            <p className="text-[12px] text-[var(--warm-gray)] leading-[1.7]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ── CS 섹션 — 문의 카드 ── */}
      <section className="mx-6 mb-10 p-5 bg-[var(--cream)] rounded-xl text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-2">
          Customer Support
        </p>
        <p className="text-[13px] text-[var(--charcoal)] leading-[1.9] mb-4">
          문의는 카카오톡으로 받고 있습니다.
          <br /><br />
          아이의 이름과 연락처를 남겨주시면
          <br />
          순서대로 답변드리겠습니다.
        </p>
        <p className="text-[11px] text-[var(--warm-taupe)] mt-2">
          발송 메시지 기준 24시간 이내 답변
        </p>
        {/* CS 문의 버튼 — 카카오 노란색은 로그인 버튼에만 사용, 문의는 브랜드 컬러 */}
        <button className="mx-auto block max-w-[240px] w-full py-3 bg-[var(--walnut)] text-[var(--cream)] rounded-lg text-[13px] font-semibold font-[var(--font-ui)] hover:bg-[var(--walnut-dark)] transition-colors">
          카카오톡 문의하기
        </button>
      </section>

      <Footer />
    </>
  );
}
