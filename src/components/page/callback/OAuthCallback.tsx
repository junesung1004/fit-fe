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
  const { socialLogin, isLoggedIn } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }

        console.log('소셜 로그인 콜백 시작:', {
          provider,
          code,
          state,
          scope,
        });

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

        console.log('소셜 로그인 응답:', result);

        // 소셜 로그인 상태 업데이트
        socialLogin({
          id: result.user.id,
          email: result.user.email,
          nickname: result.user.nickname || '', // 닉네임이 없으면 빈 문자열로 설정
          role: 'USER', // 기본 역할
        });

        console.log('소셜 로그인 처리 완료');
        await handleSuccessRedirect(result, router);
      } catch (error) {
        console.error(`${provider} 소셜 로그인 콜백 처리 중 오류:`, error);
        // 에러 발생 시 각 제공자의 에러 페이지로 리다이렉트
        const errorPages = {
          kakao: 'https://accounts.kakao.com/weblogin/error',
          google: 'https://accounts.google.com/error',
          naver: 'https://nid.naver.com/error',
        };
        window.location.href = errorPages[provider] || '/login';
      }
    };

    handleCallback();
  }, [provider, router, code, state, scope, socialLogin, isLoggedIn]);

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
  console.log('리다이렉트 URL:', result.redirectUrl);
  router.push(result.redirectUrl);
}
