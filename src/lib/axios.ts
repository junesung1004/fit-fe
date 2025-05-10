import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

const instance = axios.create({
  baseURL: 'https://api.fit-date.co.kr/api/v1',
  withCredentials: true,
});

// 인증이 필요하지 않은 API 경로들
const PUBLIC_PATHS = [
  '/auth/register',
  '/auth/check-email',
  '/auth/check-nickname',
  '/auth/send-verification-email',
  '/auth/verify-email',
  '/auth/google',
  '/auth/google/login/callback',
  '/auth/kakao',
  '/auth/kakao/login/callback',
  '/auth/naver',
  '/auth/naver/login/callback',
  '/match/random/public',
  '/user/filtered-users',
];

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config.url || '';

      // 인증이 필요하지 않은 API 요청은 리다이렉트하지 않음
      if (PUBLIC_PATHS.some((path) => requestUrl.includes(path))) {
        return Promise.reject(error);
      }

      // 토큰 만료 또는 인증 실패
      const authStore = useAuthStore.getState();
      authStore.logout();
      toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');

      // 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
