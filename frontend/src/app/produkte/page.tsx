import dynamic from "next/dynamic";
import { COLLOIDAL_METALS } from "@/data/colloidal-metals";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const MetalCarousel = dynamic(
  () => import("@/components/MetalCarousel").then((m) => ({ default: m.MetalCarousel })),
  { ssr: true, loading: () => <div className="min-h-[400px] animate-pulse rounded-2xl bg-surface-alt" /> }
);

export const metadata = {
  title: "Unsere Kolloide – Öfflinger",
  description:
    "Übersicht aller kolloidalen Metalle: Chrom, Eisen, Gold, Kobalt, Kupfer, Magnesium, Molybdän, Nickel, Silber, Silizium, Tantal, Vanadium, Zink und Zinn.",
};

export default function ProduktePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Unsere Kolloide</h1>
      </AnimateOnScroll>

      <AnimateOnScroll variant="fade-up">
        <MetalCarousel metals={COLLOIDAL_METALS} />
      </AnimateOnScroll>
    </div>
  );
}
