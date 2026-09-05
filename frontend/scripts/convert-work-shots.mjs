import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve(import.meta.dirname, "../src/assets");
const OUT = path.resolve(import.meta.dirname, "../public/media/work");

// slug -> [source filename, output filename][]. First entry is the card's
// primary/poster shot; the rest cycle in the card's crossfade gallery.
const jobs = {
  "ananta-nethralaya": ["AN-scrn-1.png", "AN-scrn-2.png", "AN-scrn-3.png", "AN-scrn-4.png"],
  "al-afzah": ["ALF-scr-1.png", "ALF-scr-2.png", "ALF-scr-4.png", "ALF-scr-5.png", "ALF-scr-6.png"],
  "soorath-autos": ["SA-1.png", "SA-2.png", "SA-3.png", "SA-4.png"],
  headgreen: ["HG-1.png", "HG-2.png", "HG-4.png", "HG-5.png"],
};

for (const [slug, files] of Object.entries(jobs)) {
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  for (let i = 0; i < files.length; i++) {
    const src = path.join(SRC, files[i]);
    const out = path.join(dir, `${i + 1}.webp`);
    const img = sharp(src).resize({ width: 1400, withoutEnlargement: true });
    const meta = await img.metadata();
    await img.webp({ quality: 78 }).toFile(out);
    console.log(slug, i + 1, meta.width, "x", meta.height, "->", out);
  }
}
