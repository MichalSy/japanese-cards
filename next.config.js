const { withAikoApp } = require('@michalsy/aiko-webapp-core/next-config')

/** @type {import('next').NextConfig} */
const nextConfig = {}

const config = withAikoApp(nextConfig, {
  clientPages: []
})

if (process.env.NODE_ENV !== 'production' && process.env.DEV_APP_URL) {
  process.env.NEXT_PUBLIC_APP_URL = process.env.DEV_APP_URL
  if (config.env) config.env.NEXT_PUBLIC_APP_URL = process.env.DEV_APP_URL
}

module.exports = config
