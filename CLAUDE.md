# By MOMO — 프리미엄 반려견 수제간식 브랜드 웹사이트

## Tech Stack & Architecture

- **프레임워크**: Next.js 15.5 (App Router) + React 19.1 + TypeScript 5
- **스타일링**: Tailwind CSS 4 (PostCSS, `@import "tailwindcss"` 방식)
- **상태관리**: Context API + custom hooks (외부 라이브러리 없음)
- **배포**: Vercel (GitHub 연동 자동 배포)
- **인증**: 이중 인증 시스템
  - Supabase Auth: 이메일/비밀번호 (signUp, signInWithPassword). `@supabase/ssr` 패키지, 쿠키 기반 세션
  - 카카오 SDK: 소셜 로그인 (`NEXT_PUBLIC_KAKAO_APP_KEY`). Phase 3에서 Supabase OAuth 전환 예정
  - 서버 보호: `middleware.ts`(JWT 검증) + Server Component(`checkIsAdmin()`) 이중 검증
  - Admin 권한: `app_metadata.role === 'admin'` — Supabase SQL로 부여
- **이미지**: 상품 이미지는 Unsplash 무료 사진 (`images.unsplash.com`만 허용, `plus.unsplash.com` 금지). 비주얼 컴포넌트(GiftPreview 등)는 CSS/SVG 기반으로 전환 중
- **Supabase**: `@supabase/supabase-js` + `src/lib/supabase.ts`. **Phase 2 진입 — Supabase 프로젝트 연결 완료** (Project ID: yunmdbmzkjhlgeubrxrp, 리전: Seoul). `isSupabaseConfigured` = `true`. 이메일 Auth(signUp, signInWithPassword) 활성화됨. 카카오 OAuth는 기존 SDK 유지 (Supabase OAuth 전환은 Phase 3)
- **Phase 2 진행 중**: 토스페이먼츠 (PG) 연동 예정

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

## Brand Voice (카피 작업 필수 참조)

### Voice Attributes
1. **보호자 동료**: "나도 같은 보호자예요" — 전문가 프레임이 아닌 동등한 보호자 시점. 1인칭 "우리" 사용.
2. **선물 프레임**: 간식 = 보호자가 아이에게 주는 선물. "추천"보다 "골라봤어요" 표현.
3. **감성적 개인화**: 정밀 영양 계산이 아닌 "이름 + 생애단계 + 고민" 3요소로 감정적 개인화.
4. **절제된 우아함**: 과장 수식어("오직", "가장", "최고의") 금지. 담백하고 정중한 톤 유지.

### Terminology 규칙
- "맞춤" = **전략적 배치** (2026-03-27 확정):
  - ✅ 허용 위치 3곳: Home Hero CTA("맞춤 간식 찾기"), Shop 맞춤 추천 배너, Cart 빈 상태 CTA — 커스터마이징이 브랜드 핵심 차별점이므로 이 CTA에서는 반드시 "맞춤" 유지
  - ❌ 금지 위치: 본문·설명 텍스트에서 "맞춤 추천" 단독 사용 금지. 대신 "프로파일에 따라", "따로 구성", "찾아드릴게요" 등 사용
- "건강 고민" → "걱정되는 부분"
- 의학 용어 → 보호자 언어 ("알러지 유발 단백질" → "못 먹는 재료")
- 과장 수식어 금지: "오직", "가장", "최고의" — 어떤 맥락에서도 사용 불가

### 카피 QA 체크리스트 (배포 전 필수)
1. **조사 중복 확인**: "~를 위해 ~를 위해" 같은 동일 조사/어미 반복이 없는지 템플릿 변수 치환 결과를 검증하라.
2. **동일 단어 과용 확인**: 같은 페이지 내 "골라"가 2회 이상 노출되지 않도록 다변화하라.
3. **금지어 확인**: "오직", "가장", "최고의", 의학 전문 용어가 포함되지 않았는지 확인하라. "맞춤"은 허용된 CTA 3곳(Home Hero, Shop 배너, Cart 빈 상태) 외에서 사용되지 않았는지 확인하라.
4. **템플릿 리터럴 검증**: `${name}의 ${phrase}` 등 동적 문구는 실제 데이터로 치환한 결과를 눈으로 확인하라.
5. **와이어프레임 동기화 확인**: 코드에서 카피를 수정하면 와이어프레임 HTML(`wireframe-v2.1*.html`)의 해당 문구도 반드시 동일하게 갱신하라. 설계도와 실제 코드가 다르면 브랜드 신뢰도가 훼손된다.

