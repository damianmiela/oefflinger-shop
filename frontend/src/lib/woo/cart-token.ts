/**
 * Cart-Token storage (P1-11f): the active cart token plus per-user mappings,
 * so carts are user-bound instead of browser-bound.
 */

const CART_TOKEN_KEY = "oefflinger_cart_token";
const GUEST_STASH_KEY = "oefflinger_cart_token_guest_stash";

const isBrowser = () => typeof window !== "undefined";

export function getStoredToken(): string | undefined {
  if (!isBrowser()) return undefined;
  return localStorage.getItem(CART_TOKEN_KEY) ?? undefined;
}

export function storeToken(token: string): void {
  if (isBrowser()) localStorage.setItem(CART_TOKEN_KEY, token);
}

export function clearToken(): void {
  if (isBrowser()) localStorage.removeItem(CART_TOKEN_KEY);
}

function userKey(userId: number): string {
  return `${CART_TOKEN_KEY}_user_${userId}`;
}

export function getUserToken(userId: number): string | undefined {
  if (!isBrowser()) return undefined;
  return localStorage.getItem(userKey(userId)) ?? undefined;
}

export function storeUserToken(userId: number, token: string): void {
  if (isBrowser()) localStorage.setItem(userKey(userId), token);
}

export function getGuestStash(): string | undefined {
  if (!isBrowser()) return undefined;
  return localStorage.getItem(GUEST_STASH_KEY) ?? undefined;
}

export function setGuestStash(token: string): void {
  if (isBrowser()) localStorage.setItem(GUEST_STASH_KEY, token);
}

export function clearGuestStash(): void {
  if (isBrowser()) localStorage.removeItem(GUEST_STASH_KEY);
}
