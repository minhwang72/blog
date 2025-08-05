/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  distDir: 'dist',
  trailingSlash: true,
  output: 'standalone',
  staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig; 