"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Cart } from "@/types";
import * as wooApi from "@/lib/woo/api";

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (itemKey: string) => Promise<void>;
  updateItem: (itemKey: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_TOKEN_KEY = "oefflinger_cart_token";

function getStoredToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(CART_TOKEN_KEY) ?? undefined;
}

function storeToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_TOKEN_KEY, token);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await wooApi.getCart(getStoredToken());
      setCart(data);
    } catch {
      // Cart may not be available yet (WooCommerce still setting up)
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(
    async (productId: number, quantity: number = 1) => {
      setLoading(true);
      try {
        const data = await wooApi.addToCart(productId, quantity, getStoredToken());
        setCart(data);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const removeItem = useCallback(async (itemKey: string) => {
    setLoading(true);
    try {
      const data = await wooApi.removeFromCart(itemKey, getStoredToken());
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (itemKey: string, quantity: number) => {
    setLoading(true);
    try {
      const data = await wooApi.updateCartItem(itemKey, quantity, getStoredToken());
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, removeItem, updateItem, refreshCart }}>
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
