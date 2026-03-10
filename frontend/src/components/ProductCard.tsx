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
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden bg-surface-alt">
        {product.images[0] ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Kein Bild</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary">{product.name}</h3>
        <p className="mt-1 text-lg font-bold text-primary">{price}</p>
      </div>
    </Link>
  );
}
