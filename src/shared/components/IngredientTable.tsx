// 원재료 투명 공개 테이블 — 상품 상세 페이지 내 재료별 효능 표시
interface IngredientInfo {
  name: string;
  benefit: string;
}

interface IngredientTableProps {
  ingredients: IngredientInfo[];
}

export default function IngredientTable({ ingredients }: IngredientTableProps) {
  return (
    <div className="border border-[var(--oatmeal)] rounded-xl overflow-hidden">
      <div className="bg-[var(--cream)] px-5 py-3">
        <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)]">
          Ingredients
        </p>
      </div>
      <div className="divide-y divide-[var(--oatmeal)]">
        {ingredients.map((item) => (
          <div key={item.name} className="flex items-center justify-between px-5 py-3">
            <span className="text-[15px] font-medium text-[var(--charcoal)]">
              {item.name}
            </span>
            <span className="text-[14px] text-[var(--warm-gray)]">
              {item.benefit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
