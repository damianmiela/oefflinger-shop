"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/CartItem";

export default function CartPage() {
  const { cart, loading } = useCart();

  if (loading && !cart) {
    return <p className="py-16 text-center text-gray-500">Warenkorb wird geladen…</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Ihr Warenkorb ist leer</h1>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-light"
        >
          Weiter einkaufen
        </Link>
      </div>
    );
  }

  const total =
    Number(cart.totals.total_price) > 0
      ? `${(Number(cart.totals.total_price) / 100).toFixed(2)} ${cart.totals.currency_symbol}`
      : "0,00 €";

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Warenkorb</h1>

      <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {cart.items.map((item) => (
          <CartItem key={item.key} item={item} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl bg-surface-alt p-6">
        <span className="text-lg font-semibold text-gray-700">Gesamtsumme</span>
        <span className="text-2xl font-bold text-primary">{total}</span>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/shop"
          className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-50"
        >
          Weiter einkaufen
        </Link>
        <button
          disabled
          className="rounded-lg bg-accent px-6 py-3 font-semibold text-white opacity-60"
          title="Checkout wird in einer späteren Phase implementiert"
        >
          Zur Kasse
        </button>
      </div>
    </>
  );
}
