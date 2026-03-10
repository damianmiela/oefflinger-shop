"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { cart } = useCart();
  const itemCount = cart?.items_count ?? 0;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary-dark">
          Öfflinger
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/shop"
            className="text-sm font-medium text-gray-700 transition hover:text-primary"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="relative text-sm font-medium text-gray-700 transition hover:text-primary"
          >
            Warenkorb
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
