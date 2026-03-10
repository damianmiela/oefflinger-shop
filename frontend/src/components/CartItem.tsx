"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { slugFromPermalink } from "@/lib/woo/utils";
import type { CartItemData } from "@/types";

export function CartItem({ item }: { item: CartItemData }) {
  const { removeItem, updateItem, loading } = useCart();
  const slug = slugFromPermalink(item.permalink);
  const max = item.quantity_limits?.maximum ?? 9999;

  const lineTotal =
    Number(item.totals.line_total) > 0
      ? `${(Number(item.totals.line_total) / 100).toFixed(2)} ${item.totals.currency_symbol}`
      : "0,00 €";

  const content = (
    <>
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
        {item.images[0] ? (
          <Image
            src={item.images[0].src}
            alt={item.images[0].alt || item.name}
            width={64}
            height={64}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            Kein Bild
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500">{lineTotal}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (item.quantity > 1) updateItem(item.key, item.quantity - 1);
          }}
          disabled={loading || item.quantity <= 1}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Menge verringern"
        >
          &minus;
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (item.quantity < max) updateItem(item.key, item.quantity + 1);
          }}
          disabled={loading || item.quantity >= max}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Menge erhöhen"
        >
          +
        </button>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          removeItem(item.key);
        }}
        disabled={loading}
        className="cursor-pointer text-sm text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Entfernen
      </button>
    </>
  );

  if (slug) {
    return (
      <Link
        href={`/product/${slug}`}
        className="flex items-center gap-4 p-4 transition hover:bg-gray-50"
      >
        {content}
      </Link>
    );
  }

  return <div className="flex items-center gap-4 p-4">{content}</div>;
}
