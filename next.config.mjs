/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  output: 'export',
  
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
  
  serverExternalPackages: ['three', 'ogl'],
  
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },
}

export default nextConfig
