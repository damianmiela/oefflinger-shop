"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageLightbox } from "./ImageLightbox";

interface ClickableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Set for LCP image (above the fold, e.g. product page hero) */
  priority?: boolean;
}

export function ClickableImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: ClickableImageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="block h-full w-full cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Bild vergrößern"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          priority={priority}
          className={`h-full w-full object-cover transition hover:opacity-95 ${className}`}
        />
      </button>
      <ImageLightbox
        src={src}
        alt={alt}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
