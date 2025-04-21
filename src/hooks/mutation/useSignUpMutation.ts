import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SignUpFormValues } from '@/types/signUp.type';
import { toast } from 'react-toastify';
import { signUp } from '@/services/signUp';

export const useSignUpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignUpFormValues) => signUp(data),
    onSuccess: () => {
      toast.success('회원가입 완료!');
      router.push('/login');
    },
    onError: (error) => {
      toast.error(error.message || '회원가입 실패');
    },
  });
};
