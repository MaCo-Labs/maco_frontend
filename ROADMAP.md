# MaCo Website — Roadmap

Tracks the homepage creative reset. Full architecture and rationale: `HOMEPAGE_REDESIGN_PLAN.md`.
Update this file when a phase completes; also update `AI_HANDOFF.md` and `PROJECT_STATUS.md`.

Last updated: 2026-08-19 (edits made 2026-08-18; date rolled over during the session)

---

## Brand Hero & Bug Fix pass (2026-08-18, same-day follow-up, plan: `you-are-working-on-robust-flute.md`)

The Immersive Motion Rebuild below was never verified in a browser before
this pass — this is that verification, done by the user directly, plus the
fixes it surfaced. Full detail in `AI_HANDOFF.md`.

| Item | Status |
|------|--------|
| **Bug found & fixed**: WORK's pin distance (`end`, measured in px) and its rail transform (`-progress*(n-1)*100%`, resolves against the rail's own 4×-viewport width) disagreed by 4× — panels finished at `progress≈0.25`, leaving ~75% of the pin pinned on an empty viewport | DONE — both now derive from the same `rail.scrollWidth - rail.clientWidth` measurement |
| **Bug found & fixed**: METHOD's `ScrollTrigger` was created before WORK's (via `useMediaQuery`'s SSR-safe `false`-then-`true` mount order), measured against a document missing WORK's pin-spacer — METHOD fired early, mid-WORK, leaving a large empty gap where it should have appeared | DONE — `scheduleRefresh()` added to `lib/scroll-runtime.ts`; every scene calls it after creating its trigger, coalescing into one refresh next frame regardless of mount order |
| Hero rebuilt as MaCo's brand alone — real mark (`maco-mark-hero.png`, downsampled from `white-logo.png`) + animated "MaCo" wordmark (`<SplitReveal>`: GSAP SplitText char-rise, then a continuous 115° `.maco-shine` rake — React Bits' Split Text + Shiny Text concepts) | DONE — new `open-logo.tsx` |
| Old hero content (statement, CTAs, proof row, Bridge video) merged with the old standalone CLAIM into one section; video now fills a single 16/9 panel edge-to-edge instead of a small inset window | DONE — new `working-surface.tsx`, replaces `open-surface.tsx` + `claim.tsx` (deleted) |
| WebGL hero field, hover-distortion shader, blend-difference cursor ring, text-scramble — reverted outright (user verdict: read like `evirexsoft.com`, not MaCo) | DONE — `components/webgl/*`, `cursor-ring.tsx`, `motion/scramble.tsx` deleted; all call sites + `data-cursor` attrs removed |
| Lenis + GSAP `ScrollTrigger`/`SplitText` — kept and deepened, not reverted | DONE — still the scroll substrate for EVIDENCE/WORK/METHOD/PRODUCTS |
| Scroll-linked React state (`setProgress`/`setSweep` in `ScrollTrigger.onUpdate`, a full re-render per scroll frame) replaced with direct CSS-var/inline-style writes | DONE — EVIDENCE, WORK, METHOD, PRODUCTS |
| Services collapsed from 5 to 2 (`business-software`, `digital-solutions`) per the owner's real service menu, sub-items as `capabilities` | DONE — `content/maco.ts`, `projects[].services` remapped, `services.index.tsx` copy fixed |
| `<LineReveal>`/`<Magnetic>` added to all 9 inner routes (previously static except `products.$slug`, which already had `MotionSection`) | DONE |
| `tsc --noEmit` / `eslint` / `npm run build` clean; SSR `curl` sanity check (title, h1 text, 10 `<section>`s, 0 `<canvas>`, 0 error strings, no old service slugs) | DONE — verified this pass |
| Full live-browser verification of THIS pass's changes (new hero, merged surface, both bug fixes, services content on live pages) | **NOT DONE** — no browser-automation tool was available this session; only static checks above were run |

