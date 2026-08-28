#!/usr/bin/env node
/**
 * The live-browser QA gate AGENTS.md §27/§28 mandates, as a repeatable
 * script instead of an ad-hoc MCP flow re-derived every session. Walks
 * every homepage section across the 7 widths AGENTS.md §22 names (1440,
 * 1280, 1024, 768, 430, 390, 375) and both themes, writing one screenshot
 * per section and a console.json of any errors seen.
 *
 * Deliberately no full-page (fullPage: true) composite shot — see the
 * comment at its former call site (removed) for why: it hangs on this
 * site specifically, because Chromium's fullPage capture temporarily
 * resizes the viewport to the full document height, and OPEN's
 * `min-h-[100svh]` hero resolves against that, forcing PrismField's WebGL
 * shader to size its canvas to match. Per-section shots already give full
 * coverage without touching that path.
 *
 * Run: bun run shoot
 * Targeted re-shoot: bun run shoot -- --theme=cobalt --width=390 --section="Products"
 *
 * Requires a server already running — point --url at it. Defaults to
 * `bun run preview`'s port (4173), not the dev server: AI_HANDOFF.md
 * records that prior passes found bugs that only reproduced against a
 * production build.
 *
 * Sections identified by their real aria-label (routes/index.tsx), not by
 * component name — this is what a screen reader sees, and it's stable
 * across refactors that rename files but not sections.
 */
import { mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// AGENTS.md §22's exact list.
const WIDTHS = [1440, 1280, 1024, 768, 430, 390, 375];
const THEMES = ["obsidian", "cobalt"];

// aria-label -> filename slug, in document order (routes/index.tsx). Reordered
// 2026-08-28 for the Cuberto-parity twelve-slot structure — same eleven
// labels, new document order, new component per label.
const SECTIONS = [
  ["Introduction", "01-tophead"],
  ["Bridge in motion", "02-preview"],
  ["What MaCo does", "03-overview"],
  ["Capabilities", "04-feature"],
  ["Who we work with", "05-logoreel"],
  ["Selected client work", "06-featured-work"],
  ["Products", "07-product-summary"],
  ["MaCo, in one name and many scripts", "08-identity"],
  ["About MaCo", "09-record"],
  ["How MaCo works", "10-faq"],
  ["Start a project", "11-outro"],
];

function parseArgs(argv) {
  const args = { url: "http://localhost:4173", theme: null, width: null, section: null };
  for (const raw of argv) {
    const [key, value] = raw.replace(/^--/, "").split("=");
    if (key in args) args[key] = value;
  }
  return args;
}

async function settleScroll(page, el) {
  // Real wheel-driven scroll, not page.evaluate(() => window.scrollTo()) or
  // element.scrollIntoView() — this project's own verified history (the
  // removeChild pin-fix pass) found raw scrollTo fights Lenis's smoothing
  // and gives false readings for GSAP ScrollTrigger pins/scrubs.
  const box = await el.boundingBox();
  if (!box) return;

  // Lower bound tightened from -rect.height (2026-08-28): on a short
  // section, "any pixel still visible" let it settle with only a sliver
  // near the bottom of the viewport — technically in range, but a
  // useless capture. -200 biases toward the section's actual entrance
  // while still tolerating a pinned section's transform holding its top
  // well past 80 for its whole scrub range.
  const inRange = (rect) => rect.top <= 80 && rect.top > -200;
  const readRect = () =>
    el.evaluate((node) => {
      const r = node.getBoundingClientRect();
      return { top: r.top, height: r.height };
    });

  // Outer bounded retry: on the Cuberto-parity page's shorter, un-pinned
  // sections (2026-08-28), Lenis's smoothing means the wheel-step loop
  // below can still be coasting when it exits, and that coast is
  // sometimes enough on its own to carry a short section fully past the
  // viewport before it stops — a single fixed-size correction wasn't
  // reliably enough to recover from that (measured overshoot exceeded a
  // flat 300px correction in testing). Instead, re-run the same
  // step-until-in-range logic — which re-measures and re-aims every
  // iteration — until the settled position actually holds.
  for (let attempt = 0; attempt < 3; attempt++) {
    let guard = 0;
    while (guard++ < 40) {
      const rect = await readRect();
      // Good enough once the section's top has entered the viewport's
      // upper half — pinned sections hold there for their whole scrub range.
      if (inRange(rect)) break;
      const delta = rect.top > 80 ? 400 : -400;
      await page.mouse.wheel(0, delta);
      await page.waitForTimeout(60);
    }

    // Poll for actual stability instead of trusting a fixed wait — GSAP
    // scrub tweens and Lenis's own inertia both keep moving the element
    // for a beat after wheel input stops.
    let prev = await readRect();
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(100);
      const cur = await readRect();
      if (Math.abs(cur.top - prev.top) < 1) break;
      prev = cur;
    }

    if (inRange(await readRect())) return;
    // Still out of range after settling (inertia carried past the target
    // during the step loop itself) — loop back and re-aim from wherever
    // it actually landed, rather than a single fixed-size nudge.
  }
}

