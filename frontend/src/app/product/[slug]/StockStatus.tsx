import type { Product } from "@/types";

export function StockStatus({ product }: { product: Product }) {
  const max = product.quantity_limits?.maximum;
  const lowStock = product.low_stock_remaining;

  if (max != null && max < 9999) {
    return (
      <p className="mt-6 text-sm text-gray-600">
        {lowStock != null && lowStock <= max
          ? `Nur noch ${lowStock} auf Lager`
          : `${max} Stück verfügbar`}
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
