'use client';

// ──────────────────────────────────────────────
// 글로벌 Error Boundary — 서버 에러 시 브랜드 톤에 맞는 안내
// 하얀 화면(White Screen) 방지
// ──────────────────────────────────────────────

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center page-padding text-center">
      <div className="max-w-[400px] mx-auto">
        {/* 아이콘 */}
        <div className="w-16 h-16 mx-auto rounded-full bg-[var(--cream)] flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--walnut)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 className="font-[var(--font-serif)] text-[22px] md:text-[26px] font-medium text-[var(--walnut)] mb-3 tracking-[0.01em]">
          잠시 후 다시 시도해 주세요
        </h2>

        <p className="font-[var(--font-ui)] text-[13px] md:text-[14px] text-[var(--warm-gray)] leading-[1.7] mb-8 tracking-[0.03em]">
          일시적인 문제가 발생했어요.<br />
          잠시 후 다시 방문해 주시면 감사하겠습니다.
        </p>

        <button
          onClick={reset}
          className="inline-block px-8 py-3.5 bg-[var(--walnut)] text-[var(--cream)] text-[12px] font-[var(--font-ui)] font-medium tracking-[0.08em] uppercase hover:bg-[var(--walnut-dark)] transition-colors"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
