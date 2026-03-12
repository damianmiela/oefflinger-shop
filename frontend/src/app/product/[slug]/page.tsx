import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/woo/api";
import { AddToCartButton } from "./AddToCartButton";
import { StockStatus } from "./StockStatus";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductCard } from "@/components/ProductCard";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { AnimateChildren } from "@/components/AnimateChildren";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

function shuffleAndTake<T>(arr: T[], excludeId: number, count: number): T[] {
  const filtered = arr.filter((p) => (p as Product).id !== excludeId);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produkt nicht gefunden" };
  return {
    title: `${product.name} – Öfflinger`,
    description: product.short_description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ]);

  if (!product) notFound();

  const priceDisplay =
    Number(product.prices.price) > 0
      ? `${(Number(product.prices.price) / 100).toFixed(2)} ${product.prices.currency_symbol}`
      : "Preis auf Anfrage";

  const otherProducts = shuffleAndTake(allProducts, product.id, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Top: two columns – gallery | details */}
      <div className="grid gap-12 lg:grid-cols-2">
        <AnimateOnScroll variant="fade-up">
        <div className="w-full lg:max-w-[50%]">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            priority
          />
        </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up">
        <div className="flex w-full flex-col justify-center">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-2 text-2xl font-semibold text-primary">{priceDisplay}</p>

        {product.short_description && (
          <div
            className="product-html-content mt-6 max-w-none text-gray-600 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
        )}

        {product.attributes && product.attributes.length > 0 && (
          <dl className="mt-4 space-y-2">
            {product.attributes.map((attr) => {
              const rawLabel = attr.name || attr.attribute?.replace(/^pa_/, "").replace(/-/g, " ") || "";
              const label = rawLabel ? rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1) : "Attribut";
              const value = attr.options?.join(", ") || attr.value || "";
              if (!value) return null;
              return (
                <div key={attr.id ?? attr.attribute ?? label}>
                  <dt className="text-sm font-medium text-gray-500">{label}</dt>
                  <dd className="mt-0.5 text-gray-900">{value}</dd>
                </div>
              );
            })}
          </dl>
        )}

        {product.is_purchasable && (product.is_in_stock || product.is_on_backorder) && (
          <>
            <StockStatus product={product} />
            <AddToCartButton product={product} />
          </>
        )}

        {!product.is_in_stock && !product.is_on_backorder && (
          <p className="mt-6 text-sm text-red-600">Derzeit nicht auf Lager.</p>
        )}
        </div>
        </AnimateOnScroll>
      </div>

      {/* Full-width description */}
      {product.description && (
        <AnimateOnScroll variant="fade-up">
        <div
          className="product-html-content mt-12 max-w-none text-gray-600 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
        </AnimateOnScroll>
      )}

      {/* Andere Produkte */}
      {otherProducts.length > 0 && (
        <AnimateOnScroll variant="fade-up">
        <section className="mt-20 border-t border-gray-200 pt-16">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Andere Produkte</h2>
          <AnimateChildren
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            stagger={60}
          >
            {otherProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </AnimateChildren>
          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="text-sm font-medium text-primary transition hover:text-primary-light"
            >
              Alle Produkte anzeigen →
            </Link>
          </div>
        </section>
        </AnimateOnScroll>
      )}
    </div>
  );
}
