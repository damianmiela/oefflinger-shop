import { AnimateOnScroll } from "@/components/AnimateOnScroll";

/*
 * RECHTSTEXT-ENTWURF (D6): nicht anwaltlich geprüft – siehe Tracker P0-2f.
 * [PLATZHALTER]-Felder vor Launch mit echten Daten füllen (Inhaber, Rechtsform, USt).
 */

export const metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung gemäß § 5 DDG.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Impressum</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
          <p className="text-sm text-gray-500">Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</p>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Anbieter</h2>
            <p className="mt-2">
              [PLATZHALTER: Vollständiger Name des Inhabers / der Gesellschaft]
              <br />
              [PLATZHALTER: Rechtsform, z. B. Einzelunternehmen]
              <br />
              handelnd unter „Öfflinger“
              <br />
              Musterstraße 1
              <br />
              12345 Oberöfflingen
              <br />
              Rheinland-Pfalz, Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Kontakt</h2>
            <p className="mt-2">
              Telefon: +49 1234 567890
              <br />
              E-Mail:{" "}
              <a href="mailto:info@example.com" className="text-primary hover:text-primary-light">
                info@example.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Umsatzsteuer</h2>
            <p className="mt-2">
              [PLATZHALTER: Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE…
              <br />
              ODER bei Kleinunternehmern: „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“ —
              in diesem Fall müssen auch die Preisangaben im Shop angepasst werden.]
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Verantwortlich für den Inhalt</h2>
            <p className="mt-2">
              Sander Muijsson
              <br />
              Musterstraße 1
              <br />
              12345 Oberöfflingen
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              Verbraucherstreitbeilegung (§ 36 VSBG)
            </h2>
            <p className="mt-2">
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Website</h2>
            <p className="mt-2">
              <a
                href="https://oefflinger.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light"
              >
                https://oefflinger.de
              </a>
            </p>
          </section>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
