"use client";

/**
 * Newsletter signup (P2-15c → §4.1). Double opt-in: posting only triggers a
 * confirmation email; the 10% coupon is issued after the user confirms.
 * Designed for a dark/coloured background (footer + homepage band).
 */
import { useState } from "react";
import Link from "next/link";
import { Turnstile, turnstileEnabled } from "@/components/Turnstile";
import { apiNewsletterSubscribe } from "@/lib/newsletter";

export function NewsletterSignup({ variant = "section" }: { variant?: "section" | "footer" }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compact = variant === "footer";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiNewsletterSubscribe({ email, turnstileToken: token ?? undefined, website });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <p role="status" className={compact ? "text-sm text-white/85" : "mx-auto max-w-xl text-white/90"}>
        Fast geschafft! Wir haben Ihnen eine E-Mail geschickt – bitte bestätigen Sie darin Ihre
        Anmeldung. Danach erhalten Sie Ihren 10%-Gutschein.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-describedby={error ? "nl-error" : undefined}
      className={compact ? "" : "mx-auto max-w-xl"}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`nl-email-${variant}`} className="sr-only">
          E-Mail-Adresse
        </label>
        <input
          id={`nl-email-${variant}`}
          type="email"
          required
          autoComplete="email"
          placeholder="Ihre E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/60 focus:border-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
        />
        {/* Honeypot – invisible to humans, bots tend to fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={submitting || (turnstileEnabled && !token)}
          className="bg-accent text-primary-dark hover:bg-accent-light shrink-0 rounded-lg px-6 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Wird gesendet…" : "Anmelden"}
        </button>
      </div>

      {turnstileEnabled && (
        <div className="mt-3">
          <Turnstile onToken={setToken} />
        </div>
      )}

      {error && (
        <p id="nl-error" role="alert" className="mt-3 text-sm text-red-100">
          {error}
        </p>
      )}

      <p className={`mt-3 ${compact ? "text-xs text-white/60" : "text-sm text-white/70"}`}>
        Mit der Anmeldung erhalten Sie unseren Newsletter; eine Abmeldung ist jederzeit möglich. Es
        gilt unsere{" "}
        <Link href="/datenschutz" className="underline hover:text-white">
          Datenschutzerklärung
        </Link>
        .
      </p>
    </form>
  );
}
