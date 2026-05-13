/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH || '',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
