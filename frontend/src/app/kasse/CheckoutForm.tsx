"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import * as wooApi from "@/lib/woo/api";
import { toUserMessage } from "@/lib/woo/api";
import { getStoredToken, storeToken } from "@/lib/woo/cart-token";
import { apiNewsletterSubscribe, apiNewsletterStatus } from "@/lib/newsletter";
import { formatCents } from "@/lib/format";
import { PaymentMethodLogos } from "@/components/PaymentMethodLogos";
import { CouponField } from "@/components/CouponField";
import type { CheckoutAddress } from "@/types";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const sectionClass = "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6";

interface AddressFields {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  postcode: string;
  city: string;
}

const EMPTY_ADDRESS: AddressFields = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  postcode: "",
  city: "",
};

/** Known gateway ids → customer-facing labels */
const PAYMENT_LABELS: Record<string, { title: string; description: string }> = {
  bacs: {
    title: "Vorkasse / Überweisung",
    description:
      "Sie erhalten unsere Bankverbindung mit der Bestellbestätigung. Versand nach Zahlungseingang.",
  },
  paypal: { title: "PayPal", description: "Sie werden zur Bezahlung zu PayPal weitergeleitet." },
  "ppcp-gateway": {
    title: "PayPal",
    description: "Sie werden zur Bezahlung zu PayPal weitergeleitet.",
  },
  klarna_payments: {
    title: "Klarna (Rechnung / Sofort)",
    description: "Sie werden zur Bezahlung zu Klarna weitergeleitet.",
  },
  kp: {
    title: "Klarna (Rechnung / Sofort)",
    description: "Sie werden zur Bezahlung zu Klarna weitergeleitet.",
  },
  klarna: {
    title: "Klarna (Rechnung / Sofort)",
    description: "Sie werden zur Bezahlung zu Klarna weitergeleitet.",
  },
  stripe: {
    title: "Kredit- / Debitkarte",
    description: "Visa und Mastercard – sichere Zahlung über unseren Zahlungsdienstleister.",
  },
};

function paymentLabel(id: string) {
  return (
    PAYMENT_LABELS[id] ?? {
      title: id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: "",
    }
  );
}

