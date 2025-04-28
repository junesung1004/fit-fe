'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import instance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface LoginErrorResponse {
  message: string;
  errorCode?: string;
}

export default function AuthChecker() {
  const { login, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await instance.get('/user/me'); // ✅ 여기
        if (data && data.id && data.nickname) {
          login({ id: data.id, nickname: data.nickname }); // ✅ 유저 정보 세팅
        }
      } catch (error) {
        const err = error as AxiosError<LoginErrorResponse>;
        console.error('❌ 인증 실패', error);
        if (err.response?.status === 401) {
          // ✅ 쿠키 만료되었으면 로그아웃
          logout();
          router.refresh(); // 페이지 새로고침해서 상태 동기화
        }
      }
    };

    checkAuth();
  }, [login, logout, router]);

  return null;
}
