import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { HealthDisclaimer } from "@/components/HealthDisclaimer";
import { JsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Häufige Fragen (FAQ)",
  description:
    "Antworten auf häufige Fragen zu kolloidalen Metallen von Öfflinger: Lagerung, ppm, Glasflaschen, Versand, Zahlung und Widerruf.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    url: "/faq",
    title: "Häufige Fragen (FAQ)",
    description:
      "Antworten auf häufige Fragen zu kolloidalen Metallen von Öfflinger: Lagerung, ppm, Glasflaschen, Versand, Zahlung und Widerruf.",
  },
};

interface Faq {
  q: string;
  a: string;
  link?: { href: string; label: string };
}

/**
 * FAQ content (P2-15b → §4.1). Strictly health-claim-free (HCVO / P0-3).
 * Legal-adjacent answers (Widerruf) and storage/shelf-life wording are owner-/
 * lawyer-reviewable per D6 — confirm before launch.
 */
const FAQS: Faq[] = [
  {
    q: "Was sind kolloidale Metalle?",
    a: "Kolloidale Metalle sind feinste Metallpartikel (im Nanometer- bis Mikrometerbereich), die gleichmäßig und stabil in Wasser verteilt sind. Sie sind so klein, dass sie mit bloßem Auge nicht sichtbar sind und nicht zu Boden sinken. Öfflinger stellt sie in eigener Produktion in Oberöfflingen (Eifel, Rheinland-Pfalz) her.",
    link: { href: "/produkte", label: "Mehr über unsere 14 Metalle" },
  },
  {
    q: "Was bedeutet die Angabe ppm?",
    a: "ppm steht für parts per million (Teile pro Million) und beschreibt die Konzentration der Metallpartikel im Wasser. 10 ppm entsprechen rund 10 Milligramm Metall pro Liter. Die jeweilige Konzentration finden Sie in der Produktbeschreibung und auf dem Etikett.",
  },
  {
    q: "Warum füllen Sie in Glasflaschen ab?",
    a: "Glas ist geschmacksneutral, reagiert nicht mit dem Inhalt und gibt keine Stoffe an die Flüssigkeit ab. Deshalb füllen wir unsere kolloidalen Metalle in Glasflaschen ab.",
  },
  {
    q: "Wie sollte ich die Produkte lagern?",
    a: "Bewahren Sie die Flaschen kühl, trocken und vor direkter Sonneneinstrahlung geschützt auf und halten Sie sie original verschlossen. Das Mindesthaltbarkeitsdatum finden Sie auf dem Etikett.",
  },
  {
    q: "Wie lange dauert die Lieferung?",
    a: "Wir versenden mit DHL innerhalb Deutschlands. Die Lieferzeit beträgt in der Regel 2–5 Werktage nach Zahlungseingang. Der Versand kostet 4,90 € pro Bestellung – ab 100 € Bestellwert liefern wir versandkostenfrei.",
    link: { href: "/versand", label: "Versand & Zahlung" },
  },
  {
    q: "Welche Zahlungsarten bieten Sie an?",
    a: "Sie können per PayPal, Klarna (Rechnung/Sofortüberweisung), Kredit- bzw. Debitkarte (Visa/Mastercard) oder per Vorkasse/Überweisung bezahlen. Die Zahlungsart wählen Sie im Bestellvorgang.",
    link: { href: "/versand", label: "Zahlungsarten im Detail" },
  },
  {
    q: "Kann ich meine Bestellung widerrufen oder zurückgeben?",
    a: "Als Verbraucher haben Sie ein 14-tägiges Widerrufsrecht. Bei versiegelten Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, kann das Widerrufsrecht erlöschen, sobald die Versiegelung entfernt wurde. Die Einzelheiten und das Muster-Widerrufsformular finden Sie auf unserer Widerrufsseite.",
    link: { href: "/widerruf", label: "Widerrufsrecht" },
  },
  {
    q: "Liefern Sie auch ins Ausland?",
    a: "Derzeit liefern wir ausschließlich innerhalb Deutschlands.",
  },
  {
    q: "Wie erreiche ich den Kundenservice?",
    a: "Sie erreichen uns per E-Mail unter info@example.com und telefonisch unter +49 1234 567890. Gern können Sie auch unser Kontaktformular nutzen.",
    link: { href: "/kontakt", label: "Zum Kontaktformular" },
  },
];

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={faqLd} />
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Häufige Fragen</h1>
        <p className="mb-8 text-gray-600">
          Antworten auf die häufigsten Fragen rund um unsere kolloidalen Metalle, Versand und
          Bestellung. Ihre Frage ist nicht dabei?{" "}
          <Link href="/kontakt" className="text-primary hover:underline">
            Schreiben Sie uns
          </Link>
          .
        </p>

        <div className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                <span>{faq.q}</span>
                <svg
                  className="h-5 w-5 shrink-0 text-gray-400 transition group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-gray-600">
                <p>{faq.a}</p>
                {faq.link && (
                  <Link
                    href={faq.link.href}
                    className="text-primary mt-3 inline-block text-sm font-medium hover:underline"
                  >
                    {faq.link.label} →
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>

        <HealthDisclaimer className="mt-10" />
      </AnimateOnScroll>
    </div>
  );
}
