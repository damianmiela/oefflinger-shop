"use client";

/**
 * Mini-cart drawer (P3-20a) — the primary cart UX. Slides in from the right with
 * all the cart sections (items, coupon, free-shipping, totals, checkout). Opens
 * automatically after an add (CartContext.isOpen) and from the header cart icon;
 * /warenkorb stays as a full-page fallback built from the same shared pieces.
 *
 * a11y: role="dialog" aria-modal, Escape + backdrop close, body scroll lock while
 * open, `inert` + pointer-events-none while closed (kept mounted for the slide
 * transition), closes on route change.
 */
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CartSetGroups } from "@/app/sets/_components/CartSetGroups";
import { CartSummary } from "@/components/CartSummary";
import { CouponField } from "@/components/CouponField";
import { buildCheckoutUrl } from "@/lib/woo/checkout";

export function MiniCartDrawer() {
  const { cart, isOpen, closeCart } = useCart();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeCart]);

  const itemCount = cart?.items_count ?? 0;
  const hasItems = (cart?.items.length ?? 0) > 0;

  return (
    <div
      inert={!isOpen}
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={closeCart}
        aria-hidden
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Warenkorb"
        tabIndex={-1}
        className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 focus:outline-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Warenkorb {itemCount > 0 && <span className="font-normal text-gray-400">({itemCount})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Warenkorb schließen"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {hasItems ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <CartSetGroups items={cart!.items} />
              <div className="border-t border-gray-100 px-5 py-4">
                <CouponField />
              </div>
            </div>

            <div className="border-t border-gray-200 bg-white px-5 py-4">
              <CartSummary />
              <Link
                href={buildCheckoutUrl(cart!.items)}
                onClick={closeCart}
                className="bg-accent hover:bg-accent-light mt-4 block w-full rounded-lg py-3 text-center text-base font-semibold text-white transition"
              >
                Zur Kasse
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 block w-full text-center text-sm text-gray-500 transition hover:text-gray-700"
              >
                Weiter einkaufen
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="text-lg font-semibold text-gray-900">Ihr Warenkorb ist leer</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="bg-primary hover:bg-primary-light rounded-lg px-6 py-3 font-semibold text-white transition"
            >
              Zum Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
