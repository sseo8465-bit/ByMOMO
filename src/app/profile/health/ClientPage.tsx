'use client';

// 프로필 Step 2 페이지 — 건강 정보 입력 (나이, 체중, 알러지 / 싫어하는 재료)
// 반응형 + 이솝 스타일: bottom-line 인풋, 축소 폰트
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/shared/components/Button';
import { useProfile } from '@/domains/profile/profile.context';
import { MOCK_ALLERGIES } from '@/shared/mock/products';

export default function ProfileStep2() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const [errors, setErrors] = useState<{ age?: string; weight?: string }>({});
  const [touched, setTouched] = useState(false);

  const inputBase = 'w-full bg-transparent border-0 border-b border-[var(--oatmeal)] focus:border-[var(--walnut)] outline-none py-3 text-[13px] font-[var(--font-ui)] tracking-[0.02em] transition-colors placeholder:text-[var(--warm-taupe-light)]';
  const inputError = 'border-b-[1.5px] border-[var(--walnut)]';

  const handleAllergyToggle = (allergy: string) => {
    const updated = profile.dislikedIngredients.includes(allergy)
      ? profile.dislikedIngredients.filter((item) => item !== allergy)
      : [...profile.dislikedIngredients, allergy];
    updateProfile({ dislikedIngredients: updated });
  };

  const validate = () => {
    const newErrors: { age?: string; weight?: string } = {};
    if (profile.age === null || profile.age === undefined) {
      newErrors.age = '나이를 입력해 주세요.';
    }
    if (profile.weight === null || profile.weight === undefined) {
      newErrors.weight = '체중을 입력해 주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setTouched(true);
    if (validate()) {
      router.push('/profile/preference');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[480px] mx-auto">
      {/* ── 섹션 헤더 ── */}
      <div className="text-center pt-4">
        <h2 className="font-[var(--font-serif)] text-[20px] md:text-[24px] font-medium text-[var(--walnut)] leading-[1.5] tracking-[0.02em]">
          우리 아이, 조금 더 알려주세요.
        </h2>
        <p className="text-[11px] text-[var(--warm-taupe)] mt-3 tracking-[0.03em]">
          더 잘 맞는 간식을 찾는 데 참고할게요.
        </p>
      </div>

      {/* ── 나이 + 체중 — 2컬럼 ── */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-[var(--font-ui)] text-[10px] font-semibold text-[var(--warm-taupe)] tracking-[0.12em] uppercase">
            나이 (살) *
          </label>
          <input
            type="number"
            placeholder="예: 3"
            value={profile.age ?? ''}
            onChange={(e) => {
              updateProfile({ age: e.target.value ? parseInt(e.target.value) : null });
              if (touched) validate();
            }}
            className={`${inputBase} ${touched && errors.age ? inputError : ''}`}
            min="0"
            max="30"
          />
          {touched && errors.age && (
            <p className="text-[10px] text-[var(--walnut)] font-[var(--font-ui)]">{errors.age}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-[var(--font-ui)] text-[10px] font-semibold text-[var(--warm-taupe)] tracking-[0.12em] uppercase">
            체중 (kg) *
          </label>
          <input
            type="number"
            placeholder="예: 5.5"
            value={profile.weight ?? ''}
            onChange={(e) => {
              updateProfile({ weight: e.target.value ? parseFloat(e.target.value) : null });
              if (touched) validate();
            }}
            className={`${inputBase} ${touched && errors.weight ? inputError : ''}`}
            min="0"
            step="0.1"
          />
          {touched && errors.weight && (
            <p className="text-[10px] text-[var(--walnut)] font-[var(--font-ui)]">{errors.weight}</p>
          )}
        </div>
      </div>

      {/* ── 알러지 / 싫어하는 재료 ── */}
      <div className="flex flex-col gap-3">
        <label className="font-[var(--font-ui)] text-[10px] font-semibold text-[var(--warm-taupe)] tracking-[0.12em] uppercase">
          알러지 / 싫어하는 재료
        </label>
        <div className="flex flex-wrap gap-2.5">
          {MOCK_ALLERGIES.map((allergy) => (
            <button
              key={allergy}
              onClick={() => handleAllergyToggle(allergy)}
              className={`px-4 py-2 border text-[11px] font-[var(--font-ui)] font-medium tracking-[0.03em] transition-colors ${
                profile.dislikedIngredients.includes(allergy)
                  ? 'bg-[var(--walnut)] text-[var(--cream)] border-[var(--walnut)]'
                  : 'border-[var(--oatmeal)] text-[var(--walnut)] hover:border-[var(--walnut)]'
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 mt-4">
        <Button variant="ghost" onClick={() => router.back()} className="flex-1">
          이전
        </Button>
        <Button variant="primary" onClick={handleNext} className="flex-1">
          다음
        </Button>
      </div>
    </div>
  );
}
