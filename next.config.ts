import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true
  },
  basePath: isGitHubPages ? "/marketpulse-ai" : "",
  assetPrefix: isGitHubPages ? "/marketpulse-ai/" : ""
};

export default nextConfig;
