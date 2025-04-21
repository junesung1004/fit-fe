// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  userName: string | null; // nickName 저장용
  // eslint-disable-next-line no-unused-vars
  login: (token: string, nickName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      userName: null,

      // ✅ 여기서 실제로 인자를 사용해서 상태에 반영
      login: (token, nickName) =>
        set({
          isLoggedIn: true,
          accessToken: token,
          userName: nickName, // ← nickName 저장
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          accessToken: null,
          userName: null,
        }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
    }
  )
);
