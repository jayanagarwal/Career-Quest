import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable experimental features that cause build hangs
  experimental: {
    // @ts-ignore - force webpack for production builds
    turbo: undefined,
  },
  // Explicitly disable Turbopack for builds
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
