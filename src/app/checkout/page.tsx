'use client';

export const dynamic = 'force-dynamic';

// 결제 페이지 — v3 이솝 스타일 리모델링
// ⑪ 유효성 검사: 필수값 체크 + 에러 시각화 + 정중한 어조 + 연락처 형식 + 금액 동적 연결
// /state-management: 장바구니 금액이 결제 금액에 정확히 연동
// /response-drafting: 에러 메시지를 브랜드 톤앤매너에 맞게 정중한 표현으로
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import { useCart } from '@/domains/cart/cart.context';

type PaymentMethod = 'card' | 'kakao' | 'naver';

// 에러 타입 정의
interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

// 연락처 포맷팅 — 숫자와 하이픈만 허용, 자동 하이픈 삽입
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

// 연락처 유효성 검사 — 010-XXXX-XXXX 형식
function isValidPhone(phone: string): boolean {
  return /^010-\d{4}-\d{4}$/.test(phone);
}

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kakao');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // 에러 상태 관리
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 유효성 검사 — 브랜드 톤앤매너에 맞는 정중한 에러 메시지
  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '배송을 위해 성함을 다시 한번 확인해 주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '배송 안내를 위해 연락처를 알려주세요.';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = '연락처 형식을 확인해 주세요. (010-0000-0000)';
    }

    if (!formData.address.trim()) {
      newErrors.address = '선물을 전할 주소를 알려주세요.';
    }

    return newErrors;
  }, [formData]);

  // 결제 버튼 활성화 조건: 모든 필수값 입력 + 연락처 형식 + 약관 동의
  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() !== '' &&
      isValidPhone(formData.phone) &&
      formData.address.trim() !== '' &&
      agreedToTerms
    );
  }, [formData, agreedToTerms]);

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 연락처: 숫자+하이픈만 허용, 자동 포맷팅
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // 이미 터치된 필드는 실시간 검증
    if (touched[name]) {
      const currentErrors = validate();
      setErrors(currentErrors);
    }
  };

  // 필드 blur 시 터치 상태 업데이트 + 검증
  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const currentErrors = validate();
    setErrors(currentErrors);
  };

  // 결제 실행
  const handlePayment = () => {
    // 모든 필드 터치 처리
    setTouched({ name: true, phone: true, address: true });
    const currentErrors = validate();
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) return;
    if (!agreedToTerms) return;

    clearCart();
    router.push('/order-complete');
  };

  // 에러 스타일 클래스
  const getInputClassName = (fieldName: keyof FormErrors) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `w-full rounded-lg border ${
      hasError
        ? 'border-[1.5px] border-[var(--walnut)]'
        : 'border-[var(--oatmeal)] focus:border-[var(--walnut)]'
    } outline-none py-3 px-4 text-[14px] font-[var(--font-ui)] font-light transition-colors`;
  };

  return (
    <>
      <GNB />

      <div className="px-6 py-10">
        <h1 className="font-[var(--font-serif)] text-[22px] font-semibold text-[var(--charcoal)] mb-10">
          결제
        </h1>

        {/* ── 주문 상품 요약 — 장바구니 금액 동적 연결 ── */}
        <section className="mb-10">
          <p className="font-[var(--font-ui)] text-[11px] font-semibold tracking-[0.05em] uppercase text-[var(--walnut)] mb-2">
            Order Summary
          </p>
          <div className="bg-[var(--cream)] rounded-[10px] p-5">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-[12px] text-[var(--warm-gray)] py-1 leading-[1.8]">
                <span>{item.product.name} × {item.quantity}</span>
                <span className="font-[var(--font-ui)] font-medium">
                  ₩{(item.product.price * item.quantity).toLocaleString('ko-KR')}
                </span>
              </div>
            ))}
            <div className="border-t border-[var(--oatmeal)] mt-2 pt-2 flex justify-between">
              <span className="text-[14px] font-semibold text-[var(--charcoal)]">총 결제 금액</span>
              <span className="text-[14px] font-[var(--font-ui)] font-semibold text-[var(--charcoal)]">
                ₩{totalAmount.toLocaleString('ko-KR')}
              </span>
            </div>
          </div>
        </section>

        {/* ── 배송지 입력 — 유효성 검사 + 에러 시각화 ── */}
        <section className="mb-10">
          <p className="font-[var(--font-ui)] text-[11px] font-semibold tracking-[0.05em] uppercase text-[var(--walnut)] mb-3">
            Shipping
          </p>
          <div className="flex flex-col gap-4">
            {/* 받는 분 */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] font-normal tracking-[0.05em]">
                받는 분 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur('name')}
                placeholder="성함을 입력해 주세요"
                className={getInputClassName('name')}
              />
              {touched.name && errors.name && (
                <p className="text-[11px] text-[var(--walnut)] font-[var(--font-ui)]">{errors.name}</p>
              )}
            </div>

            {/* 연락처 — 숫자+하이픈만 허용 */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] font-normal tracking-[0.05em]">
                연락처 *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={() => handleBlur('phone')}
                placeholder="010-0000-0000"
                maxLength={13}
                className={getInputClassName('phone')}
              />
              {touched.phone && errors.phone && (
                <p className="text-[11px] text-[var(--walnut)] font-[var(--font-ui)]">{errors.phone}</p>
              )}
            </div>

            {/* 주소 */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] font-normal tracking-[0.05em]">
                주소 *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={() => handleBlur('address')}
                placeholder="배송받을 주소를 입력해 주세요"
                className={getInputClassName('address')}
              />
              {touched.address && errors.address && (
                <p className="text-[11px] text-[var(--walnut)] font-[var(--font-ui)]">{errors.address}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── 결제 수단 ── */}
        <section className="mb-10">
          <p className="font-[var(--font-ui)] text-[11px] font-semibold tracking-[0.05em] uppercase text-[var(--walnut)] mb-3">
            Payment
          </p>
          <div className="flex flex-col gap-2">
            {([
              { value: 'kakao', label: '카카오페이' },
              { value: 'card', label: '카드 결제' },
              { value: 'naver', label: '네이버페이' },
            ] as const).map(({ value, label }) => (
              <label
                key={value}
                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === value
                    ? 'border-[var(--walnut)] bg-[var(--cream)]'
                    : 'border-[var(--oatmeal)]'
                }`}
              >
                {/* 커스텀 라디오 — 와이어프레임 v2.1 스타일 */}
                <span
                  className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    paymentMethod === value
                      ? 'border-[var(--walnut)] bg-[var(--walnut)]'
                      : 'border-[var(--light-gray)]'
                  }`}
                >
                  {paymentMethod === value && (
                    <span className="w-[6px] h-[6px] rounded-full bg-[var(--cream)]" />
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
                <span className="text-[13px] text-[var(--charcoal)] font-[var(--font-ui)]">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* ── 약관 동의 — 커스텀 체크박스 ── */}
        <div className="mb-10">
          <label className="flex items-start gap-2 cursor-pointer">
            <span
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={`w-[18px] h-[18px] rounded flex-shrink-0 flex items-center justify-center mt-0.5 border-[1.5px] transition-colors cursor-pointer ${
                agreedToTerms
                  ? 'border-[var(--walnut)] bg-[var(--walnut)]'
                  : 'border-[var(--walnut)]'
              }`}
            >
              {agreedToTerms && (
                <span className="text-[10px] text-white font-bold">✓</span>
              )}
            </span>
            <span
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className="text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] leading-[1.6] cursor-pointer"
            >
              주문 내용을 확인했습니다.
            </span>
          </label>
        </div>

        {/* ── 결제 버튼 — 유효성 통과 시만 활성화, 금액 동적 표시 ── */}
        <button
          onClick={handlePayment}
          disabled={!isFormValid}
          className={`w-full py-3.5 rounded-lg text-[14px] font-[var(--font-ui)] font-medium tracking-[0.03em] transition-colors ${
            isFormValid
              ? 'bg-[var(--walnut)] text-[var(--cream)] hover:bg-[var(--walnut-dark)] cursor-pointer'
              : 'bg-[var(--oatmeal)] text-[var(--warm-taupe-light)] cursor-not-allowed'
          }`}
        >
          ₩{totalAmount.toLocaleString('ko-KR')} 결제하기
        </button>
      </div>

      <Footer />
    </>
  );
}
