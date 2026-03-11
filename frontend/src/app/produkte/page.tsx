import Link from "next/link";
import { COLLOIDAL_METALS } from "@/data/colloidal-metals";
import { MetalCarousel } from "@/components/MetalCarousel";

export const metadata = {
  title: "Unsere Kolloide – Öfflinger",
  description:
    "Übersicht aller kolloidalen Metalle: Chrom, Eisen, Gold, Kobalt, Kupfer, Magnesium, Molybdän, Nickel, Silber, Silizium, Tantal, Vanadium, Zink und Zinn.",
};

export default function ProduktePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <Link
          href="/"
          className="text-sm font-medium text-primary transition hover:text-primary-light"
        >
          ← Zurück zur Startseite
        </Link>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary-dark sm:text-5xl">
          Unsere Kolloide
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          Entdecken Sie unsere kolloidalen Metalle. Jedes Metall hat seine eigene Charakteristik und
          wird traditionell in der Naturheilkunde geschätzt. Wählen Sie ein Metall aus, um mehr zu
          erfahren.
        </p>
      </div>

      <MetalCarousel metals={COLLOIDAL_METALS} />

      <div className="mt-16 rounded-2xl border border-gray-200 bg-surface-alt p-8">
        <h2 className="text-xl font-bold text-gray-900">Produkte im Shop</h2>
        <p className="mt-2 text-gray-600">
          Die genannten Kolloide sind in unserem Shop erhältlich. Schauen Sie vorbei und finden Sie
          das passende Produkt für sich.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-light"
        >
          Zum Shop
        </Link>
      </div>
    </div>
  );
}
