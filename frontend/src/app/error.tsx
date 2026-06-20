"use client";

/**
 * Route-level error boundary (P2-18b → §3.10). Catches exceptions thrown while
 * rendering any page (it stays inside the root layout, so header/footer remain)
 * and shows a branded German message with a retry instead of Next's default
 * error screen. global-error.tsx covers failures of the root layout itself.
 */
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for diagnostics; Next strips server-side details from `error` in prod.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-primary text-sm font-medium tracking-widest uppercase">Fehler</p>
      <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
        Etwas ist schiefgelaufen
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-600">
        Beim Laden dieser Seite ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut – wenn das
        Problem weiterhin besteht, erreichen Sie uns unter{" "}
        <a href="mailto:info@example.com" className="text-primary hover:underline">
          info@example.com
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="bg-primary hover:bg-primary-light rounded-lg px-6 py-3 font-semibold text-white transition"
        >
          Erneut versuchen
        </button>
        <Link
          href="/"
          className="border-primary text-primary hover:bg-primary/5 rounded-lg border bg-white px-6 py-3 font-semibold transition"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
