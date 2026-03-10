import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/woo/api";
import { AddToCartButton } from "./AddToCartButton";

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
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-xl bg-surface-alt">
        {product.images[0] ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Kein Bild</div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-2 text-2xl font-semibold text-primary">{priceDisplay}</p>

        <div
          className="prose prose-gray mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        {product.is_purchasable && (product.is_in_stock || product.is_on_backorder) && (
          <AddToCartButton productId={product.id} />
        )}

        {!product.is_in_stock && !product.is_on_backorder && (
          <p className="mt-6 text-sm text-red-600">Derzeit nicht auf Lager.</p>
        )}
      </div>
    </div>
  );
}
