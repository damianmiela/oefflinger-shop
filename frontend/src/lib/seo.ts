/**
 * Centralized SEO config (P2-14 → §4.5).
 *
 * SITE_URL          – public base URL of THIS storefront. Env-driven per D5
 *                     (no hardcoded domains in app code); falls back to the
 *                     canonical production domain.
 * INDEXING_ENABLED  – search-engine indexing is OFF until launch so the
 *                     temporary IP host never gets indexed. Flip
 *                     NEXT_PUBLIC_ALLOW_INDEXING=true at the oefflinger.de
 *                     cutover. See _docs/launch/LAUNCH-SEO-UNBLOCK.md.
 */

const FALLBACK_SITE_URL = "https://oefflinger.de";

/** Public base URL without a trailing slash, e.g. "https://oefflinger.de". */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");

/** Whether crawlers may index the site. Off unless explicitly enabled at launch. */
export const INDEXING_ENABLED = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/** Default Open Graph / Twitter image. Replace with a 1200×630 asset before launch. */
export const DEFAULT_OG_IMAGE = "/logo/logo-wb.png";

/** Build an absolute URL from a path. Sitemap/robots require absolute URLs. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * `robots` metadata for public pages: noindex everywhere until launch, then
 * undefined (Next falls back to the default indexable behaviour). Spread into
 * the root metadata so every page inherits it.
 */
export const robotsMetadata = INDEXING_ENABLED ? undefined : ({ index: false, follow: false } as const);

/** Force noindex regardless of the global flag (functional pages: cart, checkout, account…). */
export const noindexMetadata = { index: false, follow: false } as const;

/**
 * Turn raw HTML (or long plain text) into a clean meta description:
 * strip tags, decode the few common entities, collapse whitespace, truncate
 * on a word boundary.
 */
export function toMetaDescription(html: string, max = 160): string {
  const text = (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "").trim() + "…";
}
