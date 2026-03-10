"use client";

import { useCart } from "@/context/CartContext";
import type { CartItemData } from "@/types";

export function CartItem({ item }: { item: CartItemData }) {
  const { removeItem, updateItem, loading } = useCart();

  const lineTotal =
    Number(item.totals.line_total) > 0
      ? `${(Number(item.totals.line_total) / 100).toFixed(2)} ${item.totals.currency_symbol}`
      : "0,00 €";

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
        {item.images[0] ? (
          <img
            src={item.images[0].src}
            alt={item.images[0].alt || item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            Kein Bild
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="font-semibold text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500">{lineTotal}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateItem(item.key, Math.max(1, item.quantity - 1))}
          disabled={loading || item.quantity <= 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
        >
          &minus;
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateItem(item.key, item.quantity + 1)}
          disabled={loading}
          className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
        >
          +
        </button>
      </div>

      <button
        onClick={() => removeItem(item.key)}
        disabled={loading}
        className="text-sm text-red-500 transition hover:text-red-700 disabled:opacity-40"
      >
        Entfernen
      </button>
    </div>
  );
}
