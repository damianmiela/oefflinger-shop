import { getProducts } from "@/lib/woo/api";
import { ProductCard } from "@/components/ProductCard";
import { AnimateChildren } from "@/components/AnimateChildren";
import type { Product } from "@/types";

export const metadata = {
  title: "Shop – Öfflinger",
  description: "Entdecken Sie unsere hochwertigen Kolloide.",
};

export default async function ShopPage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    // WooCommerce may not be ready yet
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Alle Produkte</h1>

      {products.length > 0 ? (
        <AnimateChildren
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={60}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimateChildren>
      ) : (
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
      )}
    </>
  );
}
