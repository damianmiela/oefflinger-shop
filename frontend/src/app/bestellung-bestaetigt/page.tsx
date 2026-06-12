import { Suspense } from "react";
import { ConfirmationContent } from "./ConfirmationContent";

export const metadata = {
  title: "Bestellung erhalten – Öfflinger",
  description: "Vielen Dank für Ihre Bestellung bei Öfflinger.",
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
