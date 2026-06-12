"use client";

import { useRouter } from "next/navigation";
import { SORT_OPTIONS, type SortKey } from "@/lib/shop-filters";

interface SortSelectProps {
  sort: SortKey;
  /** Current filter/search params to preserve (page is always reset) */
  baseParams: Record<string, string>;
}

export function SortSelect({ sort, baseParams }: SortSelectProps) {
  const router = useRouter();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as SortKey;
    const sp = new URLSearchParams(baseParams);
    sp.delete("page");
    if (value) sp.set("sort", value);
    else sp.delete("sort");
    const qs = sp.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="shop-sort" className="text-sm font-medium text-gray-500">
        Sortierung:
      </label>
      <select
        id="shop-sort"
        value={sort}
        onChange={onChange}
        className="focus:border-primary focus:ring-primary/30 cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.key || "standard"} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
