import Link from "next/link";
import { getProducts } from "@/lib/woo/api";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  let products = [];
  try {
    products = await getProducts();
  } catch {
    // WooCommerce may not be ready yet
  }

  return (
    <>
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary-dark sm:text-5xl">
          Willkommen bei Öfflinger
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Ihr Tor zu einem gesunden und bewussten Lebensstil. Hochwertige Kolloide aus eigener
          Produktion.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition hover:bg-primary-light"
        >
          Zum Shop
        </Link>
      </section>

      {products.length > 0 && (
        <section className="py-12">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">Unsere Bestseller</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {products.length === 0 && (
        <section className="py-12 text-center text-gray-500">
          <p>Produkte werden geladen… Bitte stellen Sie sicher, dass WooCommerce aktiv ist.</p>
        </section>
      )}
    </>
  );
}
