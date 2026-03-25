// 재사용 가능한 버튼 컴포넌트 — 여러 스타일 변형 지원
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
    'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses: Record<string, string> = {
    primary: `${baseClasses} w-full bg-[var(--walnut)] text-[var(--cream)] rounded-lg py-3.5 text-[15px] font-[var(--font-ui)] font-medium hover:bg-[var(--walnut-dark)] disabled:opacity-50 disabled:cursor-not-allowed`,
    secondary: `${baseClasses} border border-[var(--walnut)] text-[var(--walnut)] bg-transparent rounded-lg py-3.5 px-4 text-[15px] font-[var(--font-ui)] font-medium hover:bg-[var(--cream)] disabled:opacity-50 disabled:cursor-not-allowed`,
    kakao: `${baseClasses} w-full bg-[#FEE500] text-[#191919] rounded-lg py-3.5 text-[15px] font-[var(--font-ui)] font-semibold hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed`,
    soft: `${baseClasses} inline-block bg-[var(--cream)] text-[var(--walnut)] rounded-md px-5 py-2.5 text-[15px] font-[var(--font-ui)] font-medium hover:bg-[var(--oatmeal)] disabled:opacity-50 disabled:cursor-not-allowed`,
    ghost: `${baseClasses} inline-block bg-transparent text-[var(--warm-gray)] rounded-md px-4 py-2 text-[15px] font-[var(--font-ui)] font-medium hover:text-[var(--walnut)] disabled:opacity-50 disabled:cursor-not-allowed`,
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
