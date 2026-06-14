import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getMetalById, COLLOIDAL_METALS, getMetalAccentColor } from "@/data/colloidal-metals";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { RememberMetal } from "@/components/RememberMetal";
import { HealthDisclaimer } from "@/components/HealthDisclaimer";
import { toMetaDescription } from "@/lib/seo";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return COLLOIDAL_METALS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const metal = getMetalById(id);
  if (!metal) return { title: "Kolloid nicht gefunden", robots: { index: false, follow: false } };
  const title = `Kolloidales ${metal.name}`;
  const description = toMetaDescription(metal.description);
  const path = `/produkte/${metal.id}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title,
      description,
    },
  };
}

export default async function MetalDetailPage({ params }: Props) {
  const { id } = await params;
  const metal = getMetalById(id);

  if (!metal) notFound();

  return (
    <div className="min-h-screen">
      <RememberMetal metalId={metal.id} />
      {/* Back button – full width container */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up">
          <Link
            href="/produkte"
            className="hover:text-primary inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition"
          >
            <span aria-hidden>←</span>
            Zurück zu Produkte
          </Link>
        </AnimateOnScroll>
      </div>

      {/* Hero header – full width bg, image max 1920px centered, 400px height */}
      <div className="bg-primary-dark mt-6 w-full">
        <div className="relative mx-auto h-[400px] max-w-[1920px] overflow-hidden">
          <Image
            src={`/images/metals/${metal.id}.png`}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 1920px) 100vw, 1920px"
            priority
          />
          <div className="bg-primary-dark/40 absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl">
              Kolloidales {metal.name}
            </h1>
            <p className="mt-2 text-xl text-white/90">{metal.tagline}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up">
          <div className="prose prose-gray max-w-none space-y-8 text-gray-600">
            <div className="text-lg leading-relaxed whitespace-pre-line">
              {metal.longDescription ?? metal.description}
            </div>

            {metal.uses && metal.uses.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900">Mögliche Einsatzbereiche</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {metal.uses.map((use) => (
                    <span
                      key={use}
                      className="rounded-full px-4 py-2 text-sm font-medium"
                      style={{
                        backgroundColor: `${getMetalAccentColor(metal)}20`,
                        color: getMetalAccentColor(metal),
                      }}
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <HealthDisclaimer />
          </div>
        </AnimateOnScroll>

        {metal.productLink && (
          <AnimateOnScroll variant="fade-up">
            <Link
              href={metal.productLink}
              className="bg-primary hover:bg-primary-light mt-10 inline-block rounded-lg px-6 py-3 font-semibold text-white transition"
            >
              Zum Produkt im Shop
            </Link>
          </AnimateOnScroll>
        )}
      </div>
    </div>
  );
}
