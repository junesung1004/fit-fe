import { OAuthProvider } from '@/types/oauth.type';
import OAuthCallback from '@/components/page/callback/OAuthCallback';
import Spinner from '@/components/common/Spinner';

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

  return (
    <div className="w-full h-[calc(100vh-160px)] flex items-center justify-center">
      <Spinner size="lg" color="primary" />
      <p className="text-gray-600">소셜 로그인 처리 중...</p>
      <OAuthCallback
        provider={provider as OAuthProvider}
        code={code}
        state={state}
        scope={scope}
      />
    </div>
  );
}
