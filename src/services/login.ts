import instance from '@/lib/axios';
import { AxiosError } from 'axios';

export interface LoginProps {
  email: string;
  password: string;
}

interface LoginErrorResponse {
  message: string;
  errorCode?: string;
}

export const login = async (data: LoginProps) => {
  try {
    const response = await instance.post('/auth/login', data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<LoginErrorResponse>;
    console.error('로그인 요청 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};
