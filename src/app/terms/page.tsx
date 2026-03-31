// 이용약관 페이지 — 반응형 + 이솝 스타일
import type { Metadata } from "next";
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "이용약관",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <GNB />

      <section className="bg-[var(--cream)] page-padding pt-10 pb-8 md:pt-14 md:pb-10 text-center">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Legal
        </p>
        <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-semibold text-[var(--walnut)] leading-[1.3] tracking-[0.02em]">
          이용약관
        </h1>
      </section>

      <section className="page-padding section-spacing">
        <div className="max-w-[680px] mx-auto text-[11px] md:text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] leading-[1.9] tracking-[0.02em] space-y-8">
          <div>
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--walnut)] mb-3">
              제1조 (목적)
            </h2>
            <p>
              이 약관은 By MOMO(이하 &ldquo;회사&rdquo;)가 제공하는 온라인 서비스의 이용과 관련하여
              회사와 이용자 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
            </p>
          </div>

          <div>
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--walnut)] mb-3">
              제2조 (정의)
            </h2>
            <p>
              &ldquo;서비스&rdquo;란 회사가 운영하는 웹사이트 및 관련 제반 서비스를 의미합니다.
              &ldquo;이용자&rdquo;란 이 약관에 동의하고 서비스를 이용하는 자를 의미합니다.
            </p>
          </div>

          <div className="bg-[var(--cream)] p-6 text-center">
            <p className="text-[10px] text-[var(--warm-taupe)] tracking-[0.03em]">
              상세 약관은 정식 오픈 시 업데이트됩니다.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
