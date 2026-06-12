"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

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
  );
}
