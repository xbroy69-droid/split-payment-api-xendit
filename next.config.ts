iimport type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: false // pakai pages router, bukan app router
  }
};

export default nextConfig;

