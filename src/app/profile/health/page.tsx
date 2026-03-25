'use client';

export const dynamic = 'force-dynamic';

// 프로필 Step 2 페이지 — 건강 정보 입력 (나이, 체중, 못 먹는 재료)
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/shared/components/Button';
import { useProfile } from '@/domains/profile/profile.context';
import { MOCK_ALLERGIES } from '@/shared/mock/products';

export default function ProfileStep2() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();

  // 에러 상태 관리
  const [errors, setErrors] = useState<{ age?: string; weight?: string }>({});
  const [touched, setTouched] = useState(false);

  const handleAllergyToggle = (allergy: string) => {
    const updated = profile.dislikedIngredients.includes(allergy)
      ? profile.dislikedIngredients.filter((item) => item !== allergy)
      : [...profile.dislikedIngredients, allergy];
    updateProfile({ dislikedIngredients: updated });
  };

  // 유효성 검사
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
    <div className="flex flex-col gap-6">
      {/* ── 섹션 헤더 ── */}
      <div className="text-center pt-4">
        <h2 className="font-[var(--font-serif)] text-[22px] font-medium text-[var(--walnut)] leading-[1.5]">
          건강 정보
        </h2>
        <p className="text-[14px] text-[var(--warm-gray)] mt-2">
          안전한 간식 추천에만 사용됩니다.
        </p>
      </div>

      {/* ── 나이 + 체중 입력 섹션 ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)]">
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
            className={`rounded-lg border ${
              touched && errors.age
                ? 'border-red-400 focus:border-red-500'
                : 'border-[var(--oatmeal)] focus:border-[var(--walnut)]'
            } outline-none py-3 px-4 text-[15px] font-[var(--font-ui)] transition-colors`}
            min="0"
            max="30"
          />
          {touched && errors.age && (
            <p className="text-[12px] text-red-500 font-[var(--font-ui)]">{errors.age}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)]">
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
            className={`rounded-lg border ${
              touched && errors.weight
                ? 'border-red-400 focus:border-red-500'
                : 'border-[var(--oatmeal)] focus:border-[var(--walnut)]'
            } outline-none py-3 px-4 text-[15px] font-[var(--font-ui)] transition-colors`}
            min="0"
            step="0.1"
          />
          {touched && errors.weight && (
            <p className="text-[12px] text-red-500 font-[var(--font-ui)]">{errors.weight}</p>
          )}
        </div>
      </div>

      {/* ── 못 먹는 재료 선택 섹션 ── */}
      <div className="flex flex-col gap-2">
        <label className="font-[var(--font-ui)] text-[14px] font-medium text-[var(--walnut)]">
          못 먹는 재료 (해당 시 선택)
        </label>
        <div className="flex flex-wrap gap-3">
          {MOCK_ALLERGIES.map((allergy) => (
            <button
              key={allergy}
              onClick={() => handleAllergyToggle(allergy)}
              className={`px-3.5 py-1.5 rounded-full border text-[14px] font-[var(--font-ui)] font-medium transition-colors ${
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
