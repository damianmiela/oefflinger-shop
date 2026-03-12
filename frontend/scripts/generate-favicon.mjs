#!/usr/bin/env node
/**
 * Generates square favicons from the logo by adding white padding (letterboxing).
 * Run: node scripts/generate-favicon.mjs
 */

import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const input = join(root, "public", "logo", "logo-wb.png");
const outputIcon = join(root, "src", "app", "icon.png");
const outputAppleIcon = join(root, "src", "app", "apple-icon.png");

async function main() {
  const image = sharp(input);
  const { width, height } = await image.metadata();

  const size = Math.max(width, height);
  const top = Math.floor((size - height) / 2);
  const bottom = size - height - top;
  const left = Math.floor((size - width) / 2);
  const right = size - width - left;

  const square = await image
    .extend({
      top,
      bottom,
      left,
      right,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();

  await sharp(square).toFile(outputIcon);
  await sharp(square).toFile(outputAppleIcon);

  console.log(`Favicons generated: ${size}x${size} (icon.png, apple-icon.png)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
