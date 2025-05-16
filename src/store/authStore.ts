import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userStatusSocket } from '@/lib/socket';

interface AuthUser {
  id: string;
  nickname: string;
  email?: string;
  role?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: AuthUser | null;
  socketError: string | null;
  // eslint-disable-next-line no-unused-vars
  login: (token: string, user: AuthUser) => void;
  // eslint-disable-next-line no-unused-vars
  socialLogin: (user: AuthUser) => void;
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

        // 사용자 정보 정규화
        const normalizedUser: AuthUser = {
          id: user.id,
          nickname: user.nickname || '',
          email: user.email,
          role: user.role || 'USER',
        };

        set({
          isLoggedIn: true,
          accessToken: token || null,
          user: normalizedUser,
        });

        // 토큰이 있고 유효할 때만 소켓 연결 시도
        if (token && token.trim() !== '') {
          try {
            if (userStatusSocket.connected) {
              userStatusSocket.disconnect();
            }
            userStatusSocket.auth = { token };
            userStatusSocket.connect();
            set({ socketError: null });
          } catch (error) {
            console.error('소켓 연결 실패:', error);
            set({ socketError: '소켓 연결에 실패했습니다.' });
          }
        } else {
          console.log('토큰이 없어 소켓 연결을 건너뜁니다.');
        }
      },

      socialLogin: (user) => {
        console.log('authStore socialLogin 호출:', { user });

        // 사용자 정보 정규화
        const normalizedUser: AuthUser = {
          id: user.id,
          nickname: user.nickname || '',
          email: user.email,
          role: user.role || 'USER',
        };

        set({
          isLoggedIn: true,
          accessToken: null,
          user: normalizedUser,
        });
      },

      logout: () => {
        // 소켓 연결 해제
        if (userStatusSocket.connected) {
          userStatusSocket.disconnect();
        }

        set({
          isLoggedIn: false,
          accessToken: null,
          user: null,
          socketError: null,
        });
      },

      setSocketError: (error) => set({ socketError: error }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
