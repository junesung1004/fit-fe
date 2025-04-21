import instance from '@/lib/axios';
import { AxiosError } from 'axios';

interface SignUpPayload {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  job: string;
  gender: string;
  birthday: string;
  region: string;
  phone?: string;
  interests: string[];
  listening: string[];
  selfintro: string[];
}

interface SignUpErrorResponse {
  message: string;
  errorCode?: string;
  errors?: {
    [key: string]: string;
  };
}

export const signUp = async (data: SignUpPayload) => {
  try {
    const response = await instance.post('/auth/register', data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SignUpErrorResponse>;
    console.error('❌ 회원가입 요청 실패');
    console.error('📍 응답 상태 코드:', err.response?.status);
    console.error('📍 서버 응답 메시지:', err.response?.data?.message);
    console.error('📍 전체 응답 데이터:', err.response?.data);
    console.error('📍 요청 데이터:', data);
    throw new Error(err.response?.data?.message || '회원가입 실패패');
  }
};
