"use client";

/**
 * Shop-wide Mengenrabatt progress bar (free-shipping-bar style). Reads the live
 * volume-discount state the oeff-sets plugin attaches to the cart
 * (cart.extensions.oeff_volume) and nudges the customer toward the next tier.
 * Lives inside CartSummary, so it shows on the cart page, the mini-cart drawer
 * and checkout — and nowhere else.
 *
 * No-stacking is communicated here: when the volume discount beats a coupon the
 * coupon is flagged as not applied, and vice versa.
 */
import { useCart } from "@/context/CartContext";
import { formatCents } from "@/lib/format";

export function VolumeDiscountBar({ className = "" }: { className?: string }) {
  const { cart } = useCart();
  const v = cart?.extensions?.oeff_volume;
  if (!cart || !v || !v.enabled || !v.tiers?.length) return null;

  const currency = cart.totals.currency_code;
  const hasNext = v.next_min_qty > 0;
  const maxReached = !hasNext && v.percent > 0;
  const toNext = hasNext ? Math.max(0, v.next_min_qty - v.qty) : 0;
  const fill = hasNext ? Math.min(100, Math.round((v.qty / v.next_min_qty) * 100)) : 100;

  const couponWon = v.winner === "coupon";
  const volumeBeatCoupon = v.winner === "volume" && v.suppressed_coupons.length > 0;

  return (
    <div className={`rounded-lg bg-white px-3 py-2.5 text-xs ${className}`}>
      <p className={`flex items-center gap-1.5 ${v.applied ? "text-emerald-700" : "text-gray-600"}`}>
        {maxReached ? (
          <span className="font-semibold">
            Maximaler Mengenrabatt erreicht: −{Math.round(v.percent)} %
          </span>
        ) : (
          <span>
            Noch{" "}
            <span className="text-accent font-semibold">
              {toNext} {toNext === 1 ? "Flasche" : "Flaschen"}
            </span>{" "}
            bis <span className="font-semibold text-emerald-700">−{Math.round(v.next_percent)} %</span>{" "}
            Mengenrabatt
          </span>
        )}
      </p>

      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={fill}
        aria-label="Fortschritt bis zum nächsten Mengenrabatt"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            v.applied ? "bg-emerald-500" : "bg-accent"
          }`}
          style={{ width: `${fill}%` }}
        />
      </div>

      {v.applied && v.savings > 0 && (
        <p className="mt-1.5 font-medium text-emerald-700">
          Mengenrabatt aktiv: −{Math.round(v.percent)} % · Sie sparen {formatCents(v.savings, currency)}
        </p>
      )}
      {volumeBeatCoupon && (
        <p className="mt-1 text-gray-500">
          Gutschein {v.suppressed_coupons.join(", ")} nicht angewendet – der Mengenrabatt ist
          günstiger.
        </p>
      )}
      {couponWon && (
        <p className="mt-1 text-gray-500">Gutschein aktiv – günstiger als der Mengenrabatt.</p>
      )}
    </div>
  );
}
