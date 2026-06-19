"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { apiOrderDetail, type AuthOrderDetail, type AuthAddress } from "@/lib/auth";
import { formatEuros } from "@/lib/format";
import { orderStatusClasses } from "@/lib/order-status";

function AddressCard({ title, address }: { title: string; address: AuthAddress }) {
  const lines = [
    `${address.first_name} ${address.last_name}`.trim(),
    address.address_1,
    address.address_2,
    `${address.postcode} ${address.city}`.trim(),
  ].filter(Boolean);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-medium tracking-wider text-gray-500 uppercase">{title}</h3>
      <div className="mt-2 text-gray-900">
        {lines.length > 0 ? (
          lines.map((line, i) => <p key={i}>{line}</p>)
        ) : (
          <p className="text-gray-400">–</p>
        )}
      </div>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<AuthOrderDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    apiOrderDetail(id)
      .then(setOrder)
      .catch(() => setError(true));
  }, [id, user, authLoading]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500 sm:px-6 lg:px-8">
        Wird geladen…
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Bestellung nicht gefunden</h1>
        <Link
          href="/konto"
          className="bg-primary hover:bg-primary-light mt-6 inline-block rounded-lg px-6 py-3 text-white transition"
        >
          Zurück zu Mein Konto
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500 sm:px-6 lg:px-8">
        Bestellung wird geladen…
      </div>
    );
  }

  const money = (v: string) => formatEuros(v);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/konto"
        className="hover:text-primary inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition"
      >
        <span aria-hidden>←</span>
        Zurück zu Mein Konto
      </Link>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bestellung #{order.number}</h1>
          {order.date && <p className="mt-1 text-gray-500">Bestellt am {order.date}</p>}
        </div>
        <span
          className={`self-start rounded-full px-4 py-1.5 text-sm font-semibold sm:self-auto ${orderStatusClasses(order.status)}`}
        >
          {order.status_label}
        </span>
      </div>

      {/* Items */}
      <div className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
        {order.items.map((item, i) => {
          const content = (
            <div className="flex items-center gap-4 p-4 sm:p-5">
              <div className="bg-surface-alt h-20 w-14 shrink-0 overflow-hidden rounded-lg">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={80}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    –
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="mt-0.5 text-sm text-gray-500">Menge: {item.quantity}</p>
              </div>
              <p className="shrink-0 font-semibold text-gray-900">{money(item.total)}</p>
            </div>
          );
          return item.slug ? (
            <Link
              key={i}
              href={`/shop/${item.slug}`}
              className="block transition hover:bg-gray-50"
            >
              {content}
            </Link>
          ) : (
            <div key={i}>{content}</div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <dt>Zwischensumme</dt>
            <dd>{money(order.subtotal)}</dd>
          </div>
          {Number(order.discount_total) > 0 && (
            <div className="flex justify-between text-gray-600">
              <dt>Rabatt</dt>
              <dd>−{money(order.discount_total)}</dd>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <dt>Versand{order.shipping_method ? ` (${order.shipping_method})` : ""}</dt>
            <dd>{money(order.shipping_total)}</dd>
          </div>
          {Number(order.total_tax) > 0 && (
            <div className="flex justify-between text-gray-600">
              <dt>MwSt.</dt>
              <dd>{money(order.total_tax)}</dd>
            </div>
          )}
          <div className="text-primary flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
            <dt>Gesamt</dt>
            <dd>{money(order.total)}</dd>
          </div>
        </dl>
        {order.payment_method && (
          <p className="mt-4 text-sm text-gray-500">Zahlungsart: {order.payment_method}</p>
        )}
        {order.customer_note && (
          <p className="mt-2 text-sm text-gray-500">Anmerkung: {order.customer_note}</p>
        )}
      </div>

      {/* Addresses */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <AddressCard title="Rechnungsadresse" address={order.billing} />
        <AddressCard title="Lieferadresse" address={order.shipping} />
      </div>
    </div>
  );
}
