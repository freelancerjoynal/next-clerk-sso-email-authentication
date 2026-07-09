import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      new URL('https://img.clerk.com/**'),
    ],
  },
};

export default nextConfig;
