'use client';

// ──────────────────────────────────────────────
// GNB — 전역 네비게이션 바
// 폰트 규칙: 로고만 세리프, 메뉴는 전부 DM Sans 통일
// ──────────────────────────────────────────────
import Link from 'next/link';

interface GNBProps {
  activeItem?: 'story' | 'shop' | 'cart' | 'my';
}

// ── 메뉴 항목 데이터 — 한 곳에서 관리 ──
const MENU_ITEMS = [
  { key: 'story', href: '/about', label: 'Story' },
  { key: 'shop', href: '/profile', label: 'Shop' },
  { key: 'cart', href: '/cart', label: 'Cart' },
  { key: 'my', href: '/my', label: 'My' },
] as const;

export default function GNB({ activeItem }: GNBProps) {
  return (
    <nav className="border-b border-[var(--oatmeal)] bg-[var(--warm-white)]">
      <div className="flex items-center justify-between px-6 py-4">
        {/* ── 로고 — 세리프 (Cormorant Garamond) ── */}
        <Link
          href="/"
          className="font-[var(--font-serif)] text-[17px] font-semibold text-[var(--walnut)] hover:text-[var(--walnut-dark)] transition-colors"
        >
          By MOMO
        </Link>

        {/* ── 메뉴 — 전부 DM Sans 12px 통일 ── */}
        <div className="flex items-center gap-5">
          {MENU_ITEMS.map(({ key, href, label }) => (
            <Link
              key={key}
              href={href}
              className={`font-[var(--font-ui)] text-[12px] tracking-[0.03em] transition-colors ${
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
