'use client';

// ──────────────────────────────────────────────
// 비밀번호 찾기(재설정 요청) 페이지 — By MOMO 브랜드 스타일
// ──────────────────────────────────────────────
// 가입한 이메일을 입력하면 Supabase가 비밀번호 재설정 메일을 발송.
// 메일의 링크 클릭 → /auth/callback → /reset-password 로 이동하여
// 새 비밀번호를 설정할 수 있음.
// ──────────────────────────────────────────────

import { useState, useCallback } from 'react';
import Link from 'next/link';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import Logo from '@/shared/components/Logo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FindPasswordClientPage() {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isEmailValid = EMAIL_REGEX.test(email);

  // ── 비밀번호 재설정 메일 발송 ──
  const handleSendReset = useCallback(async () => {
    if (!isEmailValid || isSending) return;
    setIsSending(true);
    setErrorMessage('');

    if (!isSupabaseConfigured) {
      setErrorMessage('서비스 준비 중입니다. 잠시 후 다시 시도해 주세요.');
      setIsSending(false);
      return;
    }

    try {
      // Supabase 비밀번호 재설정 — 인증 메일 발송
      // 콜백 URL에 next=/reset-password를 포함시켜 코드 교환 후 비밀번호 재설정 페이지로 이동
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        // Supabase는 보안상 이메일 존재 여부를 노출하지 않으므로
        // "이메일을 찾을 수 없습니다" 에러는 보통 발생하지 않음
        setErrorMessage('비밀번호 재설정 메일 발송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      } else {
        setSent(true);
      }
    } catch {
      setErrorMessage('네트워크 연결을 확인해 주세요. 잠시 후 다시 시도해 주세요.');
    }

    setIsSending(false);
  }, [email, isEmailValid, isSending]);

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
              Reset Password
            </p>
            <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--charcoal)] tracking-[0.01em]">
              비밀번호 찾기
            </h1>
          </div>

          {sent ? (
            /* ── 발송 완료 상태 ── */
            <div className="text-center">
              <div className="border border-[#5B7553] bg-[#5B7553]/5 p-6 mb-8">
                <p className="font-[var(--font-ui)] text-[13px] md:text-[14px] text-[var(--charcoal)] leading-[1.8] tracking-[0.02em] mb-2">
                  비밀번호 재설정 메일을 발송했습니다.
                </p>
                <p className="font-[var(--font-ui)] text-[14px] md:text-[15px] font-semibold text-[var(--charcoal)] tracking-[0.02em] mb-3">
                  {email}
                </p>
                <p className="font-[var(--font-ui)] text-[12px] text-[var(--warm-taupe)] leading-[1.7] tracking-[0.02em]">
                  메일함을 확인하시고, 안내에 따라 새 비밀번호를 설정해 주세요.
                  <br />
                  메일이 보이지 않으면 스팸함도 확인해 주세요.
                </p>
              </div>

              <Link
                href="/my"
                className="inline-block w-full py-4 md:py-5 text-center text-[13px] md:text-[14px] font-[var(--font-ui)] font-bold tracking-[0.06em] border border-[var(--charcoal)] text-[var(--charcoal)] hover:bg-[var(--charcoal)] hover:text-white transition-colors"
              >
                로그인 페이지로
              </Link>
            </div>
          ) : (
            /* ── 이메일 입력 상태 ── */
            <>
              <p className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] opacity-70 leading-[1.7] tracking-[0.02em] mb-8 text-center">
                가입 시 사용하신 이메일 주소를 입력해 주세요.
                <br />
                비밀번호 재설정 안내 메일을 보내드립니다.
              </p>

              {/* ── 이메일 입력 ── */}
              <div className="mb-10">
                <label className="block font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.08em] text-[var(--charcoal)] mb-2 font-medium">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--charcoal)] outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors"
                />
              </div>

              {/* 에러 메시지 */}
              {errorMessage && (
                <p className="font-[var(--font-ui)] text-[12px] text-[var(--walnut)] mb-6 tracking-[0.02em] font-medium leading-[1.6]">
                  {errorMessage}
                </p>
              )}

              {/* ── 재설정 메일 발송 버튼 ── */}
              <button
                onClick={handleSendReset}
                disabled={!isEmailValid || isSending}
                className={`w-full py-4 md:py-5 text-[13px] md:text-[14px] font-[var(--font-ui)] font-bold tracking-[0.06em] transition-colors mb-6 ${
                  isEmailValid && !isSending
                    ? 'bg-[var(--charcoal)] text-white hover:bg-[var(--walnut-dark)] cursor-pointer'
                    : 'bg-[var(--oatmeal)] text-[var(--warm-taupe)] cursor-not-allowed'
                }`}
              >
                {isSending ? '발송 중...' : '비밀번호 재설정 메일 받기'}
              </button>

              {/* ── 하단 링크 ── */}
              <div className="border-t border-[var(--oatmeal)] pt-6">
                <div className="flex justify-center gap-6 font-[var(--font-ui)] text-[12px] tracking-[0.03em]">
                  <Link
                    href="/find-id"
                    className="text-[var(--charcoal)] hover:text-[var(--walnut-dark)] underline"
                  >
                    아이디 찾기
                  </Link>
                  <span className="text-[var(--oatmeal)]">|</span>
                  <Link
                    href="/my"
                    className="text-[var(--charcoal)] hover:text-[var(--walnut-dark)] underline"
                  >
                    로그인
                  </Link>
                  <span className="text-[var(--oatmeal)]">|</span>
                  <Link
                    href="/register"
                    className="text-[var(--charcoal)] hover:text-[var(--walnut-dark)] underline"
                  >
                    회원가입
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
