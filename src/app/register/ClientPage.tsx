'use client';

// ──────────────────────────────────────────────
// 회원가입 페이지 — By MOMO 프리미엄 브랜드 스타일
// 주소검색(카카오 우편번호) + 평생회원 + 환불계좌 + 약관 동의
// 이솝/PVCS 디자인 톤 유지, 딥 에스프레소(#2D221B) 가독성 강화
// ──────────────────────────────────────────────

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GNB from '@/shared/components/GNB';
import Footer from '@/shared/components/Footer';
import { useAuth } from '@/domains/auth/auth.context';

// ── Daum 우편번호 API 타입 선언 ──
// 카카오(Daum)에서 제공하는 주소 검색 서비스를 사용하기 위한 타입
// window.daum.Postcode 객체를 통해 주소 검색 팝업을 임베드할 수 있음
declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: DaumPostcodeResult) => void;
        onclose?: () => void;
        width?: string | number;
        height?: string | number;
      }) => { open: () => void; embed: (el: HTMLElement) => void };
    };
  }
}

interface DaumPostcodeResult {
  zonecode: string;       // 우편번호
  roadAddress: string;    // 도로명 주소
  jibunAddress: string;   // 지번 주소
  userSelectedType: 'R' | 'J'; // 사용자 선택 유형
  bname: string;          // 법정동명
  buildingName: string;   // 건물명
  apartment: string;      // 아파트 여부
}

// ── 폼 데이터 타입 ──
// 회원가입에 필요한 모든 입력값을 하나의 객체로 관리
// 환불계좌(bank*)는 선택 항목 — 나중에 마이페이지에서도 등록 가능
interface RegisterForm {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  dogName: string;
  // 환불계좌 (선택)
  bankAccountHolder: string;
  bankName: string;
  bankAccount: string;
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
  consonantOnly: /^[ㄱ-ㅎ\s]+$/,
};

