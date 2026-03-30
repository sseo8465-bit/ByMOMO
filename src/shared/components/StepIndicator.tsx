// ──────────────────────────────────────────────
// 스텝 인디케이터 — 프로그레스 바 채움 + 단계 라벨
// 사용처: /profile, /profile/health, /profile/preference
// 리디자인: dot 방식 → 바(Bar) 채움 + "n/3" 텍스트
// ──────────────────────────────────────────────

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps = 3,
  labels = ['기본 정보', '건강 정보', '취향'],
}: StepIndicatorProps) {
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
  const currentLabel = labels[currentStep - 1] || '';

  return (
    <div className="max-w-[480px] mx-auto">
      {/* 상단: 단계 텍스트 + 진행률 */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-[var(--font-ui)] text-[13px] font-medium text-[var(--charcoal)] tracking-[0.02em]">
          {currentLabel}
        </span>
        <span className="font-[var(--font-ui)] text-[12px] text-[var(--warm-taupe)] tracking-[0.04em]">
          {currentStep} / {totalSteps}
        </span>
      </div>

      {/* 프로그레스 바 */}
      <div className="relative w-full h-[3px] bg-[var(--oatmeal)] overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[var(--walnut-dark)] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 하단: 전체 단계 라벨 */}
      <div className="flex items-center justify-between mt-2.5">
        {labels.map((label, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <span
              key={label}
              className={`font-[var(--font-ui)] text-[11px] tracking-[0.03em] transition-colors ${
                isActive
                  ? 'text-[var(--walnut-dark)] font-medium'
                  : isCompleted
                    ? 'text-[var(--walnut)]'
                    : 'text-[var(--warm-taupe-light)]'
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
