import { OAuthProvider } from '@/types/oauth.type';
import OAuthCallback from '@/components/page/callback/OAuthCallback';

interface OAuthCallbackPageProps {
  params: Promise<{ provider: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OAuthCallbackPage({
  params,
  searchParams,
}: OAuthCallbackPageProps) {
  const { provider } = await params;
  const resolvedSearchParams = await searchParams;

  console.log('소셜 로그인 콜백 페이지:', {
    provider,
    searchParams: resolvedSearchParams,
  });

  const code =
    typeof resolvedSearchParams.code === 'string'
      ? resolvedSearchParams.code
      : undefined;
  const state =
    typeof resolvedSearchParams.state === 'string'
      ? resolvedSearchParams.state
      : undefined;
  const scope =
    typeof resolvedSearchParams.scope === 'string'
      ? resolvedSearchParams.scope
      : undefined;

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
