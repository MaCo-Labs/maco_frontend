#!/usr/bin/env node
// Writes an N-800.webp next to every public/media/work/<slug>/N.webp, for the
// srcset in src/lib/responsive-image.ts. Re-run after adding work screenshots.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../public/media/work", import.meta.url));
for (const slug of readdirSync(root)) {
  for (const file of readdirSync(join(root, slug))) {
    if (!/^\d+\.webp$/.test(file)) continue;
    const target = join(root, slug, file.replace(".webp", "-800.webp"));
    await sharp(join(root, slug, file)).resize({ width: 800 }).webp({ quality: 78 }).toFile(target);
  }
}
