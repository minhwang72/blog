/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@heroicons/react']
  },
  // Font optimization 비활성화 (hydration 오류 해결)
  optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true, // ESLint 오류 무시
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript 오류 무시
  },
};

module.exports = nextConfig;