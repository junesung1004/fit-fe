'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { OAuthProvider } from '@/types/oauth.type';
import { handleSocialCallback } from '@/services/oauth';
import { useAuthStore } from '@/store/authStore';
import Spinner from '@/components/common/Spinner';

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
  const { socialLogin } = useAuthStore();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!code) return;
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    const processCallback = async () => {
      try {
        console.log('소셜 로그인 콜백 시작:', { provider, code, state, scope });

        const result = await handleSocialCallback(provider, code, {
          code: code,
          state: state,
          scope: scope,
        });

        console.log('소셜 로그인 응답:', result);

        if (result.user) {
          socialLogin({
            ...result.user,
            nickname: result.user.nickname || '',
          });
          console.log('소셜 로그인 처리 완료');
          console.log('리다이렉트 URL:', result.redirectUrl);
          router.push(result.redirectUrl);
        }
      } catch (error) {
        console.error('소셜 로그인 처리 중 오류:', error);
        router.push('/error');
      } finally {
        isProcessingRef.current = false;
      }
    };

    processCallback();
  }, [code, provider, state, scope, router, socialLogin]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <div className="text-center">
        <Spinner size="lg" color="primary" />
        <p className="text-gray-600">소셜 로그인 처리 중...</p>
      </div>
    </div>
  );
}
