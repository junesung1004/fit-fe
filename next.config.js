/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['fit-aws-bucket.s3.ap-northeast-2.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fit-aws-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
