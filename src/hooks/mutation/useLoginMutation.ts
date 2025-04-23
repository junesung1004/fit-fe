import { login, LoginProps } from '@/services/login';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';

export const useLoginMutation = () => {
  const router = useRouter();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginProps) => await login(data),
    onSuccess: (res) => {
      const accessToken = res.accessToken;
      const user = res.user;
      if (!user) {
        toast.error('유저 정보가 없습니다.');
        return;
      }

      setAuth(accessToken, {
        id: user.id,
        nickname: user.nickname,
      });

      console.log('✅ 로그인 응답:', res);

      toast.success(`${user.nickname}님 환영합니다.`);
      router.push('/home');
    },
    onError: (error) => {
      toast.error(error.message || '로그인 실패');
    },
  });
};
