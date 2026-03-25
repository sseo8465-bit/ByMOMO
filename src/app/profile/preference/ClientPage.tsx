'use client';

// 프로필 Step 3 페이지 — 취향 입력 (건강 고민, 식감 선호)
// 반응형 + 이솝 스타일: 각진 칩, 축소 폰트, 넓은 여백
import { useRouter } from 'next/navigation';
import Button from '@/shared/components/Button';
import { useProfile } from '@/domains/profile/profile.context';
import { MOCK_HEALTH_CONCERNS, MOCK_TEXTURES } from '@/shared/mock/products';

export default function ProfileStep3() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();

  const handleHealthConcernToggle = (concern: string) => {
    const updated = profile.healthConcerns.includes(concern)
      ? profile.healthConcerns.filter((item) => item !== concern)
      : [...profile.healthConcerns, concern];
    updateProfile({ healthConcerns: updated });
  };

  const handleRecommend = () => {
    router.push('/recommend');
  };

  const handleSkip = () => {
    updateProfile({ healthConcerns: [], texturePreference: null });
    router.push('/recommend?skipped=true');
  };

  return (
    <div className="flex flex-col gap-8 max-w-[480px] mx-auto">
      {/* ── 섹션 헤더 ── */}
      <div className="text-center pt-4">
        <h2 className="font-[var(--font-serif)] text-[20px] md:text-[24px] font-medium text-[var(--walnut)] leading-[1.5] tracking-[0.02em]">
          조금 더 세밀하게,
          <br />
          아이의 취향을 담아주세요.
        </h2>
        <p className="text-[11px] text-[var(--warm-gray)] mt-3 tracking-[0.03em]">
          (선택 사항) 생략하셔도 무방합니다.
        </p>
      </div>

      {/* ── 건강 고민 (복수 선택) ── */}
      <div className="flex flex-col gap-3">
        <label className="font-[var(--font-ui)] text-[10px] font-semibold text-[var(--warm-taupe)] tracking-[0.12em] uppercase">
          건강 고민
        </label>
        <div className="flex flex-wrap gap-2.5">
          {MOCK_HEALTH_CONCERNS.map((concern) => (
            <button
              key={concern}
              onClick={() => handleHealthConcernToggle(concern)}
              className={`px-4 py-2 border text-[11px] font-[var(--font-ui)] tracking-[0.03em] transition-colors ${
                profile.healthConcerns.includes(concern)
                  ? 'bg-[var(--walnut)] text-[var(--cream)] border-[var(--walnut)]'
                  : 'border-[var(--oatmeal)] text-[var(--warm-gray)] hover:border-[var(--walnut)]'
              }`}
            >
              {concern}
            </button>
          ))}
        </div>
      </div>

      {/* ── 식감 선호 ── */}
      <div className="flex flex-col gap-3">
        <label className="font-[var(--font-ui)] text-[10px] font-semibold text-[var(--warm-taupe)] tracking-[0.12em] uppercase">
          식감 선호
        </label>
        <div className="flex flex-col gap-2">
          {MOCK_TEXTURES.map((texture) => (
            <button
              key={texture}
              onClick={() => updateProfile({ texturePreference: texture })}
              className={`w-full text-left px-5 py-3.5 border text-[11px] font-[var(--font-ui)] tracking-[0.03em] transition-colors ${
                profile.texturePreference === texture
                  ? 'bg-[var(--cream)] border-[var(--walnut)] text-[var(--walnut)] font-medium'
                  : 'border-[var(--oatmeal)] text-[var(--warm-gray)] hover:border-[var(--walnut)]'
              }`}
            >
              {texture}
            </button>
          ))}
        </div>
      </div>

      {/* ── 듀얼 CTA ── */}
      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={handleRecommend}
          className="w-full py-4 bg-[var(--walnut)] text-[var(--cream)] text-[13px] font-[var(--font-ui)] font-medium tracking-[0.04em] hover:bg-[var(--walnut-dark)] transition-colors"
        >
          {profile.name || '우리 아이'}의 맞춤 간식 보기
        </button>
        <button
          onClick={handleSkip}
          className="w-full py-3 bg-transparent text-[var(--warm-gray)] text-[11px] font-[var(--font-ui)] text-center tracking-[0.03em] hover:text-[var(--walnut)] transition-colors"
        >
          건너뛰고 바로 결과 보기
        </button>
      </div>
    </div>
  );
}