Bundle cost, re-measured after this pass: homepage eager entry chunk
**141.96 KB gzip** (452.03 KB raw) — down from the immersive-rebuild's
148.61 KB now that the four reverted devices and their shader strings are
gone, but still above the pre-rebuild 106 KB baseline (Lenis/GSAP glue code
remains, by explicit decision). Lazy chunks: `lenis` 5.39 KB, `scroll-runtime`
5.39 KB, `gsap` 27.42 KB, `ScrollTrigger` 17.54 KB, `SplitText` 3.26 KB gzip,
all fetched after first paint.

---

## Immersive Motion Rebuild (2026-08-18, separate plan: `you-are-working-on-robust-flute.md`)

A second, larger pass on top of the reset — full plan and rationale in the
plan file (also mirrored into `AI_HANDOFF.md`). User explicitly chose the full
version over a lighter alternative I recommended.

| Item | Status |
|------|--------|
| Lenis + GSAP `ScrollTrigger`/`SplitText` scroll substrate (`lib/scroll-runtime.ts`, `<ScrollRuntimeProvider>`) | DONE |
| Double-smoothing bug deleted (`useSpring(scrollYProgress, SPRING_SCROLL)` in EVIDENCE/WORK/PRODUCTS; `SPRING_SCROLL` itself removed as dead code) | DONE |
| EVIDENCE, WORK, METHOD moved to `ScrollTrigger` `pin`+`scrub` | DONE |
| WebGL2 cursor-reactive hero field (`<FieldCanvas>`, behind the OPEN panel) | DONE |
| Hover-distortion shader (`<DistortSurface>`) on PRODUCTS posters + EVIDENCE frame only | DONE — deliberately not on WORK (no real screenshots exist there) |
| `<Magnetic>` buttons (`rubberband()`/`SPRING_MOMENTUM`, previously unused) | DONE |
| `<Scramble>` text-scramble hover | DONE |
| `<CursorRing>` blend-difference cursor companion | DONE |
| `<LineReveal>` (GSAP SplitText line reveal) on CLAIM/CLOSE | DONE |
| `tsc --noEmit` / `eslint` / `npm run build` clean | DONE — verified this pass |
| SSR sanity check (curl the dev server: title/h1/script text present, 10 `<section>`s, 0 `<canvas>` server-side, 0 error strings) | DONE |
| Full live-browser verification (7-width × 2-theme matrix, scrubbing both pinned scenes by hand, contrast measurement over the field in both themes, `prefers-reduced-motion`/`forced-colors`/`prefers-contrast`, keyboard skip-link focus check, touch device, LCP/CLS/TBT) | **NOT DONE** — no browser-automation tool was available this session; only static checks above were run. Do not report this as verified until it actually is. |

Bundle cost, measured (not estimated) from a real build: lazy chunks
`lenis` 5.39 KB + `gsap` 27.42 KB + `ScrollTrigger` 17.54 KB + `SplitText`
3.26 KB gzip ≈ **53.6 KB**, fetched after first paint. The homepage's eager
entry chunk grew **106 KB → 148.61 KB gzip** — larger than the plan's own
estimate, from the new component glue code rather than the libraries
themselves. See `CONTEXT.md §11` for the full breakdown.

---

## Phase checklist (`HOMEPAGE_REDESIGN_PLAN.md` §16)

