import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'fit-aws-bucket.s3.ap-northeast-2.amazonaws.com',
      'www.fit-date.co.kr',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fit-aws-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.fit-date.co.kr',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;