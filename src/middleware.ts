// ──────────────────────────────────────────────
// Next.js Middleware — /admin 경로 서버사이드 보호
// ──────────────────────────────────────────────
// 1. Supabase 세션 리프레시 (쿠키 갱신)
// 2. /admin 접근 시 로그인 + admin role 검증
// 3. 미인증/비관리자 → /my 로 리다이렉트
//
// matcher: /admin 경로에만 적용 — 다른 페이지에 영향 없음
// ──────────────────────────────────────────────

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // ── 응답 객체 초기화 ──
  let supabaseResponse = NextResponse.next({ request });

  // ── 서버 Supabase 클라이언트 (쿠키 읽기/쓰기) ──
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 요청 쿠키 업데이트 (세션 리프레시용)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // 응답 재생성 (업데이트된 쿠키 포함)
          supabaseResponse = NextResponse.next({ request });
          // 응답 쿠키에도 세팅 (브라우저에 전달)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ── 세션 리프레시 + 사용자 정보 가져오기 ──
  // getUser()는 서버에서 JWT를 검증하므로 위변조 불가
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── /admin 경로 보호 ──
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 미로그인 또는 admin role이 아닌 경우 차단
    const isAdmin = user?.app_metadata?.role === 'admin';

    if (!user || !isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/my';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

// ── Middleware 적용 범위 ──
// /admin 경로에만 적용하여 다른 페이지(상품, 결제 등)에 영향 없음
export const config = {
  matcher: ['/admin/:path*'],
};
