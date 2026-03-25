// 스텝 인디케이터 — 프로필 입력 플로우 진행 상태 표시
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
  return (
    <div className="flex items-center justify-center gap-0 py-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            {/* ── 스텝 원형 ── */}
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-[var(--font-ui)] font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--walnut)] text-[var(--cream)]'
                    : isCompleted
                      ? 'bg-[var(--walnut)] text-[var(--cream)]'
                      : 'bg-[var(--oatmeal)] text-[var(--warm-taupe)]'
                }`}
              >
                {isCompleted ? '✓' : step}
              </div>
              {labels[i] && (
                <span
                  className={`text-[12px] mt-1.5 transition-colors ${
                    isActive || isCompleted
                      ? 'text-[var(--walnut)] font-medium'
                      : 'text-[var(--warm-taupe)]'
                  }`}
                >
                  {labels[i]}
                </span>
              )}
            </div>

            {/* ── 연결선 ── */}
            {step < totalSteps && (
              <div
                className={`w-12 h-px mx-2 transition-colors ${
                  isCompleted ? 'bg-[var(--walnut)]' : 'bg-[var(--oatmeal)]'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
