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
  socketError: string | null;
  // eslint-disable-next-line no-unused-vars
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  // eslint-disable-next-line no-unused-vars
  setSocketError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      user: null,
      socketError: null,

      login: (token, user) => {
        console.log('authStore login 호출:', { token, user });
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

            set({ socketError: null });
          } catch {
            set({ socketError: '소켓 연결에 실패했습니다.' });
          }
        }
      },

      logout: () =>
        set({
          isLoggedIn: false,
          accessToken: null,
          user: null,
          socketError: null,
        }),

      setSocketError: (error) => set({ socketError: error }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
