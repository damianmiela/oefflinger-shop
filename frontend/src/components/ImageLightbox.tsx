"use client";

import Lightbox from "yet-another-react-lightbox";

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  const slides = [{ src, alt }];
  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={slides}
      animation={{ fade: 300 }}
      controller={{ closeOnBackdropClick: true }}
      labels={{ Close: "Schließen" }}
      carousel={{ finite: true }}
      render={{
        buttonPrev: slides.length <= 1 ? () => null : undefined,
        buttonNext: slides.length <= 1 ? () => null : undefined,
      }}
    />
  );
}
