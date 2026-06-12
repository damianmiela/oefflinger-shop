"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

const TOAST_DURATION_MS = 4000;

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, loading, lastError, clearError } = useCart();
  const [added, setAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxFromLimits = product.quantity_limits?.maximum;
  const maxFromLowStock = product.low_stock_remaining;
  const maxFromStock = product.stock_quantity;
  const candidates = [maxFromLimits, maxFromLowStock, maxFromStock].filter(
    (n): n is number => typeof n === "number" && n >= 0
  );
  const effectiveMax = candidates.length > 0 ? Math.min(...candidates, 9999) : 9999;

  /** Raw input value – may be empty while typing; clamped for all actions */
  const [quantityInput, setQuantityInput] = useState("1");
  const quantity = Math.min(Math.max(1, parseInt(quantityInput, 10) || 1), effectiveMax);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleClick = async () => {
    clearError();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    const ok = await addItem(product.id, quantity);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      setShowToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
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
        <p className="w-full text-sm text-amber-600" role="alert">
          {lastError.message}
        </p>
      )}

      {showToast && (
        <div
          role="status"
          className="fixed right-4 bottom-4 left-4 z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:left-auto sm:w-96"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">In den Warenkorb gelegt</p>
              <p className="truncate text-sm text-gray-500">
                {quantity} × {product.name}
              </p>
              <Link
                href="/cart"
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
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
