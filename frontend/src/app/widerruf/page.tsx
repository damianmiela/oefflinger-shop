import { AnimateOnScroll } from "@/components/AnimateOnScroll";

/*
 * RECHTSTEXT-ENTWURF (D6): nicht anwaltlich geprüft.
 * Vor Launch durch Anwalt/Rechtstexte-Dienst prüfen lassen – siehe Tracker P0-2f.
 * Basiert auf dem gesetzlichen Muster (Anlage 1 + 2 zu Art. 246a EGBGB).
 */

export const metadata = {
  title: "Widerrufsbelehrung",
  description:
    "Widerrufsrecht für Verbraucher: 14 Tage Widerrufsfrist, Muster-Widerrufsformular und Hinweise zur Rücksendung.",
  alternates: { canonical: "/widerruf" },
};

export default function WiderrufPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Widerrufsbelehrung</h1>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">Widerrufsrecht</h2>
            <p className="mt-2">
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
              widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein
              von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz
              genommen haben bzw. hat.
            </p>
            <p className="mt-2">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            </p>
            <p className="mt-2">
              Öfflinger
              <br />
              Oberöfflingen, Deutschland
              <br />
              Kontakt: über unser Kontaktformular
            </p>
            <p className="mt-2">
              mittels einer eindeutigen Erklärung (z.&nbsp;B. ein mit der Post versandter Brief
              oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
              Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht
              vorgeschrieben ist.
            </p>
            <p className="mt-2">
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die
              Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Folgen des Widerrufs</h2>
            <p className="mt-2">
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
              erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen
              Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von
              uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und
              spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung
              über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung
              verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion
              eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart;
              in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
            </p>
            <p className="mt-2">
              Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben
              oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je
              nachdem, welches der frühere Zeitpunkt ist.
            </p>
            <p className="mt-2">
              Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen
              ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns
              zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor
              Ablauf der Frist von vierzehn Tagen absenden.
            </p>
            <p className="mt-2">
              <strong className="text-gray-800">
                Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
              </strong>
            </p>
            <p className="mt-2">
              Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser
              Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und
              Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              Ausschluss bzw. vorzeitiges Erlöschen des Widerrufsrechts
            </h2>
            <p className="mt-2">
              Das Widerrufsrecht erlischt vorzeitig bei Verträgen zur Lieferung versiegelter
              Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe
              geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde
              (§&nbsp;312g Abs.&nbsp;2 Nr.&nbsp;3 BGB). Dies betrifft insbesondere geöffnete
              Flaschen unserer kolloidalen Produkte.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Muster-Widerrufsformular</h2>
            <p className="mt-2">
              Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus
              und senden Sie es zurück:
            </p>
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 text-sm leading-relaxed">
              <p>
                An: Öfflinger, Oberöfflingen, Deutschland
              </p>
              <p className="mt-4">
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über
                den Kauf der folgenden Waren (*):
              </p>
              <ul className="mt-4 list-none space-y-2 p-0">
                <li>Bestellt am (*) / erhalten am (*): _______________________</li>
                <li>Name des/der Verbraucher(s): _______________________</li>
                <li>Anschrift des/der Verbraucher(s): _______________________</li>
                <li>
                  Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
                  _______________________
                </li>
                <li>Datum: _______________________</li>
              </ul>
              <p className="mt-4 text-gray-500">(*) Unzutreffendes streichen.</p>
            </div>
          </section>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
