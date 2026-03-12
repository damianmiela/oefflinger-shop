import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const price =
    Number(product.prices.price) > 0
      ? `${(Number(product.prices.price) / 100).toFixed(2)} ${product.prices.currency_symbol}`
      : "Preis auf Anfrage";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:border-gray-200 hover:shadow-md"
    >
      <div className="aspect-[5/7] overflow-hidden bg-surface-alt">
        {product.images[0] ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            width={400}
            height={560}
            unoptimized
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Kein Bild</div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 transition group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-primary">{price}</p>
      </div>
    </Link>
  );
}
