import { AnimateOnScroll } from "@/components/AnimateOnScroll";

/* Inhalt vor Launch prüfen: Versandpreis/Träger müssen den WooCommerce-Einstellungen entsprechen. */

export const metadata = {
  title: "Versand & Zahlung",
  description:
    "Versandkosten, Lieferzeiten und Zahlungsarten bei Öfflinger: DHL-Versand innerhalb Deutschlands, Zahlung per PayPal, Klarna, Kreditkarte oder Überweisung.",
  alternates: { canonical: "/versand" },
};

const PAYMENT_METHODS = [
  {
    name: "PayPal",
    description: "Bezahlen Sie schnell und sicher mit Ihrem PayPal-Konto.",
  },
  {
    name: "Klarna",
    description: "Kauf auf Rechnung oder Sofortüberweisung über Klarna.",
  },
  {
    name: "Kredit- / Debitkarte",
    description: "Visa und Mastercard werden akzeptiert.",
  },
  {
    name: "Vorkasse / Überweisung",
    description:
      "Sie überweisen den Betrag vorab; die Bankverbindung erhalten Sie mit der Bestellbestätigung. Versand nach Zahlungseingang.",
  },
];

export default function VersandPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Versand &amp; Zahlung</h1>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">Versand</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
              <dl className="divide-y divide-gray-100">
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="text-sm text-gray-500">Versandkosten</dt>
                  <dd className="font-semibold text-gray-900">4,90 € pro Bestellung</dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="text-sm text-gray-500">Versandkostenfrei</dt>
                  <dd className="font-semibold text-emerald-700">ab 100 € Bestellwert</dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="text-sm text-gray-500">Versanddienstleister</dt>
                  <dd className="font-semibold text-gray-900">DHL</dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="text-sm text-gray-500">Lieferzeit</dt>
                  <dd className="font-semibold text-gray-900">2–5 Werktage nach Zahlungseingang</dd>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="text-sm text-gray-500">Liefergebiet</dt>
                  <dd className="font-semibold text-gray-900">Deutschland</dd>
                </div>
              </dl>
            </div>
            <p className="mt-4">
              Wir versenden aus unserer Produktion in Oberöfflingen (Eifel, Rheinland-Pfalz).
              Sobald Ihre Bestellung unser Haus verlässt, erhalten Sie eine Versandbestätigung per
              E-Mail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Zahlungsarten</h2>
            <div className="mt-4 space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.name}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-4"
                >
                  <p className="font-semibold text-gray-900">{method.name}</p>
                  <p className="mt-1 text-sm text-gray-600">{method.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer, zuzüglich
              Versandkosten. Die Zahlungsart wählen Sie im Bestellvorgang aus.
            </p>
          </section>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
