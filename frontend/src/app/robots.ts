import type { MetadataRoute } from "next";
import { SITE_URL, INDEXING_ENABLED, absoluteUrl } from "@/lib/seo";

/** Functional routes that should never be crawled (no SEO value, user-specific). */
const DISALLOW_FUNCTIONAL = [
  "/warenkorb",
  "/checkout",
  "/kasse",
  "/zur-kasse",
  "/bestellung-bestaetigt",
  "/konto",
];

/**
 * robots.txt (P2-14a → §4.5).
 * Pre-launch (INDEXING_ENABLED=false) the whole site is disallowed so the
 * temporary host never gets indexed. At the oefflinger.de cutover, set
 * NEXT_PUBLIC_ALLOW_INDEXING=true to allow crawling and publish the sitemap.
 * See _docs/LAUNCH-SEO-UNBLOCK.md.
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXING_ENABLED) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: DISALLOW_FUNCTIONAL },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
