"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/CartItem";
import { buildCheckoutUrl } from "@/lib/woo/checkout";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { getProducts } from "@/lib/woo/api";
import { formatCents, volumeFromAttributes } from "@/lib/format";

export default function CartPage() {
  const { cart, loading, lastError, clearError } = useCart();

  /** Product id → package volume (ml), for the PAngV Grundpreis per line item */
  const [volumes, setVolumes] = useState<Record<number, number>>({});

  const hasItems = (cart?.items.length ?? 0) > 0;

  useEffect(() => {
    if (!hasItems) return;
    let cancelled = false;
    getProducts()
      .then((products) => {
        if (cancelled) return;
        const map: Record<number, number> = {};
        for (const p of products) {
          const ml = volumeFromAttributes(p.attributes);
          if (ml) map[p.id] = ml;
        }
        setVolumes(map);
      })
      .catch(() => {
        // Grundpreis lines are skipped when volumes can't be loaded
      });
    return () => {
      cancelled = true;
    };
  }, [hasItems]);

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

  const total = formatCents(cart.totals.total_price, cart.totals.currency_code);

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
            <span>{lastError.message}</span>
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
            <CartItem key={item.key} item={item} volumeMl={volumes[item.id] ?? null} />
          ))}
        </div>

        <div className="bg-surface-alt mt-8 flex items-center justify-between rounded-xl p-6">
          <span className="text-lg font-semibold text-gray-700">Gesamtsumme</span>
          <span className="text-right">
            <span className="text-primary block text-2xl font-bold">{total}</span>
            {/* TODO(P0-2b): link "Versand" to the upcoming Versand & Zahlung page */}
            <span className="mt-0.5 block text-xs text-gray-500">
              inkl. MwSt., zzgl. Versand
            </span>
          </span>
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
