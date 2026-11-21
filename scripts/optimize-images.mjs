/**
 * scripts/optimize-images.mjs
 * Reads public/images/*.{jpg,jpeg,png,webp}
 * Outputs to public/images/optimized/:
 *   - <name>.webp  (max 1600px wide, quality 82)
 *   - <name>-placeholder.webp  (24px wide, blurred — for LQIP fade-in)
 */

import { createRequire } from "module";
import { readdirSync, mkdirSync, existsSync } from "fs";
import { join, basename, extname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const sharp   = require("sharp");

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SRC_DIR   = join(__dirname, "../public/images");
const OUT_DIR   = join(__dirname, "../public/images/optimized");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const files = readdirSync(SRC_DIR).filter((f) => {
  const ext = extname(f).toLowerCase();
  return EXTENSIONS.has(ext) && !f.startsWith(".");
});

if (files.length === 0) {
  console.log("No source images found in public/images/ — skipping.");
  process.exit(0);
}

for (const file of files) {
  const src  = join(SRC_DIR, file);
  const name = basename(file, extname(file));
  const outFull        = join(OUT_DIR, `${name}.webp`);
  const outPlaceholder = join(OUT_DIR, `${name}-placeholder.webp`);

  try {
    // Full-res WebP — max 1600px wide, keep aspect ratio
    await sharp(src)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(outFull);

    // Blurred LQIP — 24px wide
    await sharp(src)
      .resize({ width: 24 })
      .blur(4)
      .webp({ quality: 20 })
      .toFile(outPlaceholder);

    // Log dimensions of full output
    const meta = await sharp(outFull).metadata();
    console.log(`✓  ${file}  →  ${meta.width}×${meta.height}  (${name}.webp + ${name}-placeholder.webp)`);
  } catch (err) {
    console.error(`✗  ${file}: ${err.message}`);
  }
}

console.log("\nDone — optimized files are in public/images/optimized/");
