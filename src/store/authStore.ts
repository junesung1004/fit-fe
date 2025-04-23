// src/store/authStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  nickname: string;
  height: string;
}

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: User | null; // nickName 저장용
  // eslint-disable-next-line no-unused-vars
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  accessToken: null,
  user: null,

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
}));
