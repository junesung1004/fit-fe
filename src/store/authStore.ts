// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  id: string;
  nickname: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  // eslint-disable-next-line no-unused-vars
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      user: null,

      // ✅ 여기서 실제로 인자를 사용해서 상태에 반영
      login: (user) =>
        set({
          isLoggedIn: true,
          user: user,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
