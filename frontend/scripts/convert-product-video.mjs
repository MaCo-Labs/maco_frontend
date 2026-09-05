import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

// Driver's Diary screen recording -> the phone-mockup's looping video.
// Source is a raw Android screen capture: crop off the status bar (it
// carries the recorder app's own red-dot/timer pill, per the request not
// to show "the screen record part"), downscale from a 1746-wide capture to
// phone-mockup screen size, drop audio and framerate nobody needs for a UI
// scroll, and mux both a webm and an mp4 to match every other video asset
// on the site (ProductVideo picks whichever the browser supports).

const SRC = path.resolve(import.meta.dirname, "../src/assets/DD.mp4");
const OUT_DIR = path.resolve(import.meta.dirname, "../public/media/products/drivers-diary");
const CROP = "crop=1746:3648:0:192"; // drop the top 192px status-bar strip
const SCALE = "scale=540:-2";

await mkdir(OUT_DIR, { recursive: true });

function ff(args) {
  execFileSync(ffmpegPath, args, { stdio: "inherit" });
}

ff([
  "-y",
  "-i",
  SRC,
  "-vf",
  `${CROP},${SCALE}`,
  "-an",
  "-r",
  "30",
  "-c:v",
  "libx264",
  "-preset",
  "medium",
  "-crf",
  "26",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  path.join(OUT_DIR, "screen.mp4"),
]);

ff([
  "-y",
  "-i",
  SRC,
  "-vf",
  `${CROP},${SCALE}`,
  "-an",
  "-r",
  "30",
  "-c:v",
  "libvpx-vp9",
  "-crf",
  "34",
  "-b:v",
  "0",
  "-deadline",
  "good",
  "-cpu-used",
  "2",
  path.join(OUT_DIR, "screen.webm"),
]);

ff([
  "-y",
  "-i",
  SRC,
  "-vf",
  `${CROP},${SCALE}`,
  "-frames:v",
  "1",
  "-update",
  "1",
  path.join(OUT_DIR, "screen-poster.webp"),
]);

console.log("done ->", OUT_DIR);
