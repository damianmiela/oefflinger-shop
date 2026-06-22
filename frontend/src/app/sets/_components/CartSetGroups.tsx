"use client";

/**
 * Renders the cart's line items with set members grouped into one highlighted
 * block per set instance (header + members), and a clear message when a set was
 * changed so its discount dropped (dissolved). Standalone items render as normal
 * CartItems. Used by the cart page and the mini-cart drawer so both share the
 * same grouped rendering.
 */
import Link from "next/link";
import { CartItem } from "@/components/CartItem";
import type { CartItemData } from "@/types";

type Block =
  | { type: "item"; item: CartItemData }
  | {
      type: "set";
      instance: string;
      name: string;
      slug: string;
      setType: string;
      percent: number;
      dissolved: boolean;
      members: CartItemData[];
    };

export function CartSetGroups({
  items,
  volumes,
}: {
  items: CartItemData[];
  volumes?: Record<number, number | null>;
}) {
  const blocks: Block[] = [];
  const indexByInstance = new Map<string, number>();

  for (const item of items) {
    const ext = item.extensions?.oeff_sets;
    if (ext?.is_set_member && ext.instance) {
      const at = indexByInstance.get(ext.instance);
      if (at === undefined) {
        blocks.push({
          type: "set",
          instance: ext.instance,
          name: ext.name || "Set",
          slug: ext.slug || "",
          setType: ext.type || "fixed",
          percent: ext.percent || 0,
          dissolved: ext.dissolved,
          members: [item],
        });
        indexByInstance.set(ext.instance, blocks.length - 1);
      } else {
        (blocks[at] as Extract<Block, { type: "set" }>).members.push(item);
      }
    } else {
      blocks.push({ type: "item", item });
    }
  }

  const volumeMl = (id: number) => volumes?.[id] ?? null;

  return (
    <div className="divide-y divide-gray-100">
      {blocks.map((block) => {
        if (block.type === "item") {
          return (
            <CartItem key={block.item.key} item={block.item} volumeMl={volumeMl(block.item.id)} />
          );
        }
        return (
          <div key={block.instance} className={block.dissolved ? "bg-amber-50" : "bg-primary/5"}>
            <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-1">
              {block.slug ? (
                <Link
                  href={`/sets/${block.slug}`}
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  {block.name}
                </Link>
              ) : (
                <span className="text-sm font-semibold text-gray-900">{block.name}</span>
              )}
              <span
                className={`shrink-0 text-xs font-medium ${
                  block.dissolved ? "text-amber-700" : "text-primary"
                }`}
              >
                {block.dissolved
                  ? "Set-Rabatt entfernt"
                  : block.setType === "configurable"
                    ? block.percent > 0
                      ? `Mengenrabatt −${Math.round(block.percent)} %`
                      : "Kein Mengenrabatt"
                    : "Set-Preis aktiv"}
              </span>
            </div>
            {block.dissolved && (
              <p className="px-4 pb-2 text-xs text-amber-700">
                Ein Artikel des Sets wurde geändert oder entfernt – der Set-Rabatt wurde aufgehoben.
              </p>
            )}
            <div className="divide-y divide-gray-100">
              {block.members.map((m) => (
                <CartItem key={m.key} item={m} volumeMl={volumeMl(m.id)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
