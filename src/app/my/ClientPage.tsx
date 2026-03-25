'use client';


// 마이페이지 — 로그인/비로그인 분기 (카카오 SDK 연동)
import { useState } from 'react';
import GNB from '@/shared/components/GNB';
import Button from '@/shared/components/Button';
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
          <p className="text-[15px] text-[var(--warm-gray)]">로딩 중...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <GNB activeItem="my" />

      <div className="flex-1 px-6 py-10 min-h-[60vh]">
        {isLoggedIn && user ? (
          /* ===== 로그인 상태 ===== */
          <div className="flex flex-col items-center">
            {/* ── 프로필 카드 ── */}
            <div className="w-full bg-[var(--cream)] rounded-xl p-6 mb-10 text-center">
              {user.profileImage && (
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 bg-[var(--oatmeal)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.profileImage}
                    alt={user.nickname}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="font-[var(--font-serif)] text-[22px] font-medium text-[var(--walnut)]">
                {user.nickname}님
              </p>
              {user.email && (
                <p className="text-[14px] text-[var(--warm-gray)] mt-1">{user.email}</p>
              )}
            </div>

            {/* ── 메뉴 ── */}
            <div className="w-full flex flex-col gap-3 mb-10">
              <button className="w-full text-left px-4 py-3 rounded-lg border border-[var(--oatmeal)] text-[15px] text-[var(--charcoal)] hover:bg-[var(--cream)] transition-colors">
                주문 내역
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg border border-[var(--oatmeal)] text-[15px] text-[var(--charcoal)] hover:bg-[var(--cream)] transition-colors">
                구독 관리
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg border border-[var(--oatmeal)] text-[15px] text-[var(--charcoal)] hover:bg-[var(--cream)] transition-colors">
                반려견 프로필
              </button>
            </div>

            {/* 로그아웃 */}
            <Button variant="ghost" onClick={logout}>
              로그아웃
            </Button>
          </div>
        ) : (
          /* ===== 비로그인 상태 ===== */
          <div className="flex flex-col items-center text-center">
            <h2 className="font-[var(--font-serif)] text-[28px] font-medium text-[var(--walnut)] mb-3">
              마이페이지
            </h2>
            <p className="text-[15px] text-[var(--warm-gray)] mb-10">
              로그인하고 혜택을 받아보세요.
            </p>

            <div className="w-full max-w-[280px] flex flex-col gap-3 mb-10">
              <Button variant="kakao" onClick={loginWithKakao}>
                카카오로 시작하기
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowOrderSearch(!showOrderSearch)}
                className="w-full"
              >
                비회원 주문 조회
              </Button>
            </div>

            {/* ── 비회원 주문 조회 폼 ── */}
            {showOrderSearch && (
              <form onSubmit={handleOrderSearch} className="w-full max-w-[280px]">
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="주문번호 입력"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    required
                    className="rounded-lg border border-[var(--oatmeal)] focus:border-[var(--walnut)] outline-none py-3 px-4 text-[15px] font-[var(--font-ui)] transition-colors"
                  />
                  <Button type="submit" variant="primary" disabled={!orderIdInput}>
                    조회
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
