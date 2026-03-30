'use client';

// ──────────────────────────────────────────────
// 인증 컨텍스트 — Supabase Auth (이메일) + 카카오 SDK (소셜)
// ──────────────────────────────────────────────
// 1. 이메일/비밀번호 → Supabase Auth (signUp, signInWithPassword)
// 2. 카카오 → 기존 SDK 유지 (Supabase OAuth 전환은 Phase 3)
// 3. 세션 복원 → Supabase onAuthStateChange 리스너
// ──────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { AppUser, AuthState, ByMomoUser, KakaoUser, SignUpPayload } from './auth.types';

// ── 카카오 SDK 타입 ──
interface KakaoProfile { nickname?: string; profile_image_url?: string; }
interface KakaoAccount { profile?: KakaoProfile; email?: string; }
interface KakaoUserResponse { id: number; kakao_account?: KakaoAccount; }
interface KakaoError { error: string; error_description?: string; }

interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Auth: {
    login: (options: { success: () => void; fail: (error: KakaoError) => void }) => void;
    logout: (callback: () => void) => void;
    getAccessToken: () => string | null;
  };
  API: {
    request: (options: { url: string; success: (response: KakaoUserResponse) => void; fail: (error: KakaoError) => void }) => void;
  };
}

declare global {
  interface Window { Kakao: KakaoSDK; }
}

// ── Context 타입 ──
interface AuthContextType extends AuthState {
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (payload: SignUpPayload) => Promise<{ success: boolean; error?: string }>;
  loginWithKakao: () => void;
  logout: () => Promise<void>;
  /** 현재 사용자의 표시 이름 (닉네임/이름) */
  displayName: string | null;
  /** 현재 사용자의 이메일 */
  userEmail: string | null;
  /** 현재 사용자가 관리자(admin)인지 여부 — app_metadata.role 기반 */
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '';

// ── Supabase 유저 → ByMomoUser 변환 ──
function mapSupabaseUser(supaUser: { id: string; email?: string; user_metadata?: Record<string, string> }): ByMomoUser {
  const meta = supaUser.user_metadata || {};
  return {
    id: supaUser.id,
    email: supaUser.email || '',
    name: meta.name || '',
    phone: meta.phone || null,
    address: meta.address || null,
    dogName: meta.dogName || null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
  });
  // ── admin 역할 여부 (app_metadata.role === 'admin') ──
  const [isAdmin, setIsAdmin] = useState(false);

