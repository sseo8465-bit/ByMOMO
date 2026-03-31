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
  const scale = config.width / 100;

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
      {/* ── "By" 텍스트 — 작고 가는 무게 ── */}
      <text
        x="0"
        y="12"
        fontSize={config.byFontSize}
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="300"
        letterSpacing="0.5"
        fill="currentColor"
      >
        By
      </text>

      {/* ── "MOMO" 텍스트 — "MOM" 부분 ── */}
      <text
        x="18"
        y="28"
        fontSize={config.momoFontSize}
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight="600"
        letterSpacing="0.8"
        fill="currentColor"
      >
        MOM
      </text>

      {/* ── 발자국 원 (두 번째 O를 대체) ── */}
      {/* 발자국 패드: 한 개의 큰 원 + 4개의 작은 원 */}
      <g transform={`translate(${52 * scale}, ${28 * scale})`}>
        {/* 메인 발자국 원 (엄지발가락 위치) */}
        <circle cx="0" cy="-5.5" r="3.5" fill="currentColor" opacity="0.9" />

        {/* 발가락 4개 - 부채 모양 배치 */}
        {/* 좌상단 발가락 */}
        <circle cx="-3" cy="1" r="2.8" fill="currentColor" opacity="0.85" />

        {/* 좌하단 발가락 */}
        <circle cx="-1.5" cy="4.5" r="2.8" fill="currentColor" opacity="0.85" />

        {/* 우하단 발가락 */}
        <circle cx="1.5" cy="4.5" r="2.8" fill="currentColor" opacity="0.85" />

        {/* 우상단 발가락 */}
        <circle cx="3" cy="1" r="2.8" fill="currentColor" opacity="0.85" />
      </g>
    </svg>
  );
}
