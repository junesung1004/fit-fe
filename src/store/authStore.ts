// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userStatusSocket } from '@/lib/socket';

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

      login: (token, user) => {
        set({
          isLoggedIn: true,
          accessToken: token,
          user: user,
        });
        // 소켓 재연결 처리
        try {
          if (userStatusSocket.connected) {
            userStatusSocket.disconnect();
          }
          userStatusSocket.auth = { token };
          userStatusSocket.connect();
        } catch (e) {
          console.error('소켓 재연결 실패:', e);
        }
      },

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
