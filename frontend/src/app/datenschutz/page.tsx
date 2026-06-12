import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const metadata = {
  title: "Datenschutz – Öfflinger",
  description: "Datenschutzerklärung und Informationen zur Verarbeitung Ihrer Daten.",
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Datenschutzerklärung</h1>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Verantwortlicher</h2>
            <p className="mt-2">
              Öfflinger
              <br />
              Musterstraße 1
              <br />
              12345 Oberöfflingen
              <br />
              Rheinland-Pfalz, Deutschland
              <br />
              E-Mail:{" "}
              <a href="mailto:info@example.com" className="text-primary hover:text-primary-light">
                info@example.com
              </a>
              <br />
              Telefon: 0049 123456789
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Erhebung und Speicherung personenbezogener Daten</h2>
            <p className="mt-2">
              Beim Aufruf unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden
              Browser automatisch Informationen an den Server unserer Website gesendet. Diese
              Informationen werden temporär in einem sogenannten Logfile gespeichert. Erfasst werden
              u. a. IP-Adresse, Datum und Uhrzeit des Zugriffs, Name und URL der abgerufenen Datei,
              übertragene Datenmenge sowie der verwendete Browser.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Zweck der Verarbeitung</h2>
            <p className="mt-2">
              Die Verarbeitung erfolgt zur Gewährleistung eines reibungslosen Verbindungsaufbaus,
              zur Auswertung der Systemsicherheit und -stabilität sowie zu administrativen Zwecken.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Rechtsgrundlage</h2>
            <p className="mt-2">
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser
              berechtigtes Interesse folgt aus den oben genannten Zwecken.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Speicherdauer</h2>
            <p className="mt-2">
              Die Daten werden gelöscht, sobald sie für die Erreichung des Erhebungszwecks nicht
              mehr erforderlich sind.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Ihre Rechte</h2>
            <p className="mt-2">
              Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO),
              Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO),
              Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch (Art. 21 DSGVO). Sie haben
              zudem das Recht, sich bei einer Aufsichtsbehörde zu beschweren (Art. 77 DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Shop und WooCommerce</h2>
            <p className="mt-2">
              Bei Bestellungen über unseren Shop werden die für die Vertragsabwicklung erforderlichen
              Daten (Name, Adresse, E-Mail, Zahlungsdaten) verarbeitet. Die Verarbeitung erfolgt auf
              Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Die Daten werden nach
              Ablauf der gesetzlichen Aufbewahrungsfristen gelöscht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Cookies</h2>
            <p className="mt-2">
              Wir setzen technisch notwendige Cookies ein, die für den Betrieb der Website und des
              Shops erforderlich sind (z. B. Warenkorb). Diese Cookies werden nach Ende Ihrer
              Browser-Sitzung gelöscht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. Kontaktformular</h2>
            <p className="mt-2">
              Wenn Sie uns über das Kontaktformular eine Anfrage senden, verarbeiten wir die von
              Ihnen angegebenen Daten (Name, E-Mail-Adresse, Inhalt der Nachricht) ausschließlich
              zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO,
              soweit Ihre Anfrage mit einem Vertrag zusammenhängt, im Übrigen unser berechtigtes
              Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO). Die Daten
              werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich sind und
              keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              10. Schutz vor Missbrauch (Cloudflare Turnstile)
            </h2>
            <p className="mt-2">
              Zum Schutz unserer Formulare (Registrierung, Kontakt) vor automatisiertem Missbrauch
              setzen wir Cloudflare Turnstile ein, einen Dienst der Cloudflare, Inc. Dabei kann
              Ihre IP-Adresse an Cloudflare übermittelt werden. Rechtsgrundlage ist unser
              berechtigtes Interesse an der Sicherheit unserer Systeme (Art. 6 Abs. 1 lit. f
              DSGVO).
            </p>
          </section>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
