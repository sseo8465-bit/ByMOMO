'use client';

// ──────────────────────────────────────────────
// GNB — 전역 네비게이션 바 (반응형)
// 이솝 스타일: 넓은 여백, 가는 타이포, 시원한 자간
// ──────────────────────────────────────────────
import Link from 'next/link';

interface GNBProps {
  activeItem?: 'story' | 'shop' | 'cart' | 'my';
}

// ── 메뉴 항목 데이터 — 한 곳에서 관리 ──
const MENU_ITEMS = [
  { key: 'story', href: '/about', label: 'Story' },
  { key: 'shop', href: '/shop', label: 'Shop' },
  { key: 'cart', href: '/cart', label: 'Cart' },
  { key: 'my', href: '/my', label: 'My' },
] as const;

export default function GNB({ activeItem }: GNBProps) {
  return (
    <nav className="border-b border-[var(--oatmeal)] bg-[var(--warm-white)]">
      <div className="flex items-center justify-between page-padding py-5 md:py-6">
        {/* ── 로고 — 세리프 (Cormorant Garamond) ── */}
        <Link
          href="/"
          className="font-[var(--font-serif)] text-[18px] md:text-[20px] font-semibold text-[var(--walnut)] hover:text-[var(--walnut-dark)] transition-colors tracking-[0.02em]"
        >
          By MOMO
        </Link>

        {/* ── 메뉴 — DM Sans, 넓은 자간 ── */}
        <div className="flex items-center gap-6 md:gap-10">
          {MENU_ITEMS.map(({ key, href, label }) => (
            <Link
              key={key}
              href={href}
              className={`font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.12em] uppercase transition-colors ${
                activeItem === key
                  ? 'text-[var(--walnut)] font-medium'
                  : 'text-[var(--warm-gray)] font-normal hover:text-[var(--walnut)]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
