"use client";

/**
 * Reusable coupon UI (cart + checkout). Applies/removes coupons on the live
 * Store API cart (identified by the Cart-Token), so a code entered on the cart
 * page is already present at checkout — no URL passing needed. Shows the input,
 * the currently-applied coupons (with remove), and any error.
 */
import { useId, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import * as wooApi from "@/lib/woo/api";
import { toUserMessage } from "@/lib/woo/api";
import { getStoredToken, storeToken } from "@/lib/woo/cart-token";

export function CouponField({ className = "" }: { className?: string }) {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const fieldId = useId();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applied = cart?.coupons ?? [];

  async function applyCode() {
    const value = code.trim();
    if (!value || busy) return;
    setBusy(true);
    setError(null);
    try {
      let token = getStoredToken();
      // Email-restricted coupons (e.g. the newsletter welcome code) need an email
      // on the guest Store-API cart to validate against. For logged-in customers,
      // push their account email first so the restriction passes — here and at checkout.
      if (user?.email) {
        const res = await wooApi.updateCustomer({ billing_address: { email: user.email } }, token);
        if (res.token) {
          token = res.token;
          storeToken(token);
        }
      }
      const { token: appliedToken } = await wooApi.applyCoupon(value, token);
      if (appliedToken) storeToken(appliedToken);
      await refreshCart();
      setCode("");
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(couponCode: string) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { token } = await wooApi.removeCoupon(couponCode, getStoredToken());
      if (token) storeToken(token);
      await refreshCart();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-gray-700">
        Gutscheincode
      </label>
      <div className="flex gap-2">
        <input
          id={fieldId}
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyCode();
            }
          }}
          placeholder="z. B. WILLKOMMEN10"
          autoComplete="off"
          className="focus:border-primary focus:ring-primary/30 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:outline-none"
        />
        <button
          type="button"
          onClick={applyCode}
          disabled={busy || !code.trim()}
          className="bg-primary hover:bg-primary-light shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "…" : "Einlösen"}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      {applied.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {applied.map((coupon) => (
            <li
              key={coupon.code}
              className="flex items-center justify-between gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800"
            >
              <span>
                Gutschein <span className="font-semibold uppercase">{coupon.code}</span> aktiv
              </span>
              <button
                type="button"
                onClick={() => onRemove(coupon.code)}
                disabled={busy}
                className="font-medium underline transition hover:text-emerald-900 disabled:opacity-60"
              >
                Entfernen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
