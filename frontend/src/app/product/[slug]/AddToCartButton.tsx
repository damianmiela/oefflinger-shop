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
    (n): n is number => typeof n === "number" && n >= 0
  );
  const effectiveMax = candidates.length > 0 ? Math.min(...candidates, 9999) : 9999;

  const [quantity, setQuantity] = useState(1);

  const handleClick = async () => {
    clearError();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    const qty = Math.min(Math.max(1, quantity), effectiveMax);
    const ok = await addItem(product.id, qty);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center rounded-lg border border-gray-300">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={loading}
          className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Menge verringern"
        >
          &minus;
        </button>
        <input
          type="number"
          min={1}
          max={effectiveMax}
          value={quantity}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10) || 1;
            setQuantity(Math.max(1, Math.min(v, effectiveMax)));
          }}
          disabled={loading}
          className="h-11 w-16 border-0 bg-transparent text-center text-lg font-medium [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(effectiveMax, q + 1))}
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
        className={`cursor-pointer rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white transition duration-150 hover:bg-primary-light active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${isAnimating ? "animate-button-pop" : ""}`}
      >
        {loading ? "Wird hinzugefügt…" : added ? "Hinzugefügt!" : "In den Warenkorb"}
      </button>
      {lastError && (
        <p className="w-full text-sm text-amber-600" role="alert">
          {lastError.message}
        </p>
      )}
    </div>
  );
}