async function shootElement(page, el, filePath, viewport) {
  // page.screenshot({clip}), not locator.screenshot(): the latter's
  // actionability check waits for the element's bounding box to stop
  // moving between frames, which times out at 30s on every section with
  // an ambient float, pin-scrub, or crossfade still running while it's in
  // view (CLIENTS' float, CAPABILITY's pin, PRODUCTS' crossfade all do this
  // by design). A clip-based page screenshot has no such wait.
  const box = await el.boundingBox();
  if (!box) throw new Error("element has no bounding box (hidden or zero-size)");

  // boundingBox() is viewport-relative and can exceed the viewport (e.g.
  // PRODUCTS' <section> wraps a 300vh scroll-stage — the whole element is
  // never on screen at once). page.screenshot's clip must stay inside the
  // viewport, so clamp to what's actually visible at the settled scroll
  // position — which is also the more honest capture: what a visitor sees.
  const top = Math.max(0, box.y);
  const bottom = Math.min(viewport.height, box.y + box.height);
  const left = Math.max(0, box.x);
  const right = Math.min(viewport.width, box.x + box.width);
  const clip = { x: left, y: top, width: right - left, height: bottom - top };
  if (clip.width <= 0 || clip.height <= 0) {
    throw new Error("element is entirely outside the viewport after settling scroll");
  }
  await page.screenshot({ path: filePath, clip });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const widths = args.width ? [Number(args.width)] : WIDTHS;
  const themes = args.theme ? [args.theme] : THEMES;
  const sections = args.section ? SECTIONS.filter(([label]) => label === args.section) : SECTIONS;
  if (args.section && sections.length === 0) {
    console.error(`No section matches "${args.section}". Valid labels:`);
    for (const [label] of SECTIONS) console.error(`  ${label}`);
    process.exit(1);
  }

  const date = new Date().toISOString().slice(0, 10);
  const outRoot = path.join(root, "..", "audit", date);

  const browser = await chromium.launch();
  let shotCount = 0;

  for (const theme of themes) {
    for (const width of widths) {
      const dir = path.join(outRoot, `${theme}-${width}`);
      mkdirSync(dir, { recursive: true });

      const context = await browser.newContext({ viewport: { width, height: 900 } });
      // Set theme via the real localStorage key (theme.tsx) before first
      // paint — clicking the toggle would capture a mid-transition frame.
      await context.addInitScript((t) => {
        window.localStorage.setItem("maco-theme", t);
      }, theme);

      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => consoleErrors.push(err.message));

      const t = (label) => process.env.SHOOT_DEBUG && console.error(`[${Date.now()}] ${label}`);

      t("goto start");
      await page.goto(args.url, { waitUntil: "networkidle" });
      t("goto done");
      await page.waitForTimeout(600);

      for (const [label, slug] of sections) {
        t(`section "${label}" start`);
        const el = page.locator(`[aria-label="${label}"]`).first();
        const count = await el.count();
        if (count === 0) {
          consoleErrors.push(`section not found: aria-label="${label}"`);
          continue;
        }
        await settleScroll(page, el);
        t(`section "${label}" settled`);
        await shootElement(page, el, path.join(dir, `${slug}.png`), { width, height: 900 }).catch(
          (err) => {
            consoleErrors.push(`screenshot failed for "${label}": ${err.message}`);
          },
        );
        t(`section "${label}" shot`);
        shotCount++;
      }

      // No full-page (fullPage: true) composite shot: Chromium implements
      // it by temporarily resizing the viewport to the full document
      // height (~20,000px on this page) to composite one image. OPEN's
      // hero is sized with `min-h-[100svh]`, so that CSS unit resolves
      // against the artificially huge viewport during capture, forcing
      // PrismField's WebGL canvas (a 100-step raymarched shader per pixel,
      // prism-field.tsx) to resize to a canvas potentially 20,000px tall —
      // confirmed via SHOOT_DEBUG timing: it consistently hung at exactly
      // this step, independent of theme/width/section filter. The 11
      // per-section shots above already cover every section's content;
      // this was a redundant composite, not a requirement (AGENTS.md §22
      // asks for per-section coverage, not one stitched image).

      await writeFile(path.join(dir, "console.json"), JSON.stringify(consoleErrors, null, 2));
      if (consoleErrors.length > 0) {
        console.log(`  [${theme}-${width}] ${consoleErrors.length} console issue(s)`);
      }

      await context.close();
      console.log(`done: ${theme}-${width}`);
    }
  }

  await browser.close();
  console.log(`\n${shotCount} screenshots written to ${path.relative(process.cwd(), outRoot)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
