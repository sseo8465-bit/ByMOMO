'use client';

// ──────────────────────────────────────────────
// BenefitList — 회원 혜택 안내 공통 컴포넌트
// ──────────────────────────────────────────────
// 역할: signup 페이지 + cart BottomSheet에서 동일 혜택 목록 표시
// 디자인: 이솝/PVCS 에디토리얼 스타일 — 축소 폰트, 넓은 자간, 얇은 dot 불렛
// 문구 수정 시 BENEFIT_ITEMS 배열만 변경하면 전체 반영됨
// ──────────────────────────────────────────────

// ── 혜택 목록 데이터 — 한 곳에서 관리 ──
const BENEFIT_ITEMS = [
  '프로필 저장 — 다음 주문 시 바로 추천',     // 혜택 1: 재주문 편의성
  '첫 구매 5% 할인 쿠폰',                    // 혜택 2: 신규 가입 인센티브
  '구독 서비스 사전 알림',                    // 혜택 3: 얼리버드 접근
] as const;

// ── Props 타입 ──
interface BenefitListProps {
  className?: string;  // 외부에서 추가 스타일 주입 가능
}

export default function BenefitList({ className = '' }: BenefitListProps) {
  return (
    // 혜택 카드 — 크림색 배경, 에디토리얼 타이포
    <div className={`bg-[var(--cream)] p-6 ${className}`}>
      <ul className="flex flex-col gap-3">
        {BENEFIT_ITEMS.map((benefitText) => (
          <li
            key={benefitText}
            className="flex items-start gap-3 font-[var(--font-ui)] text-[11px] text-[var(--charcoal)] tracking-[0.06em] leading-[1.6]"
          >
            {/* 얇은 dot 불렛 — 체크 이모지 대신 미니멀한 원형 포인트 */}
            <span
              className="flex-shrink-0 w-[4px] h-[4px] rounded-full bg-[var(--walnut)] mt-[6px]"
              aria-hidden="true"
            />
            {/* 혜택 텍스트 */}
            <span>{benefitText}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
