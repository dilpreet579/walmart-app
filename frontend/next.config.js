/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i5.walmartimages.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig