'use client';

export const dynamic = 'force-dynamic';

// 프로필 Step 1 페이지 — 기본 정보 입력 (이름, 사진, 견종)
// ⑥ 견종 기본값 "견종을 선택해 주세요" + 기타 선택 시 직접 입력 창
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/shared/components/Button';
import { useProfile } from '@/domains/profile/profile.context';
import { MOCK_BREEDS } from '@/shared/mock/products';

export default function ProfileStep1() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile.photo);
  // 기타 견종 직접 입력 상태
  const [customBreed, setCustomBreed] = useState('');
  const [isCustomBreed, setIsCustomBreed] = useState(false);

  // 에러 상태 관리
  const [errors, setErrors] = useState<{ name?: string; breed?: string }>({});
  const [touched, setTouched] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoPreview(result);
        updateProfile({ photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 견종 선택 핸들러 — "기타" 선택 시 직접 입력 모드 전환
  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '기타') {
      setIsCustomBreed(true);
      setCustomBreed('');
      updateProfile({ breed: '' });
    } else {
      setIsCustomBreed(false);
      setCustomBreed('');
      updateProfile({ breed: value });
    }
    if (touched) validate();
  };

  // 기타 견종 직접 입력 핸들러
  const handleCustomBreedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomBreed(value);
    updateProfile({ breed: value });
    if (touched) validate();
  };

  // 유효성 검사
  const validate = () => {
    const newErrors: { name?: string; breed?: string } = {};
    if (!profile.name.trim()) newErrors.name = '아이의 이름을 알려주세요.';
    if (!profile.breed.trim()) newErrors.breed = '어떤 친구인지 알려주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setTouched(true);
    if (validate()) {
      router.push('/profile/health');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── 섹션 헤더 ── */}
      <div className="text-center pt-4">
        <h2 className="font-[var(--font-serif)] text-[22px] font-medium text-[var(--walnut)] leading-[1.5]">
          우리 아이를 소개해 주세요.
        </h2>
        <p className="text-[13px] text-[var(--warm-gray)] mt-2">
          맞춤 간식을 위해 기본 정보가 필요합니다.
        </p>
      </div>

      {/* ── 이름 입력 섹션 ── */}
      <div className="flex flex-col gap-1.5">
        <label className="font-[var(--font-ui)] text-[12px] font-medium text-[var(--walnut)] tracking-[0.02em]">
          이름 *
        </label>
        <input
          type="text"
          placeholder="예: 뭉치"
          value={profile.name}
          onChange={(e) => {
            updateProfile({ name: e.target.value });
            if (touched) validate();
          }}
          className={`rounded-lg border ${
            touched && errors.name
              ? 'border-[1.5px] border-[var(--walnut)]'
              : 'border-[var(--oatmeal)] focus:border-[var(--walnut)]'
          } outline-none py-3 px-4 text-[14px] font-[var(--font-ui)] transition-colors`}
        />
        {touched && errors.name && (
          <p className="text-[11px] text-[var(--walnut)] font-[var(--font-ui)]">{errors.name}</p>
        )}
      </div>

      {/* ── 사진 업로드 섹션 ── */}
      <div className="flex flex-col gap-1.5">
        <label className="font-[var(--font-ui)] text-[12px] font-medium text-[var(--walnut)] tracking-[0.02em]">
          사진 (선택)
        </label>
        <div
          className="relative rounded-lg border border-dashed border-[var(--warm-taupe-light)] flex items-center justify-center overflow-hidden cursor-pointer hover:bg-[var(--cream)] transition-colors h-[160px]"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt="아이의 사진"
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-center">
              <p className="text-[10px] text-[var(--warm-taupe)]">
                사진을 선택해 주세요
              </p>
            </div>
          )}
        </div>
        <p className="text-[11px] text-[var(--warm-taupe)]">
          (선택) 나중에 추가할 수 있습니다
        </p>
      </div>

      {/* ── 견종 선택 섹션 — 기타 선택 시 직접 입력 ── */}
      <div className="flex flex-col gap-1.5">
        <label className="font-[var(--font-ui)] text-[12px] font-medium text-[var(--walnut)] tracking-[0.02em]">
          견종 *
        </label>
        <select
          value={isCustomBreed ? '기타' : profile.breed}
          onChange={handleBreedChange}
          className={`rounded-lg border ${
            touched && errors.breed && !isCustomBreed
              ? 'border-[1.5px] border-[var(--walnut)]'
              : 'border-[var(--oatmeal)] focus:border-[var(--walnut)]'
          } outline-none py-3 px-4 text-[14px] font-[var(--font-ui)] transition-colors bg-white cursor-pointer`}
        >
          <option value="">견종을 선택해 주세요</option>
          {MOCK_BREEDS.map((breed) => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>

        {/* 기타 선택 시 직접 입력 필드 */}
        {isCustomBreed && (
          <input
            type="text"
            placeholder="견종을 직접 입력해 주세요"
            value={customBreed}
            onChange={handleCustomBreedChange}
            autoFocus
            className={`mt-2 rounded-lg border ${
              touched && errors.breed
                ? 'border-[1.5px] border-[var(--walnut)]'
                : 'border-[var(--oatmeal)] focus:border-[var(--walnut)]'
            } outline-none py-3 px-4 text-[14px] font-[var(--font-ui)] transition-colors`}
          />
        )}

        {touched && errors.breed && (
          <p className="text-[11px] text-[var(--walnut)] font-[var(--font-ui)]">{errors.breed}</p>
        )}
      </div>

      {/* 다음 버튼 */}
      <Button variant="primary" onClick={handleNext} className="mt-4">
        다음
      </Button>
    </div>
  );
}