// ── 연락처 자동 포맷 ──
function formatPhone(value: string): string {
  const digits = value.replace(/[^0-9]/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

// ── 에러 메시지 ──
// response-drafting 원칙: 공감 먼저(empathy-first) + 구체적 해결 방법 제시
// brand-voice 원칙: 보호자 동료 톤, 절제된 우아함, 과장 없는 정중한 안내
const MESSAGES = {
  emailRequired: '이메일 주소를 입력해 주세요.',
  emailInvalid: '이메일 형식을 다시 확인해 주시겠어요? (예: name@example.com)',
  passwordRequired: '비밀번호를 입력해 주세요.',
  passwordShort: '안전한 가입을 위해 비밀번호는 8자 이상으로 설정해 주세요.',
  passwordMismatch: '입력하신 비밀번호가 서로 다릅니다. 다시 확인해 주세요.',
  nameRequired: '이름을 입력해 주세요.',
  nameInvalid: '한글 또는 영문으로 2자 이상 입력해 주세요.',
  phoneRequired: '연락처를 입력해 주세요.',
  phoneInvalid: '연락처 형식을 확인해 주세요. (예: 010-1234-5678)',
  addressRequired: '배송받으실 주소를 검색해 주세요.',
} as const;

// ── 은행 목록 ──
const BANK_LIST = [
  '선택해 주세요',
  '국민은행', '신한은행', '우리은행', '하나은행', 'SC제일은행',
  '기업은행', '농협은행', '수협은행', '카카오뱅크', '토스뱅크',
  '케이뱅크', '우체국', '새마을금고', '신협', '산업은행',
  '대구은행', '부산은행', '경남은행', '광주은행', '전북은행', '제주은행',
];

// ── 약관 본문 텍스트 ──
const TERMS_OF_SERVICE = `제 1 조 (목적)
이 약관은 바이모모(이하 "회사")가 운영하는 온라인 쇼핑몰 By MOMO(이하 "몰")에서 제공하는 인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제 2 조 (정의)
① "몰"이란 바이모모가 재화 또는 용역(이하 "재화 등")을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
② "이용자"란 "몰"에 접속하여 이 약관에 따라 "몰"이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
③ "회원"이라 함은 "몰"에 회원등록을 한 자로서, 계속적으로 "몰"이 제공하는 서비스를 이용할 수 있는 자를 말합니다.

제 3 조 (약관 등의 명시와 설명 및 개정)
① "몰"은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소, 전화번호, 전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보관리책임자 등을 이용자가 쉽게 알 수 있도록 By MOMO 사이트의 초기 서비스 화면에 게시합니다.
② "몰"은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.

제 4 조 (서비스의 제공 및 변경)
① "몰"은 다음과 같은 업무를 수행합니다.
  1. 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결
  2. 구매계약이 체결된 재화 또는 용역의 배송
  3. 기타 "몰"이 정하는 업무

제 5 조 (서비스의 중단)
① "몰"은 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.

제 6 조 (회원가입)
① 이용자는 "몰"이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
② "몰"은 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.

제 7 조 (회원 탈퇴 및 자격 상실 등)
① 회원은 "몰"에 언제든지 탈퇴를 요청할 수 있으며 "몰"은 즉시 회원탈퇴를 처리합니다.

제 8 조 (구매신청)
① "몰" 이용자는 "몰"상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, "몰"은 이용자가 구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다.
  1. 재화 등의 검색 및 선택
  2. 받는 사람의 성명, 주소, 전화번호, 전자우편주소 등의 입력
  3. 약관내용, 청약철회권이 제한되는 서비스, 배송료 등의 비용부담과 관련한 내용에 대한 확인
  4. 이 약관에 동의하고 위 3호의 사항을 확인하거나 거부하는 표시(예: 마우스 클릭)
  5. 재화 등의 구매신청 및 이에 관한 확인 또는 "몰"의 확인에 대한 동의

제 9 조 (청약철회 등)
① "몰"과 재화 등의 구매에 관한 계약을 체결한 이용자는 재화를 인수한 날부터 7일 이내에는 청약의 철회를 할 수 있습니다.
② 다음 각 호에 해당하는 경우에는 청약철회가 제한됩니다.
  1. 상품의 포장을 개봉하였거나 시식한 경우 (반려동물 식품의 위생·안전 특성상)
  2. 상품의 포장이 훼손되어 상품 가치가 현저히 감소한 경우 (이용자의 과실에 한함)
  3. 시간이 지나 재판매가 곤란할 정도로 상품의 가치가 현저히 감소한 경우
③ 제2항에도 불구하고, 상품의 내용이 표시·광고 내용과 다르거나 계약 내용과 다르게 이행된 경우에는 인수한 날부터 3개월 이내, 그 사실을 안 날부터 30일 이내에 청약철회를 할 수 있습니다.

제 10 조 (개인정보보호)
① "몰"은 이용자의 개인정보 수집 시 서비스 제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.
② "몰"은 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.

부칙
본 약관은 2026년 3월 30일부터 시행합니다.
바이모모 (By MOMO)`;

const PRIVACY_POLICY = `바이모모(이하 "회사")는 고객의 개인정보를 중요시하며, 「개인정보 보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」을 준수합니다.

1. 수집하는 개인정보 항목
회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.

[필수 수집 항목]
- 이메일 주소, 비밀번호, 이름, 연락처, 주소(우편번호 포함)

[선택 수집 항목]
- 반려동물 이름, 환불계좌 정보(예금주, 은행명, 계좌번호)

[자동 수집 항목]
- IP 주소, 쿠키, 서비스 이용 기록, 방문 일시

2. 개인정보의 수집 및 이용 목적
회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
- 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정이용 방지
- 마케팅 및 광고에 활용: 이벤트 정보 및 참여기회 제공, 서비스 이용 통계 (동의 시에 한함)
- 환불 처리: 환불계좌 정보를 이용한 환불 처리 (해당 시)

3. 개인정보의 보유 및 이용 기간
회원 탈퇴 시 즉시 파기합니다. 단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.
- 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률 제6조)
- 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률 제6조)
- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률 제6조)
- 표시/광고에 관한 기록: 6개월 (전자상거래 등에서의 소비자보호에 관한 법률 제6조)

4. 개인정보의 파기 절차 및 방법
- 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
- 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.

5. 개인정보의 제3자 제공
회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
- 이용자가 사전에 동의한 경우
- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

6. 이용자 및 법정대리인의 권리와 그 행사 방법
- 이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있습니다.
- 이용자는 언제든지 개인정보 수집 및 이용 동의를 철회할 수 있습니다.

7. 개인정보 보호책임자
- 성명: By MOMO 개인정보보호팀
- 이메일: privacy@bymomo.kr

본 방침은 2026년 3월 30일부터 시행됩니다.
바이모모 (By MOMO)

※ 동의를 거부할 수 있으나 거부시 회원 가입이 불가능합니다.`;

// ── 체크박스 아이콘 컴포넌트 ──
function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--cream)" strokeWidth="1.5" strokeLinecap="round">
      <polyline points="8 3 4 8 2 6" />
    </svg>
  );
}

