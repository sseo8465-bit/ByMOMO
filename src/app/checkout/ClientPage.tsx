'use client';

// ──────────────────────────────────────────────
// 결제 페이지 — 이솝 스타일 + Regex 입력 검증
// 이름: 한글/영문 2자 이상
// 연락처: 010-XXXX-XXXX
// 주소: 자음만 입력 차단, 5자 이상
// 결제 버튼: 모든 validation + 약관 동의 시에만 활성화
// ──────────────────────────────────────────────

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import { useCart } from '@/domains/cart/cart.context';

type PaymentMethod = 'card' | 'kakao' | 'naver';

interface FormErrors {
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
}

const PAYMENT_OPTIONS = [
  { value: 'kakao' as const, label: '카카오페이' },
  { value: 'card' as const, label: '카드 결제' },
  { value: 'naver' as const, label: '네이버페이' },
];

// ── 정규식 ──
const REGEX = {
  name: /^[가-힣a-zA-Z\s]{2,}$/,
  phone: /^010-\d{4}-\d{4}$/,
  address: /^[가-힣a-zA-Z0-9\s\-.,()]{5,}$/,
  consonantOnly: /^[ㄱ-ㅎ\s]+$/,
};

function formatPrice(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

// ── 에러 메시지 (브랜드 톤앤매너) ──
const ERROR_MESSAGES = {
  nameRequired: '배송을 위해 성함을 입력해 주세요.',
  nameInvalid: '한글 또는 영문 2자 이상 입력해 주세요.',
  phoneRequired: '배송 안내를 위해 연락처를 알려주세요.',
  phoneInvalid: '연락처 형식을 확인해 주세요. (010-0000-0000)',
  addressRequired: '선물을 전할 주소를 알려주세요.',
  addressInvalid: '올바른 주소를 입력해 주세요. (5자 이상)',
} as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] text-[var(--walnut)] mt-1.5 tracking-[0.02em]">
      {message}
    </p>
  );
}

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    shippingAddress: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kakao');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── 유효성 검사 ──
  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    // 이름: 빈 값 → 한글/영문 2자 이상
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = ERROR_MESSAGES.nameRequired;
    } else if (!REGEX.name.test(formData.recipientName.trim())) {
      newErrors.recipientName = ERROR_MESSAGES.nameInvalid;
    }

    // 연락처: 빈 값 → 010 형식
    if (!formData.recipientPhone.trim()) {
      newErrors.recipientPhone = ERROR_MESSAGES.phoneRequired;
    } else if (!REGEX.phone.test(formData.recipientPhone)) {
      newErrors.recipientPhone = ERROR_MESSAGES.phoneInvalid;
    }

    // 주소: 빈 값 → 자음만 차단 → 5자 이상
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = ERROR_MESSAGES.addressRequired;
    } else if (REGEX.consonantOnly.test(formData.shippingAddress.trim())) {
      newErrors.shippingAddress = ERROR_MESSAGES.addressInvalid;
    } else if (!REGEX.address.test(formData.shippingAddress.trim())) {
      newErrors.shippingAddress = ERROR_MESSAGES.addressInvalid;
    }

    return newErrors;
  }, [formData]);

  // ── 결제 버튼 활성화 조건 ──
  const isFormValid = useMemo(() => {
    return (
      REGEX.name.test(formData.recipientName.trim()) &&
      REGEX.phone.test(formData.recipientPhone) &&
      REGEX.address.test(formData.shippingAddress.trim()) &&
      !REGEX.consonantOnly.test(formData.shippingAddress.trim()) &&
      agreedToTerms
    );
  }, [formData, agreedToTerms]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'recipientPhone') {
      setFormData((prev) => ({ ...prev, recipientPhone: formatPhoneNumber(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (touched[name]) setErrors(validate());
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    setErrors(validate());
  };

  const handlePayment = () => {
    if (isSubmitting) return;
    setTouched({ recipientName: true, recipientPhone: true, shippingAddress: true });
    const currentErrors = validate();
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0 || !agreedToTerms) return;

    setIsSubmitting(true);
    clearCart();
    router.push('/order-complete');
  };

  // ── 인풋 스타일 ──
  function getInputStyle(hasError: boolean): string {
    return `w-full bg-transparent border-0 border-b outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-light text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors ${
      hasError
        ? 'border-b-[var(--walnut)]'
        : 'border-b-[var(--oatmeal)] focus:border-b-[var(--walnut)]'
    }`;
  }

  return (
    <>
      <GNB />

      <div className="page-padding section-spacing">
        <div className="max-w-[520px] mx-auto">
          {/* 페이지 타이틀 */}
          <div className="text-center mb-10 md:mb-14">
            <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--warm-taupe)] mb-3">
              Checkout
            </p>
            <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--walnut)] tracking-[0.01em]">
              결제
            </h1>
          </div>

          {/* ── 주문 상품 요약 ── */}
          <section className="mb-10 md:mb-14">
            <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-4">
              Order Summary
            </p>
            <div className="border-t border-[var(--oatmeal)]">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between py-3 border-b border-[var(--oatmeal)]">
                  <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--warm-gray)] tracking-[0.02em]">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-medium text-[var(--charcoal)] tracking-[0.02em]">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-4">
                <span className="font-[var(--font-ui)] text-[13px] md:text-[14px] font-medium text-[var(--charcoal)] tracking-[0.02em]">
                  총 결제 금액
                </span>
                <span className="font-[var(--font-ui)] text-[13px] md:text-[14px] font-semibold text-[var(--charcoal)] tracking-[0.02em]">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </section>

          {/* ── 배송지 입력 ── */}
          <section className="mb-10 md:mb-14">
            <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-6">
              Shipping
            </p>

            <div className="mb-6">
              <label className="block font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.1em] uppercase text-[var(--warm-taupe)] mb-1.5">
                받는 분 *
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                onBlur={() => handleBlur('recipientName')}
                placeholder="성함을 입력해 주세요"
                className={getInputStyle(!!touched.recipientName && !!errors.recipientName)}
              />
              {touched.recipientName && <FieldError message={errors.recipientName} />}
            </div>

            <div className="mb-6">
              <label className="block font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.1em] uppercase text-[var(--warm-taupe)] mb-1.5">
                연락처 *
              </label>
              <input
                type="tel"
                name="recipientPhone"
                value={formData.recipientPhone}
                onChange={handleInputChange}
                onBlur={() => handleBlur('recipientPhone')}
                placeholder="010-0000-0000"
                maxLength={13}
                className={getInputStyle(!!touched.recipientPhone && !!errors.recipientPhone)}
              />
              {touched.recipientPhone && <FieldError message={errors.recipientPhone} />}
            </div>

            <div className="mb-6">
              <label className="block font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.1em] uppercase text-[var(--warm-taupe)] mb-1.5">
                주소 *
              </label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                onBlur={() => handleBlur('shippingAddress')}
                placeholder="배송받을 주소를 입력해 주세요"
                className={getInputStyle(!!touched.shippingAddress && !!errors.shippingAddress)}
              />
              {touched.shippingAddress && <FieldError message={errors.shippingAddress} />}
            </div>
          </section>

          {/* ── 결제 수단 ── */}
          <section className="mb-10 md:mb-14">
            <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-4">
              Payment
            </p>
            <div className="flex flex-col gap-2">
              {PAYMENT_OPTIONS.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 py-3.5 px-4 border cursor-pointer transition-colors ${
                    paymentMethod === value
                      ? 'border-[var(--walnut)] bg-[var(--cream)]'
                      : 'border-[var(--oatmeal)] hover:border-[var(--warm-taupe-light)]'
                  }`}
                >
                  <span
                    className={`w-[16px] h-[16px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors ${
                      paymentMethod === value
                        ? 'border-[var(--walnut)] bg-[var(--walnut)]'
                        : 'border-[var(--warm-taupe-light)]'
                    }`}
                  >
                    {paymentMethod === value && (
                      <span className="w-[5px] h-[5px] rounded-full bg-[var(--cream)]" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="sr-only"
                  />
                  <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] tracking-[0.02em]">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* ── 약관 동의 ── */}
          <div className="mb-10">
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
                className="font-[var(--font-ui)] text-[11px] md:text-[12px] text-[var(--warm-gray)] tracking-[0.02em] leading-[1.6] cursor-pointer"
              >
                주문 내용을 확인했습니다.
              </span>
            </label>
          </div>

          {/* ── 결제 버튼 ── */}
          <button
            onClick={handlePayment}
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 text-[12px] md:text-[13px] font-[var(--font-ui)] tracking-[0.08em] uppercase transition-colors ${
              isFormValid && !isSubmitting
                ? 'bg-[var(--walnut)] text-[var(--cream)] hover:bg-[var(--walnut-dark)] cursor-pointer'
                : 'bg-[var(--oatmeal)] text-[var(--warm-taupe-light)] cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '처리 중...' : `${formatPrice(totalAmount)} 결제하기`}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
