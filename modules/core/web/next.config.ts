import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // export while deploying to GitHub Pages
  output: "export",
  basePath: isProd ? "/lifeOS" : "",
  assetPrefix: isProd ? "/lifeOS/" : "",
};

export default nextConfig;
