import type { ProductPrice } from "@/types";

interface PriceDisplayProps {
  prices: ProductPrice;
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({ prices, className = "", size = "md" }: PriceDisplayProps) {
  const priceNum = Number(prices.price);
  const regularNum = Number(prices.regular_price);
  const saleNum = Number(prices.sale_price);
  const hasSale = saleNum > 0 && regularNum > saleNum;

  const format = (cents: number) =>
    `${(cents / 100).toFixed(2)} ${prices.currency_symbol}`;

  if (priceNum <= 0) {
    return <span className={className}>Preis auf Anfrage</span>;
  }

  const sizeClass =
    size === "sm"
      ? "text-base"
      : size === "lg"
        ? "text-2xl"
        : "text-lg";

  if (hasSale) {
    return (
      <span className={`flex flex-wrap items-baseline gap-2 ${sizeClass} ${className}`}>
        <span className="text-gray-500 line-through">{format(regularNum)}</span>
        <span className="font-bold text-primary">{format(saleNum)}</span>
      </span>
    );
  }

  return (
    <span className={`font-bold text-primary ${sizeClass} ${className}`}>
      {format(priceNum)}
    </span>
  );
}
