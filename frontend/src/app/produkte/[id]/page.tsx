import { notFound } from "next/navigation";
import Link from "next/link";
import { getMetalById, COLLOIDAL_METALS, getMetalAccentColor } from "@/data/colloidal-metals";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return COLLOIDAL_METALS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const metal = getMetalById(id);
  if (!metal) return { title: "Kolloid nicht gefunden" };
  return {
    title: `Kolloidales ${metal.name} – Öfflinger`,
    description: metal.description,
  };
}

export default async function MetalDetailPage({ params }: Props) {
  const { id } = await params;
  const metal = getMetalById(id);

  if (!metal) notFound();

  return (
    <div className="min-h-screen">
      {/* Back button – full width container */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up">
          <Link
            href="/produkte"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-primary"
          >
            <span aria-hidden>←</span>
            Zurück zu Produkte
          </Link>
        </AnimateOnScroll>
      </div>

      {/* Hero header – 100% width, gradient */}
      <div
        className="relative mt-6 overflow-hidden py-16 sm:py-24"
        style={{
          background: `linear-gradient(135deg, ${metal.gradientFrom} 0%, ${metal.gradientTo} 50%, ${metal.gradientFrom} 100%)`,
          boxShadow: "inset 0 0 60px rgba(255,255,255,0.15)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.2) 50%, transparent 55%)",
          }}
        />
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="droplets-detail"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="2" fill="white" opacity="0.5" />
                <circle cx="40" cy="35" r="1.5" fill="white" opacity="0.4" />
                <circle cx="25" cy="50" r="1" fill="white" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#droplets-detail)" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl">
            Kolloidales {metal.name}
          </h1>
          <p className="mt-2 text-xl text-white/90">{metal.tagline}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up">
          <div className="prose prose-gray max-w-none space-y-8 text-gray-600">
            <div className="whitespace-pre-line text-lg leading-relaxed">
              {metal.longDescription ?? metal.description}
            </div>

            {metal.uses && metal.uses.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900">
                  Mögliche Einsatzbereiche
                </h2>
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

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-900">
              <p className="font-medium">Hinweis</p>
              <p className="mt-1">
                Die hier präsentierten Informationen dienen ausschließlich zu Bildungszwecken und
                allgemeinen Informationen. Sie ersetzen keine professionelle medizinische Beratung,
                Diagnose oder Behandlung. Vor der Einnahme von Nahrungsergänzungsmitteln oder
                Änderungen Ihrer Gesundheitsroutine konsultieren Sie bitte einen qualifizierten Arzt
                oder Gesundheitsexperten.
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        {metal.productLink && (
          <AnimateOnScroll variant="fade-up">
            <Link
              href={metal.productLink}
              className="mt-10 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-light"
            >
              Zum Produkt im Shop
            </Link>
          </AnimateOnScroll>
        )}
      </div>
    </div>
  );
}
