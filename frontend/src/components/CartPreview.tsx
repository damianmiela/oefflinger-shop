"use client";

/**
 * Header cart control. Opens the mini-cart drawer (P3-20a) on click and shows the
 * item-count badge + a brief pulse after an add. The full cart view lives in the
 * drawer (and the /warenkorb fallback page).
 */
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";

const CART_PULSE_DELAY_MS = 280;

export function CartPreview() {
  const { cart, justAddedToCart, openCart } = useCart();
  const [showPulse, setShowPulse] = useState(false);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!justAddedToCart) {
      setShowPulse(false);
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
        pulseTimeoutRef.current = null;
      }
      return;
    }
    pulseTimeoutRef.current = setTimeout(() => {
      setShowPulse(true);
      pulseTimeoutRef.current = setTimeout(() => setShowPulse(false), 900);
    }, CART_PULSE_DELAY_MS);
    return () => {
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, [justAddedToCart]);

  const itemCount = cart?.items_count ?? 0;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={itemCount > 0 ? `Warenkorb öffnen, ${itemCount} Artikel` : "Warenkorb öffnen"}
      className="hover:bg-primary/10 hover:text-primary relative flex items-center gap-1.5 rounded-full px-4 py-2 pr-6 text-sm font-medium text-gray-700 transition-colors duration-200"
    >
      {showPulse && (
        <span className="cart-pulse-ring absolute inset-0 -m-2 rounded-full border-2" aria-hidden />
      )}
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span className="hidden lg:inline">Warenkorb</span>
      {itemCount > 0 && (
        <span className="bg-accent text-primary-dark absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
          {itemCount}
        </span>
      )}
    </button>
  );
}
