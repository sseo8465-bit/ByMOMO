'use client';

// ──────────────────────────────────────────────
// 마이페이지 — PVCS 스타일 로그인 + 관리자 비밀 통로
// ──────────────────────────────────────────────
// [비로그인 상태]
//   1) 이메일/비밀번호 로그인 → Supabase Auth (실제 인증)
//   2) 버튼 위계: 로그인(solid walnut) > 비회원 주문/카카오(outline)
//   3) 회원가입 링크 → /register
//
// [로그인 상태]
//   프로필 헤더 + 메뉴 리스트 + 로그아웃
//
// [관리자 비밀 통로]
//   "운영" 5회 탭 → 비밀번호 입력 → /admin
// ──────────────────────────────────────────────

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import { useAuth } from '@/domains/auth/auth.context';

// 관리자 비밀번호 — Phase 2에서 DB role 기반으로 전환 예정
const ADMIN_PASSWORD = 'momo2026';

export default function MyPage() {
  const { isLoggedIn, user, loginWithEmail, loginWithKakao, logout, isLoading, displayName, userEmail } = useAuth();
  const router = useRouter();

  // ── 로그인 폼 상태 ──
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // ── 관리자 비밀 통로 상태 ──
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminPw, setAdminPw] = useState('');
  const [adminError, setAdminError] = useState('');

  // ── 비회원 주문 조회 상태 ──
  const [orderIdInput, setOrderIdInput] = useState('');
  const [showOrderSearch, setShowOrderSearch] = useState(false);

  // ── 이메일 로그인 핸들러 (Supabase Auth) ──
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim() || !password) {
      setLoginError('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setIsLoginLoading(true);
    const result = await loginWithEmail(email, password);
    setIsLoginLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setLoginError(result.error || '로그인 중 문제가 발생했습니다.');
    }
  };

  // ── 관리자 비밀 통로: "운영" 텍스트 5회 탭 ──
  const handleAdminTap = () => {
    const newCount = adminTapCount + 1;
    setAdminTapCount(newCount);
    if (newCount >= 5) {
      setShowAdminInput(true);
      setAdminTapCount(0);
    }
  };

  // ── 관리자 비밀번호 확인 ──
  const handleAdminLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (adminPw === ADMIN_PASSWORD) {
      router.push('/admin');
    } else {
      setAdminError('비밀번호가 일치하지 않습니다.');
      setAdminPw('');
    }
  };

  // ── 비회원 주문 조회 ──
  const handleOrderSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderIdInput) {
      // TODO: 실제 주문 조회 로직 연결
      setOrderIdInput('');
    }
  };

  // ── 로딩 상태 ──
  if (isLoading) {
    return (
      <>
        <GNB activeItem="my" />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <p className="font-[var(--font-ui)] text-[12px] text-[var(--warm-gray)] tracking-[0.04em]">로딩 중...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <GNB activeItem="my" />

      <div className="page-padding section-spacing min-h-[60vh]">
        <div className="max-w-[420px] mx-auto">

          {isLoggedIn && user ? (
            /* ===== 로그인 상태 ===== */
            <div>
              {/* 프로필 헤더 */}
              <div className="text-center mb-12 md:mb-16">
                {/* 프로필 이미지 (카카오 로그인일 때만) */}
                {user.provider === 'kakao' && user.data.profileImage && (
                  <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 bg-[var(--oatmeal)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.data.profileImage}
                      alt={displayName || '프로필'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {/* 이메일 로그인일 때 이니셜 아바타 */}
                {user.provider === 'email' && (
                  <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-[var(--cream)] border border-[var(--oatmeal)]">
                    <span className="font-[var(--font-serif)] text-[24px] font-medium text-[var(--walnut)]">
                      {(displayName || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <p className="font-[var(--font-serif)] text-[22px] md:text-[26px] font-medium text-[var(--walnut)] tracking-[0.01em]">
                  {displayName}님
                </p>
                {userEmail && (
                  <p className="font-[var(--font-ui)] text-[12px] text-[var(--warm-gray)] mt-1.5 tracking-[0.03em]">{userEmail}</p>
                )}
              </div>

              {/* 메뉴 리스트 — hairline 구분 */}
              <div className="border-t border-[var(--oatmeal)]">
                {['주문 내역', '구독 관리', '반려견 프로필'].map((label) => (
                  <button
                    key={label}
                    className="w-full flex items-center justify-between py-4 border-b border-[var(--oatmeal)] font-[var(--font-ui)] text-[13px] md:text-[14px] text-[var(--charcoal)] hover:text-[var(--walnut)] tracking-[0.02em] transition-colors"
                  >
                    {label}
                    <span className="text-[var(--warm-taupe)]">→</span>
                  </button>
                ))}
              </div>

              {/* 로그아웃 */}
              <div className="text-center mt-10">
                <button
                  onClick={() => logout()}
                  className="font-[var(--font-ui)] text-[11px] text-[var(--warm-taupe)] hover:text-[var(--walnut)] tracking-[0.06em] transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            /* ===== 비로그인 상태 — PVCS 스타일 ===== */
            <div>
              {/* 페이지 타이틀 */}
              <div className="text-center mb-10 md:mb-14">
                <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--warm-taupe)] mb-3">
                  Login
                </p>
                <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--walnut)] tracking-[0.01em]">
                  회원 로그인
                </h1>
              </div>

              {/* ── 이메일/비밀번호 로그인 폼 ── */}
              <form onSubmit={handleEmailLogin} className="mb-6">
                {/* 이메일(아이디) */}
                <div className="mb-5">
                  <label className="block font-[var(--font-ui)] text-[10px] tracking-[0.12em] uppercase text-[var(--warm-taupe)] mb-2">
                    ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
                    placeholder="이메일 주소를 입력해 주세요"
                    required
                    className="w-full bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--walnut)] outline-none py-3 text-[13px] font-[var(--font-ui)] font-light text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors"
                  />
                </div>

                {/* 비밀번호 */}
                <div className="mb-6">
                  <label className="block font-[var(--font-ui)] text-[10px] tracking-[0.12em] uppercase text-[var(--warm-taupe)] mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                    placeholder="비밀번호를 입력해 주세요"
                    required
                    className="w-full bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--walnut)] outline-none py-3 text-[13px] font-[var(--font-ui)] font-light text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors"
                  />
                </div>

                {/* 에러 메시지 — 브랜드 톤 (walnut) */}
                {loginError && (
                  <p className="font-[var(--font-ui)] text-[11px] text-[var(--walnut)] tracking-[0.02em] mb-4 leading-[1.6]">
                    {loginError}
                  </p>
                )}

                {/* ── 로그인 버튼 — Solid Walnut (최상위 위계) ── */}
                <button
                  type="submit"
                  disabled={isLoginLoading}
                  className="w-full py-3.5 bg-[var(--walnut)] text-[var(--cream)] text-[12px] font-[var(--font-ui)] font-medium tracking-[0.08em] uppercase hover:bg-[var(--walnut-dark)] disabled:opacity-60 transition-colors"
                >
                  {isLoginLoading ? '로그인 중...' : 'Login'}
                </button>
              </form>

              {/* ── 회원가입 안내 ── */}
              <div className="text-center mb-8">
                <span className="font-[var(--font-ui)] text-[11px] text-[var(--warm-gray)] tracking-[0.03em]">
                  아직 회원이 아니신가요?{' '}
                  <Link href="/register" className="text-[var(--walnut)] underline underline-offset-4 decoration-[var(--walnut)]/40 hover:decoration-[var(--walnut)] transition-colors">
                    회원가입
                  </Link>
                </span>
              </div>

              {/* ── 구분선 ── */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 border-t border-[var(--oatmeal)]" />
                <span className="font-[var(--font-ui)] text-[10px] tracking-[0.1em] uppercase text-[var(--warm-taupe)]">
                  또는
                </span>
                <div className="flex-1 border-t border-[var(--oatmeal)]" />
              </div>

              {/* ── 비회원 주문하기 — Outline 스타일 (보조 위계) ── */}
              <Link href="/checkout" className="block mb-3">
                <button className="w-full py-3.5 border border-[var(--walnut)] text-[var(--walnut)] text-[12px] font-[var(--font-ui)] font-medium tracking-[0.08em] uppercase bg-transparent hover:bg-[var(--cream)] transition-colors">
                  비회원 주문하기
                </button>
              </Link>

              {/* ── 카카오 로그인 — Outline 스타일 (보조 위계) ── */}
              <button
                onClick={loginWithKakao}
                className="w-full py-3.5 border border-[#FEE500] bg-transparent text-[var(--charcoal)] text-[12px] font-[var(--font-ui)] font-medium tracking-[0.06em] hover:bg-[#FEE500]/10 transition-colors mb-8"
              >
                카카오로 시작하기
              </button>

              {/* ── 아이디/비밀번호 찾기 링크 ── */}
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/find-id"
                  className="font-[var(--font-ui)] text-[10px] tracking-[0.08em] uppercase text-[var(--warm-taupe)] hover:text-[var(--walnut)] transition-colors"
                >
                  Forgot ID
                </Link>
                <span className="text-[var(--oatmeal)]">|</span>
                <Link
                  href="/find-password"
                  className="font-[var(--font-ui)] text-[10px] tracking-[0.08em] uppercase text-[var(--warm-taupe)] hover:text-[var(--walnut)] transition-colors"
                >
                  Forgot Password
                </Link>
              </div>

              {/* ── 비회원 주문 조회 (접이식) ── */}
              <div className="mt-10 text-center">
                <button
                  onClick={() => setShowOrderSearch(!showOrderSearch)}
                  className="font-[var(--font-ui)] text-[11px] text-[var(--warm-taupe)] hover:text-[var(--walnut)] tracking-[0.06em] transition-colors"
                >
                  비회원 주문 조회
                </button>

                {showOrderSearch && (
                  <form onSubmit={handleOrderSearch} className="max-w-[320px] mx-auto mt-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="주문번호를 입력해 주세요"
                        value={orderIdInput}
                        onChange={(e) => setOrderIdInput(e.target.value)}
                        required
                        className="flex-1 bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--walnut)] outline-none py-3 text-[13px] font-[var(--font-ui)] font-light text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!orderIdInput}
                        className="font-[var(--font-ui)] text-[11px] tracking-[0.08em] uppercase text-[var(--walnut)] hover:text-[var(--walnut-dark)] disabled:text-[var(--warm-taupe-light)] transition-colors"
                      >
                        조회
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* 관리자 비밀 통로 — 모든 상태에서 최하단에 표시 */}
          {/* ══════════════════════════════════════════════ */}
          <div className="mt-16 text-center">
            <button
              onClick={handleAdminTap}
              className="font-[var(--font-ui)] text-[9px] text-[var(--oatmeal)] tracking-[0.1em] cursor-default select-none"
              aria-hidden="true"
            >
              운영
            </button>

            {showAdminInput && (
              <form onSubmit={handleAdminLogin} className="mt-4 max-w-[240px] mx-auto">
                <input
                  type="password"
                  value={adminPw}
                  onChange={(e) => { setAdminPw(e.target.value); setAdminError(''); }}
                  placeholder="관리자 비밀번호"
                  autoFocus
                  className="w-full bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--walnut)] outline-none py-2 text-[12px] font-[var(--font-ui)] text-center text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.04em] transition-colors"
                />
                {adminError && (
                  <p className="font-[var(--font-ui)] text-[10px] text-[var(--walnut)] mt-2 tracking-[0.02em]">
                    {adminError}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
