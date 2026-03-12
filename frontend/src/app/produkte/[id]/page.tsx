import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getMetalById, COLLOIDAL_METALS, getMetalAccentColor } from "@/data/colloidal-metals";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { RememberMetal } from "@/components/RememberMetal";

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
      <RememberMetal metalId={metal.id} />
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

      {/* Hero header – 100% width, metal label image */}
      <div className="relative mt-6 aspect-[21/9] min-h-[240px] overflow-hidden">
        <Image
          src={`/images/metals/${metal.id}.png`}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.15) 50%, transparent 55%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 flex w-full flex-col justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
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
