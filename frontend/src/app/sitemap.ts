import type { MetadataRoute } from "next";
import { getProductsPaginated } from "@/lib/woo/api";
import { COLLOIDAL_METALS } from "@/data/colloidal-metals";
import { absoluteUrl } from "@/lib/seo";

// Refresh the sitemap hourly (catalog changes are infrequent).
export const revalidate = 3600;

/**
 * XML sitemap (P2-14a → §4.5). Lists only public, indexable routes:
 * content/legal pages, the knowledge hub per metal, and every product.
 * Functional routes (cart, checkout, account…) are intentionally excluded.
 * Falls back gracefully to static + knowledge routes if WordPress is unreachable.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/produkte"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/versand"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/kontakt"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/widerruf"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/impressum"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/datenschutz"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/agb"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const metalEntries: MetadataRoute.Sitemap = COLLOIDAL_METALS.map((m) => ({
    url: absoluteUrl(`/produkte/${m.id}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const { products } = await getProductsPaginated(1, 100);
    productEntries = products.map((p) => ({
      url: absoluteUrl(`/shop/${p.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // WordPress unreachable – return the static + knowledge routes we already have.
  }

  return [...staticEntries, ...metalEntries, ...productEntries];
}
