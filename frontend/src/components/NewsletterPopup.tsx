"use client";

/**
 * Newsletter popup (P2-15c): appears 5s after the first visit, once per browser
 * (localStorage), site-wide except the newsletter confirm/unsubscribe pages.
 * Reuses NewsletterSignup on a branded dark card. Double opt-in applies.
 */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const SEEN_KEY = "oeff_nl_popup_seen";
const DELAY_MS = 5000;

export function NewsletterPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Never interrupt the confirm/unsubscribe flow.
    if (pathname?.startsWith("/newsletter")) return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return; // storage blocked → don't nag
    }
    const timer = setTimeout(() => {
      setOpen(true);
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden onClick={() => setOpen(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Newsletter-Anmeldung"
        className="bg-primary-dark relative w-full max-w-md rounded-2xl p-6 shadow-xl sm:p-8"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Schließen"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-sm font-medium tracking-widest text-white/80 uppercase">Newsletter</p>
        <h2 className="mt-2 text-2xl font-bold text-white">10% auf Ihre erste Bestellung</h2>
        <p className="mt-3 text-sm text-white/85">
          Melden Sie sich für unseren Newsletter an und sichern Sie sich Ihren Willkommensgutschein
          – dazu Neuigkeiten zu unseren kolloidalen Metallen aus der Eifel.
        </p>
        <div className="mt-5">
          <NewsletterSignup variant="section" />
        </div>
      </div>
    </div>
  );
}
