import type { CartItemData } from "@/types";

/**
 * Build WooCommerce checkout-link URL.
 * See: https://developer.woocommerce.com/docs/best-practices/urls-and-routing/checkout-urls/
 */
export function buildCheckoutUrl(items: CartItemData[], coupon?: string): string {
  const base = process.env.NEXT_PUBLIC_WP_URL || "http://localhost:4001";
  const products = items.map((i) => `${i.id}:${i.quantity}`).join(",");
  const params = new URLSearchParams({ products });
  if (coupon) params.set("coupon", coupon);
  return `${base}/checkout-link/?${params.toString()}`;
}
