"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({ productId }: { productId: number }) {
  const { addItem, loading } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleClick = async () => {
    await addItem(productId, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
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
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
          disabled={loading}
          className="h-11 w-16 border-0 bg-transparent text-center text-lg font-medium [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          disabled={loading}
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
    </div>
  );
}
