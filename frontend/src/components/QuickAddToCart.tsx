"use client";

/**
 * Small quick-add icon button on a product card's thumbnail, with a hover/focus
 * tooltip. Hover-reveal on desktop, always visible on touch; adds one unit. The
 * mini-cart drawer auto-opens on a successful add (CartContext), which is the
 * confirmation — no toast here. Sibling of the card links (never nested in an
 * anchor); pointer-events disabled while hidden so it can't steal card clicks.
 * Hidden when the product isn't purchasable.
 */
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export function QuickAddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [busy, setBusy] = useState(false);

  const purchasable =
    product.is_purchasable && (product.is_in_stock || product.is_on_backorder);
  if (!purchasable) return null;

  async function handleAdd() {
    if (busy) return;
    setBusy(true);
    await addItem(product.id, 1); // opens the mini-cart drawer on success
    setBusy(false);
  }

  return (
    <div className="group/qab pointer-events-none absolute right-2 bottom-2 z-10 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100 max-sm:pointer-events-auto max-sm:opacity-100">
      <button
        type="button"
        onClick={handleAdd}
        disabled={busy}
        aria-label={`${product.name} in den Warenkorb legen`}
        className="bg-primary/95 hover:bg-primary flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-full mb-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition group-hover/qab:opacity-100 group-focus-within/qab:opacity-100"
      >
        In den Warenkorb
      </span>
    </div>
  );
}
