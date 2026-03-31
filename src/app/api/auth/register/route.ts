// ──────────────────────────────────────────────
// 회원가입 API Route — service_role 키로 유저 생성 + 이메일 자동 인증
// ──────────────────────────────────────────────
// 사용처: register/ClientPage.tsx → POST /api/auth/register
// Supabase admin.createUser()로 유저를 생성하면:
//   1) email_confirm: true → 이메일 인증 메일 발송 없이 즉시 가입 완료
//   2) 클라이언트에서 signInWithPassword()로 바로 로그인 가능
// 보안: service_role 키는 서버에서만 사용 (클라이언트 노출 없음)
// ──────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── service_role 키로 Admin 클라이언트 생성 ──
// SUPABASE_SERVICE_ROLE_KEY는 .env.local에만 존재 (NEXT_PUBLIC_ 아님 → 클라이언트 노출 안 됨)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ── 한글 에러 메시지 매핑 ──
// Supabase 원문 에러를 브랜드 톤의 친절한 안내로 변환
const ERROR_MESSAGES: Record<string, string> = {
  'already_exists': '이미 가입된 이메일입니다. 로그인을 이용해 주세요.',
  'invalid_email': '이메일 형식을 다시 확인해 주시겠어요?',
  'weak_password': '안전한 가입을 위해 영문과 숫자를 포함하여 8자 이상으로 설정해 주세요.',
  'service_unavailable': '회원가입 서비스가 잠시 점검 중입니다. 잠시 후 다시 시도해 주세요.',
};

// ── 에러 메시지 변환 함수 ──
function getKoreanErrorMessage(error: { message?: string; code?: string }): string {
  const msg = error.message || '';
  const code = error.code || '';

  if (msg.includes('already') || msg.includes('duplicate') || code === 'email_exists') {
    return ERROR_MESSAGES.already_exists;
  }
  if (msg.includes('password') || msg.includes('weak')) {
    return ERROR_MESSAGES.weak_password;
  }
  if (msg.includes('email') && msg.includes('invalid')) {
    return ERROR_MESSAGES.invalid_email;
  }
  return '회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
}

// ── 요청 바디 타입 ──
interface RegisterBody {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  dogName?: string;
}

export async function POST(request: NextRequest) {
  // ── 환경 변수 확인 ──
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.service_unavailable },
      { status: 503 }
    );
  }

  // ── Admin 클라이언트 생성 ──
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ── 요청 바디 파싱 ──
  let body: RegisterBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: '요청 형식이 올바르지 않습니다.' },
      { status: 400 }
    );
  }

  const { email, password, name, phone, address, dogName } = body;

  // ── 필수 필드 검증 ──
  if (!email || !password || !name || !phone || !address) {
    return NextResponse.json(
      { success: false, error: '필수 항목을 모두 입력해 주세요.' },
      { status: 400 }
    );
  }

  // ── admin.createUser() 호출 ──
  // email_confirm: true → 이메일 인증 없이 즉시 활성화
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      phone,
      address,
      dogName: dogName || '',
    },
  });

  if (error) {
    // Supabase 에러를 한글로 변환하여 응답
    const statusCode = error.message?.includes('already') ? 409 : 400;
    return NextResponse.json(
      { success: false, error: getKoreanErrorMessage(error) },
      { status: statusCode }
    );
  }

  // ── 가입 성공 ──
  return NextResponse.json({
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || '',
    },
  });
}
