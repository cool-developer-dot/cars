import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev server only: let phones/tablets on the local network load dev assets
  // (/_next/*, including images). Without these, opening the site on a phone
  // via this Mac's IP blocks every next/image request.
  allowedDevOrigins: [
    "127.0.0.1",
    "127.0.2.2",
    "localhost",
    "10.*.*.*",
    "192.168.*.*",
    "172.*.*.*",
    "*.local",
  ],
  async redirects() {
    return [{ source: "/help", destination: "/faqs", permanent: true }];
  },
  images: {
    // Every image in /public is already a right-sized WebP, so skip the
    // on-demand optimizer: files are served straight from disk/CDN with no
    // first-request processing delay, and match the <link rel="preload"> URLs.
    unoptimized: true,
  },
};

export default nextConfig;
