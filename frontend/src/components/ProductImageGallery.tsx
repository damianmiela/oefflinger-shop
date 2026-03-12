"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import type { ProductImage } from "@/types";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  /** Set for LCP (above the fold) */
  priority?: boolean;
}

export function ProductImageGallery({
  images,
  productName,
  priority = false,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-surface-alt text-gray-400">
        Kein Bild
      </div>
    );
  }

  const mainImage = images[selectedIndex];
  const slides = images.map((img) => ({
    src: img.src,
    alt: img.alt || productName,
  }));

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="block aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Bild vergrößern"
      >
        <Image
          src={mainImage.src}
          alt={mainImage.alt || productName}
          width={600}
          height={600}
          unoptimized
          priority={priority}
          className="h-full w-full object-cover transition hover:opacity-95"
        />
      </button>

      {/* Thumbnail strip (when multiple images) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                selectedIndex === i
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Bild ${i + 1} anzeigen`}
            >
              <Image
                src={img.thumbnail || img.src}
                alt={img.alt || `${productName} – Bild ${i + 1}`}
                width={64}
                height={64}
                unoptimized
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={selectedIndex}
        animation={{ fade: 300 }}
        controller={{ closeOnBackdropClick: true }}
        labels={{ Close: "Schließen" }}
        carousel={{ finite: true }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
}
