"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AccountView } from "./AccountView";
import { AuthApiError } from "@/lib/auth";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

function KontoContent() {
  const { user, loading, login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      if (mode === "login") {
        await login(String(form.get("email")), String(form.get("password")));
      } else {
        await register({
          email: String(form.get("email")),
          password: String(form.get("password")),
          first_name: String(form.get("first_name") || ""),
          last_name: String(form.get("last_name") || ""),
        });
      }
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === "login" ? "Anmelden" : "Konto erstellen"}
        </h1>

        {/* Tabs */}
        <div className="bg-surface-alt mt-6 grid grid-cols-2 gap-2 rounded-xl p-1">
          {(
            [
              ["login", "Anmelden"],
              ["register", "Registrieren"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMode(key);
                setError(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mode === key
                  ? "text-primary bg-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {mode === "register" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className={labelClass}>
                  Vorname
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="last_name" className={labelClass}>
                  Nachname
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className={labelClass}>
              E-Mail-Adresse
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={mode === "register" ? 8 : undefined}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className={inputClass}
            />
            {mode === "register" && (
              <p className="mt-1 text-xs text-gray-500">Mindestens 8 Zeichen.</p>
            )}
          </div>

          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-primary-light mt-2 rounded-lg px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Bitte warten…" : mode === "login" ? "Anmelden" : "Konto erstellen"}
          </button>
        </form>
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
