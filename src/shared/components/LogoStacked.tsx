'use client';

// ──────────────────────────────────────────────
// LogoStacked — By MOMO A-02 Stacked Couture
// 수직형 로고: BY(300, 극광자간 0.8em) + 헤어라인 + MOMO(600, 0.2em)
// 금박 형압 최적화 — 패키지 라벨, 가입완료, 팝업 등 '정성' 강조 맥락
// 사용처: 패키지 씰, 모달/팝업, 가입 완료 페이지
// ──────────────────────────────────────────────

interface LogoStackedProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** 금박 효과 적용 여부 (CSS gradient 시뮬레이션) */
  goldFoil?: boolean;
}

const SIZE_CONFIG = {
  sm: { width: 100, height: 60 },
  md: { width: 140, height: 84 },
  lg: { width: 200, height: 120 },
} as const;

const DEEP_ESPRESSO = '#2D221B';

export default function LogoStacked({ size = 'md', className = '', goldFoil = false }: LogoStackedProps) {
  const config = SIZE_CONFIG[size];
  const foilId = `gold-foil-${size}`;

  return (
    <svg
      viewBox="0 0 140 84"
      width={config.width}
      height={config.height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="By MOMO"
    >
      {/* ── 금박 그라디언트 정의 (goldFoil=true일 때만 사용) ── */}
      {goldFoil && (
        <defs>
          <linearGradient id={foilId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4A265" />
            <stop offset="20%" stopColor="#E8D5A8" />
            <stop offset="40%" stopColor="#C4A265" />
            <stop offset="60%" stopColor="#A8863E" />
            <stop offset="80%" stopColor="#D4B87A" />
            <stop offset="100%" stopColor="#C4A265" />
          </linearGradient>
        </defs>
      )}

      {/* ── "BY" — Light(300), 극광자간(0.8em ≈ 12.8px at 16px) ── */}
      <text
        x="70"
        y="28"
        fontSize="16"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="300"
        letterSpacing="12.8"
        textAnchor="middle"
        fill={goldFoil ? `url(#${foilId})` : DEEP_ESPRESSO}
      >
        BY
      </text>

      {/* ── 헤어라인 디바이더 ── */}
      <line
        x1="30"
        y1="36"
        x2="110"
        y2="36"
        stroke={goldFoil ? '#C4A265' : DEEP_ESPRESSO}
        strokeWidth="0.35"
        opacity={goldFoil ? 0.5 : 0.2}
      />

      {/* ── "MOMO" — SemiBold(600), 0.2em 자간 ── */}
      <text
        x="70"
        y="62"
        fontSize="28"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="600"
        letterSpacing="5.6"
        textAnchor="middle"
        fill={goldFoil ? `url(#${foilId})` : DEEP_ESPRESSO}
      >
        MOMO
      </text>

      {/* ── 하단 헤어라인 ── */}
      <line
        x1="30"
        y1="70"
        x2="110"
        y2="70"
        stroke={goldFoil ? '#C4A265' : DEEP_ESPRESSO}
        strokeWidth="0.35"
        opacity={goldFoil ? 0.5 : 0.2}
      />
    </svg>
  );
}
