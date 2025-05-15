import instance from '@/lib/axios';
import { AxiosError } from 'axios';
import {
  SocialSignUpPayload,
  SocialSignUpErrorResponse,
} from '@/types/social.type';

// 소셜 회원가입 API
export const socialSignUp = async (data: SocialSignUpPayload) => {
  try {
    const response = await instance.post('/auth/social-register', data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SocialSignUpErrorResponse>;
    console.error('❌ 소셜 회원가입 실패:', err.response?.data?.message);
    throw new Error(err.response?.data?.message || '소셜 회원가입 실패');
  }
};

//이미지 업로드 API
export const socialSignUpImageUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await instance.post('/profile-image/temp', formData);
    return response.data.url;
  } catch (error) {
    const err = error as AxiosError<SocialSignUpErrorResponse>;
    console.error('❌ 이미지 업로드 실패:', err.response?.data?.message);
    throw new Error(err.response?.data?.message || '이미지 업로드 실패');
  }
};

//관심사 API
export const socialSignupInterestCategoryData = async () => {
  try {
    const response = await instance.get(`/interest-category`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SocialSignUpErrorResponse>;
    console.error('❌ 관심사 정보 불러오기 실패:', err.response?.data?.message);
    return null;
  }
};

// 피드백 API
export const socialSignupFeedbackData = async () => {
  try {
    const response = await instance.get(`/feedback`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SocialSignUpErrorResponse>;
    console.error('❌ 피드백 정보 불러오기 실패:', err.response?.data?.message);
    return null;
  }
};

// 자기소개 API
export const socialSignupIntroduceData = async () => {
  try {
    const response = await instance.get(`/introduction`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<SocialSignUpErrorResponse>;
    console.error(
      '❌ 자기소개 정보 불러오기 실패:',
      err.response?.data?.message
    );
    return null;
  }
};
