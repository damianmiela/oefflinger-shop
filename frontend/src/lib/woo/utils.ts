/**
 * Extract product slug from WooCommerce permalink.
 * e.g. "https://store.com/product/beanie/" -> "beanie"
 */
export function slugFromPermalink(permalink?: string): string | null {
  if (!permalink) return null;
  const match = permalink.match(/\/product\/([^/]+)\/?/);
  return match ? match[1] : null;
}
