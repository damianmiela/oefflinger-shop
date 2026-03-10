"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface AnimateChildrenProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay between each child (ms) */
  stagger?: number;
  variant?: "fade-up" | "fade-in";
}

export function AnimateChildren({
  children,
  className = "",
  stagger = 80,
  variant = "fade-up",
}: AnimateChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ease-out ${
                visible
                  ? "opacity-100 translate-y-0"
                  : variant === "fade-up"
                    ? "opacity-0 translate-y-6"
                    : "opacity-0"
              }`}
              style={{
                transitionDelay: visible ? `${i * stagger}ms` : "0ms",
              }}
            >
              {child}
            </div>
          ))
        : (
          <div
            className={`transition-all duration-500 ease-out ${
              visible
                ? "opacity-100 translate-y-0"
                : variant === "fade-up"
                  ? "opacity-0 translate-y-6"
                  : "opacity-0"
            }`}
            style={{ transitionDelay: visible ? "0ms" : "0ms" }}
          >
            {children}
          </div>
        )}
    </div>
  );
}
