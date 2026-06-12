import type { CartItemData } from "@/types";

/**
 * Build checkout URL – goes through /zur-kasse (login-or-guest gate) which
 * forwards to the native /kasse checkout. The cart itself travels via the
 * Cart-Token, so no item params are needed anymore (items kept for signature
 * compatibility).
 */
export function buildCheckoutUrl(_items: CartItemData[], coupon?: string): string {
  const params = new URLSearchParams();
  if (coupon) params.set("coupon", coupon);
  const qs = params.toString();
  return qs ? `/zur-kasse?${qs}` : "/zur-kasse";
}
