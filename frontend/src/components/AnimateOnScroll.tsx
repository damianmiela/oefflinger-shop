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

export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const base = "transition-all duration-500 ease-out";
  const variants = {
    "fade-up": visible
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-6",
    "fade-in": visible ? "opacity-100" : "opacity-0",
    "fade-down": visible
      ? "opacity-100 translate-y-0"
      : "opacity-0 -translate-y-4",
  };

  return (
    <div
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
