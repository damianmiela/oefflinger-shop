"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AccountView } from "./AccountView";
import { apiRequestPasswordReset, AuthApiError } from "@/lib/auth";
import { Turnstile, turnstileEnabled } from "@/components/Turnstile";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

function LoginForm() {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [resetSent, setResetSent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await login(String(form.get("email")), String(form.get("password")));
    } catch (err) {
      setError(
        err instanceof AuthApiError
          ? err.message
          : "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      );
      setSubmitting(false);
    }
  }

  async function onForgotSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await apiRequestPasswordReset(
        String(form.get("email")),
        turnstileToken ?? undefined,
        String(form.get("website") || ""),
      );
      setResetSent(true);
    } catch (err) {
      setError(
        err instanceof AuthApiError
          ? err.message
          : "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (mode === "forgot") {
    return (
      <form
        onSubmit={onForgotSubmit}
        aria-describedby={error ? "forgot-error" : undefined}
        className="flex h-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Passwort vergessen?</h2>
          <p className="mt-1 text-sm text-gray-500">
            Geben Sie Ihre E-Mail-Adresse ein – wir senden Ihnen einen Link zum Zurücksetzen.
          </p>
        </div>

        {resetSent ? (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
            Wenn ein Konto mit dieser E-Mail-Adresse existiert, haben wir Ihnen soeben einen Link
            zum Zurücksetzen des Passworts gesendet. Bitte prüfen Sie auch Ihren Spam-Ordner.
          </p>
        ) : (
          <>
            <div>
              <label htmlFor="forgot_email" className={labelClass}>
                E-Mail-Adresse
              </label>
              <input
                id="forgot_email"
                name="email"
                type="email"
                required
                autoComplete="email"
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

            <Turnstile onToken={setTurnstileToken} />

            {error && (
              <p
                id="forgot-error"
                role="alert"
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || (turnstileEnabled && !turnstileToken)}
              className="bg-primary hover:bg-primary-light rounded-lg px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Bitte warten…" : "Link senden"}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => {
            setMode("login");
            setResetSent(false);
            setError(null);
          }}
          className="text-primary mt-auto self-start text-sm hover:underline"
        >
          ← Zurück zur Anmeldung
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-describedby={error ? "login-error" : undefined}
      className="flex h-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Ich habe bereits ein Konto</h2>
        <p className="mt-1 text-sm text-gray-500">Melden Sie sich mit Ihren Zugangsdaten an.</p>
      </div>

      <div>
        <label htmlFor="login_email" className={labelClass}>
          E-Mail-Adresse
        </label>
        <input
          id="login_email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="login_password" className={labelClass}>
          Passwort
        </label>
        <input
          id="login_password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
        <div className="mt-1.5 text-right">
          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              setError(null);
            }}
            className="text-primary text-sm hover:underline"
          >
            Passwort vergessen?
          </button>
        </div>
      </div>

      {error && (
        <p
          id="login-error"
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary hover:bg-primary-light mt-auto rounded-lg px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Bitte warten…" : "Anmelden"}
      </button>
    </form>
  );
}

function RegisterForm() {
  const { register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await register({
        email: String(form.get("email")),
        password: String(form.get("password")),
        first_name: String(form.get("first_name") || ""),
        last_name: String(form.get("last_name") || ""),
        turnstile_token: turnstileToken ?? undefined,
        website: String(form.get("website") || ""),
      });
    } catch (err) {
      setError(
        err instanceof AuthApiError
          ? err.message
          : "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-describedby={error ? "register-error" : undefined}
      className="flex h-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Neu hier?</h2>
        <p className="mt-1 text-sm text-gray-500">
          Erstellen Sie ein Konto und behalten Sie Ihre Bestellungen im Blick.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="reg_first_name" className={labelClass}>
            Vorname
          </label>
          <input
            id="reg_first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="reg_last_name" className={labelClass}>
            Nachname
          </label>
          <input
            id="reg_last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="reg_email" className={labelClass}>
          E-Mail-Adresse
        </label>
        <input
          id="reg_email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="reg_password" className={labelClass}>
          Passwort
        </label>
        <input
          id="reg_password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">Mindestens 8 Zeichen.</p>
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

      <Turnstile onToken={setTurnstileToken} />

      {error && (
        <p
          id="register-error"
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || (turnstileEnabled && !turnstileToken)}
        className="border-primary text-primary hover:bg-primary/5 mt-auto rounded-lg border bg-white px-6 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Bitte warten…" : "Konto erstellen"}
      </button>
    </form>
  );
}

function KontoContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  // After successful login/registration follow the redirect (e.g. to checkout)
  useEffect(() => {
    if (user && redirect && redirect.startsWith("/")) {
      router.replace(redirect);
    }
  }, [user, redirect, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500 sm:px-6 lg:px-8">
        Wird geladen…
      </div>
    );
  }

  if (user) {
    return <AccountView />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Anmelden</h1>
      <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  );
}

export default function KontoPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">Wird geladen…</div>
      }
    >
      <KontoContent />
    </Suspense>
  );
}