// ── 체크박스 컴포넌트 (브랜드 스타일 통일) ──
function BrandCheckbox({
  checked,
  onChange,
  children,
  size = 'default',
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  size?: 'default' | 'large';
}) {
  const boxSize = size === 'large' ? 'w-[20px] h-[20px]' : 'w-[16px] h-[16px]';
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <span
        onClick={onChange}
        className={`${boxSize} flex-shrink-0 border mt-0.5 flex items-center justify-center transition-colors cursor-pointer ${
          checked
            ? 'border-[var(--charcoal)] bg-[var(--charcoal)]'
            : 'border-[var(--warm-taupe-light)]'
        }`}
        role="checkbox"
        aria-checked={checked}
      >
        {checked && <CheckIcon />}
      </span>
      <span onClick={onChange} className="cursor-pointer">
        {children}
      </span>
    </label>
  );
}

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
  readOnly,
  inputRef,
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
  readOnly?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}) {
  const hasError = touched && !!error;
  return (
    <div className="mb-6 md:mb-8">
      <label className="block font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.08em] text-[var(--charcoal)] mb-2 font-medium">
        {label}
      </label>
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        readOnly={readOnly}
        className={`w-full bg-transparent border-0 border-b ${
          hasError ? 'border-b-[var(--walnut)]' : 'border-b-[var(--oatmeal)] focus:border-b-[var(--charcoal)]'
        } outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors ${
          readOnly ? 'cursor-default bg-[var(--cream)]' : ''
        }`}
      />
      {hasError && (
        <p className="font-[var(--font-ui)] text-[12px] text-[var(--walnut)] mt-2 tracking-[0.02em] font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

// ── 약관 스크롤 박스 컴포넌트 ──
function TermsScrollBox({
  title,
  content,
  isOpen,
  onToggle,
}: {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1 text-[12px] font-[var(--font-ui)] text-[var(--charcoal)] opacity-60 hover:opacity-100 transition-all underline"
      >
        {isOpen ? '내용 접기' : '내용 보기'}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="2 4 5 7 8 4" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-3 border border-[var(--oatmeal)] bg-[var(--cream)] p-4 max-h-[200px] overflow-y-auto">
          <p className="text-[12px] md:text-[13px] font-[var(--font-ui)] text-[#2D221B] leading-[1.8] whitespace-pre-wrap">
            {content}
          </p>
        </div>
      )}
    </div>
  );
}


export default function RegisterClientPage() {
  const router = useRouter();
  const { signUp, loginWithKakao } = useAuth();

  // ── 폼 상태 ──
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    zipCode: '',
    address: '',
    addressDetail: '',
    dogName: '',
    bankAccountHolder: '',
    bankName: '',
    bankAccount: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ── 약관 동의 상태 ──
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToMarketingSms, setAgreedToMarketingSms] = useState(false);
  const [agreedToMarketingEmail, setAgreedToMarketingEmail] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(false);

  // ── 평생회원 ──
  const [lifetimeMember, setLifetimeMember] = useState<'agree' | 'disagree' | null>(null);

  // ── 주소 검색 모달 ──
  const [showPostcode, setShowPostcode] = useState(false);
  const postcodeContainerRef = useRef<HTMLDivElement>(null);
  const addressDetailRef = useRef<HTMLInputElement>(null);

  // ── 제출 상태 ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ── Daum Postcode 스크립트 로드 ──
  // 페이지 진입 시 카카오 주소검색 스크립트를 한 번만 <head>에 추가
  // 이미 로드된 경우 중복 추가 방지
  useEffect(() => {
    if (document.getElementById('daum-postcode-script')) return;
    const script = document.createElement('script');
    script.id = 'daum-postcode-script';
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // ── 주소 검색 팝업 열기 ──
  const openPostcode = useCallback(() => {
    setShowPostcode(true);
  }, []);

  // ── 주소 검색 모달에 Daum Postcode 임베드 ──
  // 모달이 열리면 컨테이너 div 안에 카카오 주소검색 위젯을 삽입
  // 주소 선택 완료 시: 우편번호 + 기본주소 자동 입력 → 모달 닫힘 → 나머지 주소로 포커스 이동
  useEffect(() => {
    if (!showPostcode || !postcodeContainerRef.current) return;
    if (!window.daum) return;

    const container = postcodeContainerRef.current;
    container.innerHTML = '';

    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeResult) => {
        const fullAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setForm((prev) => ({
          ...prev,
          zipCode: data.zonecode,
          address: fullAddress,
        }));
        setShowPostcode(false);
        // 나머지 주소로 포커스 이동
        setTimeout(() => {
          addressDetailRef.current?.focus();
        }, 100);
      },
      width: '100%',
      height: '100%',
    }).embed(container);
  }, [showPostcode]);

  // ── ESC로 모달 닫기 ──
  useEffect(() => {
    if (!showPostcode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPostcode(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPostcode]);

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

    if (!form.zipCode || !form.address.trim()) errs.address = MESSAGES.addressRequired;

    return errs;
  }, [form]);

  // ── 전체 동의 ──
  // "전체 동의하기" 체크 시 필수+선택 약관 모두 한 번에 토글
  // 개별 해제하면 전체 동의도 자동으로 풀림
  const allAgreed = agreedToTerms && agreedToPrivacy && agreedToMarketingSms && agreedToMarketingEmail;
  const handleAgreeAll = () => {
    const newVal = !allAgreed;
    setAgreedToTerms(newVal);
    setAgreedToPrivacy(newVal);
    setAgreedToMarketingSms(newVal);
    setAgreedToMarketingEmail(newVal);
  };

  // ── 폼 유효성 + 필수 약관 동의 여부 ──
  // 이메일~주소까지 모든 필수 필드 + 이용약관/개인정보 동의 체크 시에만 가입 버튼 활성화
  // 평생회원, 마케팅 수신, 환불계좌는 필수가 아니므로 검증 대상 아님
  const isFormValid = useMemo(() => {
    const errs = validate();
    return (
      Object.keys(errs).length === 0 &&
      form.email.trim() !== '' &&
      form.password !== '' &&
      form.passwordConfirm !== '' &&
      form.name.trim() !== '' &&
      form.phone.trim() !== '' &&
      form.zipCode !== '' &&
      form.address.trim() !== '' &&
      agreedToTerms &&
      agreedToPrivacy
    );
  }, [validate, form, agreedToTerms, agreedToPrivacy]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setForm((prev) => ({ ...prev, phone: formatPhone(value) }));
    } else if (name === 'bankAccount') {
      // 계좌번호는 숫자만
      setForm((prev) => ({ ...prev, bankAccount: value.replace(/[^0-9-]/g, '') }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (touched[name]) setErrors(validate());
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    setErrors(validate());
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setSubmitMessage('');
    setSubmitSuccess(false);
    setTouched({
      email: true, password: true, passwordConfirm: true,
      name: true, phone: true, address: true,
    });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0 || !agreedToTerms || !agreedToPrivacy) return;

    setIsSubmitting(true);

    // Supabase Auth로 회원가입 요청
    // 주소는 "[우편번호] 기본주소 나머지주소" 형태로 합쳐서 저장
    const result = await signUp({
      email: form.email,
      password: form.password,
      name: form.name,
      phone: form.phone,
      address: `[${form.zipCode}] ${form.address} ${form.addressDetail}`.trim(),
      dogName: form.dogName || undefined,
    });

    setIsSubmitting(false);

    if (result.success && !result.error) {
      router.push('/');
    } else if (result.success && result.error) {
      setSubmitSuccess(true);
      setSubmitMessage(result.error);
    } else {
      // response-drafting: 에러 시 공감 + 원인 + 해결법 구조
      setSubmitMessage(result.error || '회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <>
      <GNB />

      <div className="page-padding section-spacing">
        <div className="max-w-[480px] mx-auto">
          {/* ── 페이지 헤더 ── */}
          <div className="text-center mb-12 md:mb-16">
            <p className="font-[var(--font-ui)] text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--warm-taupe)] mb-4">
              Create Account
            </p>
            <h1 className="font-[var(--font-serif)] text-[24px] md:text-[30px] font-medium text-[var(--charcoal)] tracking-[0.01em]">
              회원가입
            </h1>
          </div>

          {/* ════════════════════════════════════════════
               섹션 1: 기본 정보
             ════════════════════════════════════════════ */}
          <div className="mb-10">
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-semibold text-[var(--charcoal)] tracking-[0.06em] mb-6">
              기본 정보
            </h2>

            {/* ux-writing: placeholder는 입력 예시를 보여주되, label과 중복하지 않음 */}
            <FormField
              label="이메일 *"
              name="email"
              type="email"
              value={form.email}
              placeholder="name@example.com"
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
              placeholder="영문, 숫자 포함 8자 이상"
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
          </div>

          <div className="border-t border-[var(--oatmeal)] my-8 md:my-10" />

          {/* ════════════════════════════════════════════
               섹션 2: 개인 정보
             ════════════════════════════════════════════ */}
          <div className="mb-10">
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-semibold text-[var(--charcoal)] tracking-[0.06em] mb-6">
              개인 정보
            </h2>

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

            {/* ── 주소 입력 (카카오 우편번호 연동) ── */}
            <div className="mb-6 md:mb-8">
              <label className="block font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.08em] text-[var(--charcoal)] mb-2 font-medium">
                주소 *
              </label>

              {/* 우편번호 + 검색 버튼 */}
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  readOnly
                  placeholder="우편번호"
                  className="flex-1 max-w-[140px] bg-[var(--cream)] border border-[var(--oatmeal)] focus:border-[var(--charcoal)] outline-none px-3 py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] cursor-default"
                />
                <button
                  type="button"
                  onClick={openPostcode}
                  className="px-5 py-3 bg-[var(--charcoal)] text-[var(--cream)] text-[12px] md:text-[13px] font-[var(--font-ui)] font-medium tracking-[0.04em] hover:bg-[var(--walnut-dark)] focus:outline-[var(--charcoal)] transition-colors cursor-pointer"
                >
                  주소검색
                </button>
              </div>

              {/* 기본주소 */}
              <input
                type="text"
                name="address"
                value={form.address}
                readOnly
                placeholder="기본주소"
                className="w-full bg-[var(--cream)] border border-[var(--oatmeal)] focus:border-[var(--charcoal)] outline-none px-3 py-3 mb-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] cursor-default"
              />

              {/* 나머지 주소 */}
              <input
                ref={addressDetailRef}
                type="text"
                name="addressDetail"
                value={form.addressDetail}
                onChange={handleChange}
                placeholder="나머지 주소"
                className="w-full bg-transparent border border-[var(--oatmeal)] focus:border-[var(--charcoal)] outline-none px-3 py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors"
              />

              {touched.address && errors.address && (
                <p className="font-[var(--font-ui)] text-[12px] text-[var(--walnut)] mt-2 tracking-[0.02em] font-medium">
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-[var(--oatmeal)] my-8 md:my-10" />

          {/* ════════════════════════════════════════════
               섹션 3: 반려견 정보 + 평생회원
             ════════════════════════════════════════════ */}
          <div className="mb-10">
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-semibold text-[var(--charcoal)] tracking-[0.06em] mb-6">
              반려견 정보
            </h2>

            <div className="mb-8">
              <label className="block font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.08em] text-[var(--charcoal)] mb-2 font-medium">
                아이 이름
              </label>
              <input
                type="text"
                name="dogName"
                value={form.dogName}
                onChange={handleChange}
                placeholder="반려견 이름을 알려주세요 (선택)"
                className="w-full bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--charcoal)] outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] placeholder:text-[var(--warm-taupe-light)] tracking-[0.02em] transition-colors"
              />
            </div>

            {/* ── 평생회원 동의 — 이솝 스타일: 여백 중심, 구분선만 ── */}
            <div className="border-t border-[var(--oatmeal)] pt-8 pb-8 border-b border-b-[var(--oatmeal)]">
              <h3 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-semibold text-[#2D221B] tracking-[0.06em] mb-5">
                평생회원 가입 안내
              </h3>

              <div className="space-y-2.5 mb-6">
                <p className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[#2D221B] leading-[1.7] tracking-[0.02em]">
                  · 휴면 전환 없이 소중한 인연이 오래도록 이어집니다.
                </p>
                <p className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[#2D221B] leading-[1.7] tracking-[0.02em]">
                  · 평생회원 전용 할인 쿠폰 및 정기 혜택을 드립니다.
                </p>
                <p className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[#2D221B] leading-[1.7] tracking-[0.02em]">
                  · 신제품 우선 체험권 선물을 드립니다.
                </p>
              </div>

              {/* 동의 라디오 버튼 — 가로 정렬, 넉넉한 간격 */}
              <div className="flex gap-10 mb-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="lifetimeMember"
                    checked={lifetimeMember === 'agree'}
                    onChange={() => setLifetimeMember('agree')}
                    className="w-[16px] h-[16px] accent-[var(--charcoal)] cursor-pointer"
                  />
                  <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[#2D221B] tracking-[0.02em]">
                    동의합니다
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="lifetimeMember"
                    checked={lifetimeMember === 'disagree'}
                    onChange={() => setLifetimeMember('disagree')}
                    className="w-[16px] h-[16px] accent-[var(--charcoal)] cursor-pointer"
                  />
                  <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[#2D221B] tracking-[0.02em]">
                    동의하지 않습니다
                  </span>
                </label>
              </div>

              {/* 법적 고지 — 시각적 방해 최소화 */}
              <p className="font-[var(--font-ui)] text-[11px] text-[var(--warm-taupe)] leading-[1.6] tracking-[0.02em]">
                ※ 관련 법령에 따라 장기간 서비스를 이용하지 않으신 경우, 별도 안내 후 개인정보가 분리 보관될 수 있습니다.
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--oatmeal)] my-8 md:my-10" />

          {/* ════════════════════════════════════════════
               섹션 4: 추가 정보 (환불계좌 - 선택)
             ════════════════════════════════════════════ */}
          <div className="mb-10">
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-semibold text-[var(--charcoal)] tracking-[0.06em] mb-2">
              추가 정보
            </h2>
            {/* response-drafting: 선택 항목임을 명확히 + 대안 경로 안내 */}
            <p className="font-[var(--font-ui)] text-[12px] text-[var(--charcoal)] opacity-70 tracking-[0.02em] mb-6 leading-[1.6]">
              환불 시 사용할 계좌 정보입니다. 지금 입력하지 않으셔도 마이페이지에서 언제든 등록하실 수 있습니다.
            </p>

            <FormField
              label="예금주명"
              name="bankAccountHolder"
              value={form.bankAccountHolder}
              placeholder="예금주명을 입력해 주세요"
              error={undefined}
              touched={false}
              onChange={handleChange}
              onBlur={() => {}}
            />

            <div className="mb-6 md:mb-8">
              <label className="block font-[var(--font-ui)] text-[11px] md:text-[12px] tracking-[0.08em] text-[var(--charcoal)] mb-2 font-medium">
                은행 선택
              </label>
              <select
                name="bankName"
                value={form.bankName}
                onChange={(e) => setForm((prev) => ({ ...prev, bankName: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-b-[var(--oatmeal)] focus:border-b-[var(--charcoal)] outline-none py-3 text-[13px] md:text-[14px] font-[var(--font-ui)] font-normal text-[var(--charcoal)] tracking-[0.02em] transition-colors cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%232D221B' stroke-width='1.2'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
              >
                {BANK_LIST.map((bank) => (
                  <option key={bank} value={bank === '선택해 주세요' ? '' : bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="계좌번호"
              name="bankAccount"
              value={form.bankAccount}
              placeholder="'-' 포함하여 입력해 주세요"
              error={undefined}
              touched={false}
              onChange={handleChange}
              onBlur={() => {}}
            />
          </div>

          <div className="border-t border-[var(--oatmeal)] my-8 md:my-10" />

          {/* ════════════════════════════════════════════
               섹션 5: 약관 동의
             ════════════════════════════════════════════ */}
          <div className="mb-10">
            <h2 className="font-[var(--font-ui)] text-[12px] md:text-[13px] font-semibold text-[var(--charcoal)] tracking-[0.06em] mb-6">
              약관 동의
            </h2>

            {/* 전체 동의 */}
            <div className="bg-[var(--cream)] border border-[var(--oatmeal)] p-4 mb-5">
              <BrandCheckbox checked={allAgreed} onChange={handleAgreeAll} size="large">
                <div>
                  <span className="font-[var(--font-ui)] text-[13px] md:text-[14px] font-semibold text-[#2D221B] tracking-[0.02em]">
                    전체 동의하기
                  </span>
                  <p className="font-[var(--font-ui)] text-[11px] md:text-[12px] text-[#2D221B] opacity-70 tracking-[0.02em] mt-1 leading-[1.6]">
                    이용약관 및 개인정보수집 및 이용, 쇼핑정보 수신 SMS/이메일(선택)에 모두 동의합니다.
                  </p>
                </div>
              </BrandCheckbox>
            </div>

            <div className="space-y-5">
              {/* 이용약관 (필수) */}
              <div>
                <BrandCheckbox checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)}>
                  <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] tracking-[0.02em]">
                    <span className="text-[var(--walnut)] font-medium">[필수]</span>{' '}
                    이용약관 동의
                  </span>
                </BrandCheckbox>
                <div className="ml-[28px]">
                  <TermsScrollBox
                    title="이용약관"
                    content={TERMS_OF_SERVICE}
                    isOpen={termsOpen}
                    onToggle={() => setTermsOpen(!termsOpen)}
                  />
                </div>
              </div>

              {/* 개인정보 수집 및 이용 동의 (필수) */}
              <div>
                <BrandCheckbox checked={agreedToPrivacy} onChange={() => setAgreedToPrivacy(!agreedToPrivacy)}>
                  <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[var(--charcoal)] tracking-[0.02em]">
                    <span className="text-[var(--walnut)] font-medium">[필수]</span>{' '}
                    개인정보 수집 및 이용 동의
                  </span>
                </BrandCheckbox>
                <div className="ml-[28px]">
                  <TermsScrollBox
                    title="개인정보 수집 및 이용 동의"
                    content={PRIVACY_POLICY}
                    isOpen={privacyOpen}
                    onToggle={() => setPrivacyOpen(!privacyOpen)}
                  />
                </div>
              </div>

              {/* 쇼핑정보 수신 동의 (선택) — SMS / 이메일 별도 동의 */}
              <div>
                <p className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[#2D221B] tracking-[0.02em] mb-3">
                  <span className="text-[var(--warm-taupe)] font-medium">[선택]</span>{' '}
                  쇼핑정보 수신 동의
                </p>

                <div className="ml-[4px] space-y-3">
                  <BrandCheckbox checked={agreedToMarketingSms} onChange={() => setAgreedToMarketingSms(!agreedToMarketingSms)}>
                    <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[#2D221B] tracking-[0.02em]">
                      SMS 수신을 동의합니다
                    </span>
                  </BrandCheckbox>

                  <BrandCheckbox checked={agreedToMarketingEmail} onChange={() => setAgreedToMarketingEmail(!agreedToMarketingEmail)}>
                    <span className="font-[var(--font-ui)] text-[12px] md:text-[13px] text-[#2D221B] tracking-[0.02em]">
                      이메일 수신을 동의합니다
                    </span>
                  </BrandCheckbox>
                </div>

                <div className="ml-[4px]">
                  <TermsScrollBox
                    title="쇼핑정보 수신 동의"
                    content={`할인쿠폰 및 혜택, 이벤트, 신상품 소식 등 쇼핑몰에서 제공하는 유익한 쇼핑정보를 SMS나 이메일로 받아보실 수 있습니다.\n\n단, 주문/거래 정보 및 주요 정책과 관련된 내용은 수신동의 여부와 관계없이 발송됩니다.\n\n※ 동의를 거부하실 수 있으며, 동의하지 않으셔도 회원가입 및 서비스 이용에는 제한이 없습니다.`}
                    isOpen={marketingOpen}
                    onToggle={() => setMarketingOpen(!marketingOpen)}
                  />
                </div>
              </div>
            </div>

            {/* ux-writing: 에러 구조 — 무엇이 필요한지 + 어떻게 해결하는지 */}
            {(!agreedToTerms || !agreedToPrivacy) && (touched.email || touched.name) && (
              <p className="font-[var(--font-ui)] text-[12px] text-[var(--charcoal)] mt-4 tracking-[0.02em] font-medium">
                가입을 위해 필수 약관에 동의해 주세요.
              </p>
            )}
          </div>

          {/* ── 결과 메시지 (성공/에러) ── */}
          {submitMessage && (
            <p className={`font-[var(--font-ui)] text-[12px] tracking-[0.02em] mb-6 leading-[1.6] font-medium ${
              submitSuccess ? 'text-[var(--walnut)]' : 'text-[var(--charcoal)]'
            }`}>
              {submitMessage}
            </p>
          )}

          {/* ── 가입 버튼 ── */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 md:py-5 text-[13px] md:text-[14px] font-[var(--font-ui)] font-bold tracking-[0.06em] transition-colors ${
              isFormValid && !isSubmitting
                ? 'bg-[var(--charcoal)] text-white hover:bg-[var(--walnut-dark)] cursor-pointer'
                : 'bg-[var(--oatmeal)] text-[var(--warm-taupe)] cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '가입 처리 중...' : 'By MOMO 가족이 되기'}
          </button>

          {/* ── 로그인 링크 ── */}
          <div className="text-center mt-8 mb-4">
            <span className="font-[var(--font-ui)] text-[12px] text-[var(--charcoal)] tracking-[0.03em]">
              이미 회원이신가요?{' '}
              <Link href="/my" className="text-[var(--charcoal)] underline hover:text-[var(--walnut-dark)] font-medium">
                로그인
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
           주소 검색 모달 (카카오 우편번호 서비스)
         ════════════════════════════════════════════ */}
      {showPostcode && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPostcode(false);
          }}
        >
          <div className="w-full max-w-[500px] h-[520px] md:h-[560px] mx-4 flex flex-col bg-white shadow-2xl overflow-hidden
                          max-md:fixed max-md:inset-0 max-md:max-w-none max-md:h-full max-md:mx-0">
            {/* 헤더 바 — 브랜드 컬러 */}
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--charcoal)]">
              <h3 className="font-[var(--font-ui)] text-[13px] md:text-[14px] font-medium text-[var(--cream)] tracking-[0.04em]">
                우편번호 검색
              </h3>
              <button
                type="button"
                onClick={() => setShowPostcode(false)}
                className="w-[28px] h-[28px] flex items-center justify-center text-[var(--cream)] hover:text-white transition-colors cursor-pointer"
                aria-label="닫기"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="4" y1="4" x2="12" y2="12" />
                  <line x1="12" y1="4" x2="4" y2="12" />
                </svg>
              </button>
            </div>
            {/* Daum Postcode 임베드 영역 */}
            <div ref={postcodeContainerRef} className="flex-1 w-full" />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
