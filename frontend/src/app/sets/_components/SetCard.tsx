import Link from "next/link";
import Image from "next/image";
import { AddSetButton } from "./AddSetButton";
import { formatCents } from "@/lib/format";
import type { OeffSet } from "../_lib/sets";

/** Catalog card for a Set on the /sets listing. */
export function SetCard({ set }: { set: OeffSet }) {
  const cc = set.currency_code || "EUR";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:border-gray-200 hover:shadow-md">
      <Link
        href={`/sets/${set.slug}`}
        aria-label={set.name}
        className="bg-surface-alt relative block aspect-[4/3] overflow-hidden"
      >
        {set.image ? (
          <Image
            src={set.image}
            alt={set.name}
            width={600}
            height={450}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">Kein Bild</div>
        )}
        {set.savings_percent > 0 && (
          <span className="bg-accent absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow">
            −{set.savings_percent}&nbsp;%
          </span>
        )}
      </Link>

      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
        <Link href={`/sets/${set.slug}`}>
          <h3 className="group-hover:text-primary line-clamp-2 text-base font-semibold text-gray-900 transition">
            {set.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500">{set.components.length} Produkte</p>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-primary text-xl font-bold">{formatCents(set.set_price, cc)}</span>
            {set.savings > 0 && (
              <span className="text-sm text-gray-400 line-through">
                {formatCents(set.components_sum, cc)}
              </span>
            )}
          </div>
          {set.savings > 0 && (
            <p className="text-accent text-sm font-medium">Sie sparen {formatCents(set.savings, cc)}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">inkl. MwSt.</p>
          <AddSetButton setId={set.id} available={set.available} className="mt-3 w-full" />
        </div>
      </div>
    </article>
  );
}
