"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/woo/api";
import { formatCents } from "@/lib/format";
import type { Product } from "@/types";

interface SearchBoxProps {
  /** "desktop": compact input with absolute dropdown; "mobile": full-width with inline results */
  variant?: "desktop" | "mobile";
  /** Called after navigating (e.g. to close the mobile menu) */
  onNavigate?: () => void;
}

const MIN_CHARS = 2;
const DEBOUNCE_MS = 250;

export function SearchBox({ variant = "desktop", onNavigate }: SearchBoxProps) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = term.trim();
    if (q.length < MIN_CHARS) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const products = await searchProducts(q, 5);
        setResults(products);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setOpen(true);
      }
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [term]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const goToResults = useCallback(() => {
    const q = term.trim();
    if (!q) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }, [term, router, onNavigate]);

  const closeAndNavigate = useCallback(() => {
    setOpen(false);
    onNavigate?.();
  }, [onNavigate]);

  const isDesktop = variant === "desktop";

  const resultsList = open && (
    <div
      className={
        isDesktop
          ? "absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          : "mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white"
      }
      role="listbox"
      aria-label="Suchergebnisse"
    >
      {results.length === 0 ? (
        <p className="px-4 py-3 text-sm text-gray-500">
          {loading ? "Suche läuft…" : `Keine Treffer für „${term.trim()}“`}
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {results.map((product) => (
            <li key={product.id} role="option" aria-selected={false}>
              <Link
                href={`/product/${product.slug}`}
                onClick={closeAndNavigate}
                className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-gray-50"
              >
                <span className="bg-surface-alt block h-11 w-8 shrink-0 overflow-hidden rounded">
                  {product.images[0] && (
                    <Image
                      src={product.images[0].thumbnail || product.images[0].src}
                      alt=""
                      width={32}
                      height={44}
                      className="h-full w-full object-contain"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">
                    {product.name}
                  </span>
                  <span className="text-primary text-xs font-semibold">
                    {formatCents(product.prices.price, product.prices.currency_code)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={goToResults}
        className="text-primary block w-full border-t border-gray-100 px-4 py-2.5 text-left text-sm font-medium transition hover:bg-gray-50"
      >
        Alle Ergebnisse anzeigen →
      </button>
    </div>
  );

  return (
    <div ref={containerRef} className={isDesktop ? "relative" : "px-4 pt-3"}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          goToResults();
        }}
      >
        <div className="relative">
          <svg
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
            />
          </svg>
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onFocus={() => {
              if (results.length > 0 || term.trim().length >= MIN_CHARS) setOpen(true);
            }}
            placeholder="Suchen…"
            aria-label="Produkte durchsuchen"
            className={`rounded-full border border-gray-300 bg-white py-1.5 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/30 focus:ring-2 focus:outline-none ${
              isDesktop ? "w-40 transition-[width] duration-200 focus:w-56 lg:w-44 lg:focus:w-64" : "w-full py-2.5"
            }`}
          />
        </div>
      </form>
      {resultsList}
    </div>
  );
}
