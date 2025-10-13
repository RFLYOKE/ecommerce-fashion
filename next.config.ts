import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: [
      "lyzj3ipx9y.ufs.sh",
      "api-cuti.naditechno.id",
      "api-jasa.naditechno.id"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-cuti.naditechno.id',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'api-jasa.naditechno.id',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
