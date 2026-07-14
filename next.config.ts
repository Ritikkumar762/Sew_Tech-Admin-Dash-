import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["recharts"],
  async rewrites() {
    return [
       {
        source: "/api/v1/:path*",
        destination: "https://project-sewtech-mart.onrender.com/api/v1/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://project-sewtech-mart.onrender.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
