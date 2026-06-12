"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CartPreview } from "@/components/CartPreview";

const navLinkClass =
  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-primary/10 hover:text-primary";

const mobileNavLinkClass =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-primary/10 hover:text-primary";

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function DropletsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.318H2.665c-1.718 0-2.3-2.086-1.067-3.318L5 14.5"
      />
    </svg>
  );
}

function ShopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:py-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo/logo-transparent.png"
            alt="Öfflinger"
            width={160}
            height={48}
            priority
            className="h-10 w-auto md:h-[calc(var(--spacing)*15)]"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className={navLinkClass}>
            <HomeIcon className="h-4 w-4" />
            Start
          </Link>
          <Link href="/produkte" className={navLinkClass}>
            <DropletsIcon className="h-4 w-4" />
            Kolloidales Wasser
          </Link>
          <Link href="/shop" className={navLinkClass}>
            <ShopIcon className="h-4 w-4" />
            Shop
          </Link>
          <CartPreview />
        </nav>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <CartPreview />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      <div
        id="mobile-menu"
        className={`grid overflow-hidden border-gray-200 bg-white transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
      >
        <nav className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link href="/" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
              <HomeIcon className="h-5 w-5" />
              Start
            </Link>
            <Link
              href="/produkte"
              className={mobileNavLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <DropletsIcon className="h-5 w-5" />
              Kolloidales Wasser
            </Link>
            <Link href="/shop" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
              <ShopIcon className="h-5 w-5" />
              Shop
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
