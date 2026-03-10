import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/woo/api";
import { ProductCard } from "@/components/ProductCard";
import { AnimateChildren } from "@/components/AnimateChildren";
import type { Product } from "@/types";

const SECTION_CLASS = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

/* Unsplash images – replace with your own for production */
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
  waterPurity:
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80",
  rheinland:
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
};

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    // WooCommerce may not be ready yet
  }

  return (
    <>
      {/* Hero with background image */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.hero}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-primary-dark/70" />
        </div>
        <div className="relative">
          <div className={SECTION_CLASS}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/90">
                Kolloidales Wasser aus Rheinland-Pfalz
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Natürliche Reinheit.
                <br />
                <span className="text-white/95">Wissenschaftliche Präzision.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
                Hochwertige Kolloide aus eigener Produktion in Rheinland-Pfalz — für Ihre
                Gesundheit und Ihr Wohlbefinden.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/shop"
                  className="w-full rounded-lg bg-white px-8 py-4 text-center font-semibold text-primary-dark transition hover:bg-gray-100 sm:w-auto"
                >
                  Produkte entdecken
                </Link>
                <Link
                  href="#was-ist-kolloidales-wasser"
                  className="w-full rounded-lg border border-white/50 bg-white/10 px-8 py-4 text-center font-medium text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
                >
                  Mehr erfahren
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is colloidal water – with image */}
      <section
        id="was-ist-kolloidales-wasser"
        className="border-t border-gray-100 bg-white py-20 sm:py-28"
      >
        <div className={SECTION_CLASS}>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={IMAGES.waterPurity}
                alt="Klares Wasser – Symbol für Reinheit"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
                Was ist kolloidales Wasser?
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-600">
                <p>
                  <strong className="text-gray-800">Kolloidales Wasser</strong> beschreibt einen
                  physikalischen Zustand, in dem winzigste Partikel — zwischen 1 und mehreren
                  hundert Nanometern groß — gleichmäßig im Wasser verteilt sind. Diese Partikel sind
                  zu klein, um mit bloßem Auge sichtbar zu sein, und zu groß, um sich wie
                  vollständig gelöste Moleküle zu verhalten.
                </p>
                <p>
                  Kolloide liegen damit zwischen echten Lösungen (z. B. Zucker im Wasser) und
                  groben Suspensionen (z. B. Sand im Wasser). Die Teilchen schweben stabil im
                  Wasser und sinken nicht zu Boden. Bekannte Beispiele für Kolloidsysteme sind
                  Milch, Blut, Nebel und Tinte.
                </p>
                <p>
                  Bei Öfflinger produzieren wir hochwertige kolloidale Zubereitungen in eigener
                  Herstellung in Rheinland-Pfalz — mit Sorgfalt, Transparenz und dem Anspruch,
                  Ihnen ein reines, zuverlässiges Produkt für Ihren Alltag zu bieten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications of colloidal water */}
      <section className="border-t border-gray-100 bg-surface-alt py-20 sm:py-28">
        <div className={SECTION_CLASS}>
          <h2 className="text-center text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
            Vielfältige Anwendungsmöglichkeiten
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Kolloidales Wasser wird traditionell in verschiedenen Bereichen eingesetzt.
          </p>
          <div className="mx-auto mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gesundheit & Wohlbefinden</h3>
                <p className="mt-1 text-gray-600">
                  Traditionell zur Unterstützung des allgemeinen Wohlbefindens und der täglichen
                  Balance.
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
                <h3 className="font-semibold text-gray-900">Hautpflege</h3>
                <p className="mt-1 text-gray-600">
                  Äußerliche Anwendung bei Hautpflege, Mundhygiene und zur Unterstützung der
                  Hautregeneration.
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
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M12 12a2 2 0 104 0 2 2 0 00-4 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pflanzen & Haushalt</h3>
                <p className="mt-1 text-gray-600">
                  Natürliche Anwendung in der Pflanzenpflege und für den Haushalt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* From Rheinland-Pfalz – local feel with image */}
      <section className="border-t border-gray-100 bg-white py-20 sm:py-28">
        <div className={SECTION_CLASS}>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Aus der Region
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
                Verwurzelt in Rheinland-Pfalz
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                Öfflinger ist in Rheinland-Pfalz zu Hause — einer Region mit reicher Natur,
                klarem Wasser und einer langen Tradition des Handwerks. Hier produzieren wir
                unsere Kolloide mit kurzen Wegen, regionaler Verantwortung und dem Wissen, dass
                Qualität vor der Haustür beginnt.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                Von der Pfalz über die Eifel bis zum Rhein — wir sind stolz darauf, Teil dieser
                Region zu sein und unseren Kunden ein Produkt aus der Heimat zu bieten.
              </p>
            </div>
            <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
              <Image
                src={IMAGES.rheinland}
                alt="Landschaft Rheinland-Pfalz"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Öfflinger */}
      <section className="border-t border-gray-100 bg-surface-alt py-20 sm:py-28">
        <div className={SECTION_CLASS}>
          <h2 className="text-center text-3xl font-bold tracking-tight text-primary-dark sm:text-4xl">
            Warum Öfflinger?
          </h2>
          <div className="mx-auto mt-16 grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
                Kolloide aus eigener Herstellung in Rheinland-Pfalz — Kontrolle über jeden
                Schritt.
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
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Qualität</h3>
              <p className="mt-2 text-gray-600">
                Höchste Ansprüche an Reinheit und Zuverlässigkeit.
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
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Regional</h3>
              <p className="mt-2 text-gray-600">
                Produktion in Rheinland-Pfalz — kurze Wege, regionale Wurzeln.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      {products.length > 0 && (
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
              className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              stagger={80}
            >
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimateChildren>
          </div>
        </section>
      )}

      {products.length === 0 && (
        <section className="border-t border-gray-100 bg-surface-alt py-20">
          <div className={SECTION_CLASS}>
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <p className="text-gray-500">
                Produkte werden geladen. Bitte stellen Sie sicher, dass WooCommerce aktiv ist.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-block rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-50"
              >
                Zum Shop
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-gray-100 bg-primary-dark py-20 sm:py-24">
        <div className={SECTION_CLASS}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Bereit für natürliche Qualität aus Rheinland-Pfalz?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Entdecken Sie unsere Kolloide und finden Sie das passende Produkt für Sie.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-block rounded-lg bg-white px-8 py-4 font-semibold text-primary-dark transition hover:bg-gray-100"
            >
              Jetzt einkaufen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
