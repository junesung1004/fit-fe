export type OAuthProvider = 'google' | 'kakao' | 'naver';
export type OAuthEndpoints = Record<OAuthProvider, OAuthEndpoint>;
export interface OAuthLoginResponse {
  accessToken: string;
  refreshToken: string;
  isProfileComplete: boolean;
  redirectUrl: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface OAuthCallbackParams {
  code: string;
  state?: string;
  scope?: string;
  user?: {
    id: string;
    email: string;
    authProvider: string;
    isProfileComplete: boolean;
  };
}

export interface OAuthEndpoint {
  auth: string;
  callback: string;
}

export interface AdditionalParams {
  state?: string | null;
  scope?: string | null;
}
