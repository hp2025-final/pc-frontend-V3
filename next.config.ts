import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable Next.js image optimization since we're using Cloudflare
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.pcwalaonline.com",
      },
      {
        protocol: "https",
        hostname: "pcwalaonline.com",
      },
      {
        protocol: "https",
        hostname: "www.pcwalaonline.com",
      },
    ],
  },
  // Enable output: 'standalone' for optimized Docker/production builds
  output: 'standalone',
};

export default nextConfig;
