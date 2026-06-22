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
  getUserToken,
  storeUserToken,
  getGuestStash,
  setGuestStash,
  clearGuestStash,
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
  /** Add a Set (oeff-sets) — adds its components as a grouped, discounted unit */
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
  /** undefined = auth not resolved yet; null = guest */
  const prevUserIdRef = useRef<number | null | undefined>(undefined);

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
   * P1-11f: bind carts to users.
   * Login: guest cart becomes the user's cart (no previous user cart), or guest
   * items are merged into the user's existing cart. Logout: persist the user's
   * cart under their key, then restore the stashed guest cart or start fresh.
   */
  const handleLogin = useCallback(
    async (userId: number) => {
      const guestToken = getStoredToken();
      const userToken = getUserToken(userId);

      if (!userToken) {
        // First login on this browser: the guest cart simply becomes the user's cart
        if (guestToken) storeUserToken(userId, guestToken);
        await refreshCart();
        return;
      }
      if (userToken === guestToken) {
        await refreshCart();
        return;
      }
      // Merge guest items into the user's existing cart (best effort)
      try {
        if (guestToken) {
          const { data: guestCart } = await wooApi.getCart(guestToken);
          if (guestCart.items.length > 0) {
            for (const item of guestCart.items) {
              await wooApi.addToCart(item.id, item.quantity, userToken);
            }
          } else {
            // Keep the (empty) guest cart for after logout
            setGuestStash(guestToken);
          }
        }
      } catch {
        // merge is best-effort – the user still gets their own cart
      }
      storeToken(userToken);
      await refreshCart();
    },
    [refreshCart],
  );

  const handleLogout = useCallback(
    (previousUserId: number) => {
      const active = getStoredToken();
      if (active) storeUserToken(previousUserId, active);
      const stash = getGuestStash();
      if (stash) {
        storeToken(stash);
        clearGuestStash();
      } else {
        clearToken(); // fresh anonymous cart
      }
      setCart(null);
      void refreshCart();
    },
    [refreshCart],
  );

  useEffect(() => {
    if (authLoading) return;
    const currentId = user?.id ?? null;
    const prevId = prevUserIdRef.current;
    prevUserIdRef.current = currentId;

    if (prevId === undefined) {
      // Initial auth resolution (page load), no transition
      if (currentId != null) {
        const userToken = getUserToken(currentId);
        const active = getStoredToken();
        if (userToken && userToken !== active) {
          if (active) setGuestStash(active);
          storeToken(userToken);
          void refreshCart();
        } else if (!userToken && active) {
          storeUserToken(currentId, active);
        }
      }
      return;
    }
    if (prevId === null && currentId != null) void handleLogin(currentId);
    else if (prevId != null && currentId === null) handleLogout(prevId);
  }, [user, authLoading, handleLogin, handleLogout, refreshCart]);

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

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

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
