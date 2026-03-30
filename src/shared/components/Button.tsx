'use client';

// 재사용 가능한 버튼 컴포넌트 — 이솝 스타일 (각진 모서리, 축소 폰트, 넓은 letter-spacing)
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'kakao' | 'soft' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function Button({
  variant,
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  // ── 기본 클래스: 모든 버튼 공통 (active state 강화 포함) ──
  const baseClasses =
    'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 tracking-[0.04em] active:scale-[0.97] active:brightness-90';

  // ── 변형별 클래스 — 최소 높이 54px 보장 (모바일 터치 영역 준수) ──
  const variantClasses: Record<string, string> = {
    primary: `${baseClasses} w-full bg-[var(--walnut-dark)] text-[var(--cream)] rounded-none min-h-[54px] py-4 text-[14px] font-[var(--font-ui)] font-semibold hover:bg-[var(--walnut)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`,
    secondary: `${baseClasses} border border-[var(--walnut)] text-[var(--walnut)] bg-transparent rounded-none min-h-[54px] py-4 px-6 text-[13px] font-[var(--font-ui)] font-medium hover:bg-[var(--cream)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`,
    kakao: `${baseClasses} w-full bg-[#FEE500] text-[#191919] rounded-none min-h-[54px] py-4 text-[13px] font-[var(--font-ui)] font-semibold hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`,
    soft: `${baseClasses} inline-block bg-[var(--cream)] text-[var(--walnut)] rounded-none px-6 min-h-[44px] py-3 text-[13px] font-[var(--font-ui)] font-medium hover:bg-[var(--oatmeal)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`,
    ghost: `${baseClasses} inline-block bg-transparent text-[var(--warm-gray)] rounded-none px-4 min-h-[44px] py-2 text-[13px] font-[var(--font-ui)] font-medium hover:text-[var(--walnut)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
