'use client';

// ──────────────────────────────────────────────
// Logo — By MOMO A-01 Blade & Curve
// 아치선(0.5px) + italic By(300) + SemiBold MOMO(600) + 베이스라인
// 르라보 감성의 초극세 아치선으로 공기감 연출
// 발가락 도트 제거 — "아이콘 제로" 원칙 확정 (2026-03-31)
// 사용처: GNB 헤더, Footer — 웹사이트 메인 로고
// ──────────────────────────────────────────────

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CONFIG = {
  sm: { width: 110, height: 36 },
  md: { width: 140, height: 46 },
  lg: { width: 200, height: 66 },
} as const;

const DEEP_ESPRESSO = '#2D221B';

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const config = SIZE_CONFIG[size];

  return (
    <svg
      viewBox="0 0 140 46"
      width={config.width}
      height={config.height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="By MOMO"
    >
      {/* ── 아치선 — 0.5px 초극세, 르라보 공기감 ── */}
      <path
        d="M 25 14 Q 70 2, 115 14"
        fill="none"
        stroke={DEEP_ESPRESSO}
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* ── "By" — Italic Light(300), Cormorant Garamond ── */}
      <text
        x="42"
        y="27"
        fontSize="18"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="300"
        fontStyle="italic"
        letterSpacing="0.5"
        fill={DEEP_ESPRESSO}
      >
        By
      </text>

      {/* ── "MOMO" — SemiBold(600), 넓은 자간(0.12em) ── */}
      <text
        x="62"
        y="27"
        fontSize="22"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="600"
        letterSpacing="2.6"
        fill={DEEP_ESPRESSO}
      >
        MOMO
      </text>

      {/* ── 베이스라인 — 헤어라인 0.35px ── */}
      <line
        x1="25"
        y1="32"
        x2="115"
        y2="32"
        stroke={DEEP_ESPRESSO}
        strokeWidth="0.35"
        opacity="0.2"
      />
    </svg>
  );
}
