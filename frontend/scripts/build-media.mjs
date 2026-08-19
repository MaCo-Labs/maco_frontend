#!/usr/bin/env node
/**
 * One-time/dev-only media pipeline. Never imported by app code, never
 * shipped to the client — `ffmpeg-static` is a devDependency only.
 *
 * Run: npm run media
 *
 * Produces, into frontend/public/media/:
 *   bridge/capture.webm  bridge/capture.mp4  bridge/poster.jpg  bridge/poster.avif
 *   brand/ananta.webp  brand/al-afzah.webp  brand/soorath.webp
 *   brand/headgreen.webp  brand/bridge.webp  brand/drivers-diary.webp
 *
 * See HOMEPAGE_REDESIGN_PLAN.md / the "Real Media, Density & Motion" plan
 * for why each source needs the treatment it gets here (baked-in mattes
 * on Ananta/Bridge, oversized originals, the video trim window).
 */
import { existsSync, mkdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const pub = path.join(root, "public");
const outVideo = path.join(pub, "media", "bridge");
const outBrand = path.join(pub, "media", "brand");

for (const dir of [outVideo, outBrand]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function run(args, label) {
  console.log(`\n--- ${label} ---`);
  console.log([ffmpegPath, ...args].map((a) => (a.includes(" ") ? `"${a}"` : a)).join(" "));
  execFileSync(ffmpegPath, args, { stdio: "inherit" });
}

function size(p) {
  const kb = statSync(p).size / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(0)} KB`;
}

// ---------------------------------------------------------------------
// 1. Bridge product recording — trimmed 4s-30s (dashboard -> calendar ->
//    tasks kanban): a coherent arc, chosen by reviewing extracted frames
//    at 1s/3s resolution rather than guessed. Source is 1024x576; kept
//    at source resolution since it's already compact.
// ---------------------------------------------------------------------
const src = path.join(root, "src", "assets", "Bridge Demo.mp4");
const IN = "4";
const DURATION = "26"; // -> 30s out point

if (!existsSync(src)) {
  console.error(`Missing source video: ${src}`);
  process.exit(1);
}

run(
  [
    "-y",
    "-ss", IN,
    "-t", DURATION,
    "-i", src,
    "-an",
    "-vf", "scale=1024:-2,format=yuv420p",
    "-c:v", "libvpx-vp9",
    "-crf", "36",
    "-b:v", "0",
    "-deadline", "good",
    "-cpu-used", "2",
    path.join(outVideo, "capture.webm"),
  ],
  "bridge/capture.webm (VP9)",
);

run(
  [
    "-y",
    "-ss", IN,
    "-t", DURATION,
    "-i", src,
    "-an",
    "-vf", "scale=1024:-2,format=yuv420p",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "24",
    "-profile:v", "high",
    "-movflags", "+faststart",
    path.join(outVideo, "capture.mp4"),
  ],
  "bridge/capture.mp4 (H.264, Safari fallback)",
);

// Poster: 1s into the trimmed segment (clean dashboard frame, no cursor
// mid-drag) — matches the video's first visible frame so there's no
// poster->video jump cut.
run(
  ["-y", "-ss", String(Number(IN) + 1), "-i", src, "-frames:v", "1", "-vf", "scale=1024:-2", path.join(outVideo, "poster.jpg")],
  "bridge/poster.jpg",
);
run(
  ["-y", "-i", path.join(outVideo, "poster.jpg"), "-c:v", "libaom-av1", "-crf", "32", "-b:v", "0", "-still-picture", "1", path.join(outVideo, "poster.avif")],
  "bridge/poster.avif",
);
run(
  ["-y", "-i", path.join(outVideo, "poster.jpg"), "-c:v", "libwebp", "-quality", "82", path.join(outVideo, "poster.webp")],
  "bridge/poster.webp",
);

// ---------------------------------------------------------------------
// 2. Client / product logos. Two sources bake in an opaque matte and
//    need a luma key before resizing; the rest just need resizing +
//    WebP re-encoding (they're wildly oversized for UI use).
// ---------------------------------------------------------------------
const brandJobs = [
  // [source filename in public/, output name, target long-edge px, keying]
  { src: "Ananta Nethralaya.png", out: "ananta.webp", w: 640, key: "black" },
  { src: "Bridge.png", out: "bridge.webp", w: 640, key: "white" },
  { src: "Al-Afzah.png", out: "al-afzah.webp", w: 500 },
  { src: "Soorath Autos.png", out: "soorath.webp", w: 500 },
  { src: "Headgreen!.png", out: "headgreen.webp", w: 500 },
  { src: "Driver's Dairy.png", out: "drivers-diary.webp", w: 900 },
];

for (const job of brandJobs) {
  const inPath = path.join(pub, job.src);
  if (!existsSync(inPath)) {
    console.warn(`SKIP (not found): ${inPath}`);
    continue;
  }
  const outPath = path.join(outBrand, job.out);

  let vf;
  if (job.key === "black") {
    // Proportional luma key: treat near-black as transparent, keep
    // partial alpha at the anti-aliased edge instead of a hard cut.
    vf = `format=rgba,colorkey=0x000000:0.22:0.12,scale=${job.w}:-1`;
  } else if (job.key === "white") {
    vf = `format=rgba,colorkey=0xffffff:0.16:0.10,scale=${job.w}:-1`;
  } else {
    vf = `scale=${job.w}:-1`;
  }

  run(["-y", "-i", inPath, "-vf", vf, "-c:v", "libwebp", "-lossless", "0", "-q:v", "90", outPath], `brand/${job.out}`);
}

// ---------------------------------------------------------------------
console.log("\n=== Sizes ===");
for (const p of [
  path.join(outVideo, "capture.webm"),
  path.join(outVideo, "capture.mp4"),
  path.join(outVideo, "poster.jpg"),
  path.join(outVideo, "poster.avif"),
  path.join(outVideo, "poster.webp"),
  ...brandJobs.map((j) => path.join(outBrand, j.out)),
]) {
  if (existsSync(p)) console.log(`${path.relative(root, p)}: ${size(p)}`);
}
