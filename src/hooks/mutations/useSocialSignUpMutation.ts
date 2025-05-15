import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SocialSignUpFormValues } from '@/types/social.type';
import { toast } from 'react-toastify';
import { socialSignUp, socialSignUpImageUpload } from '@/services/socialSignUp';

// 소셜 회원가입
export const useSocialSignUpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SocialSignUpFormValues) => socialSignUp(data),
    onSuccess: () => {
      toast.success('소셜 회원가입이 완료되었습니다!');
      router.push('/home');
    },
    onError: (error) => {
      toast.error(error.message || '소셜 회원가입에 실패했습니다.');
    },
  });
};

// 이미지 업로드
export const useSocialUploadImageMutataion = () => {
  return useMutation({
    mutationFn: async (image: File) => await socialSignUpImageUpload(image),
    onSuccess: () => {
      toast.success('이미지 업로드 성공');
    },
    onError: (error) => {
      toast.error(error.message || '이미지 업로드 실패');
    },
  });
};
