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
  const { login, isLoggedIn } = useAuthStore();

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

        console.log('소셜 로그인 응답:', result);

        // 로그인 처리
        if (result.accessToken) {
          console.log('소셜 로그인 처리 시작:', {
            token: result.accessToken,
            user: result.user,
          });

          // 로그인 상태 업데이트
          login(result.accessToken, {
            id: result.user.id,
            nickname: result.user.nickname || '',
          });

          // 상태 업데이트가 완료될 때까지 최대 3초 대기
          let attempts = 0;
          const maxAttempts = 30; // 3초 (100ms * 30)

          while (!isLoggedIn && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            attempts++;
          }

          console.log('소셜 로그인 처리 완료');

          await handleSuccessRedirect(result, router);
        } else {
          console.log('소셜 로그인 토큰이 없습니다:', result);
          // 소셜 로그인 실패 시 각 제공자의 에러 페이지로 리다이렉트
          const errorPages = {
            kakao: 'https://accounts.kakao.com/weblogin/error',
            google: 'https://accounts.google.com/error',
            naver: 'https://nid.naver.com/error',
          };
          window.location.href = errorPages[provider] || '/login';
        }
      } catch (error) {
        console.error(`${provider} 소셜 로그인 콜백 처리 중 오류:`, error);
        // 에러 발생 시에도 각 제공자의 에러 페이지로 리다이렉트
        const errorPages = {
          kakao: 'https://accounts.kakao.com/weblogin/error',
          google: 'https://accounts.google.com/error',
          naver: 'https://nid.naver.com/error',
        };
        window.location.href = errorPages[provider] || '/login';
      }
    };

    handleCallback();
  }, [provider, router, code, state, scope, login, isLoggedIn]);

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
