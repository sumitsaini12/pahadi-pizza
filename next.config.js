/** @type {import('next').NextConfig} */
const nextConfig = {
  // Improve Turbopack stability
  experimental: {
    turbo: {
      resolveAlias: {
        // Ensure proper module resolution
      },
    },
  },
}

module.exports = nextConfig

