'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OAuthProvider, OAuthLoginResponse } from '@/types/oauth.type';
import { handleSocialCallback } from '@/services/oauth';

interface OAuthCallbackProps {
  provider: OAuthProvider;
  code?: string;
  state?: string;
  scope?: string;
}

export default function OAuthCallback({
  provider,
  code,
  state,
  scope,
}: OAuthCallbackProps) {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }

        const additionalParams = {
          code,
          state,
          scope,
        };

        const result = await handleSocialCallback(
          provider,
          code,
          additionalParams
        );

        await handleSuccessRedirect(result, router);
      } catch (error) {
        console.error(`${provider} 로그인 콜백 처리 중 오류:`, error);
        router.push(`/login?error=${provider}-login-failed`);
      }
    };

    handleCallback();
  }, [provider, router, code, state, scope]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">소셜 로그인 처리 중...</h1>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

// 로그인 성공 후 리다이렉트 처리
async function handleSuccessRedirect(
  result: OAuthLoginResponse,
  router: ReturnType<typeof useRouter>
) {
  if (!result.isProfileComplete) {
    router.push('/complete-profile');
    return;
  }

  router.push(result.redirectUrl);
}
