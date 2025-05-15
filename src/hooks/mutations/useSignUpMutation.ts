import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SignUpFormValues } from '@/types/signUp.type';
import { toast } from 'react-toastify';
import {
  emailCheck,
  emailVerificationRequest,
  emailVerificationSuccess,
  signUp,
  signUpImageUpload,
} from '@/services/signUp';

// 이미지 업로드 mutation
export const useUploadImageMutataion = () => {
  return useMutation({
    mutationFn: async (image: File) => await signUpImageUpload(image),
    onSuccess: () => {
      toast.success('이미지 업로드 성공');
    },
    onError: (error) => {
      toast.error(error.message || '이미지 업로드 실패');
    },
  });
};

// 회원가입 mutation
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

//이메일 중복 mutation
export const useEmailCheckMutation = (
  // eslint-disable-next-line no-unused-vars
  onValid: (isAvailable: boolean) => void
) => {
  return useMutation({
    mutationFn: (email: string) => emailCheck(email),
    onSuccess: (data) => {
      if (data?.isDuplicate) {
        toast.error('이미 사용 중인 이메일입니다.');
        onValid(false);
      } else {
        toast.success('사용 가능한 이메일입니다!');
        onValid(true);
      }
    },
    onError: (error) => {
      toast.error(error.message || '이메일 중복 확인 요청이 실패했습니다.');
    },
  });
};

//이메일 인증메일 발송 mutation
export const useEmailVerificationMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => await emailVerificationRequest(email),
    onSuccess: () => {
      toast.success('인증 코드가 이메일로 전송되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message || '이메일 인증 코드 요청이 실패했습니다.');
    },
  });
};

//이메일 인증코드 확인 mutation
export const useEmailSuccessMutation = () => {
  return useMutation({
    mutationFn: async (data: number) => await emailVerificationSuccess(data),
    onSuccess: () => {
      toast.success('인증 코드가 확인되었습니다.');
    },
    onError: (error) => {
      toast.error(
        error.message || '이메일 인증 코드 확인 요청이 실패했습니다.'
      );
    },
  });
};
