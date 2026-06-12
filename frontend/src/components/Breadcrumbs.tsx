import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Brotkrumen-Navigation" className={`text-sm text-gray-500 ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-primary transition">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="truncate font-medium text-gray-700">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden className="text-gray-300">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
