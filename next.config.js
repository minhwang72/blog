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
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 실험적 기능
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
    scrollRestoration: true,
  },
  
  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // ESLint 활성화 (코드 품질 유지)
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // TypeScript 오류 처리 (코드 품질 유지) - scripts 폴더 제외
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // 빌드에서 scripts 폴더 제외
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/scripts/**', '**/node_modules/**']
    }
    return config
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // 리다이렉트 설정 제거 (테스트용)
  /*
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
      },
    ];
  },
  */
};

module.exports = nextConfig;