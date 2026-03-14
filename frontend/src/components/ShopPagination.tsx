import Link from "next/link";

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function ShopPagination({
  currentPage,
  totalPages,
  basePath = "/shop",
}: ShopPaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const pageHref = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2"
      aria-label="Produktseiten"
    >
      {prevPage ? (
        <Link
          href={pageHref(prevPage)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Zurück
        </Link>
      ) : (
        <span
          className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400"
          aria-disabled
        >
          ← Zurück
        </span>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isCurrent = page === currentPage;
          return (
            <Link
              key={page}
              href={pageHref(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                isCurrent
                  ? "bg-primary text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
              aria-current={isCurrent ? "page" : undefined}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {nextPage ? (
        <Link
          href={pageHref(nextPage)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Weiter →
        </Link>
      ) : (
        <span
          className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400"
          aria-disabled
        >
          Weiter →
        </span>
      )}
    </nav>
  );
}
