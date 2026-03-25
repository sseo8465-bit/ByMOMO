'use client';

// 전역 네비게이션 바 — 타이포그래피 기반 메뉴
import Link from 'next/link';

interface GNBProps {
  activeItem?: 'story' | 'shop' | 'cart' | 'my';
}

export default function GNB({ activeItem }: GNBProps) {
  const isActive = (item: string): boolean => activeItem === item;

  return (
    <nav className="border-b border-[var(--oatmeal)] bg-[var(--warm-white)]">
      <div className="flex items-center justify-between px-6 py-4">
        {/* ── 로고 ── */}
        <Link
          href="/"
          className="font-[var(--font-serif)] text-[17px] font-semibold text-[var(--walnut)] hover:text-[var(--walnut-dark)] transition-colors"
        >
          By MOMO
        </Link>

        {/* ── 메뉴 아이템 ── */}
        <div className="flex items-center gap-6">
          <Link
            href="/about"
            className={`font-[var(--font-ui)] text-[12px] font-medium transition-colors ${
              isActive('story')
                ? 'text-[var(--walnut)]'
                : 'text-[var(--warm-gray)] hover:text-[var(--walnut)]'
            }`}
          >
            Story
          </Link>

          <Link
            href="/profile"
            className={`font-[var(--font-ui)] text-[12px] font-medium transition-colors ${
              isActive('shop')
                ? 'text-[var(--walnut)]'
                : 'text-[var(--warm-gray)] hover:text-[var(--walnut)]'
            }`}
          >
            Shop
          </Link>

          <Link
            href="/cart"
            className={`font-[var(--font-serif)] text-[14px] italic transition-colors ${
              isActive('cart')
                ? 'text-[var(--walnut)]'
                : 'text-[var(--warm-gray)] hover:text-[var(--walnut)]'
            }`}
          >
            Cart
          </Link>

          <Link
            href="/my"
            className={`font-[var(--font-serif)] text-[14px] italic transition-colors ${
              isActive('my')
                ? 'text-[var(--walnut)]'
                : 'text-[var(--warm-gray)] hover:text-[var(--walnut)]'
            }`}
          >
            My
          </Link>
        </div>
      </div>
    </nav>
  );
}
