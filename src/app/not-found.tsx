// ──────────────────────────────────────────────
// 커스텀 404 페이지 — 브랜드 톤에 맞는 다정한 안내
// ──────────────────────────────────────────────
import Link from 'next/link';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

export default function NotFound() {
  return (
    <>
      <GNB />

      <div className="min-h-[60vh] flex flex-col items-center justify-center page-padding text-center">
        <div className="max-w-[400px] mx-auto">
          {/* 부드러운 아이콘 */}
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--cream)] flex items-center justify-center mb-6">
            <span className="font-[var(--font-serif)] text-[28px] font-medium text-[var(--walnut)]">?</span>
          </div>

          <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--walnut)] mb-3 tracking-[0.01em]">
            페이지를 찾을 수 없어요
          </h1>

          <p className="font-[var(--font-ui)] text-[13px] md:text-[14px] text-[var(--warm-gray)] leading-[1.7] mb-8 tracking-[0.03em]">
            찾으시는 페이지가 이동되었거나 존재하지 않아요.<br />
            아래 버튼으로 다시 시작해 보세요.
          </p>

          <div className="flex flex-col gap-3 items-center">
            <Link
              href="/"
              className="inline-block px-8 py-3.5 bg-[var(--walnut)] text-[var(--cream)] text-[12px] font-[var(--font-ui)] font-medium tracking-[0.08em] uppercase hover:bg-[var(--walnut-dark)] transition-colors"
            >
              홈으로 돌아가기
            </Link>
            <Link
              href="/shop"
              className="font-[var(--font-ui)] text-[11px] text-[var(--warm-taupe)] hover:text-[var(--walnut)] tracking-[0.06em] transition-colors"
            >
              상품 둘러보기 →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
