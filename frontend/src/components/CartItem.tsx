"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { slugFromPermalink } from "@/lib/woo/utils";
import { formatBasePrice, formatCents } from "@/lib/format";
import type { CartItemData } from "@/types";

interface CartItemProps {
  item: CartItemData;
  /** Package volume in ml (from product attributes) – enables the PAngV Grundpreis line */
  volumeMl?: number | null;
}

export function CartItem({ item, volumeMl = null }: CartItemProps) {
  const { removeItem, updateItem, loading } = useCart();
  const slug = slugFromPermalink(item.permalink);
  const max = item.quantity_limits?.maximum ?? 9999;
  const href = slug ? `/product/${slug}` : null;

  const currency = item.totals.currency_code;
  const lineTotalCents = Number(item.totals.line_total) + Number(item.totals.line_total_tax ?? 0);
  const lineTotal = formatCents(lineTotalCents, currency);
  const unitPrice = formatCents(item.prices.price, item.prices.currency_code);
  const basePrice = formatBasePrice(item.prices.price, volumeMl, item.prices.currency_code);

  const image = (
    <div className="bg-surface-alt h-16 w-[45px] shrink-0 overflow-hidden rounded-lg">
      {item.images[0] ? (
        <Image
          src={item.images[0].src}
          alt={item.images[0].alt || item.name}
          width={45}
          height={64}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-gray-400">
          Kein Bild
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4 sm:flex-nowrap">
      {href ? (
        <Link href={href} className="shrink-0 transition hover:opacity-80">
          {image}
        </Link>
      ) : (
        image
      )}

      <div className="min-w-0 flex-1 basis-40">
        {href ? (
          <Link href={href} className="hover:text-primary font-semibold text-gray-900 transition">
            {item.name}
          </Link>
        ) : (
          <p className="font-semibold text-gray-900">{item.name}</p>
        )}
        <p className="mt-0.5 text-xs text-gray-400">
          {unitPrice} / Stück
          {basePrice && (
            <>
              <span aria-hidden> · </span>
              {basePrice}
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            if (item.quantity > 1) updateItem(item.key, item.quantity - 1);
          }}
          disabled={loading || item.quantity <= 1}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Menge verringern"
        >
          &minus;
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => {
            if (item.quantity < max) updateItem(item.key, item.quantity + 1);
          }}
          disabled={loading || item.quantity >= max}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Menge erhöhen"
        >
          +
        </button>
      </div>

      <p className="w-24 text-right font-semibold text-gray-900">{lineTotal}</p>

      <button
        onClick={() => removeItem(item.key)}
        disabled={loading}
        aria-label={`${item.name} entfernen`}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
