-- ──────────────────────────────────────────────
-- By MOMO — Supabase RPC 함수 (SQL Editor에서 실행)
-- ──────────────────────────────────────────────
-- 1. check_email_exists: 회원가입 시 이메일 중복 체크
-- 2. find_email_by_name_phone: 아이디 찾기 (이름+연락처 → 마스킹 이메일)
--
-- 실행 방법:
--   Supabase Dashboard → SQL Editor → 이 파일 내용 전체 복사 → Run
--
-- 보안:
--   - SECURITY DEFINER: 함수 소유자 권한으로 auth.users 접근
--   - SET search_path = '': search_path injection 방지
--   - pg_sleep: 자동화 스크립트 억제 (의도적 지연)
--   - 입력값 길이 제한: 비정상 입력 차단
--   - 마스킹: find_email_by_name_phone은 원본 이메일 미반환
-- ──────────────────────────────────────────────


-- ============================================
-- 1) check_email_exists
-- ============================================
-- 용도: register/ClientPage.tsx에서 이메일 입력 후 blur 시 중복 체크
-- 호출: supabase.rpc('check_email_exists', { check_email: 'user@example.com' })
-- 반환: true(이미 존재) / false(사용 가능)
--
-- 보안 고려:
--   - 이메일 열거 공격 완화: 0.2초 의도적 지연으로 대량 조회 비용 증가
--   - 이메일 형식/길이 검증으로 비정상 입력 차단
--   - 실제 운영에서 추가 rate limit이 필요하면 Supabase Edge Function 래핑 권장

CREATE OR REPLACE FUNCTION public.check_email_exists(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- 입력값 검증: NULL, 빈 문자열, 비정상 길이 차단
  IF check_email IS NULL OR length(trim(check_email)) < 5 OR length(trim(check_email)) > 254 THEN
    RETURN FALSE;
  END IF;

  -- 기본 이메일 형식 검증 (@ 포함 여부)
  IF position('@' IN trim(check_email)) = 0 THEN
    RETURN FALSE;
  END IF;

  -- 자동화 스크립트 억제: 0.2초 지연
  PERFORM pg_sleep(0.2);

  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email = lower(trim(check_email))
  );
END;
$$;

-- anon: 비로그인 사용자(회원가입 폼)에서 호출
-- authenticated: 로그인 사용자도 호출 가능 (프로필 변경 등 향후 확장)
GRANT EXECUTE ON FUNCTION public.check_email_exists(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.check_email_exists(TEXT) TO authenticated;


-- ============================================
-- 2) find_email_by_name_phone
-- ============================================
-- 용도: find-id/ClientPage.tsx에서 이름+연락처로 이메일(아이디) 찾기
-- 호출: supabase.rpc('find_email_by_name_phone', { search_name: '홍길동', search_phone: '010-1234-5678' })
-- 반환: 마스킹된 이메일 문자열 (예: 'h***@example.com') 또는 NULL(매칭 없음)
--
-- 마스킹 규칙:
--   - 로컬파트 1자 이하: 전부 * 처리 (예: a@... → *@...)
--   - 로컬파트 2자 이상: 첫 글자 + *** (예: hello@... → h***@...)
--
-- 보안 고려:
--   - 브루트포스 완화: 0.5초 의도적 지연 (이메일 열거보다 민감한 개인정보 조합)
--   - 이름/전화번호 길이 제한으로 비정상 입력 차단
--   - 전화번호 형식 검증 (010-XXXX-XXXX)
--
-- 참고: Supabase auth.users의 메타데이터 컬럼명은 raw_user_meta_data (언더스코어 구분)
--       register API route에서 user_metadata로 저장 → Supabase가 raw_user_meta_data에 매핑

CREATE OR REPLACE FUNCTION public.find_email_by_name_phone(search_name TEXT, search_phone TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  found_email TEXT;
  local_part TEXT;
  domain_part TEXT;
  masked TEXT;
  clean_name TEXT;
  clean_phone TEXT;
BEGIN
  -- 입력값 정리
  clean_name := trim(search_name);
  clean_phone := trim(search_phone);

  -- 입력값 검증: NULL, 빈 문자열, 비정상 길이
  IF clean_name IS NULL OR length(clean_name) < 2 OR length(clean_name) > 50 THEN
    RETURN NULL;
  END IF;

  IF clean_phone IS NULL OR length(clean_phone) < 12 OR length(clean_phone) > 13 THEN
    -- 010-1234-5678 = 13자, 01012345678 = 11자 (하이픈 없을 경우 대비해 12~13)
    RETURN NULL;
  END IF;

  -- 전화번호 형식 검증 (010으로 시작하는지)
  IF left(clean_phone, 3) <> '010' THEN
    RETURN NULL;
  END IF;

  -- 브루트포스 억제: 0.5초 지연 (이름+전화번호 조합은 더 민감)
  PERFORM pg_sleep(0.5);

  -- user_metadata에서 name, phone이 일치하는 유저의 이메일 조회
  SELECT u.email INTO found_email
  FROM auth.users u
  WHERE u.raw_user_meta_data ->> 'name' = clean_name
    AND u.raw_user_meta_data ->> 'phone' = clean_phone
  LIMIT 1;

  -- 매칭 없으면 NULL 반환
  IF found_email IS NULL THEN
    RETURN NULL;
  END IF;

  -- 이메일 마스킹 처리
  local_part := split_part(found_email, '@', 1);
  domain_part := split_part(found_email, '@', 2);

  IF length(local_part) <= 1 THEN
    masked := repeat('*', length(local_part)) || '@' || domain_part;
  ELSE
    masked := left(local_part, 1) || '***' || '@' || domain_part;
  END IF;

  RETURN masked;
END;
$$;

-- anon: 비로그인 사용자(아이디 찾기 폼)에서 호출
-- authenticated: 로그인 사용자도 호출 가능
GRANT EXECUTE ON FUNCTION public.find_email_by_name_phone(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.find_email_by_name_phone(TEXT, TEXT) TO authenticated;
