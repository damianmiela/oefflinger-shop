"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
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
      <div className="bg-surface-alt flex aspect-[5/7] items-center justify-center rounded-xl text-gray-400">
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
      {/* Main image – ~600px high, 5:7 ratio */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="bg-surface-alt focus:ring-primary block aspect-[5/7] max-h-[600px] w-full cursor-pointer overflow-hidden rounded-xl focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label="Bild vergrößern"
      >
        <Image
          src={mainImage.src}
          alt={mainImage.alt || productName}
          width={429}
          height={600}
          unoptimized
          priority={priority}
          className="h-full w-full object-contain p-1 transition hover:opacity-95"
        />
      </button>

      {/* Thumbnail grid – 3 per row, no scrollbar, all visible */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`focus:ring-primary relative cursor-pointer overflow-hidden rounded-lg transition focus:ring-2 focus:outline-none focus:ring-inset ${
                selectedIndex === i
                  ? "ring-primary ring-2 ring-inset"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Bild ${i + 1} anzeigen`}
            >
              <div className="aspect-square w-full">
                <Image
                  src={img.thumbnail || img.src}
                  alt={img.alt || `${productName} – Bild ${i + 1}`}
                  width={120}
                  height={120}
                  unoptimized
                  className="h-full w-full object-cover p-1"
                />
              </div>
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
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
          doubleTapDelay: 300,
          pinchZoomDistanceFactor: 100,
        }}
        carousel={{ finite: true, imageFit: "contain", padding: "16px" }}
        animation={{ fade: 300 }}
        controller={{ closeOnBackdropClick: true }}
        labels={{ Close: "Schließen" }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
}
