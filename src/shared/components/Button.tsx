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
  const baseClasses =
    'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 tracking-[0.04em]';

  const variantClasses: Record<string, string> = {
    primary: `${baseClasses} w-full bg-[var(--walnut)] text-[var(--cream)] rounded-none py-4 text-[13px] font-[var(--font-ui)] font-medium hover:bg-[var(--walnut-dark)] disabled:opacity-50 disabled:cursor-not-allowed`,
    secondary: `${baseClasses} border border-[var(--walnut)] text-[var(--walnut)] bg-transparent rounded-none py-4 px-6 text-[13px] font-[var(--font-ui)] font-medium hover:bg-[var(--cream)] disabled:opacity-50 disabled:cursor-not-allowed`,
    kakao: `${baseClasses} w-full bg-[#FEE500] text-[#191919] rounded-none py-4 text-[13px] font-[var(--font-ui)] font-semibold hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed`,
    soft: `${baseClasses} inline-block bg-[var(--cream)] text-[var(--walnut)] rounded-none px-6 py-3 text-[13px] font-[var(--font-ui)] font-medium hover:bg-[var(--oatmeal)] disabled:opacity-50 disabled:cursor-not-allowed`,
    ghost: `${baseClasses} inline-block bg-transparent text-[var(--warm-gray)] rounded-none px-4 py-2 text-[13px] font-[var(--font-ui)] font-medium hover:text-[var(--walnut)] disabled:opacity-50 disabled:cursor-not-allowed`,
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
