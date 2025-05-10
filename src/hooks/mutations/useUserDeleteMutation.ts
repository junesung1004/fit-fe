import { userDelete } from '@/services/userDelete';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export const useUserDeleteMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => await userDelete(),
    onSuccess: () => {
      toast.success('회원탈퇴가 완료되었습니다.');
      router.push('/home');
    },
    onError: () => toast.error('회원탈퇴에 실패했습니다.'),
  });
};
