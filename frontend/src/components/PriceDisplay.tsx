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
}

export function PriceDisplay({
  prices,
  className = "",
  size = "md",
  showTaxNote = false,
  basePrice = null,
}: PriceDisplayProps) {
  const priceNum = Number(prices.price);
  const regularNum = Number(prices.regular_price);
  const saleNum = Number(prices.sale_price);
  const hasSale = saleNum > 0 && regularNum > saleNum;

  const format = (cents: number) => formatCents(cents, prices.currency_code);

  if (priceNum <= 0) {
    return <span className={className}>Preis auf Anfrage</span>;
  }

  const sizeClass = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  const noteSizeClass = size === "lg" ? "text-sm" : "text-xs";

  /* TODO(P0-2b): link "Versand" to the upcoming Versand & Zahlung page */
  const notes = (showTaxNote || basePrice) && (
    <span className={`mt-0.5 block font-normal text-gray-500 ${noteSizeClass}`}>
      {basePrice && <span>{basePrice}</span>}
      {basePrice && showTaxNote && <span aria-hidden> · </span>}
      {showTaxNote && <span>inkl. MwSt., zzgl. Versand</span>}
    </span>
  );

  if (hasSale) {
    return (
      <span className={`block ${className}`}>
        <span className={`flex flex-wrap items-baseline gap-2 ${sizeClass}`}>
          <span className="text-gray-500 line-through">{format(regularNum)}</span>
          <span className="text-primary font-bold">{format(saleNum)}</span>
        </span>
        {notes}
      </span>
    );
  }

  return (
    <span className={`block ${className}`}>
      <span className={`text-primary font-bold ${sizeClass}`}>{format(priceNum)}</span>
      {notes}
    </span>
  );
}
