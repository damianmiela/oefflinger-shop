"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

const PARALLAX_FACTOR = 1.0;

interface HeroParallaxProps {
  imageUrl: string;
  children: React.ReactNode;
}

/**
 * Hero with parallax background. The image appears to stay in place while
 * scrolling (moves slower), but is contained in the section – once scrolled
 * past, it's no longer visible.
 * Uses direct DOM updates (no React state) to keep scroll and image in sync.
 */
export function HeroParallax({ imageUrl, children }: HeroParallaxProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced-motion (P2-16a): leave the hero image static, no parallax.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      const image = imageRef.current;
      if (!section || !image) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      let translateY: number;
      if (sectionTop + sectionHeight < 0) {
        translateY = sectionHeight;
      } else if (sectionTop > 0) {
        translateY = 0;
      } else {
        const scrollProgress = -sectionTop;
        translateY = Math.min(scrollProgress, sectionHeight);
      }

      image.style.transform = `translateY(${translateY * PARALLAX_FACTOR}px)`;
    };

    handleScroll(); // initial
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pb-24 sm:pb-32 lg:pb-40"
      style={{
        marginTop: "calc(-1 * var(--header-height, 88px))",
        paddingTop: "calc(var(--header-height, 88px) + 6rem)",
      }}
    >
      {/* Parallax background – extends above/below section for smooth translate */}
      <div
        ref={imageRef}
        className="absolute left-0 w-full"
        style={{
          top: "-10%",
          height: "120%",
        }}
        aria-hidden
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-primary-dark/70" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
