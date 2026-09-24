import { test } from "node:test";
import assert from "node:assert/strict";
import type { Product } from "@/types";
import { collectFilterGroups, filterProducts, sortProducts } from "../shop-filters.ts";

// Only the fields the helpers read; the rest of Product doesn't matter here.
const product = (name: string, price: string, size: string, ppm: string) =>
  ({
    name,
    prices: { price },
    attributes: [
      { name: "Größe", options: [size] },
      { name: "Konzentration", options: [ppm] },
    ],
  }) as unknown as Product;

const gold = product("Kolloidales Gold", "2490", "500ml", "10 ppm");
const silber = product("Kolloidales Silber", "1990", "250ml", "100 ppm");
const zink = product("Kolloidales Zink", "990", "500ML", "5 ppm");
const all = [gold, silber, zink];
const names = (list: Product[]) => list.map((p) => p.name);

test("collectFilterGroups sorts values naturally and drops groups with one value", () => {
  assert.deepEqual(collectFilterGroups(all), [
    { param: "groesse", label: "Größe", values: ["250ml", "500ml"] },
    { param: "konzentration", label: "Konzentration", values: ["5 ppm", "10 ppm", "100 ppm"] },
  ]);
  // "500ml" and "500ML" count as one size, so only one group is left.
  assert.deepEqual(
    collectFilterGroups([gold, zink]).map((g) => g.param),
    ["konzentration"],
  );
});

test("filterProducts: OR within a group, AND across groups, name search", () => {
  assert.deepEqual(names(filterProducts(all, "", { groesse: ["500ml"] })), [
    "Kolloidales Gold",
    "Kolloidales Zink",
  ]);
  assert.deepEqual(names(filterProducts(all, "", { konzentration: ["5 ppm", "100 ppm"] })), [
    "Kolloidales Silber",
    "Kolloidales Zink",
  ]);
  assert.deepEqual(filterProducts(all, "", { groesse: ["500ml"], konzentration: ["100 ppm"] }), []);
  assert.deepEqual(names(filterProducts(all, "  GOLD ", {})), ["Kolloidales Gold"]);
});

test("sortProducts compares prices as numbers and leaves the input alone", () => {
  const shuffled = [silber, zink, gold];
  assert.deepEqual(
    sortProducts(shuffled, "preis-auf").map((p) => p.prices.price),
    ["990", "1990", "2490"],
  );
  assert.deepEqual(
    sortProducts(shuffled, "preis-ab").map((p) => p.prices.price),
    ["2490", "1990", "990"],
  );
  assert.deepEqual(names(sortProducts(shuffled, "name")), names(all));
  assert.notEqual(sortProducts(shuffled, ""), shuffled);
  assert.deepEqual(shuffled, [silber, zink, gold]);
});
