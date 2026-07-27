import type { NextConfig } from "next";

const backendUrl = 'https://project-sewtech-mart.onrender.com' 

const nextConfig: NextConfig = {
  transpilePackages: ["recharts"],
  async rewrites() {
    return [
       {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
    
