import { FREE_SHIPPING_FROM_CENTS, missingForFreeShipping } from "@/lib/shipping";
import { formatCents } from "@/lib/format";

interface FreeShippingProgressProps {
  /** Gross items subtotal in minor units (incl. VAT) — same basis as the threshold. */
  subtotalCents: number;
  currency?: string;
  /** Slim rendering for the hover mini-cart preview. */
  compact?: boolean;
  className?: string;
}

/**
 * Free-shipping progress bar (P3-20c).
 * Fills in brand gold while progressing, switches to emerald-green once the
 * free-shipping threshold (lib/shipping) is reached. The bar's width transition
 * is neutralized for users with prefers-reduced-motion via the global reset.
 */
export function FreeShippingProgress({
  subtotalCents,
  currency = "EUR",
  compact = false,
  className = "",
}: FreeShippingProgressProps) {
  const missingCents = missingForFreeShipping(subtotalCents);
  const reached = missingCents <= 0;
  const percent =
    FREE_SHIPPING_FROM_CENTS > 0
      ? Math.min(100, Math.max(0, Math.round((subtotalCents / FREE_SHIPPING_FROM_CENTS) * 100)))
      : 100;

  const wrapperClass = compact
    ? `text-xs ${className}`
    : `rounded-lg bg-white px-3 py-2.5 text-xs text-gray-600 ${className}`;

  return (
    <div className={wrapperClass}>
      <p className={`flex items-center gap-1.5 ${reached ? "text-emerald-700" : "text-gray-600"}`}>
        {reached ? (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.8 6.79-6.8a1 1 0 011.42 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">Sie erhalten kostenlosen Versand!</span>
          </>
        ) : (
          <span>
            Noch{" "}
            <span className="font-semibold text-emerald-700">
              {formatCents(missingCents, currency)}
            </span>{" "}
            bis zum kostenlosen Versand
          </span>
        )}
      </p>

      <div
        className={`mt-2 w-full overflow-hidden rounded-full bg-gray-200 ${compact ? "h-1.5" : "h-2"}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Fortschritt bis zum kostenlosen Versand"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            reached ? "bg-emerald-500" : "bg-accent"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
