import { deleteUser } from '@/services/user';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useDeleteUserMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => await deleteUser(),
    onSuccess: () => {
      console.log('회원 탈퇴 성공');
      router.push('/');
    },
    onError: (error) => {
      console.error('회원 탈퇴 실패  : ', error);
    },
  });
};
