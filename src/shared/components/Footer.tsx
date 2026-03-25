// 사이트 푸터 — 회사 정보 + 링크 네비게이션
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--walnut-dark)] text-[var(--warm-taupe-light)]">
      <div className="px-6 py-10">
        {/* ── 로고 + 태그라인 ── */}
        <div className="text-center mb-10">
          <h3 className="font-[var(--font-serif)] text-[17px] font-semibold text-[var(--cream)] mb-2">
            By MOMO
          </h3>
          <p className="text-[14px] text-[var(--warm-taupe-light)] leading-[1.6]">
            내 아이를 위한 단 하나뿐인 선물
          </p>
        </div>

        {/* ── 네비게이션 링크 ── */}
        <nav className="flex flex-wrap justify-center gap-5 mb-10 text-[12px]">
          <Link href="/about" className="text-[var(--warm-taupe-light)] hover:text-[var(--cream)] transition-colors">
            About
          </Link>
          <Link href="/profile" className="text-[var(--warm-taupe-light)] hover:text-[var(--cream)] transition-colors">
            Shop
          </Link>
          <Link href="/" className="text-[var(--warm-taupe-light)] hover:text-[var(--cream)] transition-colors">
            이용안내
          </Link>
          <Link href="/" className="text-[var(--warm-taupe-light)] hover:text-[var(--cream)] transition-colors">
            FAQ
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--warm-taupe-light)] hover:text-[var(--cream)] transition-colors"
          >
            Instagram
          </a>
        </nav>

        {/* ── 구분선 ── */}
        <div className="border-t border-[var(--walnut)] mb-10" />

        {/* ── 사업자 정보 ── */}
        <div className="text-[12px] text-[var(--warm-taupe)] space-y-0.5 mb-10 text-center leading-[1.6]">
          <p>상호: By MOMO | 사업자번호: 000-00-00000</p>
          <p>대표: 홍길동 | 서울시 강남구 테헤란로</p>
        </div>

        {/* ── 약관 + 저작권 ── */}
        <div className="flex justify-center gap-3 text-[12px] text-[var(--warm-taupe)] mb-4">
          <Link href="/" className="hover:text-[var(--cream)] transition-colors">
            이용약관
          </Link>
          <span>·</span>
          <Link href="/" className="hover:text-[var(--cream)] transition-colors">
            개인정보처리방침
          </Link>
        </div>

        <p className="text-[12px] text-[var(--warm-taupe)] text-center">
          © 2026 By MOMO. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
