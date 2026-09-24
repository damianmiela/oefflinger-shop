import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen für den Einkauf bei Öfflinger.",
  alternates: { canonical: "/agb" },
};

export default function AGBPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Allgemeine Geschäftsbedingungen</h1>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">§ 1 Geltungsbereich</h2>
            <p className="mt-2">
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge, die über den
              Online-Shop von Öfflinger geschlossen werden.
              Abweichende Bedingungen des Kunden werden nicht anerkannt, sofern wir nicht
              ausdrücklich ihrer Geltung schriftlich zugestimmt haben.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">§ 2 Vertragspartner</h2>
            <p className="mt-2">
              Der Kaufvertrag kommt zustande mit Öfflinger, Oberöfflingen, Rheinland-Pfalz,
              Deutschland. Kontakt: über unser Kontaktformular.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">§ 3 Vertragsschluss</h2>
            <p className="mt-2">
              Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot,
              sondern eine unverbindliche Aufforderung zur Bestellung dar. Durch Absenden der
              Bestellung gibt der Kunde ein verbindliches Angebot ab. Die Bestätigung des
              Bestelleingangs stellt noch keine Annahme des Angebots dar. Der Vertrag kommt zustande,
              wenn wir die Lieferung der bestellten Ware versenden oder die Annahme ausdrücklich
              bestätigen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">§ 4 Preise und Versandkosten</h2>
            <p className="mt-2">
              Die angegebenen Preise verstehen sich als Endpreise inklusive der gesetzlichen
              Mehrwertsteuer. Versandkosten werden im Bestellvorgang angezeigt und sind vom Kunden
              zu tragen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">§ 5 Zahlung</h2>
            <p className="mt-2">
              Die Zahlung erfolgt nach den im jeweiligen Bestellvorgang angegebenen Optionen. Die
              Zahlungsabwicklung erfolgt über unser WooCommerce-System (WooCommerce Checkout).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">§ 6 Lieferung</h2>
            <p className="mt-2">
              Die Lieferzeit beträgt in der Regel 2–5 Werktage nach Zahlungseingang. Abweichungen
              bleiben vorbehalten. Wir liefern nur innerhalb Deutschlands. Die genaue Lieferadresse
              ist vom Kunden bei der Bestellung anzugeben.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">§ 7 Widerrufsrecht</h2>
            <p className="mt-2">
              Verbrauchern steht ein Widerrufsrecht gemäß den gesetzlichen Bestimmungen zu. Die
              Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter
              Dritter die Waren in Besitz genommen haben. Zur Wahrung der Widerrufsfrist reicht es
              aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der
              Widerrufsfrist absenden. Der Widerruf ist zu richten an: Öfflinger,
              Oberöfflingen (Kontakt über unser Kontaktformular).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">§ 8 Gewährleistung</h2>
            <p className="mt-2">
              Es gelten die gesetzlichen Gewährleistungsrechte. Bei neuen Waren beträgt die
              Gewährleistungsfrist zwei Jahre.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">§ 9 Schlussbestimmungen</h2>
            <p className="mt-2">
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
              Gerichtsstand für alle Streitigkeiten ist, soweit gesetzlich zulässig, unser
              Geschäftssitz.
            </p>
          </section>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
