/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assessra.onrender.com' },
    ],
  },
  // Allow large textbook uploads (Next.js limits FormData to 4MB by default)
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  serverExternalPackages: ['canvas', 'pdf-parse', 'pdfjs-dist'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias.canvas = false;
    }
    return config;
  },
  turbopack: {
    root: '/Users/abdulrehan/Documents/Assessra',
  },
};


