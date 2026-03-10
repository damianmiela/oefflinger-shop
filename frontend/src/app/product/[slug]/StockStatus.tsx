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
    return (
      <p className="mt-6 text-sm text-gray-600">
        {product.low_stock_remaining != null && product.low_stock_remaining <= limit
          ? `Nur noch ${product.low_stock_remaining} auf Lager`
          : `${limit} Stück verfügbar`}
      </p>
    );
  }

  if (!product.is_in_stock && !product.is_on_backorder) return null;

  return (
    <p className="mt-6 text-sm text-green-600">
      {product.is_in_stock ? "Auf Lager" : "Lieferbar auf Nachfrage"}
    </p>
  );
}
