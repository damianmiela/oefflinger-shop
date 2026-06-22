"use client";

/**
 * Build-your-own configurator for a configurable set: pick products from the
 * set's category with quantity steppers, see the live quantity-tier discount and
 * a "noch N für X %" nudge, then add the selection to the cart (CartContext.addSet
 * → oeff-sets validates the selection against the set's category server-side).
 */
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatCents } from "@/lib/format";
import type { OeffSet } from "../_lib/sets";

export function SetConfigurator({ set }: { set: OeffSet }) {
  const { addSet } = useCart();
  const [qty, setQty] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);

  const cc = set.currency_code || "EUR";
  const options = set.options || [];
  const tiers = [...(set.tiers || [])].sort((a, b) => a.min_qty - b.min_qty);

  const setQ = (id: number, n: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, n) }));

  const totalQty = options.reduce((s, o) => s + (qty[o.id] || 0), 0);
  const baseCents = options.reduce((s, o) => s + (qty[o.id] || 0) * o.price, 0);

  let percent = 0;
  for (const t of tiers) if (totalQty >= t.min_qty) percent = t.percent;
  const discounted = Math.round(baseCents * (1 - percent / 100));
  const savings = baseCents - discounted;
  const nextTier = tiers.find((t) => totalQty < t.min_qty);

  async function handleAdd() {
    if (busy || totalQty < 1) return;
    const selection = options
      .filter((o) => (qty[o.id] || 0) > 0)
      .map((o) => ({ id: o.id, qty: qty[o.id] }));
    setBusy(true);
    const ok = await addSet(set.id, selection);
    setBusy(false);
    if (ok) {
      setQty({});
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <div className="mt-4">
      {tiers.length > 0 && (
        <p className="text-sm text-gray-600">
          Mengenrabatt:{" "}
          {tiers.map((t, i) => (
            <span key={t.min_qty} className="whitespace-nowrap">
              {i > 0 ? ", " : ""}ab {t.min_qty} → {Math.round(t.percent)} %
            </span>
          ))}
        </p>
      )}

      <ul className="mt-4 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {options.map((o) => {
          const n = qty[o.id] || 0;
          return (
            <li key={o.id} className="flex items-center gap-4 p-4">
              <div className="bg-surface-alt h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                {o.image ? (
                  <Image
                    src={o.image}
                    alt={o.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">{o.name}</p>
                <p className="text-sm text-gray-500">
                  {formatCents(o.price, cc)}
                  {!o.in_stock && " · nicht verfügbar"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQ(o.id, n - 1)}
                  disabled={n <= 0}
                  aria-label={`Weniger ${o.name}`}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>
                <span className="w-7 text-center text-sm font-medium">{n}</span>
                <button
                  type="button"
                  onClick={() => setQ(o.id, n + 1)}
                  disabled={!o.in_stock}
                  aria-label={`Mehr ${o.name}`}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="bg-surface-alt mt-6 rounded-xl p-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-gray-600">{totalQty} Artikel gewählt</span>
          <span className="text-primary text-2xl font-bold">{formatCents(discounted, cc)}</span>
        </div>
        {savings > 0 && (
          <p className="text-accent mt-1 text-right text-sm font-medium">
            Mengenrabatt −{Math.round(percent)} % · Sie sparen {formatCents(savings, cc)}
          </p>
        )}
        {nextTier && (
          <p className="mt-2 text-sm text-gray-500">
            Noch {nextTier.min_qty - totalQty} Artikel bis {Math.round(nextTier.percent)} % Rabatt.
          </p>
        )}
        <button
          type="button"
          onClick={handleAdd}
          disabled={busy || totalQty < 1}
          className="bg-primary hover:bg-primary-light mt-4 w-full cursor-pointer rounded-lg px-5 py-3 text-center font-semibold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy
            ? "Wird hinzugefügt…"
            : added
              ? "Hinzugefügt!"
              : totalQty < 1
                ? "Produkte wählen"
                : "In den Warenkorb"}
        </button>
        <p className="mt-1 text-center text-xs text-gray-400">inkl. MwSt.</p>
      </div>
    </div>
  );
}
