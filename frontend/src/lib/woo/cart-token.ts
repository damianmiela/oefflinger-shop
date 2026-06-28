/**
 * Cart-Token storage. The headless WooCommerce cart is identified only by a
 * Cart-Token string, so we keep one ACTIVE token (used by every cart request)
 * plus a per-identity "slot" — each viewer (the guest, or a specific logged-in
 * user) gets their own parked cart. CartContext swaps the active token on every
 * login / logout / account switch, so carts (and coupons) never leak between
 * accounts.
 */

const ACTIVE_KEY = "oefflinger_cart_token";
const SLOT_PREFIX = "oefflinger_cart_slot_";

const isBrowser = () => typeof window !== "undefined";

/** A cart identity: "guest" or `user_<id>`. */
export type CartIdentity = string;

export function identityFor(userId: number | null | undefined): CartIdentity {
  return userId != null ? `user_${userId}` : "guest";
}

/* ---- active token: what every cart API call uses ---- */

export function getStoredToken(): string | undefined {
  if (!isBrowser()) return undefined;
  return localStorage.getItem(ACTIVE_KEY) ?? undefined;
}

export function storeToken(token: string): void {
  if (isBrowser()) localStorage.setItem(ACTIVE_KEY, token);
}

export function clearToken(): void {
  if (isBrowser()) localStorage.removeItem(ACTIVE_KEY);
}

/* ---- per-identity slots: each viewer's parked cart ---- */

export function getSlotToken(identity: CartIdentity): string | undefined {
  if (!isBrowser()) return undefined;
  return localStorage.getItem(SLOT_PREFIX + identity) ?? undefined;
}

export function setSlotToken(identity: CartIdentity, token: string): void {
  if (isBrowser()) localStorage.setItem(SLOT_PREFIX + identity, token);
}

export function clearSlotToken(identity: CartIdentity): void {
  if (isBrowser()) localStorage.removeItem(SLOT_PREFIX + identity);
}
