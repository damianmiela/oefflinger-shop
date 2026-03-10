"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageLightbox } from "./ImageLightbox";
import type { Product } from "@/types";

export function ProductCardImage({ product }: { product: Product }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!product.images[0]) {
    return (
      <div className="flex aspect-square h-full w-full items-center justify-center bg-surface-alt text-gray-400">
        Kein Bild
      </div>
    );
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setLightboxOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            setLightboxOpen(true);
          }
        }}
        className="aspect-square cursor-pointer overflow-hidden bg-surface-alt"
        aria-label="Bild vergrößern"
      >
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt || product.name}
          width={400}
          height={400}
          unoptimized
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <ImageLightbox
        src={product.images[0].src}
        alt={product.images[0].alt || product.name}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
