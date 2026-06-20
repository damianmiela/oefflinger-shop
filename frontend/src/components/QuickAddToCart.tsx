"use client";

/**
 * Quick "add to cart" button shown on a product card's thumbnail.
 * Hover-reveal on desktop, always visible on touch; adds one unit and shows the
 * same confirmation toast as the product page. Rendered as a sibling of the card
 * links (never nested in an anchor), and pointer-events are disabled while hidden
 * so it doesn't intercept clicks meant for the product link. Hidden entirely when
 * the product isn't purchasable.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

const TOAST_DURATION_MS = 4000;

export function QuickAddToCart({ product }: { product: Product }) {
  const { addItem, loading } = useCart();
  const [busy, setBusy] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    },
    [],
  );

  const purchasable =
    product.is_purchasable && (product.is_in_stock || product.is_on_backorder);
  if (!purchasable) return null;

  async function handleAdd() {
    setBusy(true);
    const ok = await addItem(product.id, 1);
    setBusy(false);
    if (!ok) return;
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleAdd}
        disabled={busy || loading}
        aria-label={`${product.name} in den Warenkorb legen`}
        className="bg-primary/95 hover:bg-primary pointer-events-none absolute inset-x-2 bottom-2 flex translate-y-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white opacity-0 shadow-md backdrop-blur transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:translate-y-0 focus-visible:opacity-100 disabled:opacity-60 max-sm:pointer-events-auto max-sm:translate-y-0 max-sm:opacity-100"
      >
        <svg
          className="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {busy ? "Wird hinzugefügt…" : "In den Warenkorb"}
      </button>

      {showToast && (
        <div
          role="status"
          className="fixed right-4 bottom-4 left-4 z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:left-auto sm:w-96"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">In den Warenkorb gelegt</p>
              <p className="truncate text-sm text-gray-500">1 × {product.name}</p>
              <Link
                href="/warenkorb"
                className="bg-primary hover:bg-primary-light mt-3 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
              >
                Zum Warenkorb
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              aria-label="Hinweis schließen"
              className="text-gray-400 transition hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
