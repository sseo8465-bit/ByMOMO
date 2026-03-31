'use client';

// ──────────────────────────────────────────────
// 비밀번호 재설정 페이지 — By MOMO 브랜드 스타일
// ──────────────────────────────────────────────
// /find-password에서 재설정 메일을 받은 고객이
// 메일 링크 → /auth/callback → 여기로 도착.
// 이 시점에서 Supabase 세션이 살아있으므로 updateUser로 비밀번호 변경 가능.
// ──────────────────────────────────────────────

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import Logo from '@/shared/components/Logo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// 영문 + 숫자 포함 8자 이상 (register와 동일한 규칙)
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export default function ResetPasswordClientPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // ── 비밀번호 일치 여부 실시간 계산 ──
  const passwordMatchStatus = useMemo(() => {
    if (!passwordConfirm) return null;
    return password === passwordConfirm ? 'match' : 'mismatch';
  }, [password, passwordConfirm]);

  // ── 폼 유효성 ──
  const isFormValid =
    PASSWORD_REGEX.test(password) &&
    password === passwordConfirm;

  // ── 비밀번호 변경 실행 ──
  const handleSubmit = useCallback(async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage('');

    if (!isSupabaseConfigured) {
      setErrorMessage('서비스 준비 중입니다. 잠시 후 다시 시도해 주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 재설정 세션이 활성화된 상태에서 비밀번호 업데이트
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        if (error.message.includes('same_password')) {
          setErrorMessage('이전 비밀번호와 동일합니다. 새로운 비밀번호를 입력해 주세요.');
        } else {
          setErrorMessage('비밀번호 변경 중 문제가 발생했습니다. 재설정 링크가 만료되었을 수 있습니다. 다시 시도해 주세요.');
        }
      } else {
        setSuccess(true);
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => router.push('/my'), 3000);
      }
    } catch {
      setErrorMessage('네트워크 연결을 확인해 주세요. 잠시 후 다시 시도해 주세요.');
    }

    setIsSubmitting(false);
  }, [password, isFormValid, isSubmitting, router]);

  return (
    <>
      <GNB />

      <div className="page-padding section-spacing">
        <div className="max-w-[420px] mx-auto">

          {/* ── 페이지 헤더 — 로고 + 타이틀 ── */}
          <div className="text-center mb-12 md:mb-16">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--warm-taupe)] mb-4">
              New Password
            </p>
            <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--charcoal)] tracking-[0.01em]">
              비밀번호 재설정
            </h1>
          </div>

          {success ? (
            /* ── 변경 완료 ── */
            <div className="text-center">
              <div className="border border-[#5B7553] bg-[#5B7553]/5 p-6 mb-8">
                <p className="font-[var(--font-ui)] text-[14px] md:text-[15px] text-[var(--charcoal)] leading-[1.8] tracking-[0.02em]">
                  비밀번호가 성공적으로 변경되었습니다.
                </p>
                <p className="font-[var(--font-ui)] text-[12px] text-[var(--warm-taupe)] mt-2 tracking-[0.02em]">
                  잠시 후 로그인 페이지로 이동합니다.
                </p>
              </div>
            </div>
          ) : (
            /* ── 비밀번호 입력 ── */
            <>
              <p className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] opacity-70 leading-[1.7] tracking-[0.02em] mb-8 text-center">
                새로운 비밀번호를 입력해 주세요.
              </p>

              {/* ── 새 비밀번호 ── */}
              <div className="mb-6 md:mb-8">
                <label className="block font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.08em] text-[var(--charcoal)] mb-2 font-medium">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="영문, 숫자 포함 8자 이상"
                  className="w-full bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--charcoal)] outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors"
                />
                {/* 비밀번호 형식 안내 — 입력 시작 후 형식 불일치 시 표시 */}
                {password && !PASSWORD_REGEX.test(password) && (
                  <p className="font-[var(--font-ui)] text-[12px] text-[var(--walnut)] mt-2 tracking-[0.02em] font-medium">
                    영문과 숫자를 포함하여 8자 이상으로 입력해 주세요.
                  </p>
                )}
              </div>

              {/* ── 비밀번호 확인 ── */}
              <div className="mb-10">
                <label className="block font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.08em] text-[var(--charcoal)] mb-2 font-medium">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 다시 입력해 주세요"
                  className={`w-full bg-transparent border-0 border-b ${
                    passwordMatchStatus === 'mismatch'
                      ? 'border-b-[var(--walnut)]'
                      : passwordMatchStatus === 'match'
                      ? 'border-b-[#5B7553]'
                      : 'border-b-[var(--oatmeal)] focus:border-b-[var(--charcoal)]'
                  } outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors`}
                />
                {passwordMatchStatus && (
                  <p className={`font-[var(--font-ui)] text-[12px] mt-2 tracking-[0.02em] font-medium ${
                    passwordMatchStatus === 'match' ? 'text-[#5B7553]' : 'text-[var(--walnut)]'
                  }`}>
                    {passwordMatchStatus === 'match'
                      ? '비밀번호가 일치합니다.'
                      : '비밀번호가 일치하지 않습니다.'}
                  </p>
                )}
              </div>

              {/* 에러 메시지 */}
              {errorMessage && (
                <p className="font-[var(--font-ui)] text-[12px] text-[var(--walnut)] mb-6 tracking-[0.02em] font-medium leading-[1.6]">
                  {errorMessage}
                </p>
              )}

              {/* ── 변경 버튼 ── */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 md:py-5 text-[13px] md:text-[14px] font-[var(--font-ui)] font-bold tracking-[0.06em] transition-colors ${
                  isFormValid && !isSubmitting
                    ? 'bg-[var(--charcoal)] text-white hover:bg-[var(--walnut-dark)] cursor-pointer'
                    : 'bg-[var(--oatmeal)] text-[var(--warm-taupe)] cursor-not-allowed'
                }`}
              >
                {isSubmitting ? '변경 중...' : '비밀번호 변경'}
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
