import type { ProductAttribute } from "@/types";

/**
 * Price & unit formatting helpers (de-DE, PAngV-aware).
 *
 * All Store API money values are minor units (cents) as strings.
 * Account/order endpoints return major units (e.g. "43.50") – use formatEuros.
 */

const formatters = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(currencyCode: string): Intl.NumberFormat {
  let fmt = formatters.get(currencyCode);
  if (!fmt) {
    fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: currencyCode });
    formatters.set(currencyCode, fmt);
  }
  return fmt;
}

/** Format minor units as German currency: 4350 → "43,50 €". */
export function formatCents(cents: number | string, currencyCode: string = "EUR"): string {
  const n = typeof cents === "string" ? Number(cents) : cents;
  if (!Number.isFinite(n)) return "";
  return getCurrencyFormatter(currencyCode).format(n / 100);
}

/** Format major units as German currency: "43.5" / 43.5 → "43,50 €". */
export function formatEuros(amount: number | string, currencyCode: string = "EUR"): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "";
  return getCurrencyFormatter(currencyCode).format(n);
}

/** Parse a volume value like "500ml", "500 ml", "0,5 l", "1L" into milliliters. */
export function parseVolumeMl(value: string): number | null {
  const match = value
    .trim()
    .toLowerCase()
    .replace(",", ".")
    .match(/^(\d+(?:\.\d+)?)\s*(ml|l)$/);
  if (!match) return null;
  const amount = parseFloat(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return match[2] === "l" ? amount * 1000 : amount;
}

const VOLUME_ATTRIBUTE_PATTERN = /(gr[öo]([ßs]|ss)e|grose|volumen|menge|inhalt|f[üu]llmenge)/;

/** Find the package volume (ml) in product attributes (Größe / Volumen / Inhalt …). */
export function volumeFromAttributes(attributes?: ProductAttribute[]): number | null {
  if (!attributes) return null;
  for (const attr of attributes) {
    const label = `${attr.name ?? ""} ${attr.attribute ?? ""}`.toLowerCase();
    if (!VOLUME_ATTRIBUTE_PATTERN.test(label)) continue;
    const values = attr.options?.length ? attr.options : attr.value ? [attr.value] : [];
    for (const value of values) {
      const ml = parseVolumeMl(value);
      if (ml) return ml;
    }
  }
  return null;
}

/**
 * PAngV Grundpreis from a unit price in minor units.
 * Reference quantity for packaged liquids (Fertigpackungen) is fixed at 1 l
 * (PAngV 2022, §5 – the former ≤250 ml → 100 ml exception was abolished;
 * 100 g/ml remains only for loose goods, which does not apply here).
 * Returns e.g. "87,00 € / 1 l" or null when not computable.
 */
export function formatBasePrice(
  unitPriceCents: number | string,
  volumeMl: number | null,
  currencyCode: string = "EUR",
): string | null {
  const cents = typeof unitPriceCents === "string" ? Number(unitPriceCents) : unitPriceCents;
  if (!Number.isFinite(cents) || cents <= 0 || !volumeMl || volumeMl <= 0) return null;
  const referenceCents = (cents / volumeMl) * 1000;
  return `${formatCents(referenceCents, currencyCode)} / 1 l`;
}
