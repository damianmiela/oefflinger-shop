import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/woo/api";
import { AddToCartButton } from "./AddToCartButton";
import { StockStatus } from "./StockStatus";
import { ClickableImage } from "@/components/ClickableImage";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

interface Props {
  params: Promise<{ slug: string }>;
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
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const priceDisplay =
    Number(product.prices.price) > 0
      ? `${(Number(product.prices.price) / 100).toFixed(2)} ${product.prices.currency_symbol}`
      : "Preis auf Anfrage";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <AnimateOnScroll variant="fade-up">
        <div className="aspect-square overflow-hidden rounded-xl bg-surface-alt">
        {product.images[0] ? (
          <ClickableImage
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            width={600}
            height={600}
            priority
            className="h-full w-full rounded-xl"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Kein Bild</div>
        )}
        </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up">
        <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-2 text-2xl font-semibold text-primary">{priceDisplay}</p>

        {product.short_description && (
          <div
            className="prose prose-gray mt-6 max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
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

        {product.description && (
          <div
            className="prose prose-gray mt-10 max-w-none border-t border-gray-200 pt-8"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
        </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
