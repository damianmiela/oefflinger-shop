import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/woo/api";
import { AddToCartButton } from "./AddToCartButton";
import { StockStatus } from "./StockStatus";
import { DeliveryEstimate } from "./DeliveryEstimate";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductCrossSell } from "./ProductCrossSell";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
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

  const crossSellProducts = shuffleAndTake(allProducts, product.id, 10);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Top: gallery (30%) | details (60%) | cross-sell (10%). Height from gallery or details only; cross-sell is absolute. */}
      <div className="relative flex gap-8">
        <div className="min-w-0 flex-1 grid gap-8 lg:grid-cols-[30%_1fr]">
          <AnimateOnScroll variant="fade-up">
          <div className="w-full">
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
          <p className="mt-2">
            <PriceDisplay prices={product.prices} size="lg" />
          </p>

          {product.short_description && (
            <div
              className="product-html-content mt-6 max-w-none text-gray-600 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          {product.attributes && product.attributes.length > 0 && (
            <dl className="mt-4 space-y-2">
              {product.attributes.map((attr, i) => {
                const rawLabel = attr.name || attr.attribute?.replace(/^pa_/, "").replace(/-/g, " ") || "";
                const label = rawLabel ? rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1) : "Attribut";
                const value = attr.options?.join(", ") || attr.value || "";
                if (!value) return null;
                return (
                  <div key={attr.attribute ?? attr.name ?? `attr-${i}`}>
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
              <DeliveryEstimate deliveryEstimate={product.delivery_estimate} />
              <AddToCartButton product={product} />
            </>
          )}

          {!product.is_in_stock && !product.is_on_backorder && (
            <p className="mt-6 text-sm text-red-600">Derzeit nicht auf Lager.</p>
          )}
          </div>
          </AnimateOnScroll>
        </div>

        {crossSellProducts.length > 0 && (
          <>
            <div className="hidden w-[10%] shrink-0 lg:block" aria-hidden />
            <div className="absolute right-0 top-0 bottom-0 hidden w-[10%] overflow-hidden border-l border-gray-100 pl-6 lg:block">
              <ProductCrossSell products={crossSellProducts} />
            </div>
          </>
        )}
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

    </div>
  );
}
