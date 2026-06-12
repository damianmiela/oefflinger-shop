"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/CartItem";
import { buildCheckoutUrl } from "@/lib/woo/checkout";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export default function CartPage() {
  const { cart, loading, lastError, clearError } = useCart();

  if (loading && !cart) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500 sm:px-6 lg:px-8">
        Warenkorb wird geladen…
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up">
          <h1 className="text-2xl font-bold text-gray-900">Ihr Warenkorb ist leer</h1>
          <Link
            href="/shop"
            className="bg-primary hover:bg-primary-light mt-6 inline-block rounded-lg px-6 py-3 text-white transition"
          >
            Weiter einkaufen
          </Link>
        </AnimateOnScroll>
      </div>
    );
  }

  const total =
    Number(cart.totals.total_price) > 0
      ? `${(Number(cart.totals.total_price) / 100).toFixed(2)} ${cart.totals.currency_symbol}`
      : "0,00 €";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Warenkorb</h1>
      </AnimateOnScroll>

      {lastError && (
        <AnimateOnScroll variant="fade-up">
          <div
            className="mb-6 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            role="alert"
          >
            <span>{lastError.message.replace(/^WooCommerce Store API error: /, "")}</span>
            <button
              onClick={clearError}
              className="text-amber-600 hover:text-amber-800"
              aria-label="Schließen"
            >
              &times;
            </button>
          </div>
        </AnimateOnScroll>
      )}

      <AnimateOnScroll variant="fade-up">
        <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {cart.items.map((item) => (
            <CartItem key={item.key} item={item} />
          ))}
        </div>

        <div className="bg-surface-alt mt-8 flex items-center justify-between rounded-xl p-6">
          <span className="text-lg font-semibold text-gray-700">Gesamtsumme</span>
          <span className="text-primary text-2xl font-bold">{total}</span>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/shop"
            className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm whitespace-nowrap text-gray-700 transition hover:bg-gray-50 sm:px-6 sm:text-base"
          >
            Weiter einkaufen
          </Link>
          <Link
            href={buildCheckoutUrl(cart.items)}
            className="bg-accent hover:bg-accent-light rounded-lg px-4 py-3 text-center text-sm font-semibold whitespace-nowrap text-white transition sm:px-6 sm:text-base"
          >
            Zur Kasse
          </Link>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
