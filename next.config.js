/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', '127.0.0.1', 'vai-rad-backend.onrender.com'],
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://vai-rad-backend.onrender.com/api/:path*',
      },
      {
        source: '/media/:path*',
        destination: 'https://vai-rad-backend.onrender.com/media/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
