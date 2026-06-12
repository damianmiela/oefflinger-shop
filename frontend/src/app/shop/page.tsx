import Link from "next/link";
import { getProductsPaginated } from "@/lib/woo/api";
import { ProductCard } from "@/components/ProductCard";
import { ShopPagination } from "@/components/ShopPagination";
import { AnimateChildren } from "@/components/AnimateChildren";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { HealthDisclaimer } from "@/components/HealthDisclaimer";
import type { Product } from "@/types";

export const metadata = {
  title: "Shop – Öfflinger",
  description: "Entdecken Sie unsere hochwertigen Kolloide.",
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  let products: Product[] = [];
  let totalPages = 1;
  let loadFailed = false;
  try {
    const result = await getProductsPaginated(currentPage, 20);
    products = result.products;
    totalPages = result.totalPages;
  } catch {
    loadFailed = true;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Alle Produkte</h1>
      </AnimateOnScroll>

      <AnimateOnScroll variant="fade-up">
        <div className="border-primary/20 bg-primary/5 mb-10 flex flex-col gap-4 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700 sm:text-base">
            <span className="text-primary font-medium">Was sind kolloidale Metalle?</span> Erfahren
            Sie mehr über Eisen, Gold, Silber, Zink und unsere weiteren Spurenelemente —
            Herstellung, Eigenschaften und mögliche Einsatzbereiche.
          </p>
          <Link
            href="/produkte"
            className="bg-primary hover:bg-primary-light shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white transition"
          >
            Mehr erfahren →
          </Link>
        </div>
      </AnimateOnScroll>

      {products.length > 0 ? (
        <>
          <AnimateChildren
            className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            stagger={60}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimateChildren>
          <ShopPagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <AnimateOnScroll variant="fade-up">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {loadFailed
                ? "Unsere Produkte konnten gerade nicht geladen werden."
                : "Im Moment sind keine Produkte verfügbar."}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">
              {loadFailed
                ? "Bitte versuchen Sie es in wenigen Minuten erneut."
                : "Unser Sortiment wird gerade aktualisiert – schauen Sie bald wieder vorbei."}
            </p>
            {loadFailed && (
              <a
                href="/shop"
                className="bg-primary hover:bg-primary-light mt-6 inline-block rounded-lg px-6 py-3 font-semibold text-white transition"
              >
                Erneut versuchen
              </a>
            )}
          </div>
        </AnimateOnScroll>
      )}

      <AnimateOnScroll variant="fade-up">
        <HealthDisclaimer className="mt-12" />
      </AnimateOnScroll>
    </div>
  );
}
