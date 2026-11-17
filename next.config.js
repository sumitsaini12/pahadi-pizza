/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this folder so Next does not pick up a parent lockfile.
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'i0.wp.com' },
      { protocol: 'https', hostname: 'pms-tool.s3.eu-west-1.amazonaws.com' },
    ],
  },
};

module.exports = nextConfig;
