"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Delay before animation (stagger children) */
  delay?: number;
  /** Animation variant */
  variant?: "fade-up" | "fade-in" | "fade-down";
}

/**
 * Reveals children on scroll. Visible by default (P2-16e): the hidden/animated
 * state only applies when JS is active (html.js, set in the root layout) and the
 * user hasn't requested reduced motion — so no-JS visitors, crawlers and
 * reduced-motion users always see the content. Styling lives in globals.css
 * (`[data-reveal]` / `[data-revealed]`).
 */
export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={variant}
      data-revealed={revealed ? "" : undefined}
      className={className}
      style={{ transitionDelay: revealed ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
