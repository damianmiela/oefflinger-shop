import { test } from "node:test";
import assert from "node:assert/strict";
import type { ProductAttribute } from "@/types";
import {
  formatBasePrice,
  formatCents,
  formatEuros,
  parseVolumeMl,
  volumeFromAttributes,
} from "../format.ts";

// Intl puts a no-break space before "€"; compare with plain spaces.
const plain = (s: string | null) => s?.replace(/\s/g, " ") ?? null;

test("formatCents formats minor units the German way", () => {
  assert.equal(plain(formatCents(4350)), "43,50 €");
  assert.equal(plain(formatCents("123456")), "1.234,56 €");
  assert.equal(formatCents("not a number"), "");
});

test("formatEuros formats major units", () => {
  assert.equal(plain(formatEuros("43.5")), "43,50 €");
  assert.equal(plain(formatEuros(0)), "0,00 €");
  assert.equal(formatEuros(Number.NaN), "");
});

test("parseVolumeMl reads ml and litres, with comma or dot", () => {
  assert.equal(parseVolumeMl("500ml"), 500);
  assert.equal(parseVolumeMl(" 500 ML "), 500);
  assert.equal(parseVolumeMl("0,5 l"), 500);
  assert.equal(parseVolumeMl("1L"), 1000);
  assert.equal(parseVolumeMl("0 ml"), null);
  assert.equal(parseVolumeMl("500 g"), null);
  assert.equal(parseVolumeMl("groß"), null);
});

test("volumeFromAttributes finds the volume in a size attribute", () => {
  const attrs: ProductAttribute[] = [
    { name: "Konzentration", options: ["10 ppm"] },
    { name: "Größe", options: ["groß", "250 ml"] },
  ];
  assert.equal(volumeFromAttributes(attrs), 250);
  assert.equal(volumeFromAttributes([{ name: "Inhalt", value: "0,5 l" }]), 500);
  assert.equal(volumeFromAttributes([{ name: "Farbe", options: ["500ml"] }]), null);
  assert.equal(volumeFromAttributes(undefined), null);
});

test("formatBasePrice gives the legal price per litre (PAngV)", () => {
  assert.equal(plain(formatBasePrice(4350, 500)), "87,00 € / 1 l");
  assert.equal(plain(formatBasePrice("1990", 100)), "199,00 € / 1 l");
  assert.equal(formatBasePrice(4350, null), null);
  assert.equal(formatBasePrice(0, 500), null);
});
