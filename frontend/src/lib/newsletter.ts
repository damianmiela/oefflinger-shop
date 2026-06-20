/**
 * Newsletter client for the headless WordPress API (oeff/v1/newsletter).
 * Double-opt-in: subscribe → confirmation email → confirm (issues 10% coupon).
 */

const WP_URL = process.env.NEXT_PUBLIC_WP_URL || "http://localhost:4001";
const API_BASE = `${WP_URL.replace(/\/$/, "")}/wp-json/oeff/v1/newsletter`;

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data && typeof data.message === "string" && data.message) ||
      "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.";
    throw new Error(message);
  }
  return data as T;
}

/** Start the double opt-in. Always resolves generically (no account disclosure). */
export async function apiNewsletterSubscribe(params: {
  email: string;
  turnstileToken?: string;
  /** Honeypot field – must stay empty */
  website?: string;
}): Promise<void> {
  await post("/subscribe", {
    email: params.email,
    turnstile_token: params.turnstileToken,
    website: params.website ?? "",
  });
}

export interface NewsletterConfirmResult {
  coupon: string | null;
  discount: string;
}

/** Confirm a subscription via the emailed token; returns the welcome coupon. */
export async function apiNewsletterConfirm(token: string): Promise<NewsletterConfirmResult> {
  const data = await post<{ coupon: string | null; discount: string }>("/confirm", { token });
  return { coupon: data.coupon ?? null, discount: data.discount ?? "10%" };
}

/** Unsubscribe via the emailed token. Resolves generically. */
export async function apiNewsletterUnsubscribe(token: string): Promise<void> {
  await post("/unsubscribe", { token });
}

/**
 * Whether the logged-in user (WP cookie) is already a confirmed subscriber.
 * Answers only for the authenticated user's own email; resolves false otherwise.
 */
export async function apiNewsletterStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/status`, { credentials: "include" });
    if (!res.ok) return false;
    const data = (await res.json()) as { subscribed?: boolean };
    return Boolean(data?.subscribed);
  } catch {
    return false;
  }
}
