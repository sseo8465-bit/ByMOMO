// ──────────────────────────────────────────────
// 서버사이드 Supabase 클라이언트 — Next.js App Router 전용
// ──────────────────────────────────────────────
// 사용처: middleware.ts, admin/page.tsx (Server Component)
// @supabase/ssr 패키지로 쿠키 기반 세션 관리
// 클라이언트 사이드에서는 사용 금지 — src/lib/supabase.ts 사용할 것
// ──────────────────────────────────────────────

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Server Component / Route Handler 전용 Supabase 클라이언트 생성
 * 쿠키를 읽고 쓸 수 있어 세션 유지가 가능
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component에서 setAll 호출 시 무시 (읽기 전용)
          // Middleware에서 세션 리프레시를 처리하므로 안전
        }
      },
    },
  });
}

/**
 * 현재 로그인된 사용자가 admin인지 확인
 * app_metadata.role === 'admin' 여부를 서버에서 검증
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return false;
    return user.app_metadata?.role === 'admin';
  } catch {
    return false;
  }
}
