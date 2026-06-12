import type { Product } from "@/types";

function getStockLimit(product: Product): number | null {
  const candidates = [
    product.quantity_limits?.maximum,
    product.low_stock_remaining,
    product.stock_quantity,
  ].filter((n): n is number => typeof n === "number" && n >= 0);
  if (candidates.length === 0) return null;
  const limit = Math.min(...candidates, 9999);
  return limit < 9999 ? limit : null;
}

export function StockStatus({ product }: { product: Product }) {
  const limit = getStockLimit(product);

  if (limit != null) {
    const isLow = product.low_stock_remaining != null && product.low_stock_remaining <= limit;
    return (
      <p
        className={`mt-5 flex items-center gap-2 text-sm font-medium ${
          isLow ? "text-amber-700" : "text-gray-600"
        }`}
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${isLow ? "bg-amber-500" : "bg-emerald-500"}`}
          aria-hidden
        />
        {isLow ? `Nur noch ${product.low_stock_remaining} auf Lager` : `${limit} Stück verfügbar`}
      </p>
    );
  }

  if (!product.is_in_stock && !product.is_on_backorder) return null;

  return (
    <p className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700">
      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
      {product.is_in_stock ? "Auf Lager" : "Lieferbar auf Nachfrage"}
    </p>
  );
}
