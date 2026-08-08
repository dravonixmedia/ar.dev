import type { NextConfig } from "next";

// Static export: the whole site is prerendered (no SSR/dynamic routes, no
// server actions, no API routes), so it deploys as plain static files —
// simplest and most reliable path for Cloudflare Workers static assets.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
