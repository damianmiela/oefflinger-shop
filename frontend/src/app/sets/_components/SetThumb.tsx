import Image from "next/image";
import type { OeffSet } from "../_lib/sets";

/**
 * Set image. Uses the set's image — either the manually uploaded one or the
 * thumbnail the backend auto-composes from the product photos. Both arrive as a
 * single flat image, so next/image optimizes them normally (no transparency
 * fringing). Fills its parent — the parent must be `relative` with a size/aspect.
 */
export function SetThumb({
  set,
  sizes,
  priority,
}: {
  set: OeffSet;
  sizes?: string;
  priority?: boolean;
}) {
  if (!set.image) {
    return (
      <div className="bg-surface-alt flex h-full w-full items-center justify-center text-sm text-gray-400">
        Kein Bild
      </div>
    );
  }

  return (
    <Image
      src={set.image}
      alt={set.name}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition duration-300 group-hover:scale-105"
    />
  );
}
