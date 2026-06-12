import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Kontakt – Öfflinger",
  description:
    "Kontaktieren Sie Öfflinger: per Formular, E-Mail oder Telefon. Wir helfen bei Fragen zu Produkten, Bestellungen und Versand gerne weiter.",
};

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="text-3xl font-bold text-gray-900">Kontakt</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Sie haben Fragen zu unseren Produkten, Ihrer Bestellung oder dem Versand? Schreiben Sie
          uns – wir melden uns in der Regel innerhalb von 1–2 Werktagen.
        </p>
      </AnimateOnScroll>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[2fr_3fr]">
        <AnimateOnScroll variant="fade-up">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900">So erreichen Sie uns</h2>
            <dl className="mt-6 space-y-5 text-gray-600">
              <div>
                <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                <dd className="mt-1">
                  Öfflinger
                  <br />
                  Musterstraße 1
                  <br />
                  12345 Oberöfflingen, Deutschland
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">E-Mail</dt>
                <dd className="mt-1">
                  <a href="mailto:info@example.com" className="text-primary hover:underline">
                    info@example.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Telefon</dt>
                <dd className="mt-1">
                  <a href="tel:+491234567890" className="text-primary hover:underline">
                    +49 1234 567890
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
              Fragen zu Versandkosten und Zahlungsarten beantwortet unsere Seite{" "}
              <Link href="/versand" className="text-primary hover:underline">
                Versand &amp; Zahlung
              </Link>
              .
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={100}>
          <ContactForm />
        </AnimateOnScroll>
      </div>
    </div>
  );
}
