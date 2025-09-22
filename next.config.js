const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  output: 'export',
  trailingSlash: true,
  distDir: 'build',

  images: {
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
  
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
  
  generateBuildId: async () => {
    return Date.now().toString();
  },


}

module.exports = withBundleAnalyzer(nextConfig)