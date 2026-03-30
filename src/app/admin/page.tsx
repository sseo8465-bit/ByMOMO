// ──────────────────────────────────────────────
// 관리자 페이지 — Server Component (이중 보호)
// ──────────────────────────────────────────────
// 보호 계층:
//   1차: middleware.ts → /admin 접근 시 세션 + role 검증
//   2차: 이 파일 → Server Component에서 checkIsAdmin() 재검증
//   → 둘 중 하나라도 실패하면 /my로 리다이렉트
// ──────────────────────────────────────────────

export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { checkIsAdmin } from '@/lib/supabase-server';
import ClientPage from './ClientPage';

export default async function Page() {
  // ── 서버사이드 admin 권한 이중 검증 ──
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    redirect('/my');
  }

  return <ClientPage />;
}
