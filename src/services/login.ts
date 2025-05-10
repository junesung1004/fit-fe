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

export interface EmailFindProps {
  name: string;
  phone: string;
}

export interface PasswordFindProps {
  email: string;
  name: string;
  phone: string;
}

export interface ChangePasswordProps {
  userId: string;
  newPassword: string;
  confirmPassword: string;
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

export const findEmail = async (data: EmailFindProps) => {
  try {
    const response = await instance.post(`/auth/find-email`, data);
    console.log();
    return response.data;
  } catch (error) {
    const err = error as AxiosError<LoginErrorResponse>;
    console.error('이메일 찾기 요청 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};

export const findPassword = async (data: PasswordFindProps) => {
  try {
    const response = await instance.post(`auth/find-password`, data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<LoginErrorResponse>;
    console.error('비밀번호 찾기 요청 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};

export const changePassword = async (data: ChangePasswordProps) => {
  try {
    const response = await instance.post(`auth/find-and-change-password`, data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<LoginErrorResponse>;
    console.error('비밀번호 변경 요청 실패 : ', err);
    console.error('응답 상태 코드 : ', err.response?.status);
    console.error('메시지 : ', err.response?.data?.message);
  }
};
