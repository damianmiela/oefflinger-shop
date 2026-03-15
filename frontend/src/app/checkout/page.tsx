"use client";

import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";

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
  const products = searchParams.get("products");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(600);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "oeff-checkout-height" && typeof e.data.height === "number") {
        setIframeHeight(Math.max(400, Math.min(e.data.height + 20, 2000)));
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  if (loading && !cart) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500 sm:px-6 lg:px-8">
        Warenkorb wird geladen…
      </div>
    );
  }

  const coupon = searchParams.get("coupon");
  const productsParam = products || (cart ? cart.items.map((i) => `${i.id}:${i.quantity}`).join(",") : "");

  if (!productsParam) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Keine Produkte im Warenkorb</h1>
        <Link href="/shop" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-light">
          Zum Shop
        </Link>
      </div>
    );
  }

  const checkoutUrl = getCheckoutUrl(productsParam, coupon);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Kasse</h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <iframe
          ref={iframeRef}
          src={checkoutUrl}
          title="Checkout"
          style={{ height: iframeHeight }}
          className="min-h-[400px] w-full border-0 overflow-hidden"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">Wird geladen…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
