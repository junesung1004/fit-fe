import { OAuthProvider } from '@/types/oauth.type';
import OAuthCallback from '@/components/page/login/OAuthCallback';

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
    <OAuthCallback
      provider={provider as OAuthProvider}
      code={code}
      state={state}
      scope={scope}
    />
  );
}
