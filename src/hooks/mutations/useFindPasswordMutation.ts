import {
  changePassword,
  ChangePasswordProps,
  findPassword,
  PasswordFindProps,
} from '@/services/login';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useFindPasswordMutation = (
  // eslint-disable-next-line no-unused-vars
  onSuccess: (userId: string) => void
) => {
  return useMutation({
    mutationFn: (data: PasswordFindProps) => findPassword(data),
    onSuccess: (userId) => {
      onSuccess(userId.userId);
    },
    onError: (error) => {
      console.error('이메일 찾기 실패 : ', error);
    },
  });
};

export const useChangePasswordMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: ChangePasswordProps) => changePassword(data),
    onSuccess: () => {
      console.log('비밀번호 변경 성공');
      router.push('/login');
    },
    onError: (error) => {
      console.error('비밀번호 변경 실패 : ', error);
    },
  });
};
