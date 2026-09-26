/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
}

if (process.env.NODE_ENV !== 'production' && process.env.DEV_APP_URL) {
  process.env.NEXT_PUBLIC_APP_URL = process.env.DEV_APP_URL
  nextConfig.env = { NEXT_PUBLIC_APP_URL: process.env.DEV_APP_URL }
}

module.exports = nextConfig
