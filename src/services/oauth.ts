import axios from '@/lib/axios';
import {
  OAuthProvider,
  OAuthLoginResponse,
  OAuthCallbackParams,
  OAuthEndpoints,
} from '@/types/oauth.type';

const OAUTH_ENDPOINTS: OAuthEndpoints = {
  google: {
    auth: 'https://accounts.google.com/o/oauth2/v2/auth',
    callback: '/auth/google/callback',
  },
  kakao: {
    auth: 'https://kauth.kakao.com/oauth/authorize',
    callback: '/auth/kakao/callback',
  },
  naver: {
    auth: 'https://nid.naver.com/oauth2.0/authorize',
    callback: '/auth/naver/callback',
  },
} as const;

const OAUTH_CONFIG = {
  google: {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    scope: 'email profile',
  },
  kakao: {
    client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
    scope: 'profile_nickname profile_image account_email',
  },
  naver: {
    client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
    scope: 'profile email',
  },
} as const;

export const handleSocialLogin = async (
  provider: OAuthProvider
): Promise<void> => {
  const redirectUri = `${window.location.origin}/oauth/${provider}/callback`;
  const config = OAUTH_CONFIG[provider];
  const endpoint = OAUTH_ENDPOINTS[provider].auth;

  if (!config.client_id) {
    throw new Error(`${provider} 클라이언트 ID가 설정되지 않았습니다.`);
  }

  const params = new URLSearchParams({
    client_id: config.client_id,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scope,
  });

  window.location.href = `${endpoint}?${params.toString()}`;
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
    throw new Error(`${provider} 로그인 처리 중 오류가 발생했습니다.`);
  }
};
