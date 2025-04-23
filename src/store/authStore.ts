// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  id: string;
  nickname: string;
}

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: AuthUser | null;
  // eslint-disable-next-line no-unused-vars
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      user: null,

      // ✅ 여기서 실제로 인자를 사용해서 상태에 반영
      login: (token, user) =>
        set({
          isLoggedIn: true,
          accessToken: token,
          user: user,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          accessToken: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
