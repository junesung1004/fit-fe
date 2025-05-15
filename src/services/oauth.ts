import axios from '@/lib/axios';
import { AxiosError } from 'axios';
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
    client_id:
      '517771775460-g31uhm1lunn5er4mdgq77lltn5j4nu8b.apps.googleusercontent.com',
    scope: 'email',
    redirect_uri: 'https://fit-date.co.kr/auth/google/callback',
  },
  kakao: {
    client_id: 'dd09c3cc9f0f55669238e75de0493cb4',
    scope: 'account_email',
    redirect_uri: 'https://fit-date.co.kr/auth/kakao/callback',
  },
  naver: {
    client_id: 'OGubX3GH_5yaMJhqJ3iu',
    scope: 'email',
    redirect_uri: 'https://fit-date.co.kr/auth/naver/callback',
  },
} as const;

export const handleSocialLogin = async (
  provider: OAuthProvider
): Promise<void> => {
  const config = OAUTH_CONFIG[provider];
  const endpoint = OAUTH_ENDPOINTS[provider].auth;

  console.log('OAuth Config:', {
    provider,
    clientId: config.client_id,
    scope: config.scope,
    redirectUri: config.redirect_uri,
    endpoint,
  });

  if (!config.client_id) {
    throw new Error(`${provider} 클라이언트 ID가 설정되지 않았습니다.`);
  }

  const params = new URLSearchParams({
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
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
    const config = OAUTH_CONFIG[provider];

    console.log(`${provider} 콜백 요청 시작:`, {
      code,
      additionalParams,
      callbackUrl: OAUTH_ENDPOINTS[provider].callback,
      redirectUri: config.redirect_uri,
    });

    const response = await axios.post<OAuthLoginResponse>(
      OAUTH_ENDPOINTS[provider].callback,
      {
        ...additionalParams,
        code,
        provider,
        redirectUri: config.redirect_uri,
        user: {
          id: additionalParams.user?.id || '',
          email: additionalParams.user?.email || '',
          authProvider: provider,
          isProfileComplete: additionalParams.user?.isProfileComplete || false,
        },
      }
    );

    console.log(`${provider} 콜백 응답:`, response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`${provider} 로그인 콜백 처리 중 상세 오류:`, {
      error: axiosError,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
      headers: axiosError.response?.headers,
    });

    // 에러를 던지지 않고 기본 응답 반환
    return {
      accessToken: '',
      refreshToken: '',
      isProfileComplete: false,
      redirectUrl: '/login',
      user: {
        id: '',
        email: '',
        role: '',
      },
    };
  }
};
