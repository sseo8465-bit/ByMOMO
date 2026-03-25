'use client';

// Context Provider 래퍼 — AuthProvider > ProfileProvider > CartProvider 순서
import { AuthProvider } from '@/domains/auth/auth.context';
import { CartProvider } from '@/domains/cart/cart.context';
import { ProfileProvider } from '@/domains/profile/profile.context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <CartProvider>{children}</CartProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
