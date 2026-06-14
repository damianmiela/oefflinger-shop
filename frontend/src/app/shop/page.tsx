import Link from "next/link";
import { getProducts } from "@/lib/woo/api";
import { ProductCard } from "@/components/ProductCard";
import { ShopPagination } from "@/components/ShopPagination";
import { AnimateChildren } from "@/components/AnimateChildren";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { HealthDisclaimer } from "@/components/HealthDisclaimer";
import { SortSelect } from "@/components/SortSelect";
import {
  collectFilterGroups,
  filterProducts,
  sortProducts,
  SORT_OPTIONS,
  type SortKey,
} from "@/lib/shop-filters";
import type { Product } from "@/types";

export const metadata = {
  title: "Shop",
  description: "Entdecken Sie unsere hochwertigen Kolloide.",
  alternates: { canonical: "/shop" },
  openGraph: {
    type: "website",
    url: "/shop",
    title: "Shop",
    description: "Entdecken Sie unsere hochwertigen Kolloide.",
  },
};

const PER_PAGE = 20;

const CHIP_BASE =
  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition";
const CHIP_ACTIVE = "border-primary bg-primary text-white";
const CHIP_INACTIVE = "border-gray-300 bg-white text-gray-700 hover:border-primary/50 hover:text-primary";

interface Props {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    groesse?: string;
    konzentration?: string;
  }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const sortKeys = SORT_OPTIONS.map((o) => o.key);
  const sort: SortKey = sortKeys.includes(params.sort as SortKey)
    ? (params.sort as SortKey)
    : "";
  const selected: Record<string, string[]> = {
    groesse: params.groesse ? params.groesse.split(",").filter(Boolean) : [],
    konzentration: params.konzentration ? params.konzentration.split(",").filter(Boolean) : [],
  };

  let all: Product[] = [];
  let loadFailed = false;
  try {
    all = await getProducts();
  } catch {
    loadFailed = true;
  }

  const groups = collectFilterGroups(all);
  const filtered = sortProducts(filterProducts(all, q, selected), sort);
  const hasActiveFilters =
    q !== "" || sort !== "" || selected.groesse.length > 0 || selected.konzentration.length > 0;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(Math.max(1, parseInt(params.page ?? "1", 10) || 1), totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  /** Current state as URL params (page excluded – changing anything resets to page 1) */
  const baseParams: Record<string, string> = {};
  if (q) baseParams.q = q;
  if (sort) baseParams.sort = sort;
  if (selected.groesse.length) baseParams.groesse = selected.groesse.join(",");
  if (selected.konzentration.length) baseParams.konzentration = selected.konzentration.join(",");

  const href = (overrides: Record<string, string | null>) => {
    const sp = new URLSearchParams(baseParams);
    for (const [key, value] of Object.entries(overrides)) {
      if (value === null || value === "") sp.delete(key);
      else sp.set(key, value);
    }
    const qs = sp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const toggleHref = (param: string, value: string) => {
    const current = selected[param] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    return href({ [param]: next.join(",") });
  };

  const popular = all.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AnimateOnScroll variant="fade-up">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Alle Produkte</h1>
      </AnimateOnScroll>

      <AnimateOnScroll variant="fade-up">
        <div className="border-primary/20 bg-primary/5 mb-8 flex flex-col gap-4 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700 sm:text-base">
            <span className="text-primary font-medium">Was sind kolloidale Metalle?</span> Erfahren
            Sie mehr über Eisen, Gold, Silber, Zink und unsere weiteren Spurenelemente —
            Herstellung, Eigenschaften und mögliche Einsatzbereiche.
          </p>
          <Link
            href="/produkte"
            className="bg-primary hover:bg-primary-light shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white transition"
          >
            Mehr erfahren →
          </Link>
        </div>
      </AnimateOnScroll>

      {!loadFailed && all.length > 0 && (
        <AnimateOnScroll variant="fade-up">
          <div className="mb-8 space-y-3">
            {q && (
              <p className="text-gray-600">
                {filtered.length} {filtered.length === 1 ? "Ergebnis" : "Ergebnisse"} für „{q}“{" "}
                <Link href={href({ q: null })} className="text-primary text-sm hover:underline">
                  Suche zurücksetzen
                </Link>
              </p>
            )}

            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
              <div className="min-w-0 space-y-3">
                {groups.map((group) => (
                  <div key={group.param} className="flex flex-wrap items-center gap-2">
                    <span className="w-full text-sm font-medium text-gray-500 sm:w-28 sm:shrink-0">
                      {group.label}:
                    </span>
                    {group.values.map((value) => {
                      const active = selected[group.param]?.includes(value) ?? false;
                      return (
                        <Link
                          key={value}
                          href={toggleHref(group.param, value)}
                          className={`${CHIP_BASE} ${active ? CHIP_ACTIVE : CHIP_INACTIVE}`}
                        >
                          {value}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="shrink-0">
                <SortSelect sort={sort} baseParams={baseParams} />
              </div>
            </div>

            {hasActiveFilters && (
              <p>
                <Link href="/shop" className="text-primary text-sm font-medium hover:underline">
                  Alle Filter zurücksetzen
                </Link>
              </p>
            )}
          </div>
        </AnimateOnScroll>
      )}

      {pageItems.length > 0 ? (
        <>
          <AnimateChildren
            className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            stagger={60}
          >
            {pageItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimateChildren>
          <ShopPagination currentPage={currentPage} totalPages={totalPages} params={baseParams} />
        </>
      ) : all.length > 0 ? (
        <AnimateOnScroll variant="fade-up">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">Keine Produkte gefunden</h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">
              {q
                ? `Für „${q}“ und die gewählten Filter gibt es keine Treffer.`
                : "Für die gewählten Filter gibt es keine Treffer."}{" "}
              Versuchen Sie es mit anderen Begriffen oder setzen Sie die Filter zurück.
            </p>
            <Link
              href="/shop"
              className="bg-primary hover:bg-primary-light mt-6 inline-block rounded-lg px-6 py-3 font-semibold text-white transition"
            >
              Alle Filter zurücksetzen
            </Link>
          </div>

          {popular.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900">Beliebte Produkte</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {popular.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </AnimateOnScroll>
      ) : (
        <AnimateOnScroll variant="fade-up">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {loadFailed
                ? "Unsere Produkte konnten gerade nicht geladen werden."
                : "Im Moment sind keine Produkte verfügbar."}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">
              {loadFailed
                ? "Bitte versuchen Sie es in wenigen Minuten erneut."
                : "Unser Sortiment wird gerade aktualisiert – schauen Sie bald wieder vorbei."}
            </p>
            {loadFailed && (
              <a
                href="/shop"
                className="bg-primary hover:bg-primary-light mt-6 inline-block rounded-lg px-6 py-3 font-semibold text-white transition"
              >
                Erneut versuchen
              </a>
            )}
          </div>
        </AnimateOnScroll>
      )}

      <AnimateOnScroll variant="fade-up">
        <HealthDisclaimer className="mt-12" />
      </AnimateOnScroll>
    </div>
  );
}