## Coding Conventions

### 파일 네이밍
- 컴포넌트: PascalCase (`GNB.tsx`, `Button.tsx`, `GiftPreview.tsx`)
- Context: `{domain}.context.tsx` (`cart.context.tsx`)
- 타입: `{domain}.types.ts` (`cart.types.ts`)
- 로직: `{domain}.logic.ts` (`profile.logic.ts`)
- 페이지: `page.tsx` (Next.js App Router 규칙)

### 파일 헤더 주석 패턴
- 모든 주요 파일 상단에 `// ──────` 블록으로 파일 용도, 사용처, 리디자인 이력을 기록하라.
- 형식: `// 파일명 — 한 줄 설명` + 주석 블록 내 사용처·기술 참고 메모
- 예시: `StepIndicator.tsx` 상단의 "사용처: /profile, /profile/health, /profile/preference" 참조

### 코드 패턴
- import 순서: React/Next → 외부 라이브러리 → `@/shared/components` → `@/domains/` → 로컬 타입/스타일
- Props: 같은 파일 상단에 `interface` 키워드로 정의 (`interface GNBProps { ... }`)
- 컴포넌트: `export default function ComponentName()` (named default export)
- Context: `createContext<Type | undefined>(undefined)` + custom hook으로만 접근 (`useCart`, `useAuth`, `useProfile`)
- Provider 순서: `AuthProvider → ProfileProvider → CartProvider` (`providers.tsx` 참조)
- CSS: Tailwind 유틸리티 + CSS 커스텀 프로퍼티 혼용 (`className="bg-[var(--cream)]"`)
- 애니메이션: globals.css에 정의된 클래스 사용 (`animate-fade-in`, `animate-toast`, `animate-slide-up`)
- 인라인 스타일 반복 제거: 같은 스타일이 3회 이상 반복되면 파일 상단에 `const INPUT_BASE = '...'` 등 상수로 추출하라. (`my/ClientPage.tsx` 참조)
- **Button variant 사용 기준** (`shared/components/Button.tsx`):
  - `primary`: 페이지당 1개, 최상위 CTA (결제, 프로필 저장 등). `bg-[var(--walnut-dark)]`, 풀 너비.
  - `secondary`: 보조 CTA (비회원 주문, 돌아가기). outline 스타일, `border-[var(--walnut)]`.
  - `kakao`: 카카오 로그인 전용. `bg-[#FEE500]`.
  - `soft`: 인라인 보조 버튼 (장바구니 담기 등). `bg-[var(--cream)]`.
  - `ghost`: 최소 시각적 무게 (취소, 닫기 등). 배경 없음.
- **BottomSheet 모달 패턴** (`shared/components/BottomSheet.tsx`):
  - 모든 모달/오버레이는 BottomSheet 컴포넌트를 재사용하라. 새 모달 컴포넌트를 만들지 마라.
  - Props: `isOpen`, `onClose`, `title`(선택), `children`.
  - ESC 키 닫기 + 오버레이 클릭 닫기 + body 스크롤 잠금이 내장되어 있다.
- **domains/ 하위 빈 디렉토리 주의**: `domains/*/components/`, `domains/*/hooks/` 폴더가 전 도메인에 존재하나, 현재 전부 비어있다. Phase 2 컴포넌트 분리용으로 예약된 구조이므로, 지금은 여기에 코드를 넣지 마라. 컴포넌트는 `shared/components/`에, 도메인 로직은 `domains/{domain}/` 루트에 배치하라.
- 매핑 테이블: 조건별 문구/라벨은 `Record<string, string>` 또는 `Record<string, { label: string; keywords: string[] }>` 형태로 파일 상단에 선언하라. (`recommend/ClientPage.tsx`의 `CURATION_PHRASES`, `CONCERN_RATIONALE` 참조)
- Form validation: 정규식은 `REGEX` 상수 객체로 파일 상단에 중앙 관리하라. 개별 함수 내 인라인 정규식 금지. (`checkout/ClientPage.tsx`의 `REGEX` 객체 참조)
- Reason-to-believe 패턴: 프로필 데이터 기반 동적 큐레이션 근거는 `CONCERN_RATIONALE` Record + `generateCurationRationale()` 함수로 구현하라. 새 건강 고민 항목 추가 시 이 Record도 함께 업데이트하라. (`recommend/ClientPage.tsx` 참조)
- **홈 page.tsx 예외**: 홈(`src/app/page.tsx`)만 유일하게 Server Component에서 직접 UI를 렌더링한다 (Image, Link, GNB, Footer 직접 import). 신규 페이지는 반드시 `page.tsx`(Server) → `ClientPage.tsx`(`'use client'`) 분리 패턴을 따르라. 홈을 참고하지 말고 `shop/`, `recommend/` 등의 패턴을 따르라.
- **Supabase 가드 패턴**: `src/lib/supabase.ts`의 `isSupabaseConfigured` 플래그를 Supabase API 호출 전 반드시 체크하라. `false`일 때 API 호출 시 placeholder URL로 네트워크 에러 발생. (`src/lib/supabase.ts` 참조)
- **Supabase 서버 클라이언트**: `src/lib/supabase-server.ts` — middleware.ts, Server Component 전용. `createSupabaseServerClient()`는 쿠키 기반 세션 유지. `checkIsAdmin()`으로 admin 역할 검증. 클라이언트사이드에서는 `src/lib/supabase.ts` 사용.
- **Admin 권한 보호 (3중 계층)**:
  - 1차 Client: `useAuth().isAdmin` 체크
  - 2차 Middleware: `/admin` 접근 시 JWT 검증 + `app_metadata.role` 확인 (가장 강력, `src/middleware.ts`)
  - 3차 Server Component: `checkIsAdmin()` 재검증 (`admin/page.tsx`)
  - 참고: `docs/admin-auth-setup-guide.md`
