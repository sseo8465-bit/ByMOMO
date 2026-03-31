'use client';

// ──────────────────────────────────────────────
// 아이디(이메일) 찾기 페이지 — By MOMO 브랜드 스타일
// ──────────────────────────────────────────────
// 가입 시 입력한 이름 + 연락처로 등록된 이메일(아이디)을 찾는 페이지.
// Supabase RPC(find_email_by_name_phone) 호출로 마스킹된 이메일 반환.
// RPC 함수가 없으면 고객센터 안내로 폴백.
// ──────────────────────────────────────────────

import { useState, useCallback } from 'react';
import Link from 'next/link';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import Logo from '@/shared/components/Logo';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// ── 연락처 자동 포맷 (010-1234-5678) ──
function formatPhone(value: string): string {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export default function FindIdClientPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // 결과 상태: null(초기) / found(찾음) / not-found(없음) / error(RPC 미설정 등)
  const [result, setResult] = useState<{
    status: 'found' | 'not-found' | 'error';
    maskedEmail?: string;
    message: string;
  } | null>(null);

  const isFormValid = name.trim().length >= 2 && /^010-\d{4}-\d{4}$/.test(phone);

  // ── 이메일 찾기 실행 ──
  const handleSearch = useCallback(async () => {
    if (!isFormValid || isSearching) return;
    setIsSearching(true);
    setResult(null);

    if (!isSupabaseConfigured) {
      setResult({
        status: 'error',
        message: '서비스 준비 중입니다. 잠시 후 다시 시도해 주세요.',
      });
      setIsSearching(false);
      return;
    }

    try {
      // Supabase RPC로 이름+연락처 매칭 → 마스킹된 이메일 반환
      const { data, error } = await supabase.rpc('find_email_by_name_phone', {
        search_name: name.trim(),
        search_phone: phone.trim(),
      });

      if (error) {
        // RPC 함수 미생성 시 — 고객센터 안내로 폴백
        setResult({
          status: 'error',
          message: '아이디 찾기 기능이 준비 중입니다. 고객센터(privacy@bymomo.kr)로 문의해 주세요.',
        });
      } else if (data) {
        // 매칭 성공 — 마스킹된 이메일 표시
        setResult({
          status: 'found',
          maskedEmail: data,
          message: '입력하신 정보와 일치하는 계정을 찾았습니다.',
        });
      } else {
        // 매칭 실패
        setResult({
          status: 'not-found',
          message: '입력하신 정보와 일치하는 회원 정보를 찾을 수 없습니다. 이름과 연락처를 다시 확인해 주세요.',
        });
      }
    } catch {
      setResult({
        status: 'error',
        message: '네트워크 연결을 확인해 주세요. 잠시 후 다시 시도해 주세요.',
      });
    }

    setIsSearching(false);
  }, [name, phone, isFormValid, isSearching]);

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
              Find Account
            </p>
            <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--charcoal)] tracking-[0.01em]">
              아이디 찾기
            </h1>
          </div>

          {/* ── 안내 문구 ── */}
          <p className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] opacity-70 leading-[1.7] tracking-[0.02em] mb-8 text-center">
            가입 시 입력하신 이름과 연락처를 입력하시면
            <br />
            등록된 이메일(아이디)을 확인하실 수 있습니다.
          </p>

          {/* ── 이름 입력 ── */}
          <div className="mb-6 md:mb-8">
            <label className="block font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.08em] text-[var(--charcoal)] mb-2 font-medium">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="가입 시 입력한 이름"
              className="w-full bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--charcoal)] outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors"
            />
          </div>

          {/* ── 연락처 입력 ── */}
          <div className="mb-10">
            <label className="block font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.08em] text-[var(--charcoal)] mb-2 font-medium">
              연락처
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="010-0000-0000"
              maxLength={13}
              className="w-full bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--charcoal)] outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors"
            />
          </div>

          {/* ── 검색 결과 ── */}
          {result && (
            <div className={`mb-8 p-5 border ${
              result.status === 'found'
                ? 'border-[#5B7553] bg-[#5B7553]/5'
                : result.status === 'not-found'
                ? 'border-[var(--oatmeal)] bg-[var(--cream)]'
                : 'border-[var(--walnut)]/30 bg-[var(--walnut)]/5'
            }`}>
              <p className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] leading-[1.7] tracking-[0.02em] mb-1">
                {result.message}
              </p>
              {result.maskedEmail && (
                <p className="font-[var(--font-ui)] text-[15px] md:text-[16px] font-semibold text-[var(--charcoal)] tracking-[0.02em] mt-3">
                  {result.maskedEmail}
                </p>
              )}
            </div>
          )}

          {/* ── 찾기 버튼 ── */}
          <button
            onClick={handleSearch}
            disabled={!isFormValid || isSearching}
            className={`w-full py-4 md:py-5 text-[13px] md:text-[14px] font-[var(--font-ui)] font-bold tracking-[0.06em] transition-colors mb-6 ${
              isFormValid && !isSearching
                ? 'bg-[var(--charcoal)] text-white hover:bg-[var(--walnut-dark)] cursor-pointer'
                : 'bg-[var(--oatmeal)] text-[var(--warm-taupe)] cursor-not-allowed'
            }`}
          >
            {isSearching ? '조회 중...' : '아이디 찾기'}
          </button>

          {/* ── 하단 링크 ── */}
          <div className="border-t border-[var(--oatmeal)] pt-6">
            <div className="flex justify-center gap-6 font-[var(--font-ui)] text-[12px] tracking-[0.03em]">
              <Link
                href="/find-password"
                className="text-[var(--charcoal)] hover:text-[var(--walnut-dark)] underline"
              >
                비밀번호 찾기
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
        </div>
      </div>

      <Footer />
    </>
  );
}
