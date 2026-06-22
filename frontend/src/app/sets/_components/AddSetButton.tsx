"use client";

/**
 * Adds a Set to the cart via the Store API (CartContext.addSet → oeff-sets
 * update-callback). The mini-cart drawer auto-opens on success. Uses a local
 * busy flag so multiple set buttons on a listing don't all disable together.
 */
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function AddSetButton({
  setId,
  available,
  className = "",
}: {
  setId: number;
  available: boolean;
  className?: string;
}) {
  const { addSet } = useCart();
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);

  if (!available) {
    return (
      <button
        type="button"
        disabled
        className={`cursor-not-allowed rounded-lg bg-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-500 ${className}`}
      >
        Nicht verfügbar
      </button>
    );
  }

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    const ok = await addSet(setId);
    setBusy(false);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={`bg-primary hover:bg-primary-light cursor-pointer rounded-lg px-5 py-2.5 text-center text-sm font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {busy ? "Wird hinzugefügt…" : added ? "Hinzugefügt!" : "In den Warenkorb"}
    </button>
  );
}
