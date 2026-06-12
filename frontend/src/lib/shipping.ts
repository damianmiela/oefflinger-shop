/**
 * Shipping facts shown in the frontend (cart estimate, PDP hint, /versand page).
 * MUST be kept in sync with the WooCommerce shipping settings and /versand.
 */

/** Flat DHL rate within Germany (minor units) */
export const SHIPPING_FLAT_CENTS = 490;

/** Free shipping from this order subtotal (minor units, incl. VAT) */
export const FREE_SHIPPING_FROM_CENTS = 10000;

/** Estimated shipping for a given gross subtotal (minor units). */
export function estimateShippingCents(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_FROM_CENTS ? 0 : SHIPPING_FLAT_CENTS;
}

/** Amount (minor units) still missing for free shipping; 0 when reached. */
export function missingForFreeShipping(subtotalCents: number): number {
  return Math.max(0, FREE_SHIPPING_FROM_CENTS - subtotalCents);
}
