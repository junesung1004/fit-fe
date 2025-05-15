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

        console.log('소셜 로그인 콜백 시작:', {
          provider,
          code,
          state,
          scope,
        });

        const result = await handleSocialCallback(
          provider,
          code,
          additionalParams
        );

        console.log('소셜 로그인 응답:', result);

        // 사용자 정보가 있는 경우 로그인 처리
        if (result.user) {
          console.log('소셜 로그인 처리 시작:', {
            user: result.user,
          });

          // 로그인 상태 업데이트
          login('', {
            // accessToken이 없는 경우 빈 문자열로 처리
            id: result.user.id,
            nickname: result.user.nickname || '',
            email: result.user.email,
            role: result.user.role || 'USER', // 기본 역할 설정
          });

          console.log('로그인 상태 업데이트 후:', {
            isLoggedIn,
            user: result.user,
          });

          // 상태 업데이트가 완료될 때까지 최대 3초 대기
          let attempts = 0;
          const maxAttempts = 30; // 3초 (100ms * 30)

          while (!isLoggedIn && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            attempts++;
            console.log('로그인 상태 대기 중:', { attempts, isLoggedIn });
          }

          console.log('소셜 로그인 처리 완료');

          // 리다이렉트 전에 로컬 스토리지 확인
          const storedAuth = localStorage.getItem('auth-storage');
          console.log('로컬 스토리지 상태:', storedAuth);

          await handleSuccessRedirect(result, router);
        } else {
          console.log('소셜 로그인 사용자 정보가 없습니다:', result);
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
  console.log('리다이렉트 URL:', result.redirectUrl);
  router.push(result.redirectUrl);
}
