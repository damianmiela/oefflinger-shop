import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = {
  title: "Passwort zurücksetzen – Öfflinger",
  description: "Vergeben Sie ein neues Passwort für Ihr Öfflinger-Konto.",
};

export default function PasswortZuruecksetzenPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">Wird geladen…</div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
