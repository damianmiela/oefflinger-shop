import Image from "next/image";
import type { OeffSet } from "../_lib/sets";

/**
 * Set image with an auto-composed fallback. Uses the uploaded set image when
 * present; otherwise lays the set's product photos out side by side on white,
 * so every set has a presentable thumbnail even without a manual upload.
 *
 * Fills its parent — the parent must be `relative` with a defined size/aspect.
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
  if (set.image) {
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

  // No uploaded image: compose from the set's product photos (fixed sets use
  // their components; configurable sets fall back to the category's options).
  const source = set.components.length ? set.components : (set.options ?? []);
  const imgs = source
    .map((c) => c.image)
    .filter((src): src is string => Boolean(src))
    .slice(0, 3);

  if (imgs.length === 0) {
    return (
      <div className="bg-surface-alt flex h-full w-full items-center justify-center text-sm text-gray-400">
        Kein Bild
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white px-[6%] transition duration-300 group-hover:scale-105">
      {imgs.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="relative h-[88%] flex-1"
          style={{ marginLeft: i === 0 ? 0 : "-16%", zIndex: imgs.length - i }}
        >
          <Image src={src} alt="" fill sizes={sizes} priority={priority && i === 0} className="object-contain" />
        </div>
      ))}
    </div>
  );
}
