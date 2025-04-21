// service/userService.ts
import axios from 'axios';

interface UserData {
  email: string;
  password: string;
  name: string;
  nickname: string;
  birthday: string;
  gender: 'male' | 'female';
  phoneNumber: string;
  address: string;
}

export const createUser = async (userData: UserData) => {
  try {
    const response = await axios.post('http://api.fit-date.co.kr/api/v1/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendVerificationEmail = async (email: string) => {
  try {
    const response = await axios.post('http://api.fit-date.co.kr/api/v1/auth/send-verification-email', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyAuthCode = async (token: string) => {
  try {
    const response = await axios.get('http://api.fit-date.co.kr/api/v1/auth/verify-email', {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error('인증 실패:', error);
    throw error;
  }
};
