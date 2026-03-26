# By MOMO v3 이솝 스타일 디자인 레퍼런스

> 이 문서는 By MOMO 웹사이트의 v3 리모델링에 적용되는 이솝(Aesop) 감성 디자인 기준을 정리한다.
> 새 페이지 추가, 컴포넌트 수정, 디자인 리뷰 시 이 문서를 기준으로 판단한다.

---

## 1. 컬러 시스템

### 브랜드 컬러 팔레트 (CSS Custom Properties)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--warm-white` | #FDFAF5 | 페이지 배경, 카드 배경 |
| `--cream` | #F5F0E8 | 섹션 배경 (히어로 헤더, 선택된 상태, 선물 프리뷰) |
| `--oatmeal` | #EDE6D8 | 구분선, 비선택 border, 약한 배경 |
| `--walnut` | #6B5344 | 주요 액션 컬러 (버튼, 활성 상태, 에러 강조) |
| `--walnut-dark` | #4A3828 | 호버 상태, 토스트 배경, Footer 배경 |
| `--charcoal` | #2C2C2C | 본문 텍스트 |
| `--warm-gray` | #6B6560 | 보조 텍스트, 비활성 상태 |
| `--warm-taupe` | #8A7D6F | 아이브로우 레이블, Footer 정보 |
| `--warm-taupe-light` | #C8BEB3 | 플레이스홀더, 비활성 버튼 텍스트 |

### 컬러 사용 원칙

