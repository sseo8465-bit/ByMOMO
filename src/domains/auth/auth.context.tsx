'use client';

// 인증 컨텍스트 — 카카오 로그인 SDK 연동
// 카카오 SDK를 통해 로그인/로그아웃 기능을 관리하고,
// 로그인한 사용자의 정보(닉네임, 이메일 등)를 앱 전체에 제공한다.
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { KakaoUser, AuthState } from './auth.types';

// ── 카카오 SDK 타입 정의 ──
// 카카오에서 돌아오는 데이터의 구조를 미리 정해두면
// 나중에 예상 못한 에러를 방지할 수 있다.
interface KakaoProfile {
  nickname?: string;
  profile_image_url?: string;
}

interface KakaoAccount {
  profile?: KakaoProfile;
  email?: string;
}

interface KakaoUserResponse {
  id: number;
  kakao_account?: KakaoAccount;
}

interface KakaoError {
  error: string;
  error_description?: string;
}

// 카카오 SDK가 window.Kakao로 로드되므로 타입을 선언
interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Auth: {
    login: (options: {
      success: () => void;
      fail: (error: KakaoError) => void;
    }) => void;
    logout: (callback: () => void) => void;
    getAccessToken: () => string | null;
  };
  API: {
    request: (options: {
      url: string;
      success: (response: KakaoUserResponse) => void;
      fail: (error: KakaoError) => void;
    }) => void;
  };
}

declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}

interface AuthContextType extends AuthState {
  loginWithKakao: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
  });

  // 카카오 SDK 초기화
  useEffect(() => {
    const initKakao = () => {
      if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
        if (KAKAO_APP_KEY) {
          window.Kakao.init(KAKAO_APP_KEY);
        }
      }
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    };

    // SDK 스크립트 로드 후 초기화
    if (window.Kakao) {
      initKakao();
    } else {
      const checkInterval = setInterval(() => {
        if (window.Kakao) {
          clearInterval(checkInterval);
          initKakao();
        }
      }, 100);

      // 5초 후 타임아웃
      setTimeout(() => {
        clearInterval(checkInterval);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }, 5000);
    }
  }, []);

  const loginWithKakao = useCallback(() => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      console.warn('Kakao SDK가 초기화되지 않았습니다.');
      return;
    }

    window.Kakao.Auth.login({
      success: () => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res: KakaoUserResponse) => {
            // 카카오에서 받아온 사용자 정보 추출
            const kakaoAccount = res.kakao_account;
            const profile = kakaoAccount?.profile;

            const user: KakaoUser = {
              id: res.id,
              nickname: profile?.nickname || '사용자',
              profileImage: profile?.profile_image_url || null,
              email: kakaoAccount?.email || null,
            };

            setAuthState({
              isLoggedIn: true,
              user,
              isLoading: false,
            });
          },
          fail: (error: KakaoError) => {
            console.error('카카오 사용자 정보 요청 실패:', error);
          },
        });
      },
      fail: (error: KakaoError) => {
        console.error('카카오 로그인 실패:', error);
      },
    });
  }, []);

  const logout = useCallback(() => {
    if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
      window.Kakao.Auth.logout(() => {
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false,
        });
      });
    } else {
      setAuthState({
        isLoggedIn: false,
        user: null,
        isLoading: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginWithKakao,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
