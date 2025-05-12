import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

const instance = axios.create({
  baseURL: 'https://api.fit-date.co.kr/api/v1',
  withCredentials: true,
});

// 인증이 필요하지 않은 API 경로들
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/find-email',
  '/auth/find-password',
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

// 디바이스 ID가 필요한 API 경로들
const DEVICE_ID_REQUIRED_PATHS = ['/auth/login', '/match/random'];

// 디바이스 ID 관리 함수
function ensureDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      deviceId = crypto.randomUUID();
    } else {
      deviceId =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

// 요청 인터셉터 추가 - 특정 경로에만 디바이스 ID 헤더 추가
instance.interceptors.request.use((config) => {
  const url = config.url || '';

  // 디바이스 ID가 필요한 경로인지 확인
  if (DEVICE_ID_REQUIRED_PATHS.some((path) => url.includes(path))) {
    const deviceId = ensureDeviceId();
    if (deviceId && config.headers) {
      config.headers['x-device-id'] = deviceId;
    }
  }

  return config;
});

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
