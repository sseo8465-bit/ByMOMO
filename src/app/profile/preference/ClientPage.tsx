'use client';


// 프로필 Step 3 페이지 — 취향 입력 (건강 고민, 식감 선호)
// ⑦ "맞춤 간식 보기" vs "건너뛰고 바로 결과 보기" 분기 구현
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

  // 맞춤 간식 보기 — 건강 고민/식감 선택 데이터 포함 추천
  const handleRecommend = () => {
    router.push('/recommend');
  };

  // 건너뛰고 바로 보기 — Step 1~2 데이터만으로 추천 (건강 고민/식감 초기화)
  const handleSkip = () => {
    updateProfile({ healthConcerns: [], texturePreference: null });
    router.push('/recommend?skipped=true');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── 섹션 헤더 — 와이어프레임 v2.1 일치 ── */}
      <div className="text-center pt-4">
        <h2 className="font-[var(--font-serif)] text-[24px] font-medium text-[var(--walnut)] leading-[1.5]">
          조금 더 세밀하게,
          <br />
          아이의 취향을 담아주세요.
        </h2>
        <p className="text-[13px] text-[var(--warm-gray)] mt-2">
          (선택 사항) 생략하셔도 무방합니다.
        </p>
      </div>

      {/* ── 건강 고민 선택 섹션 (복수 선택) ── */}
      <div className="flex flex-col gap-2">
        <label className="font-[var(--font-ui)] text-[12px] font-medium text-[var(--walnut)] tracking-[0.02em]">
          건강 고민
        </label>
        <div className="flex flex-wrap gap-2">
          {MOCK_HEALTH_CONCERNS.map((concern) => (
            <button
              key={concern}
              onClick={() => handleHealthConcernToggle(concern)}
              className={`px-4 py-2 rounded-full border text-[13px] font-[var(--font-ui)] transition-colors ${
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

      {/* ── 식감 선호 선택 섹션 ── */}
      <div className="flex flex-col gap-2">
        <label className="font-[var(--font-ui)] text-[12px] font-medium text-[var(--walnut)] tracking-[0.02em]">
          식감 선호
        </label>
        <div className="flex flex-col gap-2">
          {MOCK_TEXTURES.map((texture) => (
            <button
              key={texture}
              onClick={() => updateProfile({ texturePreference: texture })}
              className={`w-full text-left px-4 py-3 rounded-lg border text-[13px] font-[var(--font-ui)] transition-colors ${
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

      {/* ── 듀얼 CTA — 와이어프레임 v2.1 버튼 구조 ── */}
      <div className="flex flex-col gap-2.5 mt-4 px-0">
        {/* Primary: 맞춤 간식 보기 */}
        <button
          onClick={handleRecommend}
          className="w-full py-3.5 bg-[var(--walnut)] text-[var(--cream)] rounded-lg text-[14px] font-[var(--font-ui)] font-medium tracking-[0.03em] hover:bg-[var(--walnut-dark)] transition-colors"
        >
          {profile.name || '우리 아이'}의 맞춤 간식 보기
        </button>

        {/* Ghost: 건너뛰고 바로 보기 */}
        <button
          onClick={handleSkip}
          className="w-full py-3 bg-transparent text-[var(--warm-gray)] text-[13px] font-[var(--font-ui)] text-center hover:text-[var(--walnut)] transition-colors"
        >
          건너뛰고 바로 결과 보기
        </button>
      </div>
    </div>
  );
}
