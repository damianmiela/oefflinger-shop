"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiResetPassword, AuthApiError } from "@/lib/auth";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = searchParams.get("login") ?? "";
  const key = searchParams.get("key") ?? "";
  const linkValid = login !== "" && key !== "";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("password_confirm") || "");
    if (password !== confirm) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    setSubmitting(true);
    try {
      const user = await apiResetPassword({ login, key, password });
      setUser(user);
      router.replace("/konto");
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-gray-900">Neues Passwort vergeben</h1>

        {!linkValid ? (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-amber-900">
              Dieser Link ist ungültig oder unvollständig. Bitte fordern Sie über{" "}
              <Link href="/konto" className="font-semibold underline">
                Anmelden → Passwort vergessen
              </Link>{" "}
              einen neuen Link an.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <p className="text-sm text-gray-500">
              Vergeben Sie ein neues Passwort für Ihr Konto. Nach dem Speichern sind Sie direkt
              angemeldet.
            </p>

            <div>
              <label htmlFor="reset_password" className={labelClass}>
                Neues Passwort
              </label>
              <input
                id="reset_password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-500">Mindestens 8 Zeichen.</p>
            </div>

            <div>
              <label htmlFor="reset_password_confirm" className={labelClass}>
                Neues Passwort wiederholen
              </label>
              <input
                id="reset_password_confirm"
                name="password_confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary-light rounded-lg px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Wird gespeichert…" : "Passwort speichern"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
