import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung dieser Portfolio-Demo.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Impressum</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
          <p>
            Diese Website ist eine Portfolio-Demo von DEN Digital und kein aktiver Shop: Es kann
            nichts gekauft werden.
          </p>
          <p>
            Anbieter und verantwortlich für den Inhalt ist DEN Digital. Die Angaben gemäß § 5 DDG
            stehen im{" "}
            <a href="https://dendigital.de/impressum" className="text-primary hover:text-primary-light">
              Impressum von DEN Digital
            </a>
            .
          </p>
          <p>
            Öfflinger ist ein echtes Geschäft in Oberöfflingen (Eifel). Produkttexte und -fotos
            werden mit Genehmigung des Inhabers gezeigt.
          </p>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
