import type { WPPage } from "@/types";

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_WP_API_URL!;
  }
  return process.env.WP_INTERNAL_URL || process.env.NEXT_PUBLIC_WP_API_URL!;
}

async function wpFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getSiteInfo(): Promise<{ name: string; description: string; url: string }> {
  return wpFetch("/");
}

export async function getPages(): Promise<WPPage[]> {
  return wpFetch<WPPage[]>("/wp/v2/pages");
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const pages = await wpFetch<WPPage[]>(`/wp/v2/pages?slug=${slug}`);
  return pages[0] ?? null;
}
