import type { NextConfig } from "next";

/**
 * next/image loads WooCommerce media from the WordPress host. Derive that host
 * from NEXT_PUBLIC_WP_URL so the oefflinger.de cutover (D5 / P0-7a) is
 * config-only — no hardcoded IPs in code. Falls back to localhost for dev.
 */
const wpUrl = process.env.NEXT_PUBLIC_WP_URL ?? "http://localhost:4001";
const wpHost = new URL(wpUrl);

const nextConfig: NextConfig = {
  images: {
    // In local Docker the browser reaches WordPress on localhost:4001 but the Next.js
    // server inside its container can't, so the dev server skips the image optimizer.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: wpHost.protocol.replace(":", "") as "http" | "https",
        hostname: wpHost.hostname,
        ...(wpHost.port ? { port: wpHost.port } : {}),
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // P2-17b: German slugs are canonical; 301 the old English routes.
      { source: "/cart", destination: "/warenkorb", permanent: true },
      { source: "/product/:slug", destination: "/shop/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