- **빨간색(#C62828, #FFF5F5 등) 절대 사용 금지** — 에러 표시도 `--walnut` 인라인 텍스트로 처리
- 배경은 warm-white → cream → oatmeal 순으로 깊이감 표현
- 강조는 walnut 한 가지로 통일 (다중 강조색 없음)

---

## 2. 타이포그래피

### 폰트 3종 체계

| 역할 | 폰트 | CSS 변수 | 사용처 |
|------|-------|----------|--------|
| 세리프 (감성) | Cormorant Garamond | `--font-serif` | 브랜드명, 헤드라인, 풀 쿼트, 반려견 이름, 상품명 |
| 본문 (가독성) | Pretendard Variable | `--font-sans` | 본문 텍스트, 설명 |
| UI (기능) | DM Sans | `--font-ui` | 버튼, 라벨, 가격, 에러 메시지, 네비게이션 |

### 사이즈 가이드

| 용도 | 크기 | 폰트 | Weight | 비고 |
|------|------|-------|--------|------|
| 히어로 제목 | 28px | serif | medium | leading-[1.5] |
| 반려견 이름 (추천 헤더) | 36px | serif | semibold | leading-[1.2] |
| 섹션 제목 | 22px | serif | semibold 또는 medium | |
| 상품명 (카드) | 18px | serif | medium | leading-[1.4] |
| 상품명 (리스트) | 12~14px | serif/sans | medium | |
| 본문 | 15px | sans | normal | leading-[1.7] |
| 아이브로우 레이블 | 10~11px | UI | semibold | tracking-[0.15em], uppercase |
| 버튼 텍스트 | 13~15px | UI | medium | tracking-[0.03em] |
| 에러 메시지 | 11px | UI | normal | walnut 컬러 |
| 퀵 장바구니 텍스트 | 11px | UI | **light (300)** | tracking-[0.08em] |

### 아이브로우 레이블 패턴

이솝에서 가져온 핵심 패턴. 섹션 시작 시 영문 대문자 소형 레이블로 맥락을 부여한다.

```jsx
<p className="font-[var(--font-ui)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--warm-taupe)]">
  Our Story
</p>
```

적용 예: `Our Story`, `Best Picks`, `Brand Philosophy`, `Customer Support`, `Order Summary`, `Shipping`, `Payment`, `AI Recommendation`, `Gift Package`

---

## 3. 버튼 & 인터랙션

### 버튼 5종 변형 (Button.tsx)

| 변형 | 배경 | 텍스트 | 용도 |
|------|------|--------|------|
| primary | walnut | cream | 주요 CTA (결제, 다음) |
| secondary | transparent + walnut border | walnut | 보조 CTA (브랜드 스토리 보기) |
| kakao | #FEE500 | #191919 | **카카오 로그인 전용** (문의 버튼에 사용 금지) |
| soft | cream | walnut | 가벼운 액션 (맞춤 간식 찾기) |
| ghost | transparent | warm-gray | 건너뛰기, 부가 링크 |

### 이솝 퀵 장바구니 텍스트 버튼

이솝의 핵심 UX 패턴. 버튼처럼 보이지 않는 텍스트가 실제로는 장바구니 담기 기능을 한다.

```
규격:
- 배경: transparent (bg-transparent)
- 폰트: DM Sans (--font-ui)
- 크기: 11px
- 굵기: Light (300) — 기본 상태
- 자간: 0.08em
- 클릭 여백: py-3 px-6 (터치 최소 44px 확보)
- 클릭 후: walnut 컬러 + medium(500)으로 1초간 "장바구니에 추가됨" 표시 후 원복
```

```jsx
<button className="inline-block py-3 px-6 bg-transparent">
  <span className="font-[var(--font-ui)] text-[11px] tracking-[0.08em] text-[var(--warm-gray)]"
        style={{ fontWeight: 300 }}>
    장바구니 담기 — ₩12,000
  </span>
</button>
```

### 비활성 버튼 처리

- 배경: `--oatmeal`
- 텍스트: `--warm-taupe-light`
- cursor: `not-allowed`
- 빨간색 경고, 흔들림 애니메이션 등 자극적 피드백 사용 금지

---

## 4. 레이아웃 & 공간

### 기본 구조

- 최대 너비: 430px (모바일 퍼스트)
- 페이지 패딩: `px-6` (좌우 24px)
- 섹션 간 간격: `py-10` (상하 40px)
- 카드 내부 패딩: `p-5` (20px)

### 간격 원칙

- **넉넉한 여백이 이솝 감성의 핵심.** 요소 간 간격을 줄이고 싶은 충동이 오면 오히려 늘려라.
- 섹션 사이: `mb-10` (40px) 이상
- 카드 리스트: `gap-10` (추천 상품 간 40px)
- 아이브로우 레이블 → 제목: `mb-2~3`
- 제목 → 본문: `mb-4~5`
- 구분선: `h-px bg-[var(--oatmeal)]` 또는 `border-t border-[var(--oatmeal)]`

### 곡률 (Border Radius)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--radius-soft` | 6px | 이미지 전역, 입력 필드 |
| `--radius-card` | 8px | 상품 카드, 콘텐츠 블록 |
| `rounded-lg` | 8px | 버튼, 결제 수단 카드 |
| `rounded-xl` | 12px | CS 문의 섹션 |
| `rounded-[10px]` | 10px | 크림 배경 카드 (철학 카드, 주문 요약) |

---

## 5. 전환 & 애니메이션

### 전역 전환

```css
a, button, input, select, textarea {
  transition: all 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

### 키프레임 애니메이션

| 이름 | 용도 | 동작 |
|------|------|------|
| `fade-in` | 페이지 전환, 요소 등장 | opacity 0→1 + translateY 8px→0, 0.4s |
| `toast-in` | 토스트 알림 | opacity 0→1 + translateY -12px→0, 0.3s |
| `slide-up` | BottomSheet | translateY 100%→0, 0.3s |

### 원칙

- **자극적 애니메이션 금지**: bounce, shake, pulse 등 사용 금지
- 모든 전환은 cubic-bezier(0.25, 0.1, 0.25, 1) — 자연스러운 이징
- 지속 시간: 0.3~0.4s (빠르지도 느리지도 않게)

---

## 6. 폼 & 에러 처리

### 입력 필드 기본 스타일

```
- border: 1px solid var(--oatmeal)
- focus: border-color → var(--walnut)
- 패딩: py-3 px-4
- 폰트: 14px, --font-ui
- 곡률: rounded-lg
```

### 에러 표시 — B단계 전수검토 기준

| 항목 | 규칙 |
|------|------|
| 에러 border | `border-[1.5px] border-[var(--walnut)]` (빨간색 아님) |
| 에러 텍스트 | `text-[11px] text-[var(--walnut)] font-[var(--font-ui)]` |
| 에러 배경 | **없음** (빨간 배경 #FFF5F5 사용 금지) |
| 메시지 톤 | "~알려주세요", "~확인해 주세요" (명령형 금지) |
| 검증 시점 | blur 시 첫 검증 → 이후 실시간 |

### 에러 메시지 예시

```
❌ "이름을 입력해 주세요"        → ⭕ "아이의 이름을 알려주세요."
❌ "전화번호가 잘못되었습니다"   → ⭕ "연락처 형식을 확인해 주세요. (010-0000-0000)"
❌ "주소를 입력해 주세요"        → ⭕ "선물을 전할 주소를 알려주세요."
❌ "견종을 선택해 주세요"        → ⭕ "어떤 친구인지 알려주세요."
```

---

## 7. 커스텀 라디오/체크박스

### 라디오 버튼 (결제 수단)

```
- 크기: 18×18px
- 비선택: border-2 border-[var(--light-gray)]
- 선택: border-[var(--walnut)] bg-[var(--walnut)] + 내부 6×6px cream 원
- 카드 형태: p-3.5 rounded-lg border, 선택 시 cream 배경
```

### 체크박스 (약관 동의)

```
- 크기: 18×18px
- 비선택: border-[1.5px] border-[var(--walnut)]
- 선택: bg-[var(--walnut)] + 흰색 ✓ (10px, bold)
- label: 12px, warm-gray, leading-[1.6]
```

---

## 8. 토스트 알림

```
위치: fixed top-16 left-1/2 -translate-x-1/2 z-50
배경: walnut-dark
텍스트: cream, 13px, --font-ui
곡률: --radius-soft
그림자: shadow-lg
애니메이션: animate-toast (toast-in 0.3s)
자동 닫기: 2초 후
```

---

## 9. 카피라이팅 톤

### 기본 원칙

- 한 문장에 한 가지 이야기만
- 짧게. 여운이 남도록.
- 이모지 사용 금지
- 느낌표(!) 사용 제한 — 1페이지에 1개 이하
- 긴급성 강조 표현 사용 금지 ("지금 바로!", "놓치지 마세요!" 등)

### 톤 레벨

| 맥락 | 톤 | 예시 |
|------|-----|------|
| 헤드라인 | 감성적, 시적 | "내 아이를 위한 단 하나뿐인 선물" |
| CTA | 명확하되 부드럽게 | "맞춤 간식 찾기", "장바구니 보기" |
| 에러 | 정중한 안내 | "배송을 위해 성함을 다시 한번 확인해 주세요." |
| 설명 | 간결, 사실 기반 | "알러지·나이·체중을 확인한 안심 간식만 추천합니다." |
| 빈 상태 | 담백 | "조건에 맞는 상품이 없습니다." |

---

## 10. 컴포넌트별 이솝 패턴 적용표

| 컴포넌트 | 패턴 | 코드 예시 |
|----------|------|-----------|
| 섹션 헤더 | 아이브로우 + 세리프 제목 | `<p uppercase>Our Story</p><h2 serif>세 가지 약속</h2>` |
| 상품 카드 | 이미지 → 세리프 이름 → 설명 → 퀵 장바구니 텍스트 | recommend/page.tsx 참조 |
| 정보 카드 | cream 배경 + 10px 곡률 + p-5 | about/page.tsx 철학 카드 |
| 가격 표시 | ₩ + toLocaleString('ko-KR') + --font-ui + medium | 전 페이지 공통 |
| 구분선 | `h-px bg-[var(--oatmeal)]` 또는 `border-t border-[var(--oatmeal)]` | 전 페이지 공통 |
| sticky CTA | `sticky bottom-0 bg-warm-white border-t border-oatmeal px-6 py-4` | recommend, cart |

---

## 체크리스트: 새 페이지 추가 시

- [ ] 아이브로우 레이블이 있는가? (영문 대문자 10px)
- [ ] 세리프 폰트가 감성 요소에 쓰였는가? (제목, 브랜드명, 인용)
- [ ] UI 폰트가 기능 요소에 쓰였는가? (버튼, 라벨, 가격)
- [ ] 빨간색이 어디에도 없는가?
- [ ] 에러 메시지가 "~알려주세요" / "~확인해 주세요" 패턴인가?
- [ ] 여백이 충분한가? (섹션 간 40px 이상)
- [ ] 이모지가 없는가?
- [ ] 느낌표가 1개 이하인가?
- [ ] 전환 애니메이션이 gentle인가? (bounce/shake 없음)
- [ ] 이미지에 radius-soft가 적용되었는가?
