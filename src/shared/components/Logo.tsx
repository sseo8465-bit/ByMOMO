'use client';

// ──────────────────────────────────────────────
// Logo — By MOMO 브랜드 로고 컴포넌트
// 절제된 우아함: High-contrast Serif + 넓은 자간
// 두 번째 O 위에만 작은 발가락 도트 3개 — 글자에 표정을 더하는 수준
// 컬러: Deep Espresso (#2D221B)
// ──────────────────────────────────────────────

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CONFIG = {
  sm: { width: 90, height: 32 },
  md: { width: 120, height: 42 },
  lg: { width: 180, height: 64 },
} as const;

const DEEP_ESPRESSO = '#2D221B';

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const config = SIZE_CONFIG[size];

  return (
    <svg
      viewBox="0 0 120 42"
      width={config.width}
      height={config.height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="By MOMO"
    >
      {/* ── "By" — MOMO의 1/3 크기, 극세 무게, 중앙 정렬 ── */}
      <text
        x="60"
        y="12"
        fontSize="7.5"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="300"
        letterSpacing="3"
        textAnchor="middle"
        fill={DEEP_ESPRESSO}
      >
        By
      </text>

      {/* ── "MOMO" — High-contrast Serif, 넓은 자간 (0.18em ≈ 4px at 22px) ── */}
      <text
        x="60"
        y="34"
        fontSize="22"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="600"
        letterSpacing="4"
        textAnchor="middle"
        fill={DEEP_ESPRESSO}
      >
        MOMO
      </text>

      {/* ── 두 번째 O 위 발가락 도트 3개 ──
           글자를 그림으로 바꾸는 게 아니라,
           O라는 글자 위에 작은 점 3개를 얹어 '표정'만 더한다.
           두 번째 O의 중심 ≈ x:82, 상단 ≈ y:18 부근 */}
      <circle cx="78.5" cy="18.5" r="1.05" fill={DEEP_ESPRESSO} />
      <circle cx="82" cy="17.2" r="1.05" fill={DEEP_ESPRESSO} />
      <circle cx="85.5" cy="18.5" r="1.05" fill={DEEP_ESPRESSO} />
    </svg>
  );
}
