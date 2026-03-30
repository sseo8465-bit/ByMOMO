// 안심 필터 카드 — 제외된 성분 시각화
interface SafeFilterProps {
  dogName: string;
  excludedIngredients: string[];
}

export default function SafeFilter({ dogName, excludedIngredients }: SafeFilterProps) {
  if (excludedIngredients.length === 0) return null;

  return (
    <div className="bg-[var(--cream)] rounded-xl p-5 border-l-[3px] border-[var(--walnut)]">
      <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-2">
        Safe Filter
      </p>
      <p className="text-[15px] text-[var(--charcoal)] leading-[1.7] mb-3">
        {dogName ? `${dogName}에게 맞지 않는 성분을 제외했어요.` : '맞지 않는 성분을 제외했어요.'}
      </p>
      <div className="flex flex-wrap gap-3">
        {excludedIngredients.map((ingredient) => (
          <span
            key={ingredient}
            className="inline-flex items-center gap-1 bg-[var(--warm-white)] text-[var(--warm-gray)] rounded-full px-3 py-1 text-[12px] font-[var(--font-ui)]"
          >
            <span className="text-[var(--warm-taupe)]">✕</span>
            {ingredient}
          </span>
        ))}
      </div>
    </div>
  );
}
