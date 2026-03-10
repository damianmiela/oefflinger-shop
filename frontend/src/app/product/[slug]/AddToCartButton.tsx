"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, loading, lastError, clearError } = useCart();
  const [added, setAdded] = useState(false);

  const max = product.quantity_limits?.maximum ?? product.low_stock_remaining ?? 9999;
  const effectiveMax = typeof max === "number" && max < 9999 ? max : 9999;

  const [quantity, setQuantity] = useState(1);

  const handleClick = async () => {
    clearError();
    const qty = Math.min(Math.max(1, quantity), effectiveMax);
    await addItem(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
        className="cursor-pointer rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Wird hinzugefügt…" : added ? "Hinzugefügt!" : "In den Warenkorb"}
      </button>
      {lastError && (
        <p className="w-full text-sm text-amber-600" role="alert">
          {lastError.message.replace(/^WooCommerce Store API error: /, "")}
        </p>
      )}
    </div>
  );
}
