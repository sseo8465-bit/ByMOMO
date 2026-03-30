# 관리자 권한 설정 가이드

> 이 가이드는 By MOMO 관리자 페이지(/admin) 접근 권한을 설정하는 방법입니다.
> 비개발자도 따라할 수 있도록 단계별로 작성되어 있습니다.

---

## 변경된 점 (2026-03-30)

| 이전 (위험) | 이후 (안전) |
|-------------|-------------|
| 비밀번호 `momo2026`이 브라우저 소스코드에 노출 | 비밀번호가 코드 어디에도 없음 |
| 누구나 URL 직접 입력으로 /admin 접근 가능 | Supabase 로그인 + admin 역할 필요 |
| 클라이언트에서 문자열 비교 | 서버에서 JWT 토큰 검증 (위변조 불가) |

---

## 서영이 해야 할 일: Supabase에서 admin 역할 부여

### Step 1. Supabase Dashboard 접속

1. 브라우저에서 **https://supabase.com/dashboard** 접속
2. 로그인 (GitHub 또는 이메일)
3. 프로젝트 목록에서 **By MOMO 프로젝트** 클릭

### Step 2. 내 계정의 User ID 확인

1. 왼쪽 메뉴에서 **Authentication** 클릭 (사람 아이콘)
2. **Users** 탭 클릭
3. 가입한 이메일 주소를 찾아서 해당 행의 **User UID** 복사
   - UUID 형태: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - 행을 클릭하면 상세 정보에서 복사 가능

### Step 3. SQL Editor에서 admin 역할 부여

1. 왼쪽 메뉴에서 **SQL Editor** 클릭 (터미널 아이콘)
2. **New query** 버튼 클릭
3. 아래 SQL을 붙여넣기:

```sql
-- By MOMO 관리자 역할 부여
-- ⚠️ 아래 'YOUR_USER_ID_HERE' 부분을 Step 2에서 복사한 User UID로 교체하세요

UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE id = 'YOUR_USER_ID_HERE';
```

4. `YOUR_USER_ID_HERE` 부분을 Step 2에서 복사한 UUID로 교체
5. **Run** 버튼 클릭 (또는 Cmd+Enter)
6. "Success. No rows returned" 메시지가 뜨면 완료

### Step 4. 적용 확인

1. 다시 **Authentication** → **Users** 이동
2. 내 이메일 클릭 → 상세 정보 확인
3. `app_metadata` 항목에 `"role": "admin"` 이 보이면 성공

---

## 관리자 페이지 접근 방법

1. By MOMO 사이트에서 **이메일로 로그인**
2. 마이페이지 하단의 "운영" 텍스트를 **5회 탭**
3. admin 권한이 확인되면 자동으로 /admin 페이지로 이동

> 비밀번호 입력 없이, 로그인 + 역할 확인만으로 접근됩니다.

---

## 보안 구조 (참고)

```
[사용자] → "운영" 5회 탭
    ↓
[클라이언트] isAdmin 확인 (app_metadata.role)
    ↓ (admin이면)
[브라우저] /admin 페이지 요청
    ↓
[서버 Middleware] Supabase JWT 검증 + role 확인
    ↓ (통과)
[서버 page.tsx] checkIsAdmin() 이중 검증
    ↓ (통과)
[관리자 대시보드] 렌더링
```

3중 보호:
- 1차: 클라이언트 — "운영" 이스터에그 + isAdmin 체크
- 2차: Middleware — 서버에서 JWT 토큰 검증 (가장 강력)
- 3차: Server Component — checkIsAdmin() 재검증

URL을 직접 입력해도 Middleware에서 차단됩니다.

---

## 추가 관리자 등록이 필요한 경우

다른 사람에게 관리자 권한을 주고 싶다면:
1. 해당 사용자가 먼저 By MOMO 사이트에서 **이메일로 회원가입**
2. Supabase Dashboard → Authentication → Users에서 해당 이메일의 User UID 복사
3. Step 3의 SQL에서 UUID만 바꿔서 실행

---

## 관리자 권한 해제

```sql
-- admin 역할 제거
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data - 'role'
WHERE id = 'USER_ID_HERE';
```

---

## 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| "운영" 5회 탭해도 "로그인이 필요합니다" 표시 | 로그인하지 않은 상태 | 이메일로 먼저 로그인 |
| "관리자 권한이 없습니다" 표시 | app_metadata에 role 미설정 | Step 3의 SQL 재실행 |
| /admin URL 직접 입력 시 /my로 이동 | 정상 동작 (Middleware 보호) | "운영" 탭으로 접근 |
| 로그인 후에도 admin 안 됨 | JWT 캐시 (이전 세션) | 로그아웃 → 재로그인 |
