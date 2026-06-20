"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/CartItem";
import { buildCheckoutUrl } from "@/lib/woo/checkout";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { FreeShippingProgress } from "@/components/FreeShippingProgress";
import { CouponField } from "@/components/CouponField";
import { getProducts } from "@/lib/woo/api";
import { formatCents, volumeFromAttributes } from "@/lib/format";
import { estimateShippingCents } from "@/lib/shipping";

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

  const currency = cart.totals.currency_code;
  /** Gross subtotal: items + item tax (tax fields are 0 when taxes aren't configured) */
  const subtotalCents =
    Number(cart.totals.total_items) + Number(cart.totals.total_items_tax ?? 0);
  const taxCents = Number(cart.totals.total_tax ?? cart.totals.total_items_tax ?? 0);
  const discountCents = Number(cart.totals.total_discount ?? 0);
  const shippingCents = estimateShippingCents(subtotalCents);
  const grandTotalCents = subtotalCents - discountCents + shippingCents;

  const checkoutHref = buildCheckoutUrl(cart.items);

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

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Coupon — applied to the live cart, so it carries over to checkout */}
          <CouponField className="w-full max-w-sm" />

          {/* Totals */}
          <div className="bg-surface-alt w-full rounded-xl p-6 lg:max-w-sm">
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Zwischensumme</dt>
                <dd className="font-medium text-gray-900">
                  {formatCents(subtotalCents, currency)}
                </dd>
              </div>
              {discountCents > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <dt>Rabatt</dt>
                  <dd className="font-medium">−{formatCents(discountCents, currency)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Versand (DHL)</dt>
                <dd
                  className={
                    shippingCents === 0 ? "font-medium text-emerald-700" : "font-medium text-gray-900"
                  }
                >
                  {shippingCents === 0 ? "Kostenlos" : formatCents(shippingCents, currency)}
                </dd>
              </div>
              {taxCents > 0 && (
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <dt>davon MwSt.</dt>
                  <dd>{formatCents(taxCents, currency)}</dd>
                </div>
              )}
            </dl>

            <FreeShippingProgress
              subtotalCents={subtotalCents}
              currency={currency}
              className="mt-3"
            />

            <div className="mt-4 flex items-baseline justify-between border-t border-gray-200 pt-4">
              <span className="text-lg font-semibold text-gray-700">Gesamtsumme</span>
              <span className="text-right">
                <span className="text-primary block text-2xl font-bold">
                  {formatCents(grandTotalCents, currency)}
                </span>
                <span className="mt-0.5 block text-xs text-gray-400">inkl. MwSt.</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/shop"
            className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm whitespace-nowrap text-gray-700 transition hover:bg-gray-50 sm:px-6 sm:text-base"
          >
            Weiter einkaufen
          </Link>
          <Link
            href={checkoutHref}
            className="bg-accent hover:bg-accent-light rounded-lg px-4 py-3 text-center text-sm font-semibold whitespace-nowrap text-white transition sm:px-6 sm:text-base"
          >
            Zur Kasse
          </Link>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
