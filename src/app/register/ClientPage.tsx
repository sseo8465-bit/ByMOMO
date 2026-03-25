'use client';

// ──────────────────────────────────────────────
// 회원가입 페이지 — 이솝/PVCS 스타일
// 미니멀 입력폼: 하단 1px 선, 넓은 여백, 정규식 검증
// response-drafting: clean-code-principles 적용
// ──────────────────────────────────────────────

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';

// ── 폼 데이터 타입 ──
interface RegisterForm {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  address: string;
  dogName: string;
}

// ── 에러 타입 ──
interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  phone?: string;
  address?: string;
}

// ── 정규식 ──
const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[가-힣a-zA-Z\s]{2,}$/,
  phone: /^010-\d{4}-\d{4}$/,
  password: /^.{8,}$/,
  address: /^[가-힣a-zA-Z0-9\s\-.,()]{5,}$/,
  consonantOnly: /^[ㄱ-ㅎ\s]+$/,
};

// ── 연락처 자동 포맷 ──
function formatPhone(value: string): string {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

// ── 에러 메시지 (브랜드 톤앤매너) ──
const MESSAGES = {
  emailRequired: '이메일 주소를 입력해 주세요.',
  emailInvalid: '올바른 이메일 형식을 확인해 주세요.',
  passwordRequired: '비밀번호를 입력해 주세요.',
  passwordShort: '비밀번호는 8자 이상이어야 합니다.',
  passwordMismatch: '비밀번호가 일치하지 않습니다.',
  nameRequired: '이름을 입력해 주세요.',
  nameInvalid: '한글 또는 영문 2자 이상 입력해 주세요.',
  phoneRequired: '연락처를 입력해 주세요.',
  phoneInvalid: '연락처 형식을 확인해 주세요. (010-0000-0000)',
  addressRequired: '주소를 입력해 주세요.',
  addressInvalid: '올바른 주소를 입력해 주세요.',
} as const;

// ── 인풋 필드 컴포넌트 — 이솝 스타일 (하단 1px 선) ──
function FormField({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  error,
  touched,
  maxLength,
  onChange,
  onBlur,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder: string;
  error?: string;
  touched: boolean;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}) {
  const hasError = touched && !!error;
  return (
    <div className="mb-6 md:mb-8">
      <label className="block font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.12em] uppercase text-[var(--warm-taupe)] mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-transparent border-0 border-b ${
          hasError ? 'border-b-[var(--walnut)]' : 'border-b-[var(--oatmeal)] focus:border-b-[var(--walnut)]'
        } outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-light text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors`}
      />
      {hasError && (
        <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] text-[var(--walnut)] mt-2 tracking-[0.02em]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function RegisterClientPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    address: '',
    dogName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── 유효성 검사 ──
  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};

    if (!form.email.trim()) errs.email = MESSAGES.emailRequired;
    else if (!REGEX.email.test(form.email)) errs.email = MESSAGES.emailInvalid;

    if (!form.password) errs.password = MESSAGES.passwordRequired;
    else if (!REGEX.password.test(form.password)) errs.password = MESSAGES.passwordShort;

    if (form.password && form.passwordConfirm && form.password !== form.passwordConfirm) {
      errs.passwordConfirm = MESSAGES.passwordMismatch;
    }

    if (!form.name.trim()) errs.name = MESSAGES.nameRequired;
    else if (!REGEX.name.test(form.name.trim())) errs.name = MESSAGES.nameInvalid;

    if (!form.phone.trim()) errs.phone = MESSAGES.phoneRequired;
    else if (!REGEX.phone.test(form.phone)) errs.phone = MESSAGES.phoneInvalid;

    if (!form.address.trim()) errs.address = MESSAGES.addressRequired;
    else if (REGEX.consonantOnly.test(form.address.trim()) || !REGEX.address.test(form.address.trim())) {
      errs.address = MESSAGES.addressInvalid;
    }

    return errs;
  }, [form]);

  // ── 폼 유효성 + 약관 동의 여부 ──
  const isFormValid = useMemo(() => {
    const errs = validate();
    return (
      Object.keys(errs).length === 0 &&
      form.email.trim() !== '' &&
      form.password !== '' &&
      form.passwordConfirm !== '' &&
      form.name.trim() !== '' &&
      form.phone.trim() !== '' &&
      form.address.trim() !== '' &&
      agreedToTerms &&
      agreedToPrivacy
    );
  }, [validate, form, agreedToTerms, agreedToPrivacy]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setForm((prev) => ({ ...prev, phone: formatPhone(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (touched[name]) setErrors(validate());
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    setErrors(validate());
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setTouched({
      email: true, password: true, passwordConfirm: true,
      name: true, phone: true, address: true,
    });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0 || !agreedToTerms || !agreedToPrivacy) return;

    setIsSubmitting(true);
    // Phase 1: 더미 가입 완료 → 홈으로 이동
    setTimeout(() => router.push('/'), 500);
  };

  return (
    <>
      <GNB />

      <div className="page-padding section-spacing">
        <div className="max-w-[420px] mx-auto">
          {/* ── 페이지 헤더 ── */}
          <div className="text-center mb-12 md:mb-16">
            <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--warm-taupe)] mb-4">
              Create Account
            </p>
            <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--walnut)] tracking-[0.01em]">
              회원가입
            </h1>
          </div>

          {/* ── 입력 폼 ── */}
          <FormField
            label="이메일 *"
            name="email"
            type="email"
            value={form.email}
            placeholder="email@example.com"
            error={errors.email}
            touched={!!touched.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
          />

          <FormField
            label="비밀번호 *"
            name="password"
            type="password"
            value={form.password}
            placeholder="8자 이상"
            error={errors.password}
            touched={!!touched.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
          />

          <FormField
            label="비밀번호 확인 *"
            name="passwordConfirm"
            type="password"
            value={form.passwordConfirm}
            placeholder="비밀번호를 다시 입력해 주세요"
            error={errors.passwordConfirm}
            touched={!!touched.passwordConfirm}
            onChange={handleChange}
            onBlur={() => handleBlur('passwordConfirm')}
          />

          <div className="border-t border-[var(--oatmeal)] my-8 md:my-10" />

          <FormField
            label="이름 *"
            name="name"
            value={form.name}
            placeholder="성함을 입력해 주세요"
            error={errors.name}
            touched={!!touched.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
          />

          <FormField
            label="연락처 *"
            name="phone"
            type="tel"
            value={form.phone}
            placeholder="010-0000-0000"
            maxLength={13}
            error={errors.phone}
            touched={!!touched.phone}
            onChange={handleChange}
            onBlur={() => handleBlur('phone')}
          />

          <FormField
            label="주소 *"
            name="address"
            value={form.address}
            placeholder="배송받을 주소를 입력해 주세요"
            error={errors.address}
            touched={!!touched.address}
            onChange={handleChange}
            onBlur={() => handleBlur('address')}
          />

          <div className="border-t border-[var(--oatmeal)] my-8 md:my-10" />

          {/* 반려견 이름 (선택) */}
          <div className="mb-8">
            <label className="block font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.12em] uppercase text-[var(--warm-taupe)] mb-2">
              아이 이름
            </label>
            <input
              type="text"
              name="dogName"
              value={form.dogName}
              onChange={handleChange}
              placeholder="반려견 이름을 알려주세요 (선택)"
              className="w-full bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--walnut)] outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-light text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors"
            />
          </div>

          {/* ── 약관 동의 ── */}
          <div className="space-y-4 mb-10">
            <label className="flex items-start gap-3 cursor-pointer">
              <span
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`w-[16px] h-[16px] flex-shrink-0 border mt-0.5 flex items-center justify-center transition-colors cursor-pointer ${
                  agreedToTerms
                    ? 'border-[var(--walnut)] bg-[var(--walnut)]'
                    : 'border-[var(--warm-taupe-light)]'
                }`}
                role="checkbox"
                aria-checked={agreedToTerms}
              >
                {agreedToTerms && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--cream)" strokeWidth="1.5" strokeLinecap="round">
                    <polyline points="8 3 4 8 2 6" />
                  </svg>
                )}
              </span>
              <span
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className="font-[var(--font-ui)] text-[11px] md:text-[12px] text-[var(--warm-gray)] tracking-[0.02em] cursor-pointer"
              >
                <Link href="/terms" className="underline hover:text-[var(--walnut)]">이용약관</Link>에 동의합니다. (필수)
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <span
                onClick={() => setAgreedToPrivacy(!agreedToPrivacy)}
                className={`w-[16px] h-[16px] flex-shrink-0 border mt-0.5 flex items-center justify-center transition-colors cursor-pointer ${
                  agreedToPrivacy
                    ? 'border-[var(--walnut)] bg-[var(--walnut)]'
                    : 'border-[var(--warm-taupe-light)]'
                }`}
                role="checkbox"
                aria-checked={agreedToPrivacy}
              >
                {agreedToPrivacy && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--cream)" strokeWidth="1.5" strokeLinecap="round">
                    <polyline points="8 3 4 8 2 6" />
                  </svg>
                )}
              </span>
              <span
                onClick={() => setAgreedToPrivacy(!agreedToPrivacy)}
                className="font-[var(--font-ui)] text-[11px] md:text-[12px] text-[var(--warm-gray)] tracking-[0.02em] cursor-pointer"
              >
                <Link href="/privacy" className="underline hover:text-[var(--walnut)]">개인정보 처리방침</Link>에 동의합니다. (필수)
              </span>
            </label>
          </div>

          {/* ── 가입 버튼 ── */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 text-[12px] md:text-[13px] font-[var(--font-ui)] tracking-[0.08em] uppercase transition-colors ${
              isFormValid && !isSubmitting
                ? 'bg-[var(--walnut)] text-[var(--cream)] hover:bg-[var(--walnut-dark)] cursor-pointer'
                : 'bg-[var(--oatmeal)] text-[var(--warm-taupe-light)] cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '처리 중...' : 'By MOMO의 가족이 되기'}
          </button>

          {/* ── 소셜 로그인 ── */}
          <div className="mt-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 border-t border-[var(--oatmeal)]" />
              <span className="font-[var(--font-ui)] text-[10px] tracking-[0.1em] uppercase text-[var(--warm-taupe)]">
                또는
              </span>
              <div className="flex-1 border-t border-[var(--oatmeal)]" />
            </div>

            <button className="w-full py-3.5 bg-[#FEE500] text-[#191919] text-[12px] md:text-[13px] font-[var(--font-ui)] font-medium tracking-[0.04em] hover:brightness-95 transition-all">
              카카오로 시작하기
            </button>
          </div>

          {/* ── 로그인 링크 ── */}
          <div className="text-center mt-8 mb-4">
            <span className="font-[var(--font-ui)] text-[11px] text-[var(--warm-taupe)] tracking-[0.03em]">
              이미 회원이신가요?{' '}
              <Link href="/my" className="text-[var(--walnut)] underline hover:text-[var(--walnut-dark)]">
                로그인
              </Link>
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
