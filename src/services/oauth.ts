import axios from '@/lib/axios';
import {
  OAuthProvider,
  OAuthLoginResponse,
  OAuthCallbackParams,
  OAuthEndpoints,
} from '@/types/oauth.type';

const OAUTH_ENDPOINTS: OAuthEndpoints = {
  google: {
    auth: '/auth/google',
    callback: '/auth/google/callback',
  },
  kakao: {
    auth: '/auth/kakao',
    callback: '/auth/kakao/callback',
  },
  naver: {
    auth: '/auth/naver',
    callback: '/auth/naver/callback',
  },
} as const;

export const handleSocialLogin = async (
  provider: OAuthProvider
): Promise<void> => {
  const redirectUri = `${window.location.origin}/oauth/${provider}/callback`;
  const endpoint = OAUTH_ENDPOINTS[provider].auth;
  window.location.href = `${axios.defaults.baseURL}${endpoint}?redirect_uri=${encodeURIComponent(redirectUri)}`;
};

export const handleSocialCallback = async (
  provider: OAuthProvider,
  code: string,
  additionalParams: OAuthCallbackParams
): Promise<OAuthLoginResponse> => {
  try {
    const response = await axios.post<OAuthLoginResponse>(
      OAUTH_ENDPOINTS[provider].callback,
      {
        ...additionalParams,
        code,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`${provider} 로그인 콜백 처리 중 오류:`, error);
    throw error;
  }
};
