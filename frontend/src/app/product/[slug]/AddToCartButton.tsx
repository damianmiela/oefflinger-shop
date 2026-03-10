"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({ productId }: { productId: number }) {
  const { addItem, loading } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = async () => {
    await addItem(productId);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="mt-8 w-full rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white transition hover:bg-primary-light disabled:opacity-50 sm:w-auto"
    >
      {loading ? "Wird hinzugefügt…" : added ? "Hinzugefügt!" : "In den Warenkorb"}
    </button>
  );
}
