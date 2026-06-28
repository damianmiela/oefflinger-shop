/**
 * Sets / bundles client for the headless WordPress API (oeff/v1/sets).
 *
 * Reads the catalog of active sets with their resolved components + computed
 * pricing (all money in minor units / cents, matching the Store API).
 * Adding a set to the cart goes through the Store API instead — see
 * lib/woo/api.ts `addSet()` and CartContext `addSet()`.
 */

/** A product attribute shown per component (e.g. Größe, Konzentration). */
export interface OeffSetAttribute {
  label: string;
  value: string;
}

export interface OeffSetComponent {
  id: number;
  name: string;
  slug: string;
  qty: number;
  /** Unit price in minor units (cents) */
  price: number;
  image: string | null;
  in_stock: boolean;
  /** Visible product attributes (Größe, Konzentration, …) */
  attributes?: OeffSetAttribute[];
}

/** A pickable product in a configurable set (no fixed qty — the customer chooses). */
export interface OeffSetOption {
  id: number;
  name: string;
  slug: string;
  /** Unit price in minor units (cents) */
  price: number;
  image: string | null;
  in_stock: boolean;
  /** Visible product attributes (Größe, Konzentration, …) */
  attributes?: OeffSetAttribute[];
}

export interface OeffSetTier {
  min_qty: number;
  percent: number;
}

export interface OeffSetCategory {
  id: number;
  name: string;
  slug: string;
}

export interface OeffSet {
  id: number;
  slug: string;
  name: string;
  /** Rendered HTML description */
  description: string;
  image: string | null;
  type: "fixed" | "configurable";
  pricing_mode: "fixed" | "percent" | "amount";
  components: OeffSetComponent[];
  /** Sum of the components at their normal price (cents) */
  components_sum: number;
  /** Price of the set (cents) */
  set_price: number;
  /** Savings vs buying separately (cents) */
  savings: number;
  savings_percent: number;
  /** False if any component is out of stock / unpurchasable */
  available: boolean;
  currency_code: string;
  /** Configurable sets only: source category, pickable products, discount tiers. */
  category?: OeffSetCategory | null;
  options?: OeffSetOption[];
  tiers?: OeffSetTier[];
  min_qty?: number;
}

/** wp-json base — internal Docker host on the server, public URL in the browser. */
function getWpApiBase(): string {
  const fallback = `${(process.env.NEXT_PUBLIC_WP_URL || "http://localhost:4001").replace(/\/$/, "")}/wp-json`;
  if (typeof window === "undefined") {
    return process.env.WP_INTERNAL_URL || process.env.NEXT_PUBLIC_WP_API_URL || fallback;
  }
  return process.env.NEXT_PUBLIC_WP_API_URL || fallback;
}

const SETS_REVALIDATE = 60;

/** All active sets. Server fetches are ISR-cached + tagged ("sets"). */
export async function getSets(): Promise<OeffSet[]> {
  try {
    const res = await fetch(`${getWpApiBase()}/oeff/v1/sets`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: SETS_REVALIDATE, tags: ["sets"] },
    });
    if (!res.ok) return [];
    return (await res.json()) as OeffSet[];
  } catch {
    return [];
  }
}

/** A single set by slug (or numeric id); null if not found. */
export async function getSet(slugOrId: string): Promise<OeffSet | null> {
  try {
    const res = await fetch(`${getWpApiBase()}/oeff/v1/sets/${encodeURIComponent(slugOrId)}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: SETS_REVALIDATE, tags: ["sets"] },
    });
    if (!res.ok) return null;
    return (await res.json()) as OeffSet;
  } catch {
    return null;
  }
}
