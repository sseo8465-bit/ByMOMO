'use client';

// ──────────────────────────────────────────────
// 결제 페이지 — v3 이솝 스타일
// 역할: 배송지 입력 + 결제 수단 선택 + 약관 동의 + 결제 실행
// 유효성: 필수값 체크 + 에러 시각화 + 정중한 어조 (브랜드 톤)
// 금액: 장바구니 Context에서 동적 연동
// ──────────────────────────────────────────────
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import { useCart } from '@/domains/cart/cart.context';

// ── 결제 수단 타입 ──
type PaymentMethod = 'card' | 'kakao' | 'naver';

// ── 폼 에러 타입 ──
interface FormErrors {
  recipientName?: string;   // 받는 분 이름 에러
  recipientPhone?: string;  // 연락처 에러
  shippingAddress?: string; // 주소 에러
}

// ── 결제 수단 목록 — 한 곳에서 관리 ──
const PAYMENT_OPTIONS = [
  { value: 'kakao' as const, label: '카카오페이' },
  { value: 'card' as const, label: '카드 결제' },
  { value: 'naver' as const, label: '네이버페이' },
];

// ── 가격 포맷 유틸 ──
function formatPrice(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

// ── 연락처 자동 포맷 — 숫자만 추출 후 하이픈 삽입 ──
function formatPhoneNumber(value: string): string {
  const digitsOnly = value.replace(/[^0-9]/g, '');  // 숫자만 남김
  if (digitsOnly.length <= 3) return digitsOnly;
  if (digitsOnly.length <= 7) return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
  return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 11)}`;
}

// ── 연락처 유효성 검사 — 010-XXXX-XXXX 형식만 허용 ──
function isValidPhone(phone: string): boolean {
  return /^010-\d{4}-\d{4}$/.test(phone);
}

// ── 에러 메시지 — 브랜드 톤앤매너 (정중하고 따뜻한 어조) ──
// response-drafting 원칙: "Lead with empathy, be specific"
const ERROR_MESSAGES = {
  nameRequired: '배송을 위해 성함을 다시 한번 확인해 주세요.',
  phoneRequired: '배송 안내를 위해 연락처를 알려주세요.',
  phoneInvalid: '연락처 형식을 확인해 주세요. (010-0000-0000)',
  addressRequired: '선물을 전할 주소를 알려주세요.',
} as const;

// ── 공통 인풋 스타일 — 에러 유무에 따라 분기 ──
function getInputStyle(hasError: boolean): string {
  const baseStyle = 'w-full rounded-lg border outline-none py-3 px-4 text-[14px] font-[var(--font-ui)] font-light transition-colors';
  const errorStyle = 'border-[1.5px] border-[var(--walnut)]';
  const normalStyle = 'border-[var(--oatmeal)] focus:border-[var(--walnut)]';
  return `${baseStyle} ${hasError ? errorStyle : normalStyle}`;
}

// ── 에러 메시지 표시 컴포넌트 — 중복 제거 ──
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[11px] text-[var(--walnut)] font-[var(--font-ui)]">
      {message}
    </p>
  );
}

// ── SVG 체크 아이콘 (체크박스용) — 이모지 대신 SVG ──
function SmallCheckIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="var(--cream)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="8 3 4 8 2 6" />
    </svg>
  );
}

export default function CheckoutPage() {
  // ── 장바구니 데이터 (Context) ──
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();

  // ── 폼 입력값 상태 ──
  const [formData, setFormData] = useState({
    recipientName: '',     // 받는 분 이름
    recipientPhone: '',    // 연락처
    shippingAddress: '',   // 배송 주소
  });

  // ── 결제 수단 상태 (기본값: 카카오페이) ──
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kakao');

  // ── 약관 동의 상태 ──
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ── 에러 상태 ──
  const [errors, setErrors] = useState<FormErrors>({});

  // ── 필드 터치 상태 (blur 이후에만 에러 표시) ──
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ── 결제 처리 중 상태 — 중복 클릭 방지 ──
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── 유효성 검사 함수 ──
  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    // 받는 분 이름 검사
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = ERROR_MESSAGES.nameRequired;
    }
    // 연락처 검사 — 빈 값 vs 형식 오류 분기
    if (!formData.recipientPhone.trim()) {
      newErrors.recipientPhone = ERROR_MESSAGES.phoneRequired;
    } else if (!isValidPhone(formData.recipientPhone)) {
      newErrors.recipientPhone = ERROR_MESSAGES.phoneInvalid;
    }
    // 주소 검사
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = ERROR_MESSAGES.addressRequired;
    }

    return newErrors;
  }, [formData]);

  // ── 결제 버튼 활성화 조건 ──
  // 모든 필수값 입력 + 연락처 형식 유효 + 약관 동의
  const isFormValid = useMemo(() => {
    return (
      formData.recipientName.trim() !== '' &&
      isValidPhone(formData.recipientPhone) &&
      formData.shippingAddress.trim() !== '' &&
      agreedToTerms
    );
  }, [formData, agreedToTerms]);

  // ── 입력값 변경 핸들러 ──
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 연락처 필드: 자동 하이픈 포맷팅 적용
    if (name === 'recipientPhone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, recipientPhone: formattedPhone }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // 이미 터치된 필드는 실시간으로 에러 검증
    if (touched[name]) {
      const currentErrors = validate();
      setErrors(currentErrors);
    }
  };

  // ── 필드 blur 핸들러 — 터치 표시 + 즉시 검증 ──
  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const currentErrors = validate();
    setErrors(currentErrors);
  };

  // ── 결제 실행 ──
  const handlePayment = () => {
    // 중복 클릭 방지
    if (isSubmitting) return;

    // 모든 필드 터치 처리 (미입력 필드도 에러 표시)
    setTouched({ recipientName: true, recipientPhone: true, shippingAddress: true });
    const currentErrors = validate();
    setErrors(currentErrors);

    // 에러가 있으면 중단
    if (Object.keys(currentErrors).length > 0) return;
    if (!agreedToTerms) return;

    // 결제 처리 시작 — 버튼 비활성화
    setIsSubmitting(true);
    clearCart();                    // 장바구니 비우기
    router.push('/order-complete'); // 주문 완료 페이지로 이동
  };

  return (
    <>
      <GNB />

      <div className="px-6 py-10">
        {/* ── 페이지 타이틀 ── */}
        <h1 className="font-[var(--font-serif)] text-[22px] font-semibold text-[var(--charcoal)] mb-10">
          결제
        </h1>

        {/* ── 섹션 1: 주문 상품 요약 ── */}
        <section className="mb-10">
          {/* 아이브로우 라벨 */}
          <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-2">
            Order Summary
          </p>
          {/* 상품 목록 카드 */}
          <div className="bg-[var(--cream)] rounded-[10px] p-5">
            {items.map((item) => {
              const itemName = item.product.name;           // 상품명
              const itemPrice = item.product.price;         // 단가
              const itemQuantity = item.quantity;            // 수량
              const itemTotal = itemPrice * itemQuantity;    // 소계

              return (
                <div key={item.product.id} className="flex justify-between text-[12px] text-[var(--warm-gray)] py-1 leading-[1.8]">
                  {/* 상품명 × 수량 */}
                  <span>{itemName} × {itemQuantity}</span>
                  {/* 소계 금액 */}
                  <span className="font-[var(--font-ui)] font-medium">
                    {formatPrice(itemTotal)}
                  </span>
                </div>
              );
            })}
            {/* 총 결제 금액 — 구분선 아래 강조 */}
            <div className="border-t border-[var(--oatmeal)] mt-2 pt-2 flex justify-between">
              <span className="text-[14px] font-semibold text-[var(--charcoal)]">총 결제 금액</span>
              <span className="text-[14px] font-[var(--font-ui)] font-semibold text-[var(--charcoal)]">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </section>

        {/* ── 섹션 2: 배송지 입력 ── */}
        <section className="mb-10">
          {/* 아이브로우 라벨 — 다른 섹션과 동일 사이즈(10px) 통일 */}
          <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
            Shipping
          </p>
          <div className="flex flex-col gap-4">
            {/* 받는 분 입력 */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] font-normal tracking-[0.05em]">
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

            {/* 연락처 입력 — 자동 하이픈 포맷팅 */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] font-normal tracking-[0.05em]">
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

            {/* 주소 입력 */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] font-normal tracking-[0.05em]">
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
          </div>
        </section>

        {/* ── 섹션 3: 결제 수단 선택 ── */}
        <section className="mb-10">
          <p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)] mb-3">
            Payment
          </p>
          <div className="flex flex-col gap-2">
            {PAYMENT_OPTIONS.map(({ value, label }) => (
              <label
                key={value}
                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === value
                    ? 'border-[var(--walnut)] bg-[var(--cream)]'   // 선택됨
                    : 'border-[var(--oatmeal)]'                     // 미선택
                }`}
              >
                {/* 커스텀 라디오 버튼 — 원형 */}
                <span
                  className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    paymentMethod === value
                      ? 'border-[var(--walnut)] bg-[var(--walnut)]'
                      : 'border-[var(--light-gray)]'
                  }`}
                >
                  {/* 선택 시 내부 원 표시 */}
                  {paymentMethod === value && (
                    <span className="w-[6px] h-[6px] rounded-full bg-[var(--cream)]" />
                  )}
                </span>
                {/* 실제 라디오 input — 시각적으로 숨김 (접근성 유지) */}
                <input
                  type="radio"
                  name="payment"
                  value={value}
                  checked={paymentMethod === value}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="sr-only"
                />
                {/* 결제 수단명 */}
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
            {/* 체크박스 아이콘 */}
            <span
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={`w-[18px] h-[18px] rounded flex-shrink-0 flex items-center justify-center mt-0.5 border-[1.5px] transition-colors cursor-pointer ${
                agreedToTerms
                  ? 'border-[var(--walnut)] bg-[var(--walnut)]'   // 체크됨
                  : 'border-[var(--walnut)]'                       // 미체크
              }`}
              role="checkbox"
              aria-checked={agreedToTerms}
              aria-label="주문 내용 확인 동의"
            >
              {/* 체크 표시 — SVG 아이콘 (이모지 대신) */}
              {agreedToTerms && <SmallCheckIcon />}
            </span>
            {/* 약관 동의 문구 */}
            <span
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className="text-[12px] text-[var(--warm-gray)] font-[var(--font-ui)] leading-[1.6] cursor-pointer"
            >
              주문 내용을 확인했습니다.
            </span>
          </label>
        </div>

        {/* ── 결제 버튼 — 유효성 + 중복 클릭 방지 ── */}
        <button
          onClick={handlePayment}
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-3.5 rounded-lg text-[14px] font-[var(--font-ui)] font-medium tracking-[0.03em] transition-colors ${
            isFormValid && !isSubmitting
              ? 'bg-[var(--walnut)] text-[var(--cream)] hover:bg-[var(--walnut-dark)] cursor-pointer'
              : 'bg-[var(--oatmeal)] text-[var(--warm-taupe-light)] cursor-not-allowed'
          }`}
        >
          {/* 결제 중 상태 표시 */}
          {isSubmitting ? '처리 중...' : `${formatPrice(totalAmount)} 결제하기`}
        </button>
      </div>

      <Footer />
    </>
  );
}
