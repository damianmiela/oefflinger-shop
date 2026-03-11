import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const metadata = {
  title: "Impressum – Öfflinger",
  description: "Impressum und Angaben gemäß § 5 TMG.",
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Impressum</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
          <p className="text-sm text-gray-500">
            Angaben gemäß § 5 Telemediengesetz (TMG)
          </p>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Anbieter</h2>
            <p className="mt-2">
              Öfflinger
              <br />
              Musterstraße 1
              <br />
              12345 Oberöfflingen
              <br />
              Rheinland-Pfalz
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Kontakt</h2>
            <p className="mt-2">
              Telefon: 0049 123456789
              <br />
              E-Mail:{" "}
              <a
                href="mailto:info@example.com"
                className="text-primary hover:text-primary-light"
              >
                info@example.com
              </a>
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
