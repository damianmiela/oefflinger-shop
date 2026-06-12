"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Pre-checkout gate: logged-in customers go straight to checkout,
 * guests choose between logging in and ordering as guest.
 */
function ZurKasseContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkoutUrl = `/checkout${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  useEffect(() => {
    if (!loading && user) {
      router.replace(checkoutUrl);
    }
  }, [loading, user, router, checkoutUrl]);

  if (loading || user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500 sm:px-6 lg:px-8">
        Wird geladen…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900">Fast geschafft!</h1>
        <p className="mt-3 text-lg text-gray-600">
          Haben Sie bereits ein Konto? Melden Sie sich an oder bestellen Sie als Gast.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href={`/konto?redirect=${encodeURIComponent(checkoutUrl)}`}
            className="bg-primary hover:bg-primary-light rounded-lg px-6 py-3.5 font-semibold text-white transition"
          >
            Anmelden und fortfahren
          </Link>
          <Link
            href={checkoutUrl}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Als Gast bestellen
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Mit einem Konto sehen Sie Ihre Bestellungen und müssen Ihre Adresse nicht erneut eingeben.
        </p>
      </div>
    </div>
  );
}

export default function ZurKassePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">Wird geladen…</div>
      }
    >
      <ZurKasseContent />
    </Suspense>
  );
}