function addressComplete(a: AddressFields): boolean {
  return (
    a.first_name.trim().length > 1 &&
    a.last_name.trim().length > 1 &&
    a.address_1.trim().length > 3 &&
    /^\d{5}$/.test(a.postcode.trim()) &&
    a.city.trim().length > 1
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shipping, setShipping] = useState<AddressFields>(EMPTY_ADDRESS);
  const [billingDiffers, setBillingDiffers] = useState(false);
  const [billing, setBilling] = useState<AddressFields>(EMPTY_ADDRESS);
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<string>("");
  const [agb, setAgb] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const [ratesLoading, setRatesLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prefilledRef = useRef(false);
  const lastSentRef = useRef("");

  /* Prefill from the logged-in account */
  useEffect(() => {
    if (authLoading || !user || prefilledRef.current) return;
    prefilledRef.current = true;
    setEmail(user.email ?? "");
    const src = user.shipping?.address_1 ? user.shipping : user.billing;
    if (src) {
      setShipping({
        first_name: src.first_name ?? "",
        last_name: src.last_name ?? "",
        address_1: src.address_1 ?? "",
        address_2: src.address_2 ?? "",
        postcode: src.postcode ?? "",
        city: src.city ?? "",
      });
    }
    if (user.billing?.phone) setPhone(user.billing.phone);
  }, [authLoading, user]);

  /* Hide the newsletter opt-in if the logged-in user is already subscribed */
  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    apiNewsletterStatus().then((s) => {
      if (!cancelled) setAlreadySubscribed(s);
    });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  /* Send the address to WooCommerce once complete → shipping rates + taxes */
  const syncCustomer = useCallback(async () => {
    if (!addressComplete(shipping)) return;
    const bill = billingDiffers && addressComplete(billing) ? billing : shipping;
    const payload = {
      shipping_address: { ...shipping, country: "DE" },
      billing_address: { ...bill, country: "DE", email: email || undefined, phone: phone || undefined },
    };
    const fingerprint = JSON.stringify(payload);
    if (fingerprint === lastSentRef.current) return;
    lastSentRef.current = fingerprint;
    setRatesLoading(true);
    try {
      const { data, token } = await wooApi.updateCustomer(payload, getStoredToken());
      if (token) storeToken(token);
      void data;
      await refreshCart();
    } catch {
      // rates simply stay hidden; final validation happens on submit
    } finally {
      setRatesLoading(false);
    }
  }, [shipping, billing, billingDiffers, email, phone, refreshCart]);

  const packages = cart?.shipping_rates ?? [];
  const rates = packages[0]?.shipping_rates ?? [];

  const cartPaymentMethods = cart?.payment_methods;
  const paymentMethods = useMemo(
    () => (cartPaymentMethods?.length ? cartPaymentMethods : ["bacs"]),
    [cartPaymentMethods],
  );
  useEffect(() => {
    if (!payment && paymentMethods.length > 0) setPayment(paymentMethods[0]);
  }, [payment, paymentMethods]);

  async function selectRate(packageId: number | string, rateId: string) {
    try {
      const { token } = await wooApi.selectShippingRate(packageId, rateId, getStoredToken());
      if (token) storeToken(token);
      await refreshCart();
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!addressComplete(shipping)) {
      setError("Bitte füllen Sie die Lieferadresse vollständig aus (PLZ mit 5 Ziffern).");
      return;
    }
    if (billingDiffers && !addressComplete(billing)) {
      setError("Bitte füllen Sie die abweichende Rechnungsadresse vollständig aus.");
      return;
    }
    if (!payment) {
      setError("Bitte wählen Sie eine Zahlungsart.");
      return;
    }
    if (!agb) {
      setError("Bitte bestätigen Sie die AGB und die Widerrufsbelehrung.");
      return;
    }

    setPlacing(true);
    try {
      // Make sure WooCommerce has the final address before placing the order
      lastSentRef.current = "";
      await syncCustomer();

      const bill = billingDiffers ? billing : shipping;
      const billingAddress: CheckoutAddress = { ...bill, country: "DE", email, phone };
      const shippingAddress: CheckoutAddress = { ...shipping, country: "DE" };

      const { data } = await wooApi.placeOrder(
        {
          billing_address: billingAddress,
          shipping_address: shippingAddress,
          payment_method: payment,
          customer_note: note.trim() || undefined,
        },
        getStoredToken(),
      );

      // Newsletter opt-in (best-effort, double opt-in) — must never block/break the order.
      if (newsletterOptIn && email && !alreadySubscribed) {
        try {
          await apiNewsletterSubscribe({ email });
        } catch {
          /* ignore — the order must succeed regardless */
        }
      }

      const pr = data.payment_result;
      const externalRedirect =
        pr?.redirect_url &&
        pr.payment_status !== "success" &&
        !pr.redirect_url.includes("order-received");

      if (externalRedirect && pr?.redirect_url) {
        // Gateway (PayPal/Klarna/3-D Secure) takes over
        window.location.href = pr.redirect_url;
        return;
      }

      await refreshCart();
      const confirmParams = new URLSearchParams({
        order: String(data.order_id),
        pm: payment,
      });
      if (!user) confirmParams.set("guest", "1");
      router.push(`/bestellung-bestaetigt?${confirmParams.toString()}`);
    } catch (err) {
      setError(toUserMessage(err));
      setPlacing(false);
    }
  }

  /* ---------- empty / loading states ---------- */
  if (!cart) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500 sm:px-6 lg:px-8">
        Kasse wird geladen…
      </div>
    );
  }
  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Ihr Warenkorb ist leer</h1>
        <Link
          href="/shop"
          className="bg-primary hover:bg-primary-light mt-6 inline-block rounded-lg px-6 py-3 text-white transition"
        >
          Zum Shop
        </Link>
      </div>
    );
  }

  const currency = cart.totals.currency_code;
  const subtotal = Number(cart.totals.total_items) + Number(cart.totals.total_items_tax ?? 0);
  const shippingTotal =
    Number(cart.totals.total_shipping ?? 0) + Number(cart.totals.total_shipping_tax ?? 0);
  const discount = Number(cart.totals.total_discount ?? 0);
  const tax = Number(cart.totals.total_tax ?? 0);
  const hasRates = rates.length > 0;

  const addressFields = (
    values: AddressFields,
    setValues: (v: AddressFields) => void,
    prefix: string,
  ) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor={`${prefix}_first_name`} className={labelClass}>
          Vorname
        </label>
        <input
          id={`${prefix}_first_name`}
          value={values.first_name}
          onChange={(e) => setValues({ ...values, first_name: e.target.value })}
          onBlur={syncCustomer}
          required
          autoComplete="given-name"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}_last_name`} className={labelClass}>
          Nachname
        </label>
        <input
          id={`${prefix}_last_name`}
          value={values.last_name}
          onChange={(e) => setValues({ ...values, last_name: e.target.value })}
          onBlur={syncCustomer}
          required
          autoComplete="family-name"
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}_address_1`} className={labelClass}>
          Straße und Hausnummer
        </label>
        <input
          id={`${prefix}_address_1`}
          value={values.address_1}
          onChange={(e) => setValues({ ...values, address_1: e.target.value })}
          onBlur={syncCustomer}
          required
          autoComplete="address-line1"
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}_address_2`} className={labelClass}>
          Adresszusatz (optional)
        </label>
        <input
          id={`${prefix}_address_2`}
          value={values.address_2}
          onChange={(e) => setValues({ ...values, address_2: e.target.value })}
          autoComplete="address-line2"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}_postcode`} className={labelClass}>
          PLZ
        </label>
        <input
          id={`${prefix}_postcode`}
          value={values.postcode}
          onChange={(e) => setValues({ ...values, postcode: e.target.value })}
          onBlur={syncCustomer}
          required
          inputMode="numeric"
          pattern="[0-9]{5}"
          autoComplete="postal-code"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}_city`} className={labelClass}>
          Stadt
        </label>
        <input
          id={`${prefix}_city`}
          value={values.city}
          onChange={(e) => setValues({ ...values, city: e.target.value })}
          onBlur={syncCustomer}
          required
          autoComplete="address-level2"
          className={inputClass}
        />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">Kasse</h1>

      <form onSubmit={onSubmit} className="grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
        {/* ---------- left: steps ---------- */}
        <div className="space-y-6">
          <section className={sectionClass} aria-labelledby="kasse-kontakt">
            <h2 id="kasse-kontakt" className="text-lg font-semibold text-gray-900">
              Kontakt
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="checkout_email" className={labelClass}>
                  E-Mail-Adresse
                </label>
                <input
                  id="checkout_email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={syncCustomer}
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="checkout_phone" className={labelClass}>
                  Telefon (optional)
                </label>
                <input
                  id="checkout_phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>
            </div>
            {!user && (
              <p className="mt-3 text-xs text-gray-500">
                Sie bestellen als Gast. An diese Adresse senden wir die Bestellbestätigung.
              </p>
            )}
          </section>

          <section className={sectionClass} aria-labelledby="kasse-lieferadresse">
            <h2 id="kasse-lieferadresse" className="text-lg font-semibold text-gray-900">
              Lieferadresse
            </h2>
            <div className="mt-4">{addressFields(shipping, setShipping, "ship")}</div>
            <p className="mt-3 text-xs text-gray-500">Wir liefern innerhalb Deutschlands.</p>

            <label className="mt-4 flex items-center gap-2.5 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={billingDiffers}
                onChange={(e) => setBillingDiffers(e.target.checked)}
                className="text-primary focus:ring-primary/30 h-4 w-4 rounded border-gray-300"
              />
              Rechnungsadresse weicht ab
            </label>
            {billingDiffers && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                {addressFields(billing, setBilling, "bill")}
              </div>
            )}
          </section>

          <section className={sectionClass} aria-labelledby="kasse-versand">
            <h2 id="kasse-versand" className="text-lg font-semibold text-gray-900">
              Versand
            </h2>
            {!addressComplete(shipping) ? (
              <p className="mt-3 text-sm text-gray-500">
                Bitte geben Sie zuerst Ihre Lieferadresse ein – die Versandkosten werden dann
                automatisch berechnet.
              </p>
            ) : ratesLoading ? (
              <p className="mt-3 text-sm text-gray-500">Versandkosten werden berechnet…</p>
            ) : hasRates ? (
              <div className="mt-3 space-y-2">
                {packages.map((pkg) =>
                  pkg.shipping_rates.map((rate) => (
                    <label
                      key={rate.rate_id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${
                        rate.selected
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_rate"
                          checked={rate.selected}
                          onChange={() => selectRate(pkg.package_id, rate.rate_id)}
                          className="text-primary focus:ring-primary/30 h-4 w-4 border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-900">{rate.name}</span>
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {Number(rate.price) + Number(rate.taxes ?? 0) === 0
                          ? "Kostenlos"
                          : formatCents(
                              Number(rate.price) + Number(rate.taxes ?? 0),
                              rate.currency_code,
                            )}
                      </span>
                    </label>
                  )),
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                Versand mit DHL – die Kosten werden in der Bestellübersicht angezeigt.
              </p>
            )}
          </section>

          <section className={sectionClass} aria-labelledby="kasse-zahlung">
            <h2 id="kasse-zahlung" className="text-lg font-semibold text-gray-900">
              Zahlungsart
            </h2>
            <div className="mt-3 space-y-2">
              {paymentMethods.map((id) => {
                const { title, description } = paymentLabel(id);
                const selected = payment === id;
                return (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
                      selected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      checked={selected}
                      onChange={() => setPayment(id)}
                      className="text-primary focus:ring-primary/30 mt-0.5 h-4 w-4 border-gray-300"
                    />
                    <span>
                      <span className="block text-sm font-medium text-gray-900">{title}</span>
                      {description && (
                        <span className="mt-0.5 block text-xs text-gray-500">{description}</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
            <PaymentMethodLogos className="mt-4" />
          </section>

          <section className={sectionClass} aria-labelledby="kasse-anmerkung">
            <h2 id="kasse-anmerkung" className="text-lg font-semibold text-gray-900">
              Anmerkung zur Bestellung (optional)
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={1000}
              className={`${inputClass} mt-3`}
              placeholder="z. B. Hinweise zur Lieferung"
            />
          </section>
        </div>

        {/* ---------- right: coupon + summary ---------- */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <CouponField className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" />
          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Bestellübersicht</h2>

          <ul className="mt-4 divide-y divide-gray-100">
            {cart.items.map((item) => (
              <li key={item.key} className="flex items-baseline justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-gray-700">
                  {item.quantity} × {item.name}
                </span>
                <span className="font-medium text-gray-900">
                  {formatCents(
                    Number(item.totals.line_total) + Number(item.totals.line_total_tax ?? 0),
                    currency,
                  )}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Zwischensumme</dt>
              <dd className="font-medium text-gray-900">{formatCents(subtotal, currency)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <dt>Rabatt</dt>
                <dd className="font-medium">−{formatCents(discount, currency)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-600">Versand</dt>
              <dd className="font-medium text-gray-900">
                {!addressComplete(shipping)
                  ? "—"
                  : shippingTotal === 0
                    ? "Kostenlos"
                    : formatCents(shippingTotal, currency)}
              </dd>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-xs text-gray-400">
                <dt>davon MwSt.</dt>
                <dd>{formatCents(tax, currency)}</dd>
              </div>
            )}
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-gray-200 pt-4">
            <span className="text-base font-semibold text-gray-800">Gesamtsumme</span>
            <span className="text-right">
              <span className="text-primary block text-2xl font-bold">
                {formatCents(Number(cart.totals.total_price), currency)}
              </span>
              <span className="mt-0.5 block text-xs text-gray-400">inkl. MwSt.</span>
            </span>
          </div>

          <label className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-gray-600">
            <input
              type="checkbox"
              checked={agb}
              onChange={(e) => setAgb(e.target.checked)}
              required
              className="text-primary focus:ring-primary/30 mt-0.5 h-4 w-4 rounded border-gray-300"
            />
            <span>
              Ich habe die{" "}
              <Link href="/agb" target="_blank" className="text-primary underline">
                AGB
              </Link>{" "}
              und die{" "}
              <Link href="/widerruf" target="_blank" className="text-primary underline">
                Widerrufsbelehrung
              </Link>{" "}
              zur Kenntnis genommen und bin mit ihnen einverstanden.
            </span>
          </label>

          {!alreadySubscribed && (
            <label className="mt-3 flex items-start gap-2.5 text-xs leading-relaxed text-gray-600">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => setNewsletterOptIn(e.target.checked)}
                className="text-primary focus:ring-primary/30 mt-0.5 h-4 w-4 rounded border-gray-300"
              />
              <span>
                Ja, ich möchte den Öfflinger-Newsletter mit Neuigkeiten und Angeboten erhalten und
                meinen 10%-Willkommensgutschein sichern. Die Anmeldung bestätige ich per E-Mail;
                eine Abmeldung ist jederzeit möglich. (optional)
              </span>
            </label>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={placing}
            className="bg-accent hover:bg-accent-light mt-5 w-full rounded-lg px-6 py-3.5 text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {placing ? "Bestellung wird übermittelt…" : "Zahlungspflichtig bestellen"}
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            Hinweise zur Datenverarbeitung:{" "}
            <Link href="/datenschutz" target="_blank" className="underline">
              Datenschutzerklärung
            </Link>
          </p>
        </aside>
        </div>
      </form>
    </div>
  );
}
