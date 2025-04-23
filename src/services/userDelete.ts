import instance from '@/lib/axios';
import { AxiosError } from 'axios';

interface UserDeleteResponse {
  message: string;
  errorCode?: string;
}

export const userDelete = async () => {
  try {
    const response = await instance.post('/auth/delete-account');
    return response;
  } catch (error) {
    const err = error as AxiosError<UserDeleteResponse>;
    console.error('회원탈퇴 요청 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};
