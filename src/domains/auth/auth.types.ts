// 인증 관련 타입 정의

export interface KakaoUser {
  id: number;
  nickname: string;
  profileImage: string | null;
  email: string | null;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: KakaoUser | null;
  isLoading: boolean;
}
