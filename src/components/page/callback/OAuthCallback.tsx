'use client';

import { useEffect, useState } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processCallback = async () => {
      if (!code || isProcessing) return;

      try {
        setIsProcessing(true);
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
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [code, provider, state, scope, router, socialLogin, isProcessing]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner size="lg" color="primary" />
        <h2 className="text-2xl font-bold mt-4">소셜 로그인 처리 중...</h2>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
