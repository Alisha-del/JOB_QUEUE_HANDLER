/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/import/:path*',
        destination: 'http://localhost:5000/import/:path*', // Proxy to backend
      },
      // Add more proxies if needed
    ];
  },
};

export default nextConfig;