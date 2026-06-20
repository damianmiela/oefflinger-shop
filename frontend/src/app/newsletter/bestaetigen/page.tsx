"use client";

/**
 * Newsletter double-opt-in confirmation page (P2-15c). Reads the token from the
 * emailed link, confirms the subscription, and shows the 10% welcome coupon.
 */
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiNewsletterConfirm } from "@/lib/newsletter";

function ConfirmContent() {
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (!token) {
      setMessage("Dieser Bestätigungslink ist ungültig oder unvollständig.");
      setState("error");
      return;
    }
    apiNewsletterConfirm(token)
      .then((r) => {
        setCoupon(r.coupon);
        setState("success");
      })
      .catch((e) => {
        setMessage(
          e instanceof Error && e.message
            ? e.message
            : "Die Bestätigung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
        );
        setState("error");
      });
  }, [token]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      {state === "loading" && (
        <p className="text-lg text-gray-600" role="status">
          Ihre Anmeldung wird bestätigt…
        </p>
      )}

      {state === "success" && (
        <>
          <p className="text-primary text-sm font-medium tracking-widest uppercase">Newsletter</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">Anmeldung bestätigt</h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            Vielen Dank! Ihre Newsletter-Anmeldung ist jetzt aktiv.
          </p>

          {coupon ? (
            <div className="mt-8 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Ihr Willkommensgutschein</p>
              <p className="text-primary mt-2 text-2xl font-bold tracking-wide">{coupon}</p>
              <p className="mt-2 text-sm text-gray-600">
                10% auf Ihre erste Bestellung · 90 Tage gültig · einmalig einlösbar. Den Code haben
                wir Ihnen auch per E-Mail gesendet.
              </p>
            </div>
          ) : (
            <p className="mt-6 max-w-md text-gray-600">
              Ihren Willkommensgutschein senden wir Ihnen in Kürze per E-Mail.
            </p>
          )}

          <Link
            href="/shop"
            className="bg-primary hover:bg-primary-light mt-8 rounded-lg px-6 py-3 font-semibold text-white transition"
          >
            Zum Shop
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <p className="text-primary text-sm font-medium tracking-widest uppercase">Newsletter</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Bestätigung nicht möglich
          </h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">{message}</p>
          <Link
            href="/"
            className="border-primary text-primary hover:bg-primary/5 mt-8 rounded-lg border bg-white px-6 py-3 font-semibold transition"
          >
            Zur Startseite
          </Link>
        </>
      )}
    </div>
  );
}

export default function NewsletterConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-24 text-center text-gray-500">Wird geladen…</div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