  // ── Supabase 세션 복원 + 리스너 ──
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Supabase 미설정 시 로딩만 해제
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    // 최초 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState({
          isLoggedIn: true,
          user: { provider: 'email', data: mapSupabaseUser(session.user) },
          isLoading: false,
        });
        // JWT 내 app_metadata에서 admin role 확인
        setIsAdmin(session.user.app_metadata?.role === 'admin');
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        setIsAdmin(false);
      }
    });

    // 세션 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthState({
          isLoggedIn: true,
          user: { provider: 'email', data: mapSupabaseUser(session.user) },
          isLoading: false,
        });
        // 세션 갱신 시 admin role 재확인
        setIsAdmin(session.user.app_metadata?.role === 'admin');
      } else {
        // 카카오 로그인 상태이면 유지
        setAuthState((prev) => {
          if (prev.user?.provider === 'kakao') return prev;
          return { isLoggedIn: false, user: null, isLoading: false };
        });
        // 카카오 로그인은 admin 아님 (Supabase Auth 전용)
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── 카카오 SDK 초기화 ──
  useEffect(() => {
    const initKakao = () => {
      if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
        if (KAKAO_APP_KEY) window.Kakao.init(KAKAO_APP_KEY);
      }
    };

    if (typeof window !== 'undefined' && window.Kakao) {
      initKakao();
    } else if (typeof window !== 'undefined') {
      const interval = setInterval(() => {
        if (window.Kakao) { clearInterval(interval); initKakao(); }
      }, 100);
      setTimeout(() => clearInterval(interval), 5000);
    }
  }, []);

  // ── 이메일 로그인 (Supabase Auth) ──
  const loginWithEmail = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: '로그인 서비스 준비 중입니다. 카카오 로그인 또는 비회원 주문을 이용해 주세요.' };
    }

    let data, error;
    try {
      ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
    } catch (networkError) {
      return { success: false, error: '네트워크 연결을 확인해 주세요. 잠시 후 다시 시도해 주세요.' };
    }

    if (error) {
      // Supabase 에러 메시지를 브랜드 톤으로 변환
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: '이메일 혹은 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: '이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.' };
      }
      return { success: false, error: '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
    }

    if (data.user) {
      setAuthState({
        isLoggedIn: true,
        user: { provider: 'email', data: mapSupabaseUser(data.user) },
        isLoading: false,
      });
      return { success: true };
    }

    return { success: false, error: '로그인 처리 중 문제가 발생했습니다.' };
  }, []);

  // ── 회원가입 (Supabase Auth + user_metadata) ──
  const signUp = useCallback(async (payload: SignUpPayload): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: '회원가입 서비스 준비 중입니다. 잠시 후 다시 시도해 주세요.' };
    }

    let data, error;
    try {
      ({ data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            name: payload.name,
            phone: payload.phone,
            address: payload.address,
            dogName: payload.dogName || '',
          },
        },
      }));
    } catch (networkError) {
      return { success: false, error: '네트워크 연결을 확인해 주세요. 잠시 후 다시 시도해 주세요.' };
    }

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        return { success: false, error: '이미 가입된 이메일입니다. 로그인을 이용해 주세요.' };
      }
      if (error.message.includes('password')) {
        return { success: false, error: '비밀번호는 8자 이상이어야 합니다.' };
      }
      return { success: false, error: '회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
    }

    // Supabase 이메일 인증이 켜져 있으면 data.user는 있지만 session은 null
    if (data.user && !data.session) {
      return { success: true, error: '인증 메일을 발송했습니다. 메일함을 확인한 후 로그인해 주세요.' };
    }

    // 이메일 인증 OFF인 경우 바로 로그인
    if (data.user && data.session) {
      setAuthState({
        isLoggedIn: true,
        user: { provider: 'email', data: mapSupabaseUser(data.user) },
        isLoading: false,
      });
      return { success: true };
    }

    return { success: false, error: '회원가입 처리 중 문제가 발생했습니다.' };
  }, []);

  // ── 카카오 로그인 (기존 SDK) ──
  const loginWithKakao = useCallback(() => {
    if (typeof window === 'undefined' || !window.Kakao || !window.Kakao.isInitialized()) {
      console.warn('Kakao SDK가 초기화되지 않았습니다.');
      return;
    }

    window.Kakao.Auth.login({
      success: () => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res: KakaoUserResponse) => {
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
              user: { provider: 'kakao', data: user },
              isLoading: false,
            });
          },
          fail: (error: KakaoError) => console.error('카카오 사용자 정보 요청 실패:', error),
        });
      },
      fail: (error: KakaoError) => console.error('카카오 로그인 실패:', error),
    });
  }, []);

  // ── 로그아웃 (Supabase + 카카오 모두 처리) ──
  const logout = useCallback(async () => {
    // Supabase 로그아웃
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }

    // 카카오 로그아웃
    if (typeof window !== 'undefined' && window.Kakao && window.Kakao.Auth.getAccessToken()) {
      window.Kakao.Auth.logout(() => { /* noop */ });
    }

    setAuthState({ isLoggedIn: false, user: null, isLoading: false });
    setIsAdmin(false);
  }, []);

  // ── 파생 값: 표시 이름, 이메일 ──
  const displayName = authState.user
    ? authState.user.provider === 'kakao'
      ? authState.user.data.nickname
      : authState.user.data.name || authState.user.data.email
    : null;

  const userEmail = authState.user?.data.email ?? null;

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginWithEmail,
        signUp,
        loginWithKakao,
        logout,
        displayName,
        userEmail,
        isAdmin,
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
