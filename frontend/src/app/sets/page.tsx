import Link from "next/link";
import { getSets } from "@/lib/sets";
import { SetCard } from "@/components/SetCard";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { HealthDisclaimer } from "@/components/HealthDisclaimer";

const DESCRIPTION =
  "Sorgfältig zusammengestellte Sets unserer kolloidalen Metalle – zusammen günstiger als einzeln.";

export const metadata = {
  title: "Sets",
  description: DESCRIPTION,
  alternates: { canonical: "/sets" },
  openGraph: { type: "website", url: "/sets", title: "Sets", description: DESCRIPTION },
};

export default async function SetsPage() {
  const sets = await getSets();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Sets</h1>
      </AnimateOnScroll>
      <AnimateOnScroll variant="fade-up">
        <p className="mb-8 max-w-3xl text-gray-600">{DESCRIPTION}</p>
      </AnimateOnScroll>

      {sets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {sets.map((set) => (
            <SetCard key={set.id} set={set} />
          ))}
        </div>
      ) : (
        <AnimateOnScroll variant="fade-up">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-900">Im Moment sind keine Sets verfügbar.</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">Schauen Sie bald wieder vorbei.</p>
            <Link
              href="/shop"
              className="bg-primary hover:bg-primary-light mt-6 inline-block rounded-lg px-6 py-3 font-semibold text-white transition"
            >
              Zum Shop
            </Link>
          </div>
        </AnimateOnScroll>
      )}

      <AnimateOnScroll variant="fade-up">
        <HealthDisclaimer className="mt-12" />
      </AnimateOnScroll>
    </div>
  );
}
