"use client";

/**
 * Small quick-add icon button pinned to the bottom-right of a product card's
 * thumbnail, with a hover/focus tooltip. Hover-reveal on desktop, always visible
 * on touch; adds one unit and shows the same confirmation toast as the product
 * page. Rendered as a sibling of the card links (never nested in an anchor), with
 * pointer-events disabled while hidden so it can't intercept clicks meant for the
 * product link. Hidden when the product isn't purchasable.
 *
 * NOTE: the disabled state uses a LOCAL `busy` flag, never the cart's shared
 * `loading` — otherwise clicking one card would disable every button at once.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

const TOAST_DURATION_MS = 4000;

export function QuickAddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
    },
    [],
  );

  const purchasable =
    product.is_purchasable && (product.is_in_stock || product.is_on_backorder);
  if (!purchasable) return null;

  async function handleAdd() {
    if (busy) return;
    setBusy(true);
    const ok = await addItem(product.id, 1);
    setBusy(false);
    if (!ok) return;
    setAdded(true);
    if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
    addedTimeoutRef.current = setTimeout(() => setAdded(false), 1500);
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
  }

  return (
    <>
      {/* Wrapper handles the hover-reveal + tooltip group; the button stays simple */}
      <div className="group/qab pointer-events-none absolute right-2 bottom-2 z-10 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100 max-sm:pointer-events-auto max-sm:opacity-100">
        <button
          type="button"
          onClick={handleAdd}
          disabled={busy}
          aria-label={`${product.name} in den Warenkorb legen`}
          className="bg-primary/95 hover:bg-primary flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition"
        >
          {added ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
            </svg>
          )}
        </button>
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-full mb-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition group-hover/qab:opacity-100 group-focus-within/qab:opacity-100"
        >
          {added ? "Hinzugefügt" : "In den Warenkorb"}
        </span>
      </div>

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
