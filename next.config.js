/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ag-grid.com',
      },
    ],
  },
};

module.exports = nextConfig;