| Phase | Work | Status |
|-------|------|--------|
| A0 | `git init`, restore-point commit, `homepage-reset` branch | DONE |
| A | Plan doc, fonts, token layer, grounds, type scale, motion/scroll/pointer hooks, pre-hydration theme script | DONE |
| B | Hero — The Working Surface (`open-surface.tsx`) | DONE |
| C | Hero → CLAIM | DONE — both render as adjacent movements; the continuous morph transform described in the plan's §7 scroll story was not built as a single continuous transform (hero recedes normally on scroll, CLAIM is a separate movement rather than the hero literally becoming it) |
| D | EVIDENCE scroll-expand + `SurfaceMedia` | DONE, including the light-pass sweep fix (2026-08-18) |
| E | WORK sequence (desktop pinned rail + mobile list) | DONE — including a real panel-straddling bug found and fixed via live scroll testing |
| F | CAPABILITY selector | DONE |
| G | PRODUCTS (Bridge + Driver's Diary) | DONE, including per-card light-pass sweep (2026-08-18) |
| H | METHOD + RECORD | DONE — claim audit clean, no invented numbers found |
| I | CLOSE intake + contact API fix | DONE — `CloseIntake` links to `/contact` rather than duplicating a form; the real fix is in `contact.tsx` itself, verified against a live backend |
| J | Mobile pass, all 7 widths | PARTIAL — 390px verified this pass (all movements, no overflow); 375/430/768/1024/1280 not yet re-checked against the final font/logo system |
| K | Accessibility pass | PARTIAL — mobile nav focus trap + backdrop done; keyboard tab order + focus-visible spot-checked on desktop nav; full screen-reader walkthrough not done |
| L | Performance pass | NOT STARTED — no LCP/CLS/long-task measurement taken; only bundle size checked (340.5 KB / 106 KB gzip for the homepage entry chunk) |
| M | Motion audit | NOT STARTED as a dedicated pass |
| N | Browser QA, 7 widths × 2 themes | PARTIAL — see Phase J; theme-toggle interaction and hydration verified real-click, not just DOM state |

---

## Current homepage architecture (as built, post Brand Hero & Bug Fix pass)

```
OPEN         deep    open-logo.tsx           hero — MaCo's brand alone: mark + animated "MaCo" wordmark
SURFACE      paper   working-surface.tsx     promise + proof row + CTAs + Bridge video, edge-to-edge 16/9
EVIDENCE     deep    evidence-expand.tsx     ScrollTrigger pin+scrub expand, Bridge in motion
WORK         paper   work-sequence.tsx       4 projects — ScrollTrigger pin+scrub rail (desktop) / list (mobile)
CAPABILITY   paper   capability-selector.tsx services selector — 2 tabs (Business Software, Digital Solutions)
PRODUCTS     deep    product-story.tsx       Bridge + Driver's Diary
IDENTITY     paper   identity.tsx            "One name. Many scripts." (rebuilt, not carried over)
METHOD       paper   method-line.tsx         A → B → C → D — ScrollTrigger pinned vertical step-through
RECORD       paper   record.tsx              clients + company, deliberate rest — unchanged this pass
CLOSE        deep    close-intake.tsx        final statement (LineReveal), links to /contact
```

Ten distinct behaviours (per the plan's own rule against repeating a device),
one deliberate rest point at RECORD. `open-surface.tsx` and `claim.tsx` are
deleted — their content merged into `open-logo.tsx` (brand only) and
`working-surface.tsx` (everything else the old hero + CLAIM carried).
No WebGL surface anywhere on the homepage as of 2026-08-18 (reverted — see
the Brand Hero & Bug Fix section above and `CONTEXT.md §11`). Scroll mechanics
for EVIDENCE/WORK/METHOD/PRODUCTS write straight to CSS custom
properties/inline style from `ScrollTrigger.onUpdate`, never through React
state — full detail in `CONTEXT.md §10`.

---

## Next exact implementation order

1. **Full live-browser verification of the Brand Hero & Bug Fix pass** — the two bugs and the hero rebuild were fixed by reading the code, not by re-testing live (no browser-automation tool was available this session; only `tsc`/`eslint`/`build`/SSR-curl were run). Specifically needed: confirm WORK's four panels now traverse the *entire* pinned scroll distance with no leftover blank stretch and the last panel isn't clipped; confirm METHOD appears in its own place, after WORK fully releases, with no gap after IDENTITY; confirm the hero mark + "MaCo" render legibly in both themes at the intended size; confirm `.maco-shine`'s animation is genuinely subtle, not distracting; then the rest of the original checklist — scrub EVIDENCE/PRODUCTS by wheel/trackpad/keyboard/touch, `prefers-reduced-motion` disables Lenis/scramble-free/magnet, skip link under Lenis, `forced-colors`/`prefers-contrast`, touch device (390px) has no horizontal overflow, route-change leak check (navigate away/back 5×, confirm no orphaned `ScrollTrigger`/Lenis instances).
2. Re-run the full 375 / 430 / 768 / 1024 / 1280 width pass against the current font/logo/hero system (only 390 and 1440 were checked in the 2026-08-18 real-media pass, predating both the immersive rebuild and this pass).
3. Cobalt theme pass at the same widths — Obsidian was the primary theme checked this round. Particularly check `.maco-shine`'s brightening-toward-white gradient reads correctly on Cobalt's blue ink.
4. Real performance measurement: LCP, CLS, long-task profiling during scroll, on a throttled profile — budgets are defined in the plan §13 but never measured. The eager chunk is currently 141.96KB gzip (down from 148.61KB, still above the pre-rebuild 106KB).
5. Dedicated motion audit (Phase M) — go section by section and ask whether each animation earns its place, per the plan's own gate. Now smaller scope than before: WebGL/cursor/scramble are already gone; what's left to audit is `.maco-shine`'s idle-loop timing and the WORK/METHOD scroll mechanics' feel now that the 4× bug is fixed.
6. Full keyboard + screen-reader walkthrough beyond the nav spot-check already done.
7. The paused `/21st-ai` sketch for `/work/$slug` remains blocked on the `21st` MCP server's OAuth authorization, unavailable in a non-interactive session — run `/mcp` interactively to unblock, if that work resumes.

---

## Explicitly out of scope unless requested

- Purging the 46 dead `components/ui/` shadcn files — logged as a follow-up in the plan's risk register, not part of this reset.
- Sourcing real product photography/video — `SurfaceMedia` ships tier-3 designed fallbacks everywhere; upgrading is a one-file `content/maco.ts` change per slot, not a code project.
- Full backend rewrite.
- Inventing new case studies, metrics, or testimonials.

---

## Success criteria (from the plan — tracked here)

- [x] Zero decorative devices carried over from the old template (grids, marquees, pulsing dots, `NN —` eyebrows all removed)
- [x] Every false claim from the audit removed or corrected (`4 Products Deployed`, `2+ Years Engineering`, `HeadGreen Mobility`, fake `DELIVERED · —` dates, etc.)
- [x] Contact form performs a real POST, verified against a live backend
- [x] Two themes read as genuinely different modes (different font sets, not a recolor)
- [x] Real logo mark integrated and themeable via a single asset
- [x] `npm run build` + `tsc` clean
- [x] Zero console errors observed across the checks run this pass
- [x] `prefers-reduced-motion: reduce` gives a designed static composition, not a broken/frozen frame
- [x] No Obsidian flash on a persisted Cobalt preference (pre-hydration script + `suppressHydrationWarning`)
- [ ] Full 7-width × 2-theme QA matrix — partial (390 + 1440, mostly Obsidian, and only against the pre-immersive-rebuild build)
- [ ] Performance budgets (LCP < 2.0s, CLS < 0.05, no long task > 200ms) — not measured
- [ ] Dedicated motion audit — not run as a standalone pass
- [x] Lenis + GSAP ScrollTrigger scroll substrate live, double-smoothing bug deleted, `tsc`/`eslint`/`build` clean (Immersive Motion Rebuild, 2026-08-18)
- [x] WORK's 4× pin/transform mismatch and METHOD's mount-order race fixed at the root cause, not tuned (Brand Hero & Bug Fix pass, 2026-08-18)
- [x] Hero rebuilt as MaCo's brand alone (mark + animated wordmark); WebGL field/cursor ring/text scramble reverted after user verdict they read as a generic template (Brand Hero & Bug Fix pass, 2026-08-18)
- [ ] The full pass (bug fixes + new hero + services content) verified in a real browser — not done this session, no browser-automation tool was available (see "Next exact implementation order" above)
