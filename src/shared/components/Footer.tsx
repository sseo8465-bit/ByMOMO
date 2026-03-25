'use client';

// ──────────────────────────────────────────────
// Footer — 사이트 하단 공통 컴포넌트
// 역할: 브랜드 로고, 네비게이션 링크, 사업자 정보, 약관 링크
// 사용처: 모든 페이지 하단에 공통 배치
// ──────────────────────────────────────────────
import Link from 'next/link';

// ── 네비게이션 링크 목록 ──
// href를 한 곳에서 관리 → 링크 변경 시 여기만 수정
const NAV_LINKS = [
  { href: '/about', label: 'About' },        // 브랜드 스토리 페이지
  { href: '/profile', label: 'Shop' },        // 맞춤 간식 찾기 (프로필 입력 → 추천)
  { href: '/guide', label: '이용안내' },       // 주문/배송/반품 안내 페이지
  { href: '/faq', label: 'FAQ' },             // 자주 묻는 질문 페이지
] as const;

// ── 약관 링크 목록 ──
const LEGAL_LINKS = [
  { href: '/terms', label: '이용약관' },            // 서비스 이용약관
  { href: '/privacy', label: '개인정보처리방침' },    // 개인정보 처리방침
] as const;

// ── 공통 링크 스타일 — 중복 제거용 상수 ──
const linkStyle = 'text-[var(--warm-taupe-light)] hover:text-[var(--cream)] transition-colors';
const legalLinkStyle = 'hover:text-[var(--cream)] transition-colors';

export default function Footer() {
  return (
    <footer className="bg-[var(--walnut-dark)] text-[var(--warm-taupe-light)]">
      <div className="px-6 py-10">

        {/* ── 브랜드 로고 + 태그라인 ── */}
        <div className="text-center mb-10">
          {/* 브랜드명 — 세리프 폰트, 크림색 */}
          <h3 className="font-[var(--font-serif)] text-[17px] font-semibold text-[var(--cream)] mb-2">
            By MOMO
          </h3>
          {/* 브랜드 슬로건 */}
          <p className="text-[14px] text-[var(--warm-taupe-light)] leading-[1.6]">
            내 아이를 위한 단 하나뿐인 선물
          </p>
        </div>

        {/* ── 네비게이션 링크 ── */}
        <nav className="flex flex-wrap justify-center gap-5 mb-10 text-[12px]">
          {/* 내부 페이지 링크 — NAV_LINKS 배열에서 자동 생성 */}
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={linkStyle}>
              {label}
            </Link>
          ))}
          {/* 인스타그램 외부 링크 — 새 탭에서 열림 */}
          <a
            href="https://instagram.com/bymomo.official"
            target="_blank"
            rel="noopener noreferrer"
            className={linkStyle}
          >
            Instagram
          </a>
        </nav>

        {/* ── 구분선 ── */}
        <div className="border-t border-[var(--walnut)] mb-10" />

        {/* ── 사업자 정보 — 전자상거래법 필수 표기 ── */}
        <div className="text-[12px] text-[var(--warm-taupe)] space-y-0.5 mb-10 text-center leading-[1.6]">
          <p>상호: By MOMO | 사업자번호: 000-00-00000</p>
          <p>대표: 홍길동 | 서울시 강남구 테헤란로</p>
        </div>

        {/* ── 약관 링크 — LEGAL_LINKS 배열에서 자동 생성 ── */}
        <div className="flex justify-center gap-3 text-[12px] text-[var(--warm-taupe)] mb-4">
          {LEGAL_LINKS.map(({ href, label }, index) => (
            <span key={href} className="flex items-center gap-3">
              {/* 첫 번째 항목 앞에는 구분점 없음 */}
              {index > 0 && <span>·</span>}
              <Link href={href} className={legalLinkStyle}>
                {label}
              </Link>
            </span>
          ))}
        </div>

        {/* ── 저작권 표기 ── */}
        <p className="text-[12px] text-[var(--warm-taupe)] text-center">
          © 2026 By MOMO. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
