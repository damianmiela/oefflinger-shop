"use client";

import Link from "next/link";
import Image from "next/image";
import { CartPreview } from "@/components/CartPreview";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo/logo-transparent.png"
            alt="Öfflinger"
            width={160}
            height={48}
            priority
            className="h-[calc(var(--spacing)*15)] w-auto"
          />
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition hover:text-primary"
          >
            Start
          </Link>
          <Link
            href="/produkte"
            className="text-sm font-medium text-gray-700 transition hover:text-primary"
          >
            Produkte
          </Link>
          <Link
            href="/shop"
            className="text-sm font-medium text-gray-700 transition hover:text-primary"
          >
            Shop
          </Link>
          <CartPreview />
        </nav>
      </div>
    </header>
  );
}
