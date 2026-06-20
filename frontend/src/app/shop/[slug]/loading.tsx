/**
 * Route-level loading skeleton for the product detail page (P2-18a → §3.10).
 *
 * Mirrors the PDP layout (breadcrumb · gallery 30% / details) so navigating to
 * a product gives immediate feedback instead of freezing the previous page.
 * The pulse is neutralised under prefers-reduced-motion by globals.css.
 */
export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <span className="sr-only" role="status">
        Produkt wird geladen…
      </span>
      <div aria-hidden className="animate-pulse">
        {/* Breadcrumb */}
        <div className="mb-6 h-4 w-64 rounded bg-gray-200" />

        <div className="grid gap-8 lg:grid-cols-[30%_1fr]">
          {/* Gallery */}
          <div>
            <div className="bg-surface-alt aspect-[5/7] w-full rounded-2xl" />
            <div className="mt-4 flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-alt h-16 w-12 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="h-9 w-3/4 rounded bg-gray-200" />
            <div className="mt-4 h-7 w-40 rounded bg-gray-200" />
            <div className="mt-5 space-y-2">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
            </div>
            {/* Attribute box */}
            <div className="mt-6 h-20 w-full rounded-xl bg-gray-100" />
            {/* Buy button */}
            <div className="mt-6 h-12 w-full max-w-xs rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
