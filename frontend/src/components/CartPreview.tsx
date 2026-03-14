"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { slugFromPermalink } from "@/lib/woo/utils";
import { buildCheckoutUrl } from "@/lib/woo/checkout";
import { useCart } from "@/context/CartContext";
import type { CartItemData } from "@/types";

const CART_PULSE_DELAY_MS = 280;

const HOVER_DELAY_MS = 300;

function CartPreviewItem({ item }: { item: CartItemData }) {
  const slug = slugFromPermalink(item.permalink);
  const lineTotal =
    Number(item.totals.line_total) > 0
      ? `${(Number(item.totals.line_total) / 100).toFixed(2)} ${item.totals.currency_symbol}`
      : "";

  const content = (
    <div className="flex items-center gap-3 py-2">
      <div className="h-10 w-[28px] shrink-0 overflow-hidden rounded bg-surface-alt">
        {item.images[0] ? (
          <Image
            src={item.images[0].src}
            alt={item.images[0].alt || item.name}
            width={28}
            height={40}
            unoptimized
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
            —
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
        <p className="text-xs text-gray-500">
          {item.quantity} × {lineTotal}
        </p>
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link href={`/product/${slug}`} className="block transition hover:bg-gray-50">
        {content}
      </Link>
    );
  }
  return <div className="block">{content}</div>;
}

export function CartPreview() {
  const { cart, justAddedToCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!justAddedToCart) {
      setShowPulse(false);
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
        pulseTimeoutRef.current = null;
      }
      return;
    }
    pulseTimeoutRef.current = setTimeout(() => {
      setShowPulse(true);
      pulseTimeoutRef.current = setTimeout(() => {
        setShowPulse(false);
      }, 900);
    }, CART_PULSE_DELAY_MS);
    return () => {
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, [justAddedToCart]);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), HOVER_DELAY_MS);
  }, []);

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  const itemCount = cart?.items_count ?? 0;
  const totalPrice =
    cart && Number(cart.totals.total_price) > 0
      ? `${(Number(cart.totals.total_price) / 100).toFixed(2)} ${cart.totals.currency_symbol}`
      : null;

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <Link
        href="/cart"
        className="relative flex items-center gap-1.5 rounded-full px-4 py-2 pr-6 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
      >
        {showPulse && (
          <span
            className="cart-pulse-ring absolute inset-0 -m-2 rounded-full border-2"
            aria-hidden
          />
        )}
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Warenkorb
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            {itemCount}
          </span>
        )}
      </Link>

      {visible && itemCount > 0 && (
        <>
          {/* Invisible bridge to prevent preview from disappearing when moving cursor from button to dropdown */}
          <div
            className="absolute left-0 right-0 top-full z-40 h-3"
            aria-hidden
          />
          <div
            className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
            onMouseEnter={show}
            onMouseLeave={hide}
          >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">Warenkorb-Vorschau</p>
          </div>
          <div className="max-h-64 overflow-y-auto px-4">
            {cart?.items.map((item) => (
              <CartPreviewItem key={item.key} item={item} />
            ))}
          </div>
          <div className="border-t border-gray-100 px-4 py-3">
            <p className="mb-2 text-sm font-semibold text-gray-900">
              Gesamt: {totalPrice}
            </p>
            <Link
              href={buildCheckoutUrl(cart!.items)}
              className="block w-full rounded-lg bg-primary py-2 text-center text-sm font-semibold text-white transition hover:bg-primary-light"
            >
              Zur Kasse
            </Link>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
