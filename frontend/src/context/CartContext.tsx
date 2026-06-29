"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Cart } from "@/types";
import * as wooApi from "@/lib/woo/api";
import { toUserMessage } from "@/lib/woo/api";
import { useAuth } from "@/context/AuthContext";
import {
  getStoredToken,
  storeToken,
  clearToken,
  identityFor,
  getSlotToken,
  setSlotToken,
  clearSlotToken,
  type CartIdentity,
} from "@/lib/woo/cart-token";

export interface CartError {
  message: string;
}

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  lastError: CartError | null;
  /** True briefly after an item is added – triggers header cart animation */
  justAddedToCart: boolean;
  clearError: () => void;
  /** Resolves true when the item was added successfully */
  addItem: (productId: number, quantity?: number) => Promise<boolean>;
  /** Add a (fixed) Set to the cart via the oeff-sets Store API. */
  addSet: (setId: number) => Promise<boolean>;
  removeItem: (itemKey: string) => Promise<void>;
  updateItem: (itemKey: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  /** Mini-cart drawer open state */
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const JUST_ADDED_DURATION_MS = 1200;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<CartError | null>(null);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const justAddedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user, loading: authLoading } = useAuth();
  /** undefined = auth not resolved yet; otherwise the current cart identity */
  const prevIdentityRef = useRef<CartIdentity | undefined>(undefined);

  const clearError = useCallback(() => setLastError(null), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const triggerJustAdded = useCallback(() => {
    if (justAddedTimeoutRef.current) clearTimeout(justAddedTimeoutRef.current);
    setJustAddedToCart(true);
    justAddedTimeoutRef.current = setTimeout(() => {
      setJustAddedToCart(false);
      justAddedTimeoutRef.current = null;
    }, JUST_ADDED_DURATION_MS);
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data, token } = await wooApi.getCart(getStoredToken());
      setCart(data);
      if (token) storeToken(token);
    } catch {
      // Cart may not be available yet (WooCommerce still setting up)
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cart identity = the current viewer ("guest" or `user_<id>`). The ACTIVE cart
   * token always mirrors the current identity's own cart, so items and coupons
   * can never leak across accounts. Every login / logout / account-switch parks
   * the outgoing identity's cart under its slot and activates the incoming one.
   * The only merge is guest → user, performed once, after which the guest slot is
   * reset so the same items can never merge twice.
   */
  const switchIdentity = useCallback(
    async (prev: CartIdentity, next: CartIdentity) => {
      // 1) Park the outgoing identity's active cart under its own slot.
      const active = getStoredToken();
      if (active) setSlotToken(prev, active);

      // 2) Resolve the incoming identity's cart.
      let nextToken = getSlotToken(next);

      // Guest → user: adopt the guest cart (first login on this browser) or merge
      // the guest items into the user's saved cart (returning user). Either way,
      // reset the guest slot afterwards so nothing can merge a second time.
      if (prev === "guest" && next !== "guest") {
        const guestToken = active;
        if (!nextToken && guestToken) {
          setSlotToken(next, guestToken);
          nextToken = guestToken;
        } else if (guestToken && nextToken && guestToken !== nextToken) {
          try {
            const { data: guestCart } = await wooApi.getCart(guestToken);
            let mergeToken = nextToken;
            for (const item of guestCart.items) {
              const res = await wooApi.addToCart(item.id, item.quantity, mergeToken);
              if (res.token) mergeToken = res.token;
            }
            nextToken = mergeToken;
            setSlotToken(next, nextToken);
          } catch {
            // best-effort; the user still gets their own cart
          }
        }
        clearSlotToken("guest");
      }

      // 3) Activate the incoming cart (or start fresh if this identity has none).
      if (nextToken) storeToken(nextToken);
      else clearToken();
      setCart(null);
      await refreshCart();
    },
    [refreshCart],
  );

  /** First load (no transition): point the active token at this identity's cart. */
  const initIdentity = useCallback(
    async (identity: CartIdentity) => {
      const active = getStoredToken();
      const slot = getSlotToken(identity);
      if (slot) {
        if (slot !== active) storeToken(slot);
      } else if (active) {
        setSlotToken(identity, active); // claim the existing cart for this identity
      }
      await refreshCart();
    },
    [refreshCart],
  );

  useEffect(() => {
    if (authLoading) return;
    const curr = identityFor(user?.id ?? null);
    const prev = prevIdentityRef.current;
    prevIdentityRef.current = curr;
    if (prev === undefined) void initIdentity(curr);
    else if (prev !== curr) void switchIdentity(prev, curr);
  }, [user, authLoading, initIdentity, switchIdentity]);

  const addItem = useCallback(
    async (productId: number, quantity: number = 1) => {
      setLoading(true);
      setLastError(null);
      try {
        const existingItem = cart?.items.find((i) => i.id === productId);
        if (existingItem) {
          const max = existingItem.quantity_limits?.maximum ?? 9999;
          const newQty = Math.min(existingItem.quantity + quantity, max);
          const { data, token } = await wooApi.updateCartItem(
            existingItem.key,
            newQty,
            getStoredToken(),
          );
          setCart(data);
          if (token) storeToken(token);
        } else {
          const { data, token } = await wooApi.addToCart(productId, quantity, getStoredToken());
          setCart(data);
          if (token) storeToken(token);
        }
        triggerJustAdded();
        setIsOpen(true);
        return true;
      } catch (err) {
        setLastError({ message: toUserMessage(err) });
        await refreshCart();
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cart?.items, refreshCart, triggerJustAdded],
  );

  const addSet = useCallback(
    async (setId: number) => {
      setLoading(true);
      setLastError(null);
      try {
        const { data, token } = await wooApi.addSet(setId, getStoredToken());
        setCart(data);
        if (token) storeToken(token);
        triggerJustAdded();
        setIsOpen(true);
        return true;
      } catch (err) {
        setLastError({ message: toUserMessage(err) });
        await refreshCart();
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refreshCart, triggerJustAdded],
  );

  const removeItem = useCallback(
    async (itemKey: string) => {
      setLoading(true);
      setLastError(null);
      try {
        const { data, token } = await wooApi.removeFromCart(itemKey, getStoredToken());
        setCart(data);
        if (token) storeToken(token);
      } catch (err) {
        setLastError({ message: toUserMessage(err) });
        await refreshCart();
      } finally {
        setLoading(false);
      }
    },
    [refreshCart],
  );

  const updateItem = useCallback(
    async (itemKey: string, quantity: number) => {
      setLoading(true);
      setLastError(null);
      try {
        const item = cart?.items.find((i) => i.key === itemKey);
        const max = item?.quantity_limits?.maximum ?? 9999;
        const clamped = Math.max(1, Math.min(quantity, max));
        const { data, token } = await wooApi.updateCartItem(itemKey, clamped, getStoredToken());
        setCart(data);
        if (token) storeToken(token);
      } catch (err) {
        setLastError({ message: toUserMessage(err) });
        await refreshCart();
      } finally {
        setLoading(false);
      }
    },
    [cart?.items, refreshCart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        lastError,
        justAddedToCart,
        clearError,
        addItem,
        addSet,
        removeItem,
        updateItem,
        refreshCart,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
