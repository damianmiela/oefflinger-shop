"use client";

/**
 * Shared cart totals (used by the cart page and the mini-cart drawer): subtotal,
 * Rabatt, DHL shipping estimate, MwSt note, free-shipping progress and the grand
 * total. Shipping is the local estimate (real rates are calculated at checkout
 * once an address is entered). Reads the live cart from CartContext.
 */
import { useCart } from "@/context/CartContext";
import { formatCents } from "@/lib/format";
import { estimateShippingCents } from "@/lib/shipping";
import { FreeShippingProgress } from "@/components/FreeShippingProgress";

export function CartSummary({ className = "" }: { className?: string }) {
  const { cart } = useCart();
  if (!cart) return null;

  const currency = cart.totals.currency_code;
  const subtotalCents = Number(cart.totals.total_items) + Number(cart.totals.total_items_tax ?? 0);
  const taxCents = Number(cart.totals.total_tax ?? cart.totals.total_items_tax ?? 0);
  const discountCents = Number(cart.totals.total_discount ?? 0);
  const shippingCents = estimateShippingCents(subtotalCents);
  const grandTotalCents = subtotalCents - discountCents + shippingCents;

  return (
    <div className={className}>
      <dl className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-gray-600">Zwischensumme</dt>
          <dd className="font-medium text-gray-900">{formatCents(subtotalCents, currency)}</dd>
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

      <FreeShippingProgress subtotalCents={subtotalCents} currency={currency} className="mt-3" />

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
  );
}
