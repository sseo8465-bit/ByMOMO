'use client';

// 프로필 Step 1 페이지 — 기본 정보 입력 (이름, 사진, 견종)
// 반응형 + 이솝 스타일: bottom-line 인풋, 축소 폰트, 넓은 여백
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
  const [customBreed, setCustomBreed] = useState('');
  const [isCustomBreed, setIsCustomBreed] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; breed?: string }>({});
  const [touched, setTouched] = useState(false);

  // 이솝 스타일 인풋 공통 클래스
  const inputBase = 'w-full bg-transparent border-0 border-b border-[var(--oatmeal)] focus:border-[var(--walnut)] outline-none py-3 text-[13px] font-[var(--font-ui)] tracking-[0.02em] transition-colors placeholder:text-[var(--warm-taupe-light)]';
  const inputError = 'border-b-[1.5px] border-[var(--walnut)]';

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

  const handleCustomBreedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomBreed(value);
    updateProfile({ breed: value });
    if (touched) validate();
  };

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
    <div className="flex flex-col gap-8 max-w-[480px] mx-auto">
      {/* ── 섹션 헤더 ── */}
      <div className="text-center pt-4">
        <h2 className="font-[var(--font-serif)] text-[20px] md:text-[24px] font-medium text-[var(--walnut)] leading-[1.5] tracking-[0.02em]">
          우리 아이를 소개해 주세요.
        </h2>
        <p className="text-[11px] text-[var(--warm-taupe)] mt-3 tracking-[0.03em]">
          이름만 알려주셔도, 정성껏 골라드릴게요.
        </p>
      </div>

      {/* ── 이름 입력 ── */}
      <div className="flex flex-col gap-2">
        <label className="font-[var(--font-ui)] text-[10px] font-semibold text-[var(--warm-taupe)] tracking-[0.12em] uppercase">
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
          className={`${inputBase} ${touched && errors.name ? inputError : ''}`}
        />
        {touched && errors.name && (
          <p className="text-[10px] text-[var(--walnut)] font-[var(--font-ui)] tracking-[0.02em]">{errors.name}</p>
        )}
      </div>

      {/* ── 사진 업로드 ── */}
      <div className="flex flex-col gap-2">
        <label className="font-[var(--font-ui)] text-[10px] font-semibold text-[var(--warm-taupe)] tracking-[0.12em] uppercase">
          사진 (선택)
        </label>
        <div
          className="relative border border-dashed border-[var(--warm-taupe-light)] flex items-center justify-center overflow-hidden cursor-pointer hover:bg-[var(--cream)] transition-colors h-[160px] md:h-[200px]"
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
              <p className="text-[10px] text-[var(--warm-taupe)] tracking-[0.03em]">
                사진을 선택해 주세요
              </p>
            </div>
          )}
        </div>
        <p className="text-[10px] text-[var(--warm-taupe)] tracking-[0.03em]">
          (선택) 나중에 추가할 수 있습니다
        </p>
      </div>

      {/* ── 견종 선택 ── */}
      <div className="flex flex-col gap-2">
        <label className="font-[var(--font-ui)] text-[10px] font-semibold text-[var(--warm-taupe)] tracking-[0.12em] uppercase">
          견종 *
        </label>
        <select
          value={isCustomBreed ? '기타' : profile.breed}
          onChange={handleBreedChange}
          className={`${inputBase} bg-transparent cursor-pointer ${touched && errors.breed && !isCustomBreed ? inputError : ''}`}
        >
          <option value="">견종을 선택해 주세요</option>
          {MOCK_BREEDS.map((breed) => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>

        {isCustomBreed && (
          <input
            type="text"
            placeholder="견종을 직접 입력해 주세요"
            value={customBreed}
            onChange={handleCustomBreedChange}
            autoFocus
            className={`mt-2 ${inputBase} ${touched && errors.breed ? inputError : ''}`}
          />
        )}

        {touched && errors.breed && (
          <p className="text-[10px] text-[var(--walnut)] font-[var(--font-ui)] tracking-[0.02em]">{errors.breed}</p>
        )}
      </div>

      {/* 다음 버튼 */}
      <Button variant="primary" onClick={handleNext} className="mt-4">
        다음
      </Button>
    </div>
  );
}
