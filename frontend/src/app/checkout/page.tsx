"use client";

import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL || "http://localhost:4001";

function getCheckoutUrl(productsParam: string, coupon: string | null): string {
  const iframeParams = new URLSearchParams({ products: productsParam });
  if (coupon) iframeParams.set("coupon", coupon);
  const base = WP_URL.replace(/\/$/, "");
  return `${base}/checkout-link/?${iframeParams.toString()}`;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { cart, loading } = useCart();
  const [iframeHeight, setIframeHeight] = useState<number | null>(null);

  // The WP checkout posts its content height; resize the iframe so no inner
  // scrollbars are needed and the page scrolls as one.
  useEffect(() => {
    let wpOrigin: string | null = null;
    try {
      wpOrigin = new URL(WP_URL).origin;
    } catch {
      wpOrigin = null;
    }
    function onMessage(e: MessageEvent) {
      if (wpOrigin && e.origin !== wpOrigin) return;
      const d = e.data;
      if (d && d.type === "oeff:checkout-height" && typeof d.height === "number") {
        setIframeHeight(Math.max(600, Math.ceil(d.height) + 2));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  const products = searchParams.get("products");
  if (loading && !cart) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500 sm:px-6 lg:px-8">
        Warenkorb wird geladen…
      </div>
    );
  }

  const coupon = searchParams.get("coupon");
  const productsParam =
    products || (cart ? cart.items.map((i) => `${i.id}:${i.quantity}`).join(",") : "");

  if (!productsParam) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Keine Produkte im Warenkorb</h1>
        <Link
          href="/shop"
          className="bg-primary hover:bg-primary-light mt-6 inline-block rounded-lg px-6 py-3 text-white transition"
        >
          Zum Shop
        </Link>
      </div>
    );
  }

  const checkoutUrl = getCheckoutUrl(productsParam, coupon);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Kasse</h1>
      <div className="min-h-[600px] overflow-hidden rounded-xl border border-gray-200 bg-white">
        <iframe
          src={checkoutUrl}
          title="Checkout"
          scrolling={iframeHeight ? "no" : "yes"}
          style={iframeHeight ? { height: iframeHeight } : undefined}
          className={
            iframeHeight
              ? "w-full border-0 transition-[height] duration-200"
              : "h-[calc(100vh-280px)] min-h-[600px] w-full border-0"
          }
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">Wird geladen…</div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
