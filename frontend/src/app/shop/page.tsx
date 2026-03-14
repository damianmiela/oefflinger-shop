import Link from "next/link";
import { getProductsPaginated } from "@/lib/woo/api";
import { ProductCard } from "@/components/ProductCard";
import { ShopPagination } from "@/components/ShopPagination";
import { AnimateChildren } from "@/components/AnimateChildren";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
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
  try {
    const result = await getProductsPaginated(currentPage, 20);
    products = result.products;
    totalPages = result.totalPages;
  } catch {
    // WooCommerce may not be ready yet
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Alle Produkte</h1>
      </AnimateOnScroll>

      <AnimateOnScroll variant="fade-up">
        <div className="mb-10 flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700 sm:text-base">
            <span className="font-medium text-primary">Was sind kolloidale Metalle?</span>{" "}
            Erfahren Sie mehr über Eisen, Gold, Silber, Zink und unsere weiteren Spurenelemente
            — Herstellung, Eigenschaften und mögliche Einsatzbereiche.
          </p>
          <Link
            href="/produkte"
            className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-light"
          >
            Mehr erfahren →
          </Link>
        </div>
      </AnimateOnScroll>

      {products.length > 0 ? (
        <>
          <AnimateChildren
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
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
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">
            Noch keine Produkte vorhanden. Fügen Sie Produkte im WordPress-Admin hinzu.
          </p>
          <a
            href="http://localhost:4001/wp-admin/post-new.php?post_type=product"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-primary underline hover:text-primary-light"
          >
            WordPress Admin &rarr;
          </a>
        </div>
        </AnimateOnScroll>
      )}
    </div>
  );
}
