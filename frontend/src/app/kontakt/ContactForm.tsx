"use client";

import { useState } from "react";
import Link from "next/link";
import { Turnstile, turnstileEnabled } from "@/components/Turnstile";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL || "http://localhost:4001";
const CONTACT_ENDPOINT = `${WP_URL.replace(/\/$/, "")}/wp-json/oeff/v1/contact`;

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          message: String(form.get("message") || ""),
          website: String(form.get("website") || ""),
          turnstile_token: turnstileToken ?? undefined,
        }),
      });
      if (!res.ok) {
        let message = "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.";
        try {
          const body = (await res.json()) as { message?: string };
          if (body?.message) message = body.message;
        } catch {
          // keep fallback message
        }
        throw new Error(message);
      }
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Ihre Nachricht konnte nicht gesendet werden. Bitte schreiben Sie uns an info@example.com.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 sm:p-8" role="status">
        <h2 className="text-xl font-semibold text-green-900">Vielen Dank für Ihre Nachricht!</h2>
        <p className="mt-2 text-green-800">
          Wir haben Ihre Anfrage erhalten und melden uns in der Regel innerhalb von 1–2 Werktagen
          bei Ihnen.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-xl font-semibold text-gray-900">Nachricht senden</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact_name" className={labelClass}>
            Name
          </label>
          <input
            id="contact_name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact_email" className={labelClass}>
            E-Mail-Adresse
          </label>
          <input
            id="contact_email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact_message" className={labelClass}>
          Ihre Nachricht
        </label>
        <textarea
          id="contact_message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className={inputClass}
        />
      </div>

      {/* Honeypot – invisible to humans, bots tend to fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="mt-4">
        <Turnstile onToken={setTurnstileToken} />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || (turnstileEnabled && !turnstileToken)}
        className="bg-primary hover:bg-primary-light mt-6 rounded-lg px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Wird gesendet…" : "Nachricht senden"}
      </button>

      <p className="mt-4 text-xs text-gray-500">
        Ihre Angaben verwenden wir ausschließlich zur Bearbeitung Ihrer Anfrage. Näheres in der{" "}
        <Link href="/datenschutz" className="text-primary hover:underline">
          Datenschutzerklärung
        </Link>
        .
      </p>
    </form>
  );
}
