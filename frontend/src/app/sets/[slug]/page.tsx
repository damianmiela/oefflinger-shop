import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSet } from "../_lib/sets";
import { AddSetButton } from "../_components/AddSetButton";
import { SetConfigurator } from "../_components/SetConfigurator";
import { HealthDisclaimer } from "@/components/HealthDisclaimer";
import { formatCents } from "@/lib/format";
import { toMetaDescription } from "@/lib/seo";

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
    set.description ||
      (set.type === "configurable"
        ? `${set.name} – stellen Sie Ihr eigenes Set zusammen.`
        : `${set.name} – Set aus ${set.components.length} Produkten.`),
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
  const isConfigurable = set.type === "configurable";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/sets" className="hover:text-primary">
          Sets
        </Link>{" "}
        <span aria-hidden>/</span> <span className="text-gray-700">{set.name}</span>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="bg-surface-alt overflow-hidden rounded-2xl">
          {set.image ? (
            <Image
              src={set.image}
              alt={set.name}
              width={800}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-gray-400">Kein Bild</div>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-gray-900">{set.name}</h1>

          {isConfigurable ? (
            <p className="mt-4 text-gray-600">
              Stellen Sie Ihr Set selbst zusammen – wählen Sie unten Ihre Produkte. Je mehr Sie
              wählen, desto höher der Mengenrabatt.
            </p>
          ) : (
            <>
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

              <AddSetButton setId={set.id} available={set.available} className="mt-6 w-full sm:w-auto" />
              {!set.available && (
                <p className="mt-2 text-sm text-amber-700">
                  Eines der enthaltenen Produkte ist derzeit nicht verfügbar.
                </p>
              )}
            </>
          )}

          {set.description && (
            <div
              className="mt-6 text-gray-600 [&_a]:text-primary [&_a]:underline [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: set.description }}
            />
          )}
        </div>
      </div>

      {isConfigurable ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">Set zusammenstellen</h2>
          <SetConfigurator set={set} />
        </section>
      ) : (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">Enthaltene Produkte</h2>
          <ul className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            {set.components.map((c) => (
              <li key={c.id} className="flex items-center gap-4 p-4">
                <Link
                  href={`/shop/${c.slug}`}
                  className="bg-surface-alt block h-16 w-16 shrink-0 overflow-hidden rounded-lg"
                >
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/shop/${c.slug}`} className="hover:text-primary font-medium text-gray-900">
                    {c.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Menge: {c.qty}
                    {!c.in_stock && " · derzeit nicht verfügbar"}
                  </p>
                </div>
                <span className="shrink-0 text-sm text-gray-600">{formatCents(c.price * c.qty, cc)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <HealthDisclaimer className="mt-12" />
    </div>
  );
}
