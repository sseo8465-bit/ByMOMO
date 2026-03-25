# By MOMO — 프리미엄 반려견 수제간식 브랜드 웹사이트

## Tech Stack & Architecture

- **프레임워크**: Next.js 15.5 (App Router) + React 19.1 + TypeScript 5
- **스타일링**: Tailwind CSS 4 (PostCSS, `@import "tailwindcss"` 방식)
- **상태관리**: Context API + custom hooks (외부 라이브러리 없음)
- **배포**: Vercel (GitHub 연동 자동 배포)
- **인증**: 카카오 로그인 SDK (`NEXT_PUBLIC_KAKAO_APP_KEY`)
- **이미지**: Unsplash CDN (Mock 단계, `images.unsplash.com` 허용)
- **Phase 2 예정**: Supabase (DB + Auth), 토스페이먼츠 (PG)

```
src/
├── app/              # Next.js App Router 페이지 + 레이아웃
│   ├── layout.tsx    # 루트 레이아웃 (Providers 래핑)
│   ├── providers.tsx # Context Provider 체인
│   ├── globals.css   # CSS 커스텀 프로퍼티 + Tailwind + 반응형 유틸리티
│   ├── page.tsx      # 홈
│   ├── about/        # 브랜드 스토리
│   ├── profile/      # 3단계 프로파일 (layout + page + health/ + preference/)
│   ├── recommend/    # 맞춤 추천 결과
│   ├── product/[id]/ # 상품 상세 (3탭 시스템)
│   ├── shop/         # 컬렉션 (PVCS 스타일 그리드)
│   ├── cart/         # 장바구니 (데스크톱 2열, 사이드바)
│   ├── checkout/     # 결제 (regex 유효성 검증)
│   ├── order-complete/ # 주문 완료
│   ├── signup/       # 회원가입
│   ├── register/     # 신규 가입 (카카오 + 이메일)
│   ├── subscription/ # 구독 웨이트리스트
│   ├── my/           # 마이페이지 (이솝 스타일 로그인)
│   ├── faq/          # 자주 묻는 질문
│   ├── terms/        # 이용약관
│   ├── privacy/      # 개인정보처리방침
│   ├── guide/        # 이용 가이드
│   └── admin/        # 어드민
├── domains/          # DDD 도메인별 분리
│   ├── auth/         # auth.context.tsx, auth.types.ts
│   ├── cart/         # cart.context.tsx, cart.types.ts
│   ├── checkout/     # (결제 관련)
│   ├── home/         # (홈 관련)
│   ├── mypage/       # (마이페이지 관련)
│   ├── product/      # (상품 관련)
│   ├── profile/      # profile.context.tsx, profile.types.ts, profile.logic.ts
│   └── subscription/ # (구독 관련)
└── shared/           # 공유 리소스
    ├── components/   # GNB, Footer, Button, BottomSheet, GiftPreview, BenefitList, IngredientTable, SafeFilter, StepIndicator (9개)
    ├── hooks/        # 커스텀 훅
    ├── mock/         # products.ts (더미 데이터)
    ├── styles/       # 추가 스타일
    └── types.ts      # 공통 타입 (Product, CartItem, DogProfile 등)
```

## Coding Conventions

### 파일 네이밍
- 컴포넌트: PascalCase (`GNB.tsx`, `Button.tsx`, `GiftPreview.tsx`)
- Context: `{domain}.context.tsx` (`cart.context.tsx`)
- 타입: `{domain}.types.ts` (`cart.types.ts`)
- 로직: `{domain}.logic.ts` (`profile.logic.ts`)
- 페이지: `page.tsx` (Next.js App Router 규칙)

### 코드 패턴
- import 순서: React/Next → 외부 라이브러리 → `@/shared/components` → `@/domains/` → 로컬 타입/스타일
- Props: 같은 파일 상단에 `interface` 키워드로 정의 (`interface GNBProps { ... }`)
- 컴포넌트: `export default function ComponentName()` (named default export)
- Context: `createContext<Type | undefined>(undefined)` + custom hook으로만 접근 (`useCart`, `useAuth`, `useProfile`)
- Provider 순서: `AuthProvider → ProfileProvider → CartProvider` (`providers.tsx` 참조)
- CSS: Tailwind 유틸리티 + CSS 커스텀 프로퍼티 혼용 (`className="bg-[var(--cream)]"`)
- 애니메이션: globals.css에 정의된 클래스 사용 (`animate-fade-in`, `animate-toast`, `animate-slide-up`)

