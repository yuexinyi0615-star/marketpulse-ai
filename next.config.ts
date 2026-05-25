import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isGitHubPages ? "export" : undefined,
  images: {
    unoptimized: true
  },
  basePath: isGitHubPages ? "/marketpulse-ai" : "",
  assetPrefix: isGitHubPages ? "/marketpulse-ai/" : "",
  allowedDevOrigins: ["127.0.0.1"]
};

export default nextConfig;
