'use client';

import { OAuthProvider } from '@/types/oauth.type';
import OAuthCallback from '@/components/page/callback/OAuthCallback';

interface OAuthCallbackPageProps {
  params: { provider: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export default function OAuthCallbackPage({
  params,
  searchParams,
}: OAuthCallbackPageProps) {
  const { provider } = params;

  console.log('소셜 로그인 콜백 페이지:', {
    provider,
    searchParams,
  });

  const code =
    typeof searchParams.code === 'string' ? searchParams.code : undefined;
  const state =
    typeof searchParams.state === 'string' ? searchParams.state : undefined;
  const scope =
    typeof searchParams.scope === 'string' ? searchParams.scope : undefined;

  console.log('파싱된 파라미터:', { code, state, scope });

  return (
    <div className="w-full h-[calc(100vh-160px)] flex items-center justify-center">
      <OAuthCallback
        provider={provider as OAuthProvider}
        code={code}
        state={state}
        scope={scope}
      />
    </div>
  );
}
