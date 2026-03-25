# By MOMO — 프리미엄 반려견 수제간식 브랜드 웹사이트

## 프로젝트 개요
- 목적: 반려견 맞춤 간식 추천 + 구매 플랫폼
- 모바일 퍼스트 (430px max-width)
- Phase 1: 프론트엔드 only + Mock 데이터
- Phase 2 예정: Supabase 연동, 실결제, 카카오 인증

## 기술 스택
- Next.js 15 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 (PostCSS)
- 카카오 로그인 SDK
- Vercel 배포

## 아키텍처
```
src/
├── app/           # Next.js 페이지 + 레이아웃
├── domains/       # DDD 도메인별 분리
│   ├── auth/      # 카카오 인증 (context + types)
│   ├── cart/      # 장바구니 (context + types)
│   └── profile/   # 반려견 프로필 (context + types + logic)
└── shared/        # 공유 리소스
    ├── components/ # GNB, Footer, Button, BottomSheet 등 8개
    ├── mock/       # 더미 데이터 (products.ts)
    └── types.ts    # 공통 타입 (Product, DogProfile 등)
```

## 파일 네이밍 컨벤션
- Context: `{domain}.context.tsx`
- 타입: `{domain}.types.ts`
- 로직: `{domain}.logic.ts`
- 컴포넌트: PascalCase (GNB.tsx, Button.tsx)
- 페이지: page.tsx (Next.js 규칙)

## 상태 관리
- Context API + custom hooks (외부 라이브러리 없음)
- Provider 순서: AuthProvider → ProfileProvider → CartProvider
- 각 Context 접근 시 반드시 custom hook 사용 (useAuth, useCart, useProfile)

## 브랜드 디자인 토큰
- 색상: --walnut(텍스트), --cream(카드배경), --oatmeal(구분선), --warm-taupe(어센트)
- 폰트: --font-serif(Cormorant Garamond), --font-ui(DM Sans), Pretendard(본문)
- 카카오 노란색(#FEE500)은 카카오 로그인 버튼에만 사용

## 타이포그래피 스케일
- H1: 28px / H2: 22px / H3: 17px
- Body: 15px / Sub: 14px / Caption: 12px / Micro: 10px
- Line-height: H1-H2 1.5 / Body 1.7 / Caption 1.6

## 라우팅
- / (홈) → /about → /profile (3단계) → /recommend → /product/[id]
- /cart → /checkout → /order-complete
- /signup, /subscription, /my, /admin

## 주의사항
- ESLint ignoreDuringBuilds: true (빌드 시 경고 무시)
- .env.local 필요: NEXT_PUBLIC_KAKAO_APP_KEY
- 새로고침 시 Context 상태 초기화됨 (영속화 미구현)
- 이미지: Unsplash CDN 더미만 사용
- VM에서 Next.js 빌드 메모리 부족 → 로컬 빌드 필요

## v2.3 예정 (이솝 스타일 + 반응형)
- 430px 고정 → 반응형 여백 시스템
- 폰트: 세리프 → 씬 산세리프 전환
- GNB 재설계 (브랜드명 중앙)
- ProductCard 컴포넌트 + 그리드 레이아웃
