import Link from "next/link";
import { formatCents } from "@/lib/format";
import type { ProductPrice } from "@/types";

interface PriceDisplayProps {
  prices: ProductPrice;
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** PAngV: show "inkl. MwSt., zzgl. Versand" under the price */
  showTaxNote?: boolean;
  /** PAngV: Grundpreis line, e.g. "87,00 € / 1 l" (see lib/format formatBasePrice) */
  basePrice?: string | null;
  /** Link the "Versand" word to /versand. Keep false inside <Link> wrappers (no nested anchors). */
  linkShipping?: boolean;
}

const SIZE_CLASS = { sm: "text-base", md: "text-lg", lg: "text-2xl" } as const;
/** Strikethrough old price: one step smaller than the main price */
const STRIKE_CLASS = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function PriceDisplay({
  prices,
  className = "",
  size = "md",
  showTaxNote = false,
  basePrice = null,
  linkShipping = false,
}: PriceDisplayProps) {
  const priceNum = Number(prices.price);
  const regularNum = Number(prices.regular_price);
  const saleNum = Number(prices.sale_price);
  const hasSale = saleNum > 0 && regularNum > saleNum;

  const format = (cents: number) => formatCents(cents, prices.currency_code);

  if (priceNum <= 0) {
    return <span className={className}>Preis auf Anfrage</span>;
  }

  /* Legal notes (Grundpreis, MwSt/Versand): mandatory but deliberately quiet */
  const notes = (showTaxNote || basePrice) && (
    <span className="mt-1 block text-xs font-normal text-gray-400">
      {basePrice && <span>{basePrice}</span>}
      {basePrice && showTaxNote && <span aria-hidden> · </span>}
      {showTaxNote && (
        <span>
          inkl. MwSt., zzgl.{" "}
          {linkShipping ? (
            <Link
              href="/versand"
              className="hover:text-primary underline decoration-gray-300 underline-offset-2 transition"
            >
              Versand
            </Link>
          ) : (
            "Versand"
          )}
        </span>
      )}
    </span>
  );

  return (
    <span className={`block ${className}`}>
      <span className={`flex flex-wrap items-baseline gap-x-2.5 ${SIZE_CLASS[size]}`}>
        <span className="text-primary font-bold">{format(hasSale ? saleNum : priceNum)}</span>
        {hasSale && (
          <span className={`${STRIKE_CLASS[size]} text-gray-400 line-through`}>
            {format(regularNum)}
          </span>
        )}
      </span>
      {notes}
    </span>
  );
}
