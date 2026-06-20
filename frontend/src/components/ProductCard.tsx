import Link from "next/link";
import Image from "next/image";
import { PriceDisplay } from "@/components/PriceDisplay";
import { StarRating } from "@/components/StarRating";
import { formatBasePrice, volumeFromAttributes } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const basePrice = formatBasePrice(
    product.prices.price,
    volumeFromAttributes(product.attributes),
    product.prices.currency_code,
  );
  const reviewAverage = parseFloat(product.average_rating || "0") || 0;
  const reviewCount = product.review_count || 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:border-gray-200 hover:shadow-md"
    >
      <div className="bg-surface-alt aspect-[5/7] shrink-0 overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            width={400}
            height={560}
            sizes="(min-width: 1280px) 240px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Kein Bild</div>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-6">
        <h3 className="group-hover:text-primary line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-gray-900 transition sm:text-base">
          {product.name}
        </h3>
        <div className="mt-auto pt-3 sm:pt-4">
          {reviewCount > 0 && (
            <StarRating rating={reviewAverage} count={reviewCount} size="sm" className="mb-2" />
          )}
          <p>
            <PriceDisplay prices={product.prices} size="md" showTaxNote basePrice={basePrice} />
          </p>
          {product.attributes && product.attributes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              {product.attributes.slice(0, 2).map((attr, i) => {
                const rawLabel =
                  attr.name || attr.attribute?.replace(/^pa_/, "").replace(/-/g, " ") || "";
                const label = rawLabel ? rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1) : "";
                const value = attr.options?.join(", ") || attr.value || "";
                if (!value || !label) return null;
                return (
                  <span key={attr.attribute ?? attr.name ?? `attr-${i}`}>
                    {label}: <span className="text-gray-700">{value}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