- **Daum 우편번호 API 패턴** (`register/ClientPage.tsx`):
  - `window.daum.Postcode` 타입은 `declare global` 블록으로 선언
  - 스크립트 로드: `document.getElementById('daum-postcode-script')` 체크 후 동적 추가
  - 주소 선택 완료 → `zipCode` + `address` 자동 입력 → `addressDetail`로 focus 이동
  - ESC 키 / 배경 클릭으로 모달 닫기
- **마케팅 동의 분리 패턴** (2026-03-30):
  - `agreedToMarketingSms` + `agreedToMarketingEmail` 두 개 상태로 분리 관리
  - 전체 동의: `allAgreed = agreedToTerms && agreedToPrivacy && agreedToMarketingSms && agreedToMarketingEmail`
  - 신규 폼에서 마케팅 동의 필드 추가 시 반드시 SMS/이메일 분리 패턴을 따르라
- **`rounded-[2px]` 예외**: `rounded-none` 원칙의 유일한 허용 예외. 하단 고정 CTA 등 미세 곡률이 필요한 경우에만 `rounded-[2px]`까지 허용. `rounded-md` 이상은 금지.

### 브랜드 디자인 토큰 (globals.css :root)
- 배경 계층: `--warm-white`(#FDFAF5) → `--cream`(#F8F4ED) → `--oatmeal`(#EDE6D8)
- 텍스트: `--charcoal`(#2D221B, 본문) / `--warm-gray`(#5A4E45, 보조) / `--walnut`(#6B5344, 강조)
- 강조색: `--walnut` 한 가지로 통일. 다중 강조색 없음
- 중간톤: `--warm-taupe`(#7A6D5F) / `--warm-taupe-light`(#C8BEB3) / `--warm-taupe-dark`(#6B5F52)
- 라떼 계열: `--latte`(#B8A48E) / `--latte-light`(#D4C8B8) / `--latte-dark`(#8C7B68)
- 기타: `--walnut-light`(#8C7A6A) / `--walnut-dark`(#3D2A1A) / `--light-gray`(#7D7269) / `--white`(#FFFFFF)
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
- 배포: 원본 repo에 git index.lock 문제 발생 시, 별도 deploy 디렉토리에서 `git init → fetch → checkout → rsync → push` 방식으로 우회하라. (`/sessions/.../bymomo-deploy/` 패턴)
- GitHub repo: `https://github.com/sseo8465-bit/ByMOMO` (main 브랜치 push → Vercel 자동 배포)

## External References

- **디자인 기준**: `docs/v3-aesop-design-reference.md` — 새 컴포넌트 추가, 색상/폰트/에러 처리, 카피 톤 결정 시 이 문서를 먼저 확인하라.
- **Next.js 에이전트 규칙**: `AGENTS.md` — Next.js 15의 breaking changes에 대한 경고. 코드 작성 전 `node_modules/next/dist/docs/`의 가이드를 참조하라고 지시함.
- **와이어프레임**: `../website/wireframe-v2.1.html` — UI 구조/레이아웃 판단 시 참조하라.
- **브랜드 보이스**: `../brand.identity/브랜드 비주얼 가이드.html` — 카피 톤, 슬로건, 용어 기준.
- **Mock 데이터**: `src/shared/mock/products.ts` — 상품 데이터 변경/추가 시 여기를 수정하라.
- **Supabase 클라이언트**: `src/lib/supabase.ts` — Supabase 연동 시 이 파일의 `isSupabaseConfigured` 가드 패턴을 따르라.
- **배포**: Vercel 자동 배포 (GitHub main 브랜치 push → 자동 빌드). 수동 배포 불필요.
- **비개발자 수정 매뉴얼**: `../bymomo-web-수정-매뉴얼.md` — 서영이 직접 카피/가격을 수정할 때 참조하는 가이드.
- **관리자 권한 설정**: `docs/admin-auth-setup-guide.md` — admin 역할 부여 단계별 가이드 (비개발자용).
- **서버사이드 Supabase**: `src/lib/supabase-server.ts` — middleware.ts, Server Component 전용. `checkIsAdmin()` 서버 검증 함수 포함.

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

### 🚨 [Critical] 카피 템플릿 리터럴 조사 중복 (2026-03-26 발생)
- **증상**: `${name}를 위해 ${phrase}` 템플릿에서, `phrase`에도 "~를 위해"가 포함되어 "모모를 위해 편안한 하루를 위해 골라본 간식" 출력
- **원인**: CURATION_PHRASES와 템플릿 문자열의 조사가 독립적으로 관리되어, 조합 시 중복 발생
- **올바른 패턴**: 매핑 테이블의 값과 템플릿 문자열을 조합한 **최종 출력 문장**을 반드시 검증하라. 동적 치환 결과를 눈으로 확인하지 않고 배포하지 마라.
- **발생일**: 2026-03-26, 사용자 QA에서 발견 → 긴급 수정

### ⚠️ 카피 동일 단어 과용 (2026-03-26 발생)
- **증상**: "골라드릴게요", "골라봤어요", "골라본" 등 "골라" 계열이 사이트 전체에서 5회 이상 노출
- **원인**: 브랜드 보이스 용어 규칙("맞춤" → "골라봤어요")을 기계적으로 적용하여 다변화 없이 동일 표현 반복
- **올바른 패턴**: 같은 페이지 내 동일 어근 2회 이내로 제한. "골라봤어요" 외에 "찾아드릴게요", "준비했어요" 등으로 다변화하라.

### ⚠️ git index.lock 파일 삭제 불가 (Cowork 환경)
- **증상**: `.git/index.lock` 파일이 존재하여 git 명령어 실패. `rm`, `chmod`, `mv`, `truncate` 모두 "Operation not permitted"
- **원인**: Cowork VM 환경에서 특정 파일 삭제 권한이 제한됨
- **해결**: 별도 디렉토리에서 `git init → git fetch → git checkout` 후 rsync로 파일 동기화하여 push하라.

### ⚠️ `formatPrice` 유틸 중복 — 공유 유틸로 추출 필요
- **현재 상태**: `formatPrice(amount: number): string` 함수가 `cart/ClientPage.tsx`와 `checkout/ClientPage.tsx`에 각각 별도 정의되어 있다. 동일한 로직이 중복됨.
- **향후 대응**: `shared/utils/format.ts` 등으로 추출하여 단일 소스로 관리하라. 새 페이지에서 가격 포맷이 필요하면 복사하지 말고 공유 유틸을 만들어라.
- **발견일**: 2026-03-27, 코드베이스 스캔에서 발견

### ⚠️ `page.tsx` vs `ClientPage.tsx` 홈 예외 주의
- **증상**: 홈 `page.tsx`가 Server Component에서 직접 UI를 렌더링하는 것을 보고, 다른 페이지도 같은 방식으로 만들면 `useState` 등 클라이언트 훅 사용 시 빌드 에러 발생.
- **원인**: 홈은 정적 콘텐츠만 렌더링하여 Server Component로 충분하지만, 대부분의 페이지는 클라이언트 훅이 필요하다.
- **올바른 패턴**: 홈을 참고하지 말고 `shop/`, `recommend/`, `cart/` 등의 `page.tsx → ClientPage.tsx` 분리 패턴을 따르라.

### ⚠️ Supabase placeholder 상태에서 API 호출 금지
- **증상**: `src/lib/supabase.ts`에서 환경변수 미설정 시 placeholder URL(`https://placeholder.supabase.co`)로 클라이언트가 생성됨. 이 상태에서 API 호출 시 네트워크 에러.
- **올바른 패턴**: Supabase API 호출 전 `isSupabaseConfigured === true`인지 반드시 확인하라. `false`면 Mock 데이터로 fallback하라.

### 🚨 [Critical] `plus.unsplash.com` — next.config.mjs remotePatterns 미등록 (2026-03-27 발생)
- **증상**: `GiftPreview.tsx`에서 `plus.unsplash.com/premium_photo-...` URL 사용 → Next.js Image 컴포넌트가 이미지를 로드하지 못함. Vercel 배포 후 깨진 이미지로 표시.
- **원인**: `next.config.mjs`의 `images.remotePatterns`에 `images.unsplash.com`만 등록, `plus.unsplash.com` 미등록.
- **올바른 패턴**: 새 이미지 호스트를 추가할 때 반드시 `next.config.mjs`의 `remotePatterns`에 해당 도메인을 등록하라. 또는 외부 이미지 의존도를 줄이고 CSS/SVG 기반 비주얼로 대체하라.
- **대응**: GiftPreview는 외부 이미지 대신 pure CSS 구현으로 전환 예정 (2026-03-30 작업 시작).

### ⚠️ 와이어프레임-코드 간 CTA 카피 불일치 주의 (2026-03-30 발생)
- **증상**: 와이어프레임(wireframe-v2.1)에는 "모모의 맞춤 간식 보기"로 되어 있으나, 코드는 "를 위한 간식 보기"로 변경됨. 브랜드 보이스 QA 반영 과정에서 코드만 수정하고 와이어프레임은 미갱신.
- **원인**: 카피 변경 워크플로에 와이어프레임 동기화 단계가 없었음.
- **올바른 패턴**: 카피를 코드에서 수정하면, 반드시 **와이어프레임 HTML(`../website/wireframe-v2.1.html` 또는 `../Petfood.project/wireframe-v2.1-접근성수정중.html`)도 동일하게 갱신**하라. 카피 QA 체크리스트(위 섹션)에 "와이어프레임 동기화 여부"를 추가로 확인하라.
- **영향 범위**: CTA, 헤딩, 서브카피 등 사용자에게 노출되는 모든 문구에 적용.

### ⚠️ Unsplash 상품 이미지 선정 기준 (2026-03-26 확립)
- **주원료 일치 필수**: 상품의 주원료(오리, 연어, 소고기 등)와 이미지의 주요 피사체가 일치해야 한다. 보조 재료(블루베리, 단호박)만 보이는 이미지는 고객 혼란 유발.
- **생고기 비주얼 금지**: 생고기·생가금류 이미지는 프리미엄 수제간식 브랜드 톤과 부적합. Aesop 스타일 미니멀 웜 크림/베이지 톤 배경 + 완성된 간식 형태가 목표.
- **URL 형식**: `https://images.unsplash.com/photo-{timestamp}-{hash}?w=600&h=500&fit=crop&crop=center` — w/h/fit/crop 파라미터 통일.
- **프리미엄 사진 주의**: `plus.unsplash.com/premium_photo-` 도메인은 Unsplash+ 유료 사진이므로 사용 금지. 무료 사진만 사용하라.
- **한계**: "건조 간식 + 재료 가니쉬 + 밝은 배경" 조합은 Unsplash에 존재하지 않음 → AI 이미지 생성 또는 실제 촬영 필요.

### ⚠️ 마케팅 동의 필드 분리 주의 (2026-03-30 추가)
- **패턴**: `register/ClientPage.tsx`에서 `agreedToMarketingSms` + `agreedToMarketingEmail` 두 개 필드로 분리 관리
- **주의**: 비회원 주문, 프로필 수정 등 다른 폼에서 마케팅 동의가 필요할 때 반드시 SMS/이메일 분리 패턴을 따르라. 단일 `agreedToMarketing` 사용 금지.
- **전체 동의 로직**: `allAgreed = agreedToTerms && agreedToPrivacy && agreedToMarketingSms && agreedToMarketingEmail` (4개 항목)

### ⚠️ 개인정보 동의 거부 시 가입불가 고지 필수 (2026-03-30 추가)
- **근거**: 개인정보보호법 제16조 3항 — 필수 동의 거부 시 서비스 제한이 있음을 반드시 고지해야 함
- **구현**: `PRIVACY_POLICY` 텍스트 최하단에 "※ 동의를 거부할 수 있으나 거부시 회원 가입이 불가능합니다." 문구 포함
- **법정 보유기간 근거**: 전자상거래법 제6조 조문 번호가 각 항목에 병기되어 있는지 확인하라
