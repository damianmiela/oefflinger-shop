import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/woo/api";
import { ProductCard } from "@/components/ProductCard";
import { AnimateChildren } from "@/components/AnimateChildren";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { HeroParallax } from "@/components/HeroParallax";
import type { Product } from "@/types";

/** Force dynamic render so products are fetched at request time (not build time) */
export const dynamic = "force-dynamic";

const SECTION_CLASS = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

/* Unsplash images – replace with your own for production */
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1714287803455-27fa2ccbaa16?w=1200&q=80",
  waterPurity:
    "https://images.unsplash.com/photo-1742279153774-af5df0a758d2?w=800&q=80",
};

export default async function HomePage() {
  let products: Product[] = [];
  let loadFailed = false;
  try {
    products = await getProducts();
  } catch {
    loadFailed = true;
  }

  return (
    <>
      <HeroParallax imageUrl={IMAGES.hero}>
        <div className={SECTION_CLASS}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/90">
              Kolloidale Metalle aus Oberöfflingen
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Öfflinger
              <br />
              <span className="text-white/95">Kolloide aus eigener Produktion</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
              Kolloidales Eisen, Gold, Silber, Zink und weitere Spurenelemente — hergestellt in
              Oberöfflingen, Rheinland-Pfalz.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/produkte"
                className="w-full rounded-lg bg-white px-8 py-4 text-center font-semibold text-primary-dark transition hover:bg-gray-100 sm:w-auto"
              >
                Produkte entdecken
              </Link>
              <Link
                href="/shop"
                className="w-full rounded-lg border border-white/50 bg-white/10 px-8 py-4 text-center font-medium text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
              >
                Zum Shop
              </Link>
            </div>
          </div>
        </div>
      </HeroParallax>

      {/* What is colloidal water – with image */}
      <AnimateOnScroll variant="fade-up">
      <section
        id="was-ist-kolloidales-wasser"
        className="border-t border-gray-100 bg-white py-20 sm:py-28"
      >
        <div className={SECTION_CLASS}>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={IMAGES.waterPurity}
                alt="Wassertropfen auf metallischer Oberfläche – Kolloidale Metalle"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
                Was sind kolloidale Metalle?
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-600">
                <p>
                  <strong className="text-gray-800">Kolloidale Metalle</strong> sind winzig kleine
                  Partikel (Nanometer bis Mikrometer) eines Metalls, die gleichmäßig in Wasser
                  verteilt sind. Die Teilchen sind zu klein, um mit bloßem Auge sichtbar zu sein,
                  und schweben stabil in der Flüssigkeit — sie sinken nicht zu Boden.
                </p>
                <p>
                  Bekannte Beispiele für Kolloidsysteme sind Milch, Blut und Tinte. Bei kolloidalem
                  Eisen, Gold, Silber oder Zink handelt es sich um Metallpartikel in dieser
                  feinverteilten Form.
                </p>
                <p>
                  Öfflinger stellt kolloidale Metalle in eigener Produktion in Oberöfflingen
                  (Eifel, Rheinland-Pfalz) her. Wir bieten Eisen, Gold, Silber, Zink, Kupfer,
                  Magnesium, Chrom, Kobalt und weitere Spurenelemente in kolloidaler Form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* Applications of colloidal water */}
      <AnimateOnScroll variant="fade-up">
      <section className="border-t border-gray-100 bg-surface-alt py-20 sm:py-28">
        <div className={SECTION_CLASS}>
          <h2 className="text-center text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
            Unsere Metalle und ihre Anwendungsbereiche
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Wir führen 14 kolloidale Metalle — von Eisen und Zink über Gold und Silber bis zu
            Chrom, Kupfer und Magnesium. Jedes Metall wird mit möglichen Einsatzbereichen beschrieben.
          </p>
          <AnimateChildren className="mx-auto mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger={80}>
            <div className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Energie & Stoffwechsel</h3>
                <p className="mt-1 text-gray-600">
                  Eisen, Chrom, Vanadium, Magnesium und andere Metalle werden mit der Unterstützung
                  von Energiestoffwechsel und Blutzuckerregulation in Verbindung gebracht.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Immunsystem & Haut</h3>
                <p className="mt-1 text-gray-600">
                  Zink, Silber, Kupfer und Silizium werden mit der Unterstützung von Immunsystem,
                  Hautgesundheit und antioxidativem Schutz in Verbindung gebracht.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gehirn & Wohlbefinden</h3>
                <p className="mt-1 text-gray-600">
                  Gold, Kobalt, Magnesium und Zink werden mit Konzentration, Stimmung und
                  geistiger Klarheit in Verbindung gebracht.
                </p>
              </div>
            </div>
          </AnimateChildren>
        </div>
      </section>
      </AnimateOnScroll>

      {/* From Rheinland-Pfalz – local feel with image */}
      <AnimateOnScroll variant="fade-up">
      <section className="border-t border-gray-100 bg-white py-20 sm:py-28">
        <div className={SECTION_CLASS}>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Standort
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
                Produktion in Oberöfflingen
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                Öfflinger hat seinen Sitz in Oberöfflingen in der Eifel, Rheinland-Pfalz. Hier
                produzieren wir unsere kolloidalen Metalle in eigener Herstellung.
              </p>
              <address className="mt-6 not-italic">
                <div className="flex items-start gap-3 text-gray-600">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <div className="space-y-0.5">
                    <div>Musterstraße 1</div>
                    <div>12345 Oberöfflingen</div>
                    <div>Deutschland</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 text-gray-600">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <a href="mailto:info@example.com" className="hover:text-primary">
                    info@example.com
                  </a>
                </div>
                <div className="mt-3 flex items-center gap-3 text-gray-600">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <a href="tel:+491234567890" className="hover:text-primary">
                    0049 123456789
                  </a>
                </div>
                <div className="mt-4 flex items-center gap-3 text-gray-600">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </span>
                  <span>Lieferung innerhalb Deutschlands</span>
                </div>
              </address>
            </div>
            <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
              <iframe
                title="Öfflinger Standort Oberöfflingen"
                src="https://www.openstreetmap.org/export/embed.html?bbox=5.99%2C49.99%2C6.01%2C50.01&layer=mapnik&marker=50.0000000%2C6.0000000"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://www.openstreetmap.org/?mlat=50.0000000&mlon=6.0000000#map=16/50.0000000/6.0000000"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 rounded bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-white"
              >
                Größere Karte anzeigen
              </a>
            </div>
          </div>
        </div>
      </section>
      </AnimateOnScroll>

      {/* Why Öfflinger */}
      <AnimateOnScroll variant="fade-up">
      <section className="border-t border-gray-100 bg-surface-alt py-20 sm:py-28">
        <div className={SECTION_CLASS}>
          <h2 className="text-center text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
            Warum Öfflinger?
          </h2>
          <AnimateChildren className="mx-auto mt-16 grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-3" stagger={80}>
            <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.172-.434a2 2 0 00-1.59.26l-.84.533a2 2 0 01-1.59.26l-.845-.534a2 2 0 00-1.59-.26l-2.166.434a2 2 0 00-1.022.547l-.79.79a2 2 0 010 2.828l.737.737a2 2 0 01.547 1.022l.434 2.172a2 2 0 00.26 1.59l.533.84a2 2 0 01.26 1.59l-.534.845a2 2 0 00-.26 1.59l.434 2.166a2 2 0 00.547 1.022l.79.79a2 2 0 002.828 0l.737-.737a2 2 0 011.022-.547l2.172-.434a2 2 0 001.59-.26l.84-.533a2 2 0 011.59-.26l.845.534a2 2 0 001.59.26l2.166-.434a2 2 0 001.022-.547l.79-.79a2 2 0 000-2.828l-.737-.737a2 2 0 01-.547-1.022l-.434-2.172a2 2 0 00-.26-1.59l-.533-.84a2 2 0 01-.26-1.59l.534-.845a2 2 0 00.26-1.59l-.434-2.166a2 2 0 00-.547-1.022l-.79-.79z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Eigene Produktion</h3>
              <p className="mt-2 text-gray-600">
                Kolloidale Metalle werden in Oberöfflingen hergestellt — Kontrolle über jeden
                Produktionsschritt.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">14 Metalle</h3>
              <p className="mt-2 text-gray-600">
                Eisen, Gold, Silber, Zink, Kupfer, Magnesium, Chrom, Kobalt, Nickel, Silizium,
                Vanadium, Molybdän, Tantal und Zinn.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Aus der Eifel</h3>
              <p className="mt-2 text-gray-600">
                Oberöfflingen in der Vulkaneifel, Rheinland-Pfalz — regionale Produktion,
                Lieferung in ganz Deutschland.
              </p>
            </div>
          </AnimateChildren>
        </div>
      </section>
      </AnimateOnScroll>

      {/* Featured products */}
      {products.length > 0 && (
        <AnimateOnScroll variant="fade-up">
        <section className="border-t border-gray-100 bg-white py-20 sm:py-28">
          <div className={SECTION_CLASS}>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <h2 className="text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
                Unsere Produkte
              </h2>
              <Link
                href="/shop"
                className="text-sm font-medium text-primary transition hover:text-primary-light"
              >
                Alle Produkte anzeigen →
              </Link>
            </div>
            <AnimateChildren
              className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              stagger={80}
            >
              {[...products].sort(() => Math.random() - 0.5).slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimateChildren>
          </div>
        </section>
        </AnimateOnScroll>
      )}

      {products.length === 0 && (
        <AnimateOnScroll variant="fade-up">
        <section className="border-t border-gray-100 bg-surface-alt py-20">
          <div className={SECTION_CLASS}>
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <p className="text-lg font-semibold text-gray-900">
                {loadFailed
                  ? "Unsere Produkte konnten gerade nicht geladen werden."
                  : "Unser Sortiment wird gerade aktualisiert."}
              </p>
              <p className="mx-auto mt-2 max-w-md text-gray-500">
                {loadFailed
                  ? "Bitte versuchen Sie es in wenigen Minuten erneut."
                  : "Schauen Sie bald wieder vorbei."}
              </p>
              {loadFailed ? (
                <Link
                  href="/"
                  className="bg-primary hover:bg-primary-light mt-6 inline-block rounded-lg px-6 py-3 font-semibold text-white transition"
                >
                  Erneut laden
                </Link>
              ) : (
                <Link
                  href="/shop"
                  className="mt-6 inline-block rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-50"
                >
                  Zum Shop
                </Link>
              )}
            </div>
          </div>
        </section>
        </AnimateOnScroll>
      )}
    </>
  );
}
