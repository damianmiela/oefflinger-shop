"use client";

import Lightbox from "yet-another-react-lightbox";

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={[{ src, alt }]}
      animation={{ fade: 300 }}
      controller={{ closeOnBackdropClick: true }}
      labels={{ Close: "Schließen" }}
    />
  );
}
