"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  apiOrders,
  apiUpdateAddress,
  AuthApiError,
  type AuthAddress,
  type AuthOrder,
} from "@/lib/auth";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const ADDRESS_FIELDS: { key: keyof AuthAddress; label: string; autoComplete: string }[] = [
  { key: "first_name", label: "Vorname", autoComplete: "given-name" },
  { key: "last_name", label: "Nachname", autoComplete: "family-name" },
  { key: "address_1", label: "Straße und Hausnummer", autoComplete: "address-line1" },
  { key: "address_2", label: "Adresszusatz (optional)", autoComplete: "address-line2" },
  { key: "postcode", label: "PLZ", autoComplete: "postal-code" },
  { key: "city", label: "Stadt", autoComplete: "address-level2" },
];

function AddressForm({
  type,
  title,
  initial,
  withPhone,
}: {
  type: "billing" | "shipping";
  title: string;
  initial: AuthAddress;
  withPhone?: boolean;
}) {
  const { setUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const form = new FormData(e.currentTarget);
    const address: Partial<AuthAddress> = {};
    for (const { key } of ADDRESS_FIELDS) {
      address[key] = String(form.get(key) ?? "");
    }
    address.country = "DE";
    if (withPhone) address.phone = String(form.get("phone") ?? "");
    try {
      const user = await apiUpdateAddress({ [type]: address });
      setUser(user);
      setMessage("Adresse gespeichert.");
    } catch (err) {
      setError(
        err instanceof AuthApiError
          ? err.message
          : "Speichern fehlgeschlagen. Bitte versuchen Sie es erneut.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {ADDRESS_FIELDS.map(({ key, label, autoComplete }) => (
          <div
            key={key}
            className={key === "address_1" || key === "address_2" ? "sm:col-span-2" : ""}
          >
            <label htmlFor={`${type}_${key}`} className={labelClass}>
              {label}
            </label>
            <input
              id={`${type}_${key}`}
              name={key}
              type="text"
              defaultValue={initial[key] ?? ""}
              autoComplete={autoComplete}
              className={inputClass}
            />
          </div>
        ))}
        {withPhone && (
          <div>
            <label htmlFor={`${type}_phone`} className={labelClass}>
              Telefon (optional)
            </label>
            <input
              id={`${type}_phone`}
              name="phone"
              type="tel"
              defaultValue={initial.phone ?? ""}
              autoComplete="tel"
              className={inputClass}
            />
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary-light rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Speichern…" : "Speichern"}
        </button>
        {message && <span className="text-sm text-green-700">{message}</span>}
        {error && <span className="text-sm text-red-700">{error}</span>}
      </div>
    </form>
  );
}

function OrderList() {
  const [orders, setOrders] = useState<AuthOrder[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiOrders()
      .then(setOrders)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p className="text-sm text-gray-500">Bestellungen konnten nicht geladen werden.</p>;
  }
  if (orders === null) {
    return <p className="text-sm text-gray-500">Bestellungen werden geladen…</p>;
  }
  if (orders.length === 0) {
    return <p className="text-sm text-gray-500">Sie haben noch keine Bestellungen.</p>;
  }

  return (
    <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/konto/bestellungen/${order.id}`}
          className="flex flex-col gap-2 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">Bestellung #{order.number}</p>
            <p className="mt-0.5 text-sm text-gray-500">
              {order.date ?? ""} · {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="bg-surface-alt rounded-full px-3 py-1 text-xs font-medium text-gray-700">
              {order.status_label}
            </span>
            <span className="text-primary font-semibold">{Number(order.total).toFixed(2)} €</span>
            <span className="text-gray-400" aria-hidden>
              →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function AccountView() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [tab, setTab] = useState<"orders" | "addresses">("orders");

  if (!user) return null;

  const displayName = user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.email;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mein Konto</h1>
          <p className="mt-1 text-gray-600">
            Angemeldet als <span className="font-medium">{displayName}</span> ({user.email})
          </p>
        </div>
        <button
          type="button"
          disabled={loggingOut}
          onClick={async () => {
            setLoggingOut(true);
            try {
              await logout();
            } finally {
              setLoggingOut(false);
            }
          }}
          className="self-start rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 sm:self-auto"
        >
          {loggingOut ? "Abmelden…" : "Abmelden"}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-surface-alt mt-8 grid max-w-md grid-cols-2 gap-2 rounded-xl p-1">
        {(
          [
            ["orders", "Bestellungen"],
            ["addresses", "Adressen"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === key ? "text-primary bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <section className="mt-6">
          <OrderList />
        </section>
      )}

      {tab === "addresses" && (
        <section className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <AddressForm type="billing" title="Rechnungsadresse" initial={user.billing} withPhone />
            <AddressForm type="shipping" title="Lieferadresse" initial={user.shipping} />
          </div>
        </section>
      )}
    </div>
  );
}
