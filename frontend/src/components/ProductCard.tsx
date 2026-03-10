import Link from "next/link";
import type { Product } from "@/types";
import { ProductCardImage } from "./ProductCardImage";

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
      <ProductCardImage product={product} />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary">{product.name}</h3>
        <p className="mt-1 text-lg font-bold text-primary">{price}</p>
      </div>
    </Link>
  );
}
