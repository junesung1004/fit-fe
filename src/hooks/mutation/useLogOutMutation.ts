'use client';

import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { logout as logoutRequest } from '@/services/logout';
import { toast } from 'react-toastify';

export const useLogOutMutation = () => {
  const router = useRouter();

  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      logout();
      toast.success('로그아웃 하셨습니다.');
      router.push('/home');
    },
    onError: (error) => {
      console.error('로그아웃 실패 : ', error);
      toast.error('로그아웃 실패했습니다. 다시 시도해주세요.');
    },
  });
};
