import type { Product } from "@/types";

/**
 * Shop filtering/sorting helpers (in-memory – the catalog is small).
 * Filters are limited to Größe and Konzentration by design; a filter group
 * is only shown when it has at least 2 distinct values across the catalog.
 */

export interface FilterGroup {
  /** URL parameter name (ASCII) */
  param: "groesse" | "konzentration";
  label: string;
  values: string[];
}

const GROUP_DEFS: { param: FilterGroup["param"]; label: string; pattern: RegExp }[] = [
  { param: "groesse", label: "Größe", pattern: /(gr[öo]([ßs]|ss)e|grose)/ },
  { param: "konzentration", label: "Konzentration", pattern: /konzentration/ },
];

const MIN_DISTINCT_VALUES = 2;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** All values of the attributes matching a pattern (e.g. ["500ml"]). */
function attributeValues(product: Product, pattern: RegExp): string[] {
  const values: string[] = [];
  for (const attr of product.attributes ?? []) {
    const label = `${attr.name ?? ""} ${attr.attribute ?? ""}`.toLowerCase();
    if (!pattern.test(label)) continue;
    if (attr.options?.length) values.push(...attr.options);
    else if (attr.value) values.push(attr.value);
  }
  return values.map((v) => v.trim()).filter(Boolean);
}

/** Natural sort: "5ppm" < "10ppm" < "100ppm"; falls back to locale compare. */
function naturalCompare(a: string, b: string): number {
  const numA = parseFloat(a.replace(",", "."));
  const numB = parseFloat(b.replace(",", "."));
  if (Number.isFinite(numA) && Number.isFinite(numB) && numA !== numB) {
    return numA - numB;
  }
  return a.localeCompare(b, "de");
}

/** Distinct values per group across the catalog; groups with < 2 values are dropped. */
export function collectFilterGroups(products: Product[]): FilterGroup[] {
  const groups: FilterGroup[] = [];
  for (const def of GROUP_DEFS) {
    const seen = new Map<string, string>(); // normalized → display casing (first wins)
    for (const product of products) {
      for (const value of attributeValues(product, def.pattern)) {
        const key = normalize(value);
        if (!seen.has(key)) seen.set(key, value);
      }
    }
    const values = [...seen.values()].sort(naturalCompare);
    if (values.length >= MIN_DISTINCT_VALUES) {
      groups.push({ param: def.param, label: def.label, values });
    }
  }
  return groups;
}

/** OR within a group, AND across groups; q matches the product name. */
export function filterProducts(
  products: Product[],
  q: string,
  selected: Record<string, string[]>,
): Product[] {
  const query = normalize(q);
  return products.filter((product) => {
    if (query && !product.name.toLowerCase().includes(query)) return false;
    for (const def of GROUP_DEFS) {
      const wanted = selected[def.param];
      if (!wanted || wanted.length === 0) continue;
      const values = attributeValues(product, def.pattern).map(normalize);
      const wantedNorm = wanted.map(normalize);
      if (!values.some((v) => wantedNorm.includes(v))) return false;
    }
    return true;
  });
}

export type SortKey = "" | "preis-auf" | "preis-ab" | "name";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "", label: "Standard" },
  { key: "preis-auf", label: "Preis aufsteigend" },
  { key: "preis-ab", label: "Preis absteigend" },
  { key: "name", label: "Name A–Z" },
];

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products];
  switch (sort) {
    case "preis-auf":
      return copy.sort((a, b) => Number(a.prices.price) - Number(b.prices.price));
    case "preis-ab":
      return copy.sort((a, b) => Number(b.prices.price) - Number(a.prices.price));
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name, "de"));
    default:
      return copy;
  }
}
