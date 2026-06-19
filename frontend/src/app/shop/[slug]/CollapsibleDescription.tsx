"use client";

import { useState } from "react";

interface CollapsibleDescriptionProps {
  html: string;
}

/**
 * Long product description – fully visible on desktop, collapsed on mobile
 * behind a "Mehr erfahren" button with a fade-out hint.
 */
export function CollapsibleDescription({ html }: CollapsibleDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className={`relative overflow-hidden lg:max-h-none ${expanded ? "" : "max-h-72"}`}>
        <div
          className="product-html-content max-w-none leading-relaxed text-gray-600 [&_p]:mb-4 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!expanded && (
          <div
            className="from-surface pointer-events-none absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t to-transparent lg:hidden"
            aria-hidden
          />
        )}
      </div>
      <div className="mt-4 flex justify-center lg:hidden">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="border-primary text-primary hover:bg-primary/5 rounded-lg border bg-white px-6 py-2.5 text-sm font-semibold transition"
        >
          {expanded ? "Weniger anzeigen" : "Mehr erfahren"}
        </button>
      </div>
    </div>
  );
}
