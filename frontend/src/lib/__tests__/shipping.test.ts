import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateShippingCents, missingForFreeShipping } from "../shipping.ts";

test("shipping is free from 100 €, otherwise 4,90 €", () => {
  assert.equal(estimateShippingCents(9_999), 490);
  assert.equal(estimateShippingCents(10_000), 0);
  assert.equal(estimateShippingCents(25_000), 0);
});

test("missingForFreeShipping counts down to zero and never goes negative", () => {
  assert.equal(missingForFreeShipping(9_000), 1_000);
  assert.equal(missingForFreeShipping(10_000), 0);
  assert.equal(missingForFreeShipping(12_000), 0);
});
