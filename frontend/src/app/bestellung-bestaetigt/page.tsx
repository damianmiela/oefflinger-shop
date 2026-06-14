import { Suspense } from "react";
import { ConfirmationContent } from "./ConfirmationContent";

export const metadata = {
  title: "Bestellung erhalten",
  description: "Vielen Dank für Ihre Bestellung bei Öfflinger.",
  robots: { index: false, follow: false },
};

export default function BestellungBestaetigtPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">Wird geladen…</div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
