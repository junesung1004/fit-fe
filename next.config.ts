import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'fit-aws-bucket.s3.ap-northeast-2.amazonaws.com',
      'www.fit-date.co.kr',
      'd22i603q3n4pzb.cloudfront.net',
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
      {
        protocol: 'https',
        hostname: 'd22i603q3n4pzb.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
