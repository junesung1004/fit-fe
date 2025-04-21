import { login, LoginProps } from '@/services/login';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';

export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginProps) => await login(data),
    onSuccess: () => {
      toast.success('로그인 완료!');
      router.push('/home');
    },
    onError: (error) => {
      toast.error(error.message || '로그인 실패');
    },
  });
};
