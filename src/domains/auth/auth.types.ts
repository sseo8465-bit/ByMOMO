// ── 인증 관련 타입 정의 ──

// 카카오 로그인 사용자
export interface KakaoUser {
  id: number;
  nickname: string;
  profileImage: string | null;
  email: string | null;
}

// By MOMO 자체 회원 (Supabase Auth)
export interface ByMomoUser {
  id: string;            // Supabase auth.users.id (UUID)
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  dogName: string | null;
}

// 통합 사용자 타입 — 로그인 방식에 따라 분기
export type AppUser =
  | { provider: 'kakao'; data: KakaoUser }
  | { provider: 'email'; data: ByMomoUser };

// 인증 상태
export interface AuthState {
  isLoggedIn: boolean;
  user: AppUser | null;
  isLoading: boolean;
}

// 회원가입 입력 데이터
export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  dogName?: string;
}
