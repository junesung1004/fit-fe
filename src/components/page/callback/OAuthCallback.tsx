'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OAuthProvider, OAuthLoginResponse } from '@/types/oauth.type';
import { handleSocialCallback } from '@/services/oauth';
import Spinner from '@/components/common/Spinner';
import { useAuthStore } from '@/store/authStore';

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
  const { login } = useAuthStore();

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

        // 로그인 처리
        if (result.accessToken) {
          login(result.accessToken, {
            id: result.user.id,
            nickname: result.user.nickname || '',
          });
        }

        await handleSuccessRedirect(result, router);
      } catch (error) {
        console.error(`${provider} 로그인 콜백 처리 중 오류:`, error);
        router.push(`/login?error=${provider}-login-failed`);
      }
    };

    handleCallback();
  }, [provider, router, code, state, scope, login]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-160px)]">
      <div className="text-center">
        <Spinner size="lg" color="primary" />
      </div>
    </div>
  );
}

// 로그인 성공 후 리다이렉트 처리
async function handleSuccessRedirect(
  result: OAuthLoginResponse,
  router: ReturnType<typeof useRouter>
) {
  // 백엔드에서 전달받은 redirectUrl을 그대로 사용
  router.push(result.redirectUrl);
}
