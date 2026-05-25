import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@iranautism/api-client",
    "@iranautism/design-tokens",
    "@iranautism/icons",
    "@iranautism/types",
    "@iranautism/ui",
    "@iranautism/validation",
  ],
  turbopack: {
    root: resolve("../.."),
  },
};

export default nextConfig;
