const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.79c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z";

const SIZE = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" } as const;

interface StarRatingProps {
  /** 0..5, fractional allowed */
  rating: number;
  /** Optional review count, shown as "(n)" when showCount */
  count?: number;
  size?: keyof typeof SIZE;
  showCount?: boolean;
  className?: string;
}

function Row({ cls }: { cls: string }) {
  return (
    <span className="flex">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={cls} fill="currentColor" aria-hidden="true">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

/** Accessible read-only star rating with fractional fill (gold over grey). */
export function StarRating({ rating, count, size = "md", showCount = true, className = "" }: StarRatingProps) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const pct = (r / 5) * 100;
  const cls = SIZE[size];
  const label =
    count != null
      ? `Bewertung ${r.toFixed(1)} von 5 bei ${count} ${count === 1 ? "Bewertung" : "Bewertungen"}`
      : `Bewertung ${r.toFixed(1)} von 5`;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="relative inline-block leading-none" role="img" aria-label={label}>
        <span className="text-gray-200">
          <Row cls={cls} />
        </span>
        <span className="absolute inset-0 overflow-hidden text-amber-400" style={{ width: `${pct}%` }}>
          <Row cls={cls} />
        </span>
      </span>
      {showCount && count != null && <span className="text-sm text-gray-500">({count})</span>}
    </span>
  );
}
