"use client";

/**
 * Newsletter unsubscribe page (P2-15c). Reads the token from the emailed link
 * and removes the subscriber. Resolves generically (the API never discloses
 * whether the address existed).
 */
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiNewsletterUnsubscribe } from "@/lib/newsletter";

function UnsubscribeContent() {
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<"loading" | "done">("loading");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    // Always resolve to a generic "done" – even an invalid token shouldn't error.
    apiNewsletterUnsubscribe(token).finally(() => setState("done"));
  }, [token]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      {state === "loading" ? (
        <p className="text-lg text-gray-600" role="status">
          Sie werden abgemeldet…
        </p>
      ) : (
        <>
          <p className="text-primary text-sm font-medium tracking-widest uppercase">Newsletter</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">Abgemeldet</h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            Sie erhalten von uns keinen Newsletter mehr. Schade, dass Sie gehen – Sie sind jederzeit
            wieder willkommen.
          </p>
          <Link
            href="/"
            className="bg-primary hover:bg-primary-light mt-8 rounded-lg px-6 py-3 font-semibold text-white transition"
          >
            Zur Startseite
          </Link>
        </>
      )}
    </div>
  );
}

export default function NewsletterUnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-24 text-center text-gray-500">Wird geladen…</div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
