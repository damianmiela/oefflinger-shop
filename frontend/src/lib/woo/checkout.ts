import type { CartItemData } from "@/types";

/**
 * Build checkout URL – goes to frontend /checkout which embeds WordPress checkout in iframe.
 * Header/footer come from frontend (single source of truth).
 */
export function buildCheckoutUrl(items: CartItemData[], coupon?: string): string {
  const products = items.map((i) => `${i.id}:${i.quantity}`).join(",");
  const params = new URLSearchParams({ products });
  if (coupon) params.set("coupon", coupon);
  return `/checkout?${params.toString()}`;
}
