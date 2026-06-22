#!/usr/bin/env node
/**
 * Generates the PNG app icons from the square master favicon (scripts/fav.png, 128x128).
 *   - src/app/icon.png        128x128  (native — browser favicon via Next.js)
 *   - src/app/apple-icon.png  180x180  (Apple touch icon)
 *
 * favicon.ico (multi-size 16/32/48) is produced separately with ImageMagick,
 * because sharp cannot write .ico:
 *   convert scripts/fav.png -define icon:auto-resize=48,32,16 src/app/favicon.ico
 *
 * Run: node scripts/generate-favicon.mjs
 */

import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Square master favicon, kept next to this script so the build does not depend
// on the design assets in /_resources.
const input = join(__dirname, "fav.png");
const outputIcon = join(root, "src", "app", "icon.png");
const outputAppleIcon = join(root, "src", "app", "apple-icon.png");

async function main() {
  await sharp(input).resize(128, 128, { kernel: "lanczos3" }).png().toFile(outputIcon);
  await sharp(input).resize(180, 180, { kernel: "lanczos3" }).png().toFile(outputAppleIcon);
  console.log("Favicons generated from fav.png: icon.png (128), apple-icon.png (180)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
