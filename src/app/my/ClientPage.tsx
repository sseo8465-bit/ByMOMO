'use client';

// ──────────────────────────────────────────────
// 마이페이지 — 이솝/PVCS 스타일 로그인 + 프로필
// 넓은 여백, 미니멀 인풋, 정갈한 타이포
// ──────────────────────────────────────────────

import { useState } from 'react';
import Link from 'next/link';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import { useAuth } from '@/domains/auth/auth.context';

export default function MyPage() {
  const { isLoggedIn, user, loginWithKakao, logout, isLoading } = useAuth();
  const [orderIdInput, setOrderIdInput] = useState('');
  const [showOrderSearch, setShowOrderSearch] = useState(false);

  const handleOrderSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderIdInput) {
      alert(`주문번호 ${orderIdInput} 조회 (준비 중)`);
      setOrderIdInput('');
    }
  };

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
                {user.profileImage && (
                  <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 bg-[var(--oatmeal)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.profileImage}
                      alt={user.nickname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="font-[var(--font-serif)] text-[22px] md:text-[26px] font-medium text-[var(--walnut)] tracking-[0.01em]">
                  {user.nickname}님
                </p>
                {user.email && (
                  <p className="font-[var(--font-ui)] text-[12px] text-[var(--warm-gray)] mt-1.5 tracking-[0.03em]">{user.email}</p>
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
                  onClick={logout}
                  className="font-[var(--font-ui)] text-[11px] text-[var(--warm-taupe)] hover:text-[var(--walnut)] tracking-[0.06em] transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>
          ) : (
            /* ===== 비로그인 상태 — 이솝/PVCS 스타일 ===== */
            <div className="text-center">
              <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--warm-taupe)] mb-4">
                My Account
              </p>
              <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--walnut)] mb-3 tracking-[0.01em]">
                마이페이지
              </h1>
              <p className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--warm-gray)] mb-12 tracking-[0.03em]">
                로그인하고 혜택을 받아보세요.
              </p>

              <div className="max-w-[320px] mx-auto flex flex-col gap-3 mb-10">
                {/* 카카오 로그인 — 작고 세련되게 */}
                <button
                  onClick={loginWithKakao}
                  className="w-full py-3.5 bg-[#FEE500] text-[#191919] text-[12px] md:text-[13px] font-[var(--font-ui)] font-medium tracking-[0.04em] hover:brightness-95 transition-all"
                >
                  카카오로 시작하기
                </button>

                {/* 회원가입 — outline */}
                <Link href="/register" className="block">
                  <button className="w-full py-3.5 border border-[var(--walnut)] text-[var(--walnut)] text-[12px] md:text-[13px] font-[var(--font-ui)] tracking-[0.06em] uppercase bg-transparent hover:bg-[var(--cream)] transition-colors">
                    회원가입
                  </button>
                </Link>
              </div>

              {/* 구분선 */}
              <div className="flex items-center gap-4 max-w-[320px] mx-auto mb-8">
                <div className="flex-1 border-t border-[var(--oatmeal)]" />
                <span className="font-[var(--font-ui)] text-[10px] tracking-[0.1em] uppercase text-[var(--warm-taupe)]">
                  또는
                </span>
                <div className="flex-1 border-t border-[var(--oatmeal)]" />
              </div>

              {/* 비회원 주문 조회 */}
              <button
                onClick={() => setShowOrderSearch(!showOrderSearch)}
                className="font-[var(--font-ui)] text-[11px] md:text-[12px] text-[var(--warm-taupe)] hover:text-[var(--walnut)] tracking-[0.06em] transition-colors"
              >
                비회원 주문 조회
              </button>

              {showOrderSearch && (
                <form onSubmit={handleOrderSearch} className="max-w-[320px] mx-auto mt-6">
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
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
