import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/expert",
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/expert/login",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
