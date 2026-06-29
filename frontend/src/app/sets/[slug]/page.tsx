import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSet } from "../_lib/sets";
import { AddSetButton } from "../_components/AddSetButton";
import { SetThumb } from "../_components/SetThumb";
import { SetsSection } from "../_components/SetsSection";
import { HealthDisclaimer } from "@/components/HealthDisclaimer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PaymentMethodLogos } from "@/components/PaymentMethodLogos";
import { JsonLd } from "@/components/JsonLd";
import { formatCents } from "@/lib/format";
import { toMetaDescription, absoluteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const set = await getSet(slug);
  if (!set) {
    return { title: "Set nicht gefunden", robots: { index: false, follow: false } };
  }
  const description = toMetaDescription(
    set.description || `${set.name} – Set aus ${set.components.length} Produkten.`,
  );
  return {
    title: set.name,
    description,
    alternates: { canonical: `/sets/${set.slug}` },
    openGraph: {
      type: "website",
      url: `/sets/${set.slug}`,
      title: set.name,
      description,
      ...(set.image ? { images: [{ url: set.image, alt: set.name }] } : {}),
    },
  };
}

export default async function SetDetailPage({ params }: Props) {
  const { slug } = await params;
  const set = await getSet(slug);
  if (!set) notFound();

  const cc = set.currency_code || "EUR";
  const componentCount = set.components.length;

  const canonicalUrl = absoluteUrl(`/sets/${set.slug}`);
  const componentImages = set.components
    .map((c) => c.image)
    .filter((src): src is string => Boolean(src));
  const ldImages = set.image ? [set.image] : componentImages;
  const ldDescription = toMetaDescription(set.description || "", 300);

  // Product JSON-LD when the set has a concrete price (parity with the PDP).
  const productLd: Record<string, unknown> | null =
    set.set_price > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: set.name,
          ...(ldDescription ? { description: ldDescription } : {}),
          ...(ldImages.length ? { image: ldImages } : {}),
          brand: { "@type": "Brand", name: "Öfflinger" },
          offers: {
            "@type": "Offer",
            price: (set.set_price / 100).toFixed(2),
            priceCurrency: cc,
            availability: set.available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            url: canonicalUrl,
          },
        }
      : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Sets", item: absoluteUrl("/sets") },
      { "@type": "ListItem", position: 3, name: set.name, item: canonicalUrl },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {productLd && <JsonLd data={productLd} />}
      <JsonLd data={breadcrumbLd} />

      <Breadcrumbs
        className="mb-6"
        items={[
          { label: "Start", href: "/" },
          { label: "Sets", href: "/sets" },
          { label: set.name },
        ]}
      />

      <div className="grid items-start gap-8 lg:grid-cols-[42%_1fr] lg:gap-12">
        {/* Image */}
        <div className="bg-surface-alt relative aspect-[4/3] overflow-hidden rounded-2xl">
          <SetThumb set={set} sizes="(min-width: 1024px) 42vw, 100vw" priority />
          {set.savings_percent > 0 && (
            <span className="bg-accent absolute top-4 left-4 rounded-full px-3 py-1 text-sm font-semibold text-white shadow-sm">
              −{set.savings_percent}&nbsp;% im Set
            </span>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0">
          <p className="text-primary text-sm font-medium tracking-widest uppercase">Set</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{set.name}</h1>

          {/* Price */}
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-primary text-3xl font-bold">{formatCents(set.set_price, cc)}</span>
            {set.savings > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatCents(set.components_sum, cc)}
                </span>
                <span className="bg-accent rounded-full px-2.5 py-1 text-sm font-semibold text-white">
                  −{set.savings_percent}&nbsp;%
                </span>
              </>
            )}
          </div>
          {set.savings > 0 && (
            <p className="text-accent mt-1 font-medium">Sie sparen {formatCents(set.savings, cc)}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">inkl. MwSt.</p>

          {/* Set facts (mirrors the PDP attribute box) */}
          <dl className="mt-5 flex flex-wrap overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="min-w-[7.5rem] flex-1 border-l border-gray-200 px-4 py-3 first:border-l-0">
              <dt className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                Produkte im Set
              </dt>
              <dd className="mt-0.5 font-semibold text-gray-900">{componentCount}</dd>
            </div>
            {set.savings_percent > 0 && (
              <div className="min-w-[7.5rem] flex-1 border-l border-gray-200 px-4 py-3 first:border-l-0">
                <dt className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Ersparnis
                </dt>
                <dd className="mt-0.5 font-semibold text-gray-900">{set.savings_percent}&nbsp;%</dd>
              </div>
            )}
          </dl>

          {/* Availability + shipping + CTA + payment */}
          <div className="mt-6">
            <p className="flex items-center gap-2 text-sm">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${set.available ? "bg-emerald-500" : "bg-amber-500"}`}
                aria-hidden
              />
              <span className={`font-medium ${set.available ? "text-emerald-700" : "text-amber-700"}`}>
                {set.available ? "Auf Lager – sofort versandfertig" : "Derzeit nicht vollständig verfügbar"}
              </span>
            </p>

            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
              <svg
                className="h-4 w-4 shrink-0 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <span>Versand 4,90 €</span>
              <span aria-hidden className="text-gray-300">
                ·
              </span>
              <span className="font-medium text-emerald-700">versandkostenfrei ab 100 €</span>
              <Link
                href="/versand"
                className="hover:text-primary text-gray-400 underline decoration-gray-300 underline-offset-2 transition"
              >
                Details
              </Link>
            </p>

            <AddSetButton setId={set.id} available={set.available} className="mt-5 w-full sm:w-auto" />
            {!set.available && (
              <p className="mt-2 text-sm text-amber-700">
                Eines der enthaltenen Produkte ist derzeit nicht verfügbar.
              </p>
            )}

            <div className="mt-5">
              <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                Sichere Bezahlung
              </p>
              <PaymentMethodLogos className="mt-2" />
            </div>
          </div>

          {set.description && (
            <div
              className="mt-6 leading-relaxed text-gray-600 [&_a]:text-primary [&_a]:underline [&_p:last-child]:mb-0 [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: set.description }}
            />
          )}
        </div>
      </div>

      {/* Included products */}
      <section className="mt-12 border-t border-gray-100 pt-10">
        <h2 className="text-2xl font-bold text-gray-900">Enthaltene Produkte</h2>
        <p className="mt-1 text-gray-500">
          {componentCount} {componentCount === 1 ? "Produkt" : "Produkte"} – im Set günstiger als
          einzeln gekauft.
        </p>
        <ul className="mt-6 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {set.components.map((c) => (
            <li key={c.id} className="flex items-center gap-4 p-4">
              <Link
                href={`/shop/${c.slug}`}
                className="bg-surface-alt block h-20 w-20 shrink-0 overflow-hidden rounded-lg"
              >
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-contain"
                  />
                ) : null}
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/shop/${c.slug}`}
                  className="hover:text-primary font-medium text-gray-900"
                >
                  {c.name}
                </Link>
                {c.attributes && c.attributes.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {c.attributes.map((a) => (
                      <span
                        key={a.label}
                        className="bg-surface-alt rounded-full px-2 py-0.5 text-xs text-gray-500"
                      >
                        {a.label}: <span className="font-medium text-gray-800">{a.value}</span>
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-1.5 text-sm text-gray-500">
                  Menge: {c.qty}
                  {!c.in_stock && " · derzeit nicht verfügbar"}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-sm font-medium text-gray-900">
                  {formatCents(c.price * c.qty, cc)}
                </span>
                {c.qty > 1 && (
                  <p className="text-xs text-gray-400">{formatCents(c.price, cc)} / Stück</p>
                )}
              </div>
            </li>
          ))}

          {/* Value summary */}
          {set.savings > 0 && (
            <li className="bg-surface-alt flex flex-col gap-1 p-4 text-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span>Einzeln zusammen</span>
                <span className="line-through">{formatCents(set.components_sum, cc)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-gray-900">
                <span>Set-Preis</span>
                <span className="text-primary">{formatCents(set.set_price, cc)}</span>
              </div>
              <div className="text-accent flex items-center justify-between font-medium">
                <span>Ihre Ersparnis</span>
                <span>
                  −{formatCents(set.savings, cc)} ({set.savings_percent}&nbsp;%)
                </span>
              </div>
            </li>
          )}
        </ul>
      </section>

      {/* Weitere Sets (cross-sell; renders nothing if this is the only set) */}
      <SetsSection
        heading="Weitere Sets"
        subline="Diese Sets könnten Ihnen auch gefallen."
        excludeId={set.id}
        className="mt-16 border-t border-gray-100 pt-12"
      />

      <HealthDisclaimer className="mt-12" />
    </div>
  );
}
