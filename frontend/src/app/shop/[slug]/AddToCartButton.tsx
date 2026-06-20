"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, loading, lastError, clearError } = useCart();
  const [added, setAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const maxFromLimits = product.quantity_limits?.maximum;
  const maxFromLowStock = product.low_stock_remaining;
  const maxFromStock = product.stock_quantity;
  const candidates = [maxFromLimits, maxFromLowStock, maxFromStock].filter(
    (n): n is number => typeof n === "number" && n >= 0,
  );
  const effectiveMax = candidates.length > 0 ? Math.min(...candidates, 9999) : 9999;

  /** Raw input value – may be empty while typing; clamped for all actions */
  const [quantityInput, setQuantityInput] = useState("1");
  const quantity = Math.min(Math.max(1, parseInt(quantityInput, 10) || 1), effectiveMax);

  const handleClick = async () => {
    clearError();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    const ok = await addItem(product.id, quantity);
    if (ok) {
      // The mini-cart drawer auto-opens on a successful add (CartContext) — that's
      // the confirmation. We just flash the button label briefly.
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center rounded-lg border border-gray-300">
        <button
          type="button"
          onClick={() => setQuantityInput(String(Math.max(1, quantity - 1)))}
          disabled={loading || quantity <= 1}
          className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Menge verringern"
        >
          &minus;
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          min={1}
          max={effectiveMax}
          value={quantityInput}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d+$/.test(value)) setQuantityInput(value);
          }}
          onBlur={() => setQuantityInput(String(quantity))}
          disabled={loading}
          aria-label="Menge"
          className="h-11 w-16 border-0 bg-transparent text-center text-lg font-medium focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setQuantityInput(String(Math.min(effectiveMax, quantity + 1)))}
          disabled={loading || quantity >= effectiveMax}
          className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Menge erhöhen"
        >
          +
        </button>
      </div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`min-w-52 cursor-pointer rounded-lg bg-primary px-6 py-3 text-center text-lg font-semibold text-white transition duration-150 hover:bg-primary-light active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${isAnimating ? "animate-button-pop" : ""}`}
      >
        {loading ? "Wird hinzugefügt…" : added ? "Hinzugefügt!" : "In den Warenkorb"}
      </button>
      {lastError && (
        <p className="w-full text-sm text-amber-700" role="alert">
          {lastError.message}
        </p>
      )}
    </div>
  );
}
