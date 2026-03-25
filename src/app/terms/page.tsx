// ──────────────────────────────────────────────
// 이용약관 페이지 — 서비스 이용약관 전문 표시
// Footer 약관 링크(/terms)에서 진입
// ──────────────────────────────────────────────
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

export const dynamic = 'force-dynamic';

export default function TermsPage() {
  return (
    <>
      <GNB />

      {/* ── 페이지 헤더 — 이솝 스타일 크림 배경 ── */}
      <section className="bg-[var(--cream)] px-6 pt-8 pb-6 text-center">
        {/* 아이브로우 라벨 — 사이트 전체 통일 패턴 */}
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
          Legal
        </p>
        {/* 페이지 타이틀 — 세리프 */}
        <h1 className="font-[var(--font-serif)] text-[28px] font-semibold text-[var(--walnut)] leading-[1.3]">
          이용약관
        </h1>
      </section>

      {/* ── 약관 본문 ── */}
      <section className="px-6 py-10">
        <div className="text-[13px] text-[var(--warm-gray)] font-[var(--font-ui)] leading-[1.8] space-y-6">
          {/* 제1조 목적 */}
          <div>
            <h2 className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)] mb-2">
              제1조 (목적)
            </h2>
            <p>
              이 약관은 By MOMO(이하 &ldquo;회사&rdquo;)가 제공하는 온라인 서비스의 이용과 관련하여
              회사와 이용자 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
            </p>
          </div>

          {/* 제2조 정의 */}
          <div>
            <h2 className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)] mb-2">
              제2조 (정의)
            </h2>
            <p>
              &ldquo;서비스&rdquo;란 회사가 운영하는 웹사이트 및 관련 제반 서비스를 의미합니다.
              &ldquo;이용자&rdquo;란 이 약관에 동의하고 서비스를 이용하는 자를 의미합니다.
            </p>
          </div>

          {/* 준비 중 안내 */}
          <div className="bg-[var(--cream)] rounded-[var(--radius-card)] p-5 text-center">
            <p className="text-[12px] text-[var(--warm-taupe)]">
              상세 약관은 정식 오픈 시 업데이트됩니다.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
