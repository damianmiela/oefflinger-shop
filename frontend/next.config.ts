import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4001",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "91.98.112.186",
        port: "4001",
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
