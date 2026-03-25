'use client';

// ──────────────────────────────────────────────
// BenefitList — 회원 혜택 안내 공통 컴포넌트
// 역할: signup 페이지 + cart BottomSheet에서 동일 혜택 목록 표시
// 중복 제거: 두 곳에서 같은 텍스트를 각각 하드코딩하던 것을 하나로 통합
// ──────────────────────────────────────────────

// ── 혜택 목록 데이터 — 한 곳에서 관리 ──
// 문구 수정 시 여기만 변경하면 signup + cart 모두 반영
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
    // 혜택 카드 — 크림색 배경, 둥근 모서리
    <div className={`bg-[var(--cream)] rounded-none p-6 ${className}`}>
      <ul className="flex flex-col gap-2.5 text-[12px] text-[var(--charcoal)] tracking-[0.02em]">
        {BENEFIT_ITEMS.map((benefitText) => (
          <li key={benefitText} className="flex items-start gap-2">
            {/* 체크 아이콘 — 이모지 대신 SVG 사용 (브랜드 톤 유지) */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="var(--walnut)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 mt-0.5"
              aria-hidden="true"
            >
              <polyline points="13 4 6 12 3 9" />
            </svg>
            {/* 혜택 텍스트 */}
            <span>{benefitText}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
