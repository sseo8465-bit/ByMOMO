// ── Supabase 클라이언트 초기화 ──
// .env.local에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY를 넣으면 작동
// 값이 없으면 placeholder URL로 클라이언트를 생성 (API 호출 시 에러 반환)
// Supabase Dashboard → Settings → API 에서 값 확인

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

/** Supabase 환경 변수가 실제로 설정되어 있는지 여부 */
export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://YOUR_PROJECT.supabase.co' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
