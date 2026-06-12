import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/woo/api";
import { AddToCartButton } from "./AddToCartButton";
import { StockStatus } from "./StockStatus";
import { DeliveryEstimate } from "./DeliveryEstimate";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductCrossSell } from "./ProductCrossSell";
import { CollapsibleDescription } from "./CollapsibleDescription";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { formatBasePrice, volumeFromAttributes } from "@/lib/format";
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
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), getProducts()]);

  if (!product) notFound();

  const crossSellProducts = shuffleAndTake(allProducts, product.id, 10);

  const basePrice = formatBasePrice(
    product.prices.price,
    volumeFromAttributes(product.attributes),
    product.prices.currency_code,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Top: gallery (30%) | details (60%) | cross-sell (10%). Height from gallery or details only; cross-sell is absolute. */}
      <div className="relative flex gap-8">
        <div className="grid min-w-0 flex-1 gap-8 lg:grid-cols-[30%_1fr]">
          <AnimateOnScroll variant="fade-up">
            <div className="w-full">
              <ProductImageGallery images={product.images} productName={product.name} priority />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fade-up">
            <div className="flex w-full flex-col justify-center">
              <h1 className="order-1 text-3xl font-bold text-gray-900 lg:order-none">
                {product.name}
              </h1>
              <p className="order-2 mt-2 lg:order-none">
                <PriceDisplay
                  prices={product.prices}
                  size="lg"
                  showTaxNote
                  basePrice={basePrice}
                  linkShipping
                />
              </p>

              {product.short_description && (
                <div
                  className="product-html-content order-7 mt-6 max-w-none leading-relaxed text-gray-600 lg:order-none [&_p]:mb-4 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {product.attributes && product.attributes.length > 0 && (
                <dl className="order-3 mt-4 space-y-2 lg:order-none">
                  {product.attributes.map((attr, i) => {
                    const rawLabel =
                      attr.name || attr.attribute?.replace(/^pa_/, "").replace(/-/g, " ") || "";
                    const label = rawLabel
                      ? rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1)
                      : "Attribut";
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
                <div className="order-4 lg:order-none">
                  <StockStatus product={product} />
                  <DeliveryEstimate deliveryEstimate={product.delivery_estimate} />
                  <AddToCartButton product={product} />
                </div>
              )}

              {!product.is_in_stock && !product.is_on_backorder && (
                <p className="order-5 mt-6 text-sm text-red-600 lg:order-none">
                  Derzeit nicht auf Lager.
                </p>
              )}
            </div>
          </AnimateOnScroll>
        </div>

        {crossSellProducts.length > 0 && (
          <>
            <div className="hidden w-[10%] shrink-0 lg:block" aria-hidden />
            <div className="absolute top-0 right-0 bottom-0 hidden w-[10%] overflow-hidden border-l border-gray-100 pl-6 lg:block">
              <ProductCrossSell products={crossSellProducts} />
            </div>
          </>
        )}
      </div>

      {/* Mobile: cross-sell between short and long description */}
      {crossSellProducts.length > 0 && (
        <div className="mt-10 lg:hidden">
          <ProductCrossSell products={crossSellProducts} orientation="horizontal" />
        </div>
      )}

      {/* Full-width description – collapsed on mobile */}
      {product.description && (
        <AnimateOnScroll variant="fade-up">
          <div className="mt-10 lg:mt-12">
            <CollapsibleDescription html={product.description} />
          </div>
        </AnimateOnScroll>
      )}
    </div>
  );
}
