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

// 이메일 중복
export const emailCheck = async (email: string) => {
  try {
    const response = await instance.post('/auth/check-email', { email });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SignUpErrorResponse>;
    console.error('❌ 이메일 중복 확인 요청 실패');
    console.error('📍 응답 상태 코드:', err.response?.status);
    console.error('📍 서버 응답 메시지:', err.response?.data?.message);
    console.error('📍 전체 응답 데이터:', err.response?.data);
    console.error('📍 요청 데이터:', email);
  }
};

// 회원가입
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
    throw new Error(err.response?.data?.message || '회원가입 실패');
  }
};

//이미지 업로드
export const signUpImageUpload = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append('image', image);

    const response = await instance.post('/profile-image/temp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.imageUrl;
  } catch (error) {
    const err = error as AxiosError<SignUpErrorResponse>;
    console.error('❌ 이미지 업로드 실패');
    console.error('📍 상태 코드:', err.response?.status);
    console.error('📍 메시지:', err.response?.data?.message);
    throw new Error(err.response?.data?.message || '이미지 업로드 실패');
  }
};

//이메일 인증코드 메일 발송
export const emailVerificationRequest = async (email: string) => {
  try {
    const response = await instance.post('/auth/send-verification-email', {
      email,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SignUpErrorResponse>;
    console.error('❌ 이메일 인증코드 발송 에러.');
    console.error('📍 상태 코드:', err.response?.status);
    console.error('📍 메시지:', err.response?.data?.message);
    throw new Error(err.response?.data?.message || '이메일 인증코드 발송 실패');
  }
};

//이메일 인증코드 확인 api
export const emailVerificationSuccess = async (code: number) => {
  try {
    const response = await instance.post('/auth/verify-email', { code });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SignUpErrorResponse>;
    console.error('❌ 이메일 인증코드 확인 발송 에러');
    console.error('📍 상태 코드:', err.response?.status);
    console.error('📍 메시지:', err.response?.data?.message);
    throw new Error(err.response?.data?.message || '이메일 인증코드 확인 실패');
  }
};
