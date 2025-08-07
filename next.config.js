/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@heroicons/react']
  },
  // Font optimization 비활성화 (hydration 오류 해결)
  optimizeFonts: false,
  // CSS 최적화 비활성화
  cssMinification: false,
};

module.exports = nextConfig;