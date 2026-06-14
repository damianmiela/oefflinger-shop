import { notFound } from "next/navigation";
import { getProductBySlug, getProductsPaginated } from "@/lib/woo/api";
import { AddToCartButton } from "./AddToCartButton";
import { StockStatus } from "./StockStatus";
import { DeliveryEstimate } from "./DeliveryEstimate";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductCrossSell } from "./ProductCrossSell";
import { CollapsibleDescription } from "./CollapsibleDescription";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PaymentMethodLogos } from "@/components/PaymentMethodLogos";
import Link from "next/link";
import { formatBasePrice, volumeFromAttributes } from "@/lib/format";
import { toMetaDescription, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { getMetalByProductSlug } from "@/data/colloidal-metals";
import type { Product } from "@/types";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * PDP cross-sell pool (P1-12c → §4.4): fetch only a small bounded set instead of
 * the whole catalog. CROSS_SELL_POOL must exceed CROSS_SELL_COUNT so excluding the
 * current product still leaves enough to show.
 */
const CROSS_SELL_POOL = 12;
const CROSS_SELL_COUNT = 10;

function shuffleAndTake<T>(arr: T[], excludeId: number, count: number): T[] {
  const filtered = arr.filter((p) => (p as Product).id !== excludeId);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Produkt nicht gefunden", robots: { index: false, follow: false } };
  }
  const description = toMetaDescription(product.short_description || product.description || "");
  const path = `/product/${product.slug}`;
  const image = product.images?.[0];
  return {
    title: product.name,
    description: description || undefined,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: product.name,
      description: description || undefined,
      images: image ? [{ url: image.src, alt: image.alt || product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description || undefined,
      images: image ? [image.src] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, related] = await Promise.all([
    getProductBySlug(slug),
    getProductsPaginated(1, CROSS_SELL_POOL),
  ]);

  if (!product) notFound();

  const crossSellProducts = shuffleAndTake(related.products, product.id, CROSS_SELL_COUNT);

  const basePrice = formatBasePrice(
    product.prices.price,
    volumeFromAttributes(product.attributes),
    product.prices.currency_code,
  );

  const metal = getMetalByProductSlug(product.slug);
  const canonicalUrl = absoluteUrl(`/product/${product.slug}`);
  const ldDescription = toMetaDescription(
    product.short_description || product.description || "",
    300,
  );
  const priceCents = Number(product.prices.price);
  const availability = product.is_in_stock
    ? "https://schema.org/InStock"
    : product.is_on_backorder
      ? "https://schema.org/BackOrder"
      : "https://schema.org/OutOfStock";
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(ldDescription ? { description: ldDescription } : {}),
    ...(product.images?.length ? { image: product.images.map((img) => img.src) } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    brand: { "@type": "Brand", name: "Öfflinger" },
    ...(priceCents > 0
      ? {
          offers: {
            "@type": "Offer",
            price: (priceCents / 100).toFixed(2),
            priceCurrency: product.prices.currency_code || "EUR",
            availability,
            itemCondition: "https://schema.org/NewCondition",
            url: canonicalUrl,
            priceValidUntil,
          },
        }
      : {}),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
      { "@type": "ListItem", position: 3, name: product.name, item: canonicalUrl },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: "Start", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />
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
              <h1 className="order-1 text-3xl font-bold tracking-tight text-gray-900 lg:order-none">
                {product.name}
              </h1>
              <p className="order-2 mt-3 lg:order-none">
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
                  className="product-html-content order-7 mt-5 max-w-none leading-relaxed text-gray-600 lg:order-none [&_p]:mb-4 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {product.attributes && product.attributes.length > 0 && (
                <dl className="order-3 mt-5 flex flex-wrap overflow-hidden rounded-xl border border-gray-200 bg-white lg:order-none">
                  {product.attributes.map((attr, i) => {
                    const rawLabel =
                      attr.name || attr.attribute?.replace(/^pa_/, "").replace(/-/g, " ") || "";
                    const label = rawLabel
                      ? rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1)
                      : "Attribut";
                    const value = attr.options?.join(", ") || attr.value || "";
                    if (!value) return null;
                    return (
                      <div
                        key={attr.attribute ?? attr.name ?? `attr-${i}`}
                        className="min-w-[7.5rem] flex-1 border-l border-gray-200 px-4 py-3 first:border-l-0"
                      >
                        <dt className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                          {label}
                        </dt>
                        <dd className="mt-0.5 font-semibold text-gray-900">{value}</dd>
                      </div>
                    );
                  })}
                </dl>
              )}

              {product.is_purchasable && (product.is_in_stock || product.is_on_backorder) && (
                <div className="order-4 lg:order-none">
                  <StockStatus product={product} />
                  <DeliveryEstimate deliveryEstimate={product.delivery_estimate} />
                  <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                    <svg
                      className="h-4 w-4 shrink-0 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                    <span>Versand 4,90 €</span>
                    <span aria-hidden className="text-gray-300">
                      ·
                    </span>
                    <span className="font-medium text-emerald-700">
                      versandkostenfrei ab 100 €
                    </span>
                    <Link
                      href="/versand"
                      className="hover:text-primary text-gray-400 underline decoration-gray-300 underline-offset-2 transition"
                    >
                      Details
                    </Link>
                  </p>
                  <AddToCartButton product={product} />
                  <div className="mt-5">
                    <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                      Sichere Bezahlung
                    </p>
                    <PaymentMethodLogos className="mt-2" />
                  </div>
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

      {/* Cross-link into the knowledge hub for this metal (P2-14h) */}
      {metal && (
        <AnimateOnScroll variant="fade-up">
          <div className="mt-10 border-t border-gray-100 pt-6">
            <Link
              href={`/produkte/${metal.id}`}
              className="text-primary hover:text-primary-light inline-flex items-center gap-2 font-medium transition"
            >
              Mehr über kolloidales {metal.name} erfahren
              <span aria-hidden>→</span>
            </Link>
          </div>
        </AnimateOnScroll>
      )}
    </div>
  );
}
