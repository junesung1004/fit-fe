import instance from '@/lib/axios';
import { AxiosError } from 'axios';

interface LogOutErrorResponse {
  message: string;
  errorCode?: string;
}

export const logout = async () => {
  try {
    const response = await instance.post('/auth/logout');
    return response.data;
  } catch (error) {
    const err = error as AxiosError<LogOutErrorResponse>;
    console.error('로그아웃 요청 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
    throw new Error('로그아웃 실패');
  }
};
