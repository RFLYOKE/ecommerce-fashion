// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // boleh true biar gak pakai optimizer next
    domains: [
      "lyzj3ipx9y.ufs.sh",
      "api-cuti.naditechno.id",
      "api-jasa.naditechno.id",
      "api-e-commerce-blackboxinc.inovasidigitalpurwokerto.id",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-cuti.naditechno.id",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "api-jasa.naditechno.id",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "api-e-commerce-blackboxinc.inovasidigitalpurwokerto.id",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;