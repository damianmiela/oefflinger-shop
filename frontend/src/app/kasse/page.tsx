import { Suspense } from "react";
import { CheckoutForm } from "./CheckoutForm";

export const metadata = {
  title: "Kasse",
  description: "Bestellung abschließen: Lieferadresse, Versand und Zahlung.",
  robots: { index: false, follow: false },
};

export default function KassePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">Wird geladen…</div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
