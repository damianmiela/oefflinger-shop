/**
 * Route-level loading skeleton for the shop list (P2-18a → §3.10).
 *
 * Shown while the (uncached, dynamic) /shop server component renders, so first
 * load and pagination give immediate feedback instead of freezing the previous
 * page. The pulse is automatically neutralised under prefers-reduced-motion by
 * the global reset in globals.css.
 */
function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="bg-surface-alt aspect-[5/7]" />
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-6">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="mt-auto h-5 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <span className="sr-only" role="status">
        Produkte werden geladen…
      </span>
      <div aria-hidden className="animate-pulse">
        {/* Heading + intro */}
        <div className="mb-6 h-8 w-56 rounded bg-gray-200" />
        <div className="mb-2 h-4 w-full max-w-3xl rounded bg-gray-200" />
        <div className="mb-8 h-4 w-2/3 max-w-2xl rounded bg-gray-200" />

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-gray-200" />
          ))}
        </div>

        {/* Product grid (mirrors the real grid columns) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
