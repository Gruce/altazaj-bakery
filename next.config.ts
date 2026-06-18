import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray ~/pnpm-lock.yaml otherwise confuses Turbopack).
  turbopack: { root: __dirname },
  // better-sqlite3 is a native module — keep it external to the server bundle.
  serverExternalPackages: ['better-sqlite3'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
