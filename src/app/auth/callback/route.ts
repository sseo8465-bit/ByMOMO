// ──────────────────────────────────────────────
// 인증 콜백 라우트 — Supabase Auth 코드 교환
// ──────────────────────────────────────────────
// Supabase가 이메일 인증·비밀번호 재설정 링크에 포함시킨 auth code를
// 세션 쿠키로 교환하는 역할.
//
// 흐름:
// 1. 고객이 인증 메일의 링크 클릭
// 2. Supabase가 https://bymomo.vercel.app/auth/callback?code=XYZ 로 리다이렉트
// 3. 이 라우트가 code를 세션으로 교환
// 4. next 파라미터에 따라 적절한 페이지로 리다이렉트
//
// 비밀번호 재설정: ?next=/reset-password 로 리다이렉트
// 일반 로그인/가입 확인: / 로 리다이렉트
// ──────────────────────────────────────────────

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // next 파라미터: 코드 교환 후 이동할 경로 (기본: 홈)
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // auth code → 세션 쿠키로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 코드 교환 성공 → 지정된 경로로 이동
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // 코드가 없거나 교환 실패 → 로그인 페이지로 이동
  return NextResponse.redirect(new URL('/my', origin));
}
