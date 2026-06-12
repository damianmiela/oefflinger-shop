"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const paymentMethod = searchParams.get("pm") ?? "";
  const isGuest = searchParams.get("guest") === "1";
  const isBankTransfer = paymentMethod === "bacs";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
        Vielen Dank für Ihre Bestellung!
      </h1>

      {orderId && (
        <p className="mt-3 text-lg text-gray-600">
          Ihre Bestellnummer: <span className="font-semibold text-gray-900">#{orderId}</span>
        </p>
      )}

      <p className="mx-auto mt-4 max-w-md text-gray-600">
        Wir haben Ihnen eine Bestellbestätigung per E-Mail gesendet.
        {isBankTransfer &&
          " Darin finden Sie unsere Bankverbindung für die Überweisung – wir versenden Ihre Bestellung nach Zahlungseingang."}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="bg-primary hover:bg-primary-light rounded-lg px-6 py-3 font-semibold text-white transition"
        >
          Weiter einkaufen
        </Link>
        {isGuest ? (
          <Link
            href="/konto"
            className="border-primary text-primary hover:bg-primary/5 rounded-lg border bg-white px-6 py-3 font-semibold transition"
          >
            Konto erstellen
          </Link>
        ) : (
          <Link
            href="/konto"
            className="border-primary text-primary hover:bg-primary/5 rounded-lg border bg-white px-6 py-3 font-semibold transition"
          >
            Bestellungen ansehen
          </Link>
        )}
      </div>

      {isGuest && (
        <p className="mx-auto mt-4 max-w-md text-sm text-gray-500">
          Mit einem Konto behalten Sie Ihre Bestellungen im Blick und müssen Ihre Adresse beim
          nächsten Mal nicht erneut eingeben.
        </p>
      )}
    </div>
  );
}
