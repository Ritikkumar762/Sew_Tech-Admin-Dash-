import type { NextConfig } from "next";

const backendUrl = process.env.NODE_ENV === 'production' 
  ? 'https://project-sewtech-mart.onrender.com' 
  : 'http://127.0.0.1:8000';

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
    
