import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/flock-ml',
        destination: 'https://flockml.qd.je',
        permanent: true,
      },
      {
        source: '/flock-ml/:path*',
        destination: 'https://flockml.qd.je/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

