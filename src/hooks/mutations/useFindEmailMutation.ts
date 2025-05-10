import { EmailFindProps, findEmail } from '@/services/login';
import { useMutation } from '@tanstack/react-query';

// eslint-disable-next-line no-unused-vars
export const useFindEmailMutation = (onSuccess: (email: string) => void) => {
  return useMutation({
    mutationFn: (data: EmailFindProps) => findEmail(data),
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error) => {
      console.error('이메일 찾기 실패 : ', error);
    },
  });
};
