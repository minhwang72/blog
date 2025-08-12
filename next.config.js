/** @type {import('next').NextConfig} */
const nextConfig = {
  // 빌드 최적화
  swcMinify: true,
  compress: true,
  output: 'standalone',
  
  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // 실험적 기능
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  },
  
  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // ESLint 비활성화 (빌드 시간 단축)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript 오류 무시 (빌드 시간 단축)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;