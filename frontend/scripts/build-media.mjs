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
//    at 1s/3s resolution rather than guessed.
//
//    Source is 1984x1024 (DAR 31:16, ~1.9375 — NOT 16:9) with a stereo
//    AAC track. An earlier 1024x576 source was swapped out for this one;
//    every consumer of these outputs derives its box from ASPECT below,
//    so the ratio lives here and nowhere else.
//
//    Two encodes, deliberately:
//      capture.*  1280 wide, silent  — the inline scroll-scrub frame.
//                 Loads on scroll, so it stays lean; ProductVideo mutes
//                 it anyway (autoplay policy), making the audio track
//                 pure waste on that path.
//      feature.*  1920 wide, WITH audio — the fullscreen lightbox only.
//                 Never fetched until the viewer clicks to expand, so it
//                 can afford the bitrate and the soundtrack.
// ---------------------------------------------------------------------
const src = path.join(root, "src", "assets", "Bridge Demo.mp4");
const IN = "4";
const DURATION = "26"; // -> 30s out point
const INLINE_W = 1280;
const FEATURE_W = 1920;

if (!existsSync(src)) {
  console.error(`Missing source video: ${src}`);
  process.exit(1);
}

/** VP9/WebM + H.264/MP4 pair at one width. `audio: false` drops the track. */
function encodePair(width, base, audio) {
  const vf = `scale=${width}:-2,format=yuv420p`;
  run(
    [
      "-y",
      "-ss",
      IN,
      "-t",
      DURATION,
      "-i",
      src,
      ...(audio ? ["-c:a", "libopus", "-b:a", "96k"] : ["-an"]),
      "-vf",
      vf,
      "-c:v",
      "libvpx-vp9",
      "-crf",
      "36",
      "-b:v",
      "0",
      "-deadline",
      "good",
      "-cpu-used",
      "2",
      path.join(outVideo, `${base}.webm`),
    ],
    `bridge/${base}.webm (VP9${audio ? " + Opus" : ", silent"})`,
  );

  run(
    [
      "-y",
      "-ss",
      IN,
      "-t",
      DURATION,
      "-i",
      src,
      ...(audio ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"]),
      "-vf",
      vf,
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "24",
      "-profile:v",
      "high",
      "-movflags",
      "+faststart",
      path.join(outVideo, `${base}.mp4`),
    ],
    `bridge/${base}.mp4 (H.264${audio ? " + AAC" : ", silent"}, Safari fallback)`,
  );
}

encodePair(INLINE_W, "capture", false);
encodePair(FEATURE_W, "feature", true);

// Poster: 1s into the trimmed segment (clean dashboard frame, no cursor
// mid-drag) — matches the video's first visible frame so there's no
// poster->video jump cut. Sized to the inline encode, since that's the
// element it sits behind.
run(
  [
    "-y",
    "-ss",
    String(Number(IN) + 1),
    "-i",
    src,
    "-frames:v",
    "1",
    "-vf",
    `scale=${INLINE_W}:-2`,
    path.join(outVideo, "poster.jpg"),
  ],
  "bridge/poster.jpg",
);
run(
  [
    "-y",
    "-i",
    path.join(outVideo, "poster.jpg"),
    "-c:v",
    "libaom-av1",
    "-crf",
    "32",
    "-b:v",
    "0",
    "-still-picture",
    "1",
    path.join(outVideo, "poster.avif"),
  ],
  "bridge/poster.avif",
);
run(
  [
    "-y",
    "-i",
    path.join(outVideo, "poster.jpg"),
    "-c:v",
    "libwebp",
    "-quality",
    "82",
    path.join(outVideo, "poster.webp"),
  ],
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

  run(
    ["-y", "-i", inPath, "-vf", vf, "-c:v", "libwebp", "-lossless", "0", "-q:v", "90", outPath],
    `brand/${job.out}`,
  );
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
