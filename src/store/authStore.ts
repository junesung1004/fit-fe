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
        console.log('로그인 시 전달된 토큰:', token);
        set({
          isLoggedIn: true,
          accessToken: token,
          user: user,
        });

        // 토큰이 유효할 때만 소켓 연결
        if (token) {
          try {
            if (userStatusSocket.connected) {
              userStatusSocket.disconnect();
            }
            userStatusSocket.auth = { token };
            userStatusSocket.connect();
          } catch (e) {
            console.error('소켓 재연결 실패:', e);
          }
        } else {
          console.warn('토큰이 없어 소켓 연결을 시도하지 않습니다.');
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
