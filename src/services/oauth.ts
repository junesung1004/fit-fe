import axios from '@/lib/axios';
import {
  OAuthProvider,
  OAuthLoginResponse,
  OAuthCallbackParams,
  OAuthEndpoints,
} from '@/types/oauth.type';

const baseUrl = 'https://api.fit-date.co.kr/api/v1';

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
  window.location.href = `${baseUrl}${endpoint}?redirect_uri=${encodeURIComponent(redirectUri)}`;
};

export const handleSocialCallback = async (
  provider: OAuthProvider,
  code: string,
  additionalParams?: OAuthCallbackParams
): Promise<OAuthLoginResponse> => {
  try {
    const endpoint = OAUTH_ENDPOINTS[provider].callback;
    const params = new URLSearchParams({
      code,
      ...(additionalParams?.state && { state: additionalParams.state }),
      ...(additionalParams?.scope && { scope: additionalParams.scope }),
    });

    const { data } = await axios.get<OAuthLoginResponse>(
      `${endpoint}?${params.toString()}`
    );

    return data;
  } catch (error) {
    console.error('소셜 로그인 콜백 처리 중 오류:', error);
    throw error;
  }
};
