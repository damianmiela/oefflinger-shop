import type { ProductReview } from "@/types";

/**
 * Reviews data layer.
 * - READ: WooCommerce Store API (/wc/store/v1/products/reviews) — public, no auth.
 * - WRITE: custom WP endpoint (oeff/v1/reviews) — moderated, honeypot + Turnstile + rate-limit.
 */

const WP_URL = process.env.NEXT_PUBLIC_WP_URL || "http://localhost:4001";
const SUBMIT_ENDPOINT = `${WP_URL.replace(/\/$/, "")}/wp-json/oeff/v1/reviews`;

/** Store API base — internal host on the server, public URL in the browser (mirrors api.ts). */
function storeBase(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_WC_STORE_API!;
  }
  return process.env.WC_INTERNAL_STORE_URL || process.env.NEXT_PUBLIC_WC_STORE_API!;
}

export interface ReviewsPage {
  reviews: ProductReview[];
  total: number;
  totalPages: number;
}

/** Fetch approved reviews for a product (paginated). Newest first. */
export async function getProductReviews(
  productId: number,
  page: number = 1,
  perPage: number = 10,
): Promise<ReviewsPage> {
  const base = storeBase();
  const offset = (page - 1) * perPage;
  const url = `${base}/products/reviews?product_id=${productId}&per_page=${perPage}&offset=${offset}&order=desc&orderby=date_gmt`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    // ISR on the server; ignored client-side. Tagged for future on-demand purge.
    ...(typeof window === "undefined" ? { next: { revalidate: 300, tags: ["reviews"] } } : {}),
  });

  if (!res.ok) {
    throw new Error(`reviews fetch failed: ${res.status}`);
  }

  const reviews = (await res.json()) as ProductReview[];
  const total = parseInt(res.headers.get("X-WP-Total") ?? String(reviews.length), 10);
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1", 10);
  return { reviews, total, totalPages };
}

export interface SubmitReviewInput {
  productId: number;
  rating: number;
  reviewer: string;
  /** Optional review text (rating-only reviews allowed) */
  review?: string;
  turnstileToken?: string;
  /** Honeypot — must stay empty */
  website?: string;
}

/**
 * Submit a review for moderation. Resolves with the (German) success message,
 * throws an Error carrying the server message on failure.
 */
export async function submitReview(input: SubmitReviewInput): Promise<string> {
  const res = await fetch(SUBMIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: input.productId,
      rating: input.rating,
      reviewer: input.reviewer,
      review: input.review ?? "",
      turnstile_token: input.turnstileToken,
      website: input.website ?? "",
    }),
  });

  const data = (await res.json().catch(() => null)) as { message?: string } | null;
  if (!res.ok) {
    throw new Error(
      (data && typeof data.message === "string" && data.message) ||
        "Ihre Bewertung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    );
  }
  return (data && data.message) || "Vielen Dank! Ihre Bewertung wird nach einer kurzen Prüfung veröffentlicht.";
}
