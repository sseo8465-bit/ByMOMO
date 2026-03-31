'use client';

// ──────────────────────────────────────────────
// Footer — 톤온톤 전환 (급격한 단절 대신 부드러운 연결)
// 이솝 스타일: cream → oatmeal 톤으로 자연스러운 그라데이션
// ──────────────────────────────────────────────
import Link from 'next/link';
import Logo from '@/shared/components/Logo';

const NAV_LINKS = [
  { href: '/about', label: 'Story' },
  { href: '/shop', label: 'Shop' },
  { href: '/guide', label: '이용안내' },
  { href: '/faq', label: 'FAQ' },
] as const;

const LEGAL_LINKS = [
  { href: '/terms', label: '이용약관' },
  { href: '/privacy', label: '개인정보처리방침' },
] as const;

export default function Footer() {
  return (
    <footer>
      {/* ── 상단: hairline 구분선으로 본문과 분리 ── */}
      <div className="border-t border-[var(--oatmeal)]" />

      {/* ── 메인 영역: cream 배경 (본문 warm-white와 톤온톤) ── */}
      <div className="bg-[var(--cream)]">
        <div className="page-padding py-14 md:py-20">

          {/* ── 브랜드 로고 + 태그라인 ── */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-3">
              <Logo size="md" className="text-[var(--walnut)]" />
            </div>
            <p className="text-[12px] md:text-[13px] text-[var(--warm-taupe)] leading-[1.7] tracking-[0.04em]">
              내 아이를 위한 단 하나뿐인 선물
            </p>
          </div>

          {/* ── 네비게이션 링크 ── */}
          <nav className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12 text-[11px] md:text-[12px] tracking-[0.08em] uppercase">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[var(--warm-taupe)] hover:text-[var(--walnut)] transition-colors"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://instagram.com/bymomo.official"
              target="_blank"
              rel="noopener nofollow noreferrer"
              className="text-[var(--warm-taupe)] hover:text-[var(--walnut)] transition-colors"
            >
              Instagram
            </a>
          </nav>

          {/* ── Hairline 구분선 ── */}
          <div className="border-t border-[var(--oatmeal)] mb-10" />

          {/* ── 사업자 필수 정보 (전자상거래법 의무 표시) ── */}
          <div className="text-[11px] text-[var(--warm-taupe)] space-y-0.5 mb-8 text-center leading-[1.8] tracking-[0.02em]">
            <p>상호: By MOMO (바이모모)</p>
            <p>대표: 안서영 | 사업자등록번호: 000-00-00000</p>
            <p>통신판매업 신고번호: 제0000-서울강남-00000호</p>
            <p>주소: 서울특별시 강남구 테헤란로 000, 0층</p>
            <p>대표전화: 070-0000-0000 | 이메일: hello@bymomo.kr</p>
          </div>

          {/* ── 약관 링크 — 개인정보처리방침은 법적 권고에 따라 강조(Semi-bold) ── */}
          <div className="flex justify-center gap-4 text-[11px] text-[var(--warm-taupe)] mb-4 tracking-[0.02em]">
            {LEGAL_LINKS.map(({ href, label }, index) => (
              <span key={href} className="flex items-center gap-4">
                {index > 0 && <span className="text-[var(--oatmeal)]">·</span>}
                <Link
                  href={href}
                  className={`hover:text-[var(--walnut)] transition-colors ${
                    label === '개인정보처리방침' ? 'font-semibold text-[var(--charcoal)]' : ''
                  }`}
                >
                  {label}
                </Link>
              </span>
            ))}
          </div>

          {/* ── 저작권 ── */}
          <p className="text-[11px] text-[var(--warm-taupe)] text-center tracking-[0.04em]">
            © 2026 By MOMO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
