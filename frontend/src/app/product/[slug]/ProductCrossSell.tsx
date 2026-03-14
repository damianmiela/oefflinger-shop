"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

interface ProductCrossSellProps {
  products: Product[];
}

export function ProductCrossSell({ products }: ProductCrossSellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "up" | "down") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 120;
    el.scrollBy({ top: direction === "up" ? -amount : amount, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex flex-col items-center gap-1">
        <span className="text-center text-xs font-medium uppercase tracking-wider text-gray-500">
          Auch interessant
        </span>
        <button
          type="button"
          onClick={() => scroll("up")}
          className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Nach oben scrollen"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex flex-col gap-4 pr-1">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group flex flex-col items-center gap-1.5 rounded-lg border border-gray-100 p-2 transition hover:border-gray-200 hover:bg-gray-50"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded bg-surface-alt">
                {p.images[0] ? (
                  <Image
                    src={p.images[0].thumbnail || p.images[0].src}
                    alt={p.images[0].alt || p.name}
                    fill
                    sizes="80px"
                    className="object-contain transition group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    Kein Bild
                  </div>
                )}
              </div>
              <p className="line-clamp-2 text-center text-xs font-medium text-gray-900 group-hover:text-primary">
                {p.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-center">
        <button
          type="button"
          onClick={() => scroll("down")}
          className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Nach unten scrollen"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
