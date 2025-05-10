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
    console.log('회원가입 성공 : ', response.data);

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
export const signUpImageUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await instance.post('/profile-image/temp', formData);
    console.log('📸 이미지 업로드 응답:', response);

    return response.data.url;
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

//회원가입 관심사 data api get 요청
export const signupInterestCategoryData = async () => {
  try {
    const response = await instance.get(`/interest-category`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SignUpErrorResponse>;
    console.error('❌ 관심사 정보 불러오기 실패패');
    console.error('📍 상태 코드:', err.response?.status);
    console.error('📍 메시지:', err.response?.data?.message);
  }
};

//회원가입 저는 이런얘기 많이 들어요(피드백) data api get 요청
export const signupFeedbackData = async () => {
  try {
    const response = await instance.get(`/feedback`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SignUpErrorResponse>;
    console.error('❌ 피드백 정보 불러오기 실패패');
    console.error('📍 상태 코드:', err.response?.status);
    console.error('📍 메시지:', err.response?.data?.message);
  }
};

// 회원가입 저는 이런 사람이에요 (introduce) data api get 요청
export const signupIntroduceData = async () => {
  try {
    const response = await instance.get(`/introduction`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SignUpErrorResponse>;
    console.error('❌ 저는 이런사람이에요 정보 불러오기 실패패');
    console.error('📍 상태 코드:', err.response?.status);
    console.error('📍 메시지:', err.response?.data?.message);
  }
};
