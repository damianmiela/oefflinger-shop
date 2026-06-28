import Link from "next/link";
import { getSets } from "../_lib/sets";
import { SetCard } from "./SetCard";

/**
 * Reusable "Sets" row: a heading + the first `limit` sets as cards + a link to
 * the full /sets page. Renders nothing when there are no published sets, so it
 * can be dropped into any server page without leaving an empty block.
 *
 * - On a page that already constrains width (e.g. /shop), use the default.
 * - On a full-bleed page (e.g. home), pass `contained` so it adds its own
 *   max-width container, and use `className` for the section background/padding.
 */
export async function SetsSection({
  limit = 4,
  heading = "Unsere Sets",
  subline = "Mehrere Metalle im Set – günstiger als einzeln.",
  className = "",
  contained = false,
}: {
  limit?: number;
  heading?: string;
  subline?: string;
  className?: string;
  contained?: boolean;
}) {
  let sets;
  try {
    sets = await getSets();
  } catch {
    return null;
  }
  if (!sets || sets.length === 0) return null;

  const shown = sets.slice(0, limit);

  const inner = (
    <>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{heading}</h2>
          <p className="mt-1 text-gray-500">{subline}</p>
        </div>
        <Link
          href="/sets"
          className="text-primary hover:text-primary-light shrink-0 text-sm font-semibold whitespace-nowrap"
        >
          Alle Sets ansehen →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {shown.map((set) => (
          <SetCard key={set.id} set={set} />
        ))}
      </div>
    </>
  );

  return (
    <section className={className}>
      {contained ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{inner}</div>
      ) : (
        inner
      )}
    </section>
  );
}
