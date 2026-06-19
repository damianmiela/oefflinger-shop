"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface AnimateChildrenProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay between each child (ms) */
  stagger?: number;
  variant?: "fade-up" | "fade-in";
}

/**
 * Staggered scroll reveal for a list of children. Visible by default (P2-16e):
 * the hidden/animated state only applies when JS is active (html.js) and motion
 * is allowed. Styling lives in globals.css (`[data-reveal]` / `[data-revealed]`).
 */
export function AnimateChildren({
  children,
  className = "",
  stagger = 80,
  variant = "fade-up",
}: AnimateChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const items = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <div
          key={i}
          data-reveal={variant}
          data-revealed={revealed ? "" : undefined}
          style={{ transitionDelay: revealed ? `${i * stagger}ms` : "0ms" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
