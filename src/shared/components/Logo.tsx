'use client';

// ──────────────────────────────────────────────
// Logo — By MOMO 브랜드 로고 컴포넌트
// SVG 기반 인라인 로고 (반응형)
// 세리프 폰트 "By MOMO" + 두 번째 O를 발자국 모티프로 표현
// ──────────────────────────────────────────────

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CONFIG = {
  sm: { width: 80, height: 32, byFontSize: 10, momoFontSize: 16 },
  md: { width: 100, height: 40, byFontSize: 12, momoFontSize: 20 },
  lg: { width: 160, height: 64, byFontSize: 20, momoFontSize: 32 },
} as const;

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const config = SIZE_CONFIG[size];

  return (
    <svg
      viewBox="0 0 100 40"
      width={config.width}
      height={config.height}
      className={`${className}`}
      style={{
        fill: 'currentColor',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── "By" 텍스트 — 가볍고 우아한 무게 ── */}
      <text
        x="50"
        y="11"
        fontSize="9"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="300"
        letterSpacing="1.5"
        textAnchor="middle"
        fill="currentColor"
      >
        By
      </text>

      {/* ── "M" (첫 번째) ── */}
      <text
        x="14"
        y="32"
        fontSize="20"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="600"
        letterSpacing="1"
        fill="currentColor"
      >
        M
      </text>

      {/* ── 발바닥 모티프 (첫 번째 O 자리, x≈30~42) ── */}
      <g transform="translate(36, 25)">
        {/* 메인 패드 — 하트형 타원 */}
        <ellipse cx="0" cy="1.5" rx="3.2" ry="2.8" fill="currentColor" />
        {/* 발가락 4개 — 위쪽 부채꼴, 간격 충분히 */}
        <circle cx="-3.8" cy="-2.8" r="1.5" fill="currentColor" />
        <circle cx="-1.4" cy="-4.2" r="1.5" fill="currentColor" />
        <circle cx="1.4" cy="-4.2" r="1.5" fill="currentColor" />
        <circle cx="3.8" cy="-2.8" r="1.5" fill="currentColor" />
      </g>

      {/* ── "M" (두 번째) ── */}
      <text
        x="43"
        y="32"
        fontSize="20"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="600"
        letterSpacing="1"
        fill="currentColor"
      >
        M
      </text>

      {/* ── 발바닥 모티프 (두 번째 O 자리, x≈59~71) ── */}
      <g transform="translate(65, 25)">
        {/* 메인 패드 */}
        <ellipse cx="0" cy="1.5" rx="3.2" ry="2.8" fill="currentColor" />
        {/* 발가락 4개 */}
        <circle cx="-3.8" cy="-2.8" r="1.5" fill="currentColor" />
        <circle cx="-1.4" cy="-4.2" r="1.5" fill="currentColor" />
        <circle cx="1.4" cy="-4.2" r="1.5" fill="currentColor" />
        <circle cx="3.8" cy="-2.8" r="1.5" fill="currentColor" />
      </g>
    </svg>
  );
}