### 브랜드 디자인 토큰 (globals.css :root)
- 배경 계층: `--warm-white`(#FDFAF5) → `--cream`(#F5F0E8) → `--oatmeal`(#EDE6D8)
- 텍스트: `--charcoal`(#2C2C2C, 본문) / `--warm-gray`(#6B6560, 보조) / `--walnut`(#6B5344, 강조)
- 강조색: `--walnut` 한 가지로 통일. 다중 강조색 없음
- 폰트: `--font-serif`(Cormorant Garamond) / `--font-sans`(Pretendard) / `--font-ui`(DM Sans)
- 카카오: `--kakao-yellow`(#FEE500)은 카카오 로그인 버튼에만 사용
- 곡률: `--radius-soft`(6px) / `--radius-card`(8px) — CSS에 정의되어 있으나 **v3 리디자인 이후 전 컴포넌트에서 `rounded-none` 적용**. 새 컴포넌트도 `rounded-none`을 기본으로 사용하라.
- 전환: `--transition-gentle`(0.35s cubic-bezier)

### 반응형 레이아웃 토큰 (globals.css :root)
- `--space-page-x: clamp(1.5rem, 5vw, 6rem)` — 좌우 페이지 패딩 (뷰포트 비례)
- `--space-section-y: clamp(2.5rem, 6vw, 5rem)` — 섹션 간 상하 간격
- `--space-content-max: 1200px` — `.app-container` 최대 너비

### CSS 유틸리티 클래스 (globals.css)
- `.page-padding` → `padding-left/right: var(--space-page-x)` — 모든 페이지 콘텐츠 영역에 적용
- `.section-spacing` → `padding-top/bottom: var(--space-section-y)` — 섹션 간 간격
- `.app-container` → `width: 100%; max-width: var(--space-content-max); margin: 0 auto` — 전체 레이아웃 래퍼
- 새 페이지 작성 시 반드시 `page-padding` + `section-spacing` 조합을 사용하라.

### 타이포그래피 스케일 (반응형)
- H1: `text-[24px] md:text-[36px] lg:text-[42px]` (세리프)
- H2: `text-[18px] md:text-[22px]` (세리프)
- Eyebrow: `text-[10px] font-semibold tracking-[0.15em] uppercase` (DM Sans) — 섹션 라벨용
- Body: `text-[13px]` (DM Sans) / Sub: `text-[12px]` / Caption: `text-[11px]`
- Line-height: H1 1.4 / Body 1.7 / Caption 1.6
- 모든 텍스트에 `tracking-[0.02em]` 이상 적용. 버튼/라벨은 `tracking-[0.04em]~[0.12em]`

### 이솝/PVCS 디자인 원칙 (v3 리디자인 완료)
- **각진 모서리**: 전 컴포넌트 `rounded-none`. 예외 없음 (`rounded-lg`, `rounded-full` 등 사용 금지)
- **빨간 에러 금지**: 빨간색(#C62828 등) 절대 불가 → `--walnut` 인라인 텍스트로 처리
- **이모지 사용 금지**: 카피, 버튼, 알림 등 전체
- **bottom-line 인풋**: `border-0 border-b border-[var(--oatmeal)] focus:border-[var(--walnut)]` — 전통적 박스 인풋 대신 하단 선만 사용
- **텍스트 링크 CTA**: 주요 내비게이션에 텍스트 버튼 + `underline underline-offset-4` 패턴 사용
- **uppercase eyebrow 라벨**: 섹션 타이틀 위에 `tracking-[0.15em] uppercase text-[10px]` 패턴
- **넉넉한 여백**: `page-padding` + `section-spacing` 기본. 콘텐츠 컨테이너는 `max-w-[480px]`(폼) 또는 `max-w-[680px]`(프로즈) 사용
- **에러 메시지 톤**: 정중한 어조 ("배송을 위해 성함을 다시 한번 확인해 주세요")

### 반응형 패턴 (Breakpoints)
- 모바일 퍼스트 + `sm:`, `md:`, `lg:` Tailwind breakpoint 활용
- 그리드: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (상품 목록, 혜택 카드 등)
- 2열 레이아웃: `flex-col lg:flex-row` (장바구니 본문 + 사이드바)
- 이미지: `sizes="100vw"` (고정 430px 대신 뷰포트 비례)
- 히어로 높이: `h-[280px] md:h-[480px] lg:h-[560px]`
- 데스크톱 사이드바: `lg:sticky lg:top-24` (장바구니 주문 요약 등)

## Behavior Guidelines

- 원본 파일을 직접 업데이트하라. 부분 코드 조각만 생성하지 마라.
- `'use client'` 디렉티브: 클라이언트 훅 사용 시 **파일 첫 번째 줄**에 반드시 작성하라.
- 반응형 레이아웃: `.app-container`는 `max-width: 1200px`로 전체 너비 활용. 430px 모바일 고정폭은 제거됨. `page-padding` + `section-spacing`을 모든 페이지에 적용하라.
- 페이지 구조: `page.tsx`(Server Component) → `ClientPage.tsx`(`'use client'`, 실제 UI) 분리 패턴. `export const dynamic`은 `page.tsx`에만 배치하라.
- 새 페이지 추가 시 `docs/v3-aesop-design-reference.md`의 "신규 페이지 체크리스트"를 따르라.
- ESLint: `ignoreDuringBuilds: true` 설정됨. 빌드 시 ESLint 에러는 무시되나, 코드 작성 시 따르라.
- path alias: `@/*` → `./src/*` (tsconfig.json paths)

## External References

- **디자인 기준**: `docs/v3-aesop-design-reference.md` — 새 컴포넌트 추가, 색상/폰트/에러 처리, 카피 톤 결정 시 이 문서를 먼저 확인하라.
- **와이어프레임**: `../website/wireframe-v2.1.html` — UI 구조/레이아웃 판단 시 참조하라.
- **브랜드 보이스**: `../brand.identity/브랜드 비주얼 가이드.html` — 카피 톤, 슬로건, 용어 기준.
- **Mock 데이터**: `src/shared/mock/products.ts` — 상품 데이터 변경/추가 시 여기를 수정하라.
- **배포**: Vercel 자동 배포 (GitHub main 브랜치 push → 자동 빌드). 수동 배포 불필요.

## Common Pitfalls

<!-- 실제 발생한 실수 패턴을 누적 기록하는 영역 -->

### 🚨 [Critical] Next.js 15 — 'use client' 페이지의 Route Segment Config 무시됨
- **증상**: `'use client'` 페이지에 `export const dynamic = 'force-dynamic'`을 넣어도 프리렌더링이 막히지 않음 → "Could not find the module in React Client Manifest" 빌드 에러
- **원인**: Next.js 15에서 `dynamic`, `revalidate` 등 Route Segment Config는 **Server Component에서만 인식**됨. Client Component에 직접 넣으면 무시된다.
- **올바른 패턴**: `page.tsx`(Server Component, `export const dynamic` 설정) → `ClientPage.tsx`(`'use client'`, 실제 UI) 구조로 분리하라.
- **발생일**: 2026-03-25, Vercel 배포 3회 연속 실패로 발견

### ⚠️ git push --force 후 Vercel 캐시 복원 문제
- **증상**: `git push --force`로 원격 히스토리를 대체해도, Vercel가 이전 성공 배포의 빌드 캐시를 복원함 → 코드와 캐시 불일치
- **해결**: Vercel 대시보드에서 "Redeploy" → "Clear Build Cache" 체크 필수. 또는 `next.config.mjs`에 `generateBuildId`로 고유 빌드 ID 강제.

### ⚠️ 'use client' 위치
- `'use client'`는 반드시 **파일의 첫 번째 줄**에 위치해야 한다. 주석 뒤에 넣으면 인식되지 않을 수 있다.
- `GiftPreview.tsx`에서 주석 뒤에 `'use client'`가 있어 빌드 에러 발생한 전례 있음.

### ⚠️ Context 상태 비영속성
- `useCart`, `useProfile` 등 Context 상태는 새로고침 시 초기화됨.
- Phase 2에서 Supabase 연동 전까지는 주의. 사용자에게 "새로고침 시 데이터가 사라집니다" 안내 필요.

### ⚠️ .env.local 환경변수
- `NEXT_PUBLIC_KAKAO_APP_KEY` 미설정 시 카카오 로그인 SDK 로드 실패.
- `.env.local` 변경 시 `next dev` 서버 재시작 필수.

### ⚠️ Tailwind v4 + CSS Custom Properties 혼용 주의
- Tailwind v4는 `@theme inline` 블록에서 커스텀 프로퍼티를 Tailwind 토큰으로 등록함.
- `bg-warm-white` 같은 Tailwind 클래스 대신 `bg-[var(--warm-white)]` 방식으로 사용 중. 일관성 유지하라.
