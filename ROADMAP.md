# MaCo Website — Roadmap

Tracks the homepage creative reset. Full architecture and rationale: `HOMEPAGE_REDESIGN_PLAN.md`.
Update this file when a phase completes; also update `AI_HANDOFF.md` and `PROJECT_STATUS.md`.

Last updated: 2026-08-19

---

## Motion Rebuild pass (2026-08-19, plan: `act-as-an-elite-piped-scone.md`)

Full detail in `AI_HANDOFF.md` ("Homepage Motion Rebuild"). Nine commits,
`0882664`..`2469975`, each live-verified via Playwright — the first homepage
pass verified live at every step rather than only via `tsc`/`build`.

| Item | Status |
|------|--------|
| Reduced-motion resolver split-brain (`getScrollRuntime`/`useReducedMotion` disagreeing) fixed; `?motion=full\|reduced` override added | DONE — confirmed live this dev machine reports `reduce=true` by default |
| Dev-HMR Lenis singleton leak (`destroy()` never cleared the module singleton) | DONE |
| Pinned sections rendering under the sticky header (`z-40`) | DONE — `z-[41]` |
| Mobile nav scroll-lock, router `scrollRestoration` double-ownership | DONE |
| `MotionSection` (one-shot fade, 20+ call sites) replaced with reversible scroll-linked primitives (`ScrubReveal`/`RuleDraw`/`Stagger`/`RakingSurface`) | DONE — one remaining call site, `method-line.tsx`'s static reduced-motion branch |
| `@property inherits` bug (`--sweep`/`--p`/`--t` registered `inherits:false`, would have frozen WORK's rail and every new `RakingSurface`) | DONE — caught before shipping further |
| All 10 sections given real scroll-linked motion (6 previously had none: SURFACE, CAPABILITY, IDENTITY, RECORD, CLOSE, WORK's mobile fallback) | DONE |
| EVIDENCE's clip-path aspect-locked to real 16:9 footage (was viewport-shaped, cropping real footage) | DONE |
| PRODUCTS' aspect ratio derived from real asset dimensions (was hardcoded 4/3, cropping Driver's Diary's portrait poster) | DONE |
| CAPABILITY — sticky scroll-driven service selection, click/arrow still wins | DONE |
| PRODUCTS — sticky overlap stack (second card visibly covers first) | DONE |
| IDENTITY — rewritten fully scroll-driven (`--t` custom property), removed animated `filter:blur()`, removed `motion/react` involvement | DONE |
| WORK's mount-order race (same bug class as METHOD's earlier one, now hitting IDENTITY) fixed at root cause | DONE |
| Ground rhythm retuned per plan Phase 4: WORK paper→deep, PRODUCTS deep→paper, IDENTITY paper→deep | DONE |
| Cross-section recession continuity (`GroundHandoff`) | DONE |
| Live-browser verification of every commit above | DONE — Playwright against a running dev server, not just static checks |
| Phase 3.2 — OPEN-mark→header shared-element handoff | NOT DONE — deferred, not re-requested |
| Phase 3.3 — single document-level `--sweep` driven off Lenis `documentElement` progress | NOT DONE — each `RakingSurface` still runs its own independent `ScrollTrigger` |
| Full 7-width × 2-theme matrix, `forced-colors`/`prefers-contrast`, real touch device, formal performance audit | NOT DONE |

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
| J | Mobile pass, all 7 widths | PARTIAL — 390px + spot-widths verified live (2026-08-19 motion rebuild, Playwright); full 375/430/768/1024/1280 matrix still not run against the current build |
| K | Accessibility pass | PARTIAL — mobile nav focus trap + backdrop done; keyboard tab order + focus-visible spot-checked; `?motion=reduced` matrix verified live across all 4 newly-choreographed sections; `forced-colors`/`prefers-contrast` and full screen-reader walkthrough still not done |
| L | Performance pass | NOT STARTED — no LCP/CLS/long-task measurement taken; bundle size last checked after Brand Hero & Bug Fix (452.03 KB / 141.96 KB gzip), not re-measured after the motion rebuild (no new npm deps added) |
| M | Motion audit | NOT STARTED as a dedicated pass — animations reviewed incidentally while building/live-verifying each commit |
| N | Browser QA, 7 widths × 2 themes | PARTIAL — the 2026-08-19 motion rebuild live-verified every commit via Playwright (full-page scroll, reduced-motion matrix, Cobalt spot-check, sticky/pin behavior) but at spot-widths, not the full 7×2 matrix |

---

## Current homepage architecture (as built, post 2026-08-19 Motion Rebuild)

```
OPEN         deep    open-logo.tsx           hero — MaCo's brand alone: mark + animated "MaCo" wordmark, over a cursor-reactive WebGL `<BlindsField>` (2026-08-19)
SURFACE      paper   working-surface.tsx     promise + proof row + CTAs + Bridge video, scrubbed lay-flat + sweep
EVIDENCE     deep    evidence-expand.tsx     ScrollTrigger pin+scrub expand, aspect-locked to real 16:9 footage
WORK         deep    work-sequence.tsx       4 projects — ScrollTrigger pin+scrub rail (desktop) / list (mobile)
CAPABILITY   paper   capability-selector.tsx sticky scroll-driven service selection (2 tabs)
PRODUCTS     paper   product-story.tsx       sticky overlap stack — each card a deep tile on paper
IDENTITY     deep    identity.tsx            "One name. Many scripts." — fully scroll-driven dial
METHOD       paper   method-line.tsx         A → B → C → D — ScrollTrigger pinned vertical step-through
RECORD       paper   record.tsx              clients + company — one RakingSurface pass + settle
CLOSE        deep    close-intake.tsx        center-out rule draw, biggest scrub reveal, final sweep
```

Plus `ground-handoff.tsx` (`<GroundHandoff>`, renders nothing), mounted once
after CLOSE — drives cross-section recession continuity across 4 hand-picked
boundary pairs.

Ten distinct behaviours (per the plan's own rule against repeating a device),
one deliberate rest point at RECORD. `open-surface.tsx` and `claim.tsx` are
deleted — their content merged into `open-logo.tsx` (brand only) and
`working-surface.tsx` (everything else the old hero + CLAIM carried).
WebGL was reverted homepage-wide 2026-08-18 (see the Brand Hero & Bug Fix
section and `CONTEXT.md §11`), then reintroduced 2026-08-19 scoped to OPEN
only (`<BlindsField>`, on `three` rather than a new dependency, live-verified
via Playwright — see `AI_HANDOFF.md` "Hero WebGL Blinds Field" pass and
`CONTEXT.md §4`). No other section has a WebGL surface. Ground sequence retuned
2026-08-19 per the plan's Phase 4 rhythm (WORK paper→deep, PRODUCTS deep→paper,
IDENTITY paper→deep) — deep/paper/deep/deep/paper/paper/deep/paper/paper/deep,
no run longer than two. Scroll mechanics for every section write straight to
registered `@property` CSS custom properties / inline style from
`ScrollTrigger.onUpdate` via `useScrollScene()`, never through React state —
full detail in `CONTEXT.md §10`.

---

## Next exact implementation order

1. Full 7-width matrix (375, 390, 430, 768, 1024, 1280, 1440) × 2 themes,
   against the current 2026-08-19 motion-rebuild build — the rebuild
   live-verified spot-widths via Playwright but not the complete matrix.
2. `forced-colors: active` / `prefers-contrast: more` — not checked in any
   pass to date.
3. Real touch-device input — every touch check so far has been DevTools
   emulation, not a physical device.
4. Real performance measurement: LCP, CLS, long-task profiling during scroll,
   on a throttled profile — budgets are defined in the plan §13 but never
   measured. Bundle size hasn't been re-measured since the Brand Hero & Bug
   Fix pass (141.96KB gzip eager chunk); the motion rebuild added no new npm
   dependencies, only components/CSS, so it should be close but is unverified.
5. Dedicated motion audit (Phase M) — go section by section and ask whether
   each animation earns its place, per the plan's own gate. Reviewed
   incidentally while live-verifying each of the 9 motion-rebuild commits,
   never as a standalone pass.
6. Full keyboard + screen-reader walkthrough beyond the nav spot-check and the
   `?motion=reduced` element-by-element check already done.
7. Optional, deferred twice now (not re-requested): Phase 3.2's OPEN-mark→
   header shared-element handoff; Phase 3.3's single document-level `--sweep`
   driven off Lenis `documentElement` progress instead of per-`RakingSurface`
   independent triggers.
8. The paused `/21st-ai` sketch for `/work/$slug` remains blocked on the `21st` MCP server's OAuth authorization, unavailable in a non-interactive session — run `/mcp` interactively to unblock, if that work resumes.
9. Deferred at the user's explicit choice, 2026-08-19 ("hero first"): the sitewide half of that day's hero-upgrade request — regroup homepage sections into continuous light/dark blocks instead of the current deliberate `paper`/`deep` alternation, curved "sheet" section overlays between them, and extend `ScrollThread` from WORK→CAPABILITY→PRODUCTS to the full page. A real re-theme of the homepage's visual rhythm; needs its own brainstorm/design pass before implementation, not a follow-on tweak to this one.

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
- [ ] Full 7-width × 2-theme QA matrix — partial (390 + 1440 + spot-widths sampled live 2026-08-19, not the full 14-pass matrix)
- [ ] Performance budgets (LCP < 2.0s, CLS < 0.05, no long task > 200ms) — not measured
- [ ] Dedicated motion audit — not run as a standalone pass
- [x] Lenis + GSAP ScrollTrigger scroll substrate live, double-smoothing bug deleted, `tsc`/`eslint`/`build` clean (Immersive Motion Rebuild, 2026-08-18)
- [x] WORK's 4× pin/transform mismatch and METHOD's mount-order race fixed at the root cause, not tuned (Brand Hero & Bug Fix pass, 2026-08-18)
- [x] Hero rebuilt as MaCo's brand alone (mark + animated wordmark); WebGL field/cursor ring/text scramble reverted after user verdict they read as a generic template (Brand Hero & Bug Fix pass, 2026-08-18)
- [x] All 10 homepage sections carry real scroll-linked motion; reduced-motion resolver split-brain, dev-HMR Lenis leak, pin z-order, and a second mount-order race (IDENTITY vs. WORK) fixed at the root cause; CAPABILITY/PRODUCTS given sticky scroll-driven mechanics; cross-section recession continuity added (Motion Rebuild pass, 2026-08-19)
- [x] The full pass live-verified in a real browser via Playwright — every one of 9 commits, not just `tsc`/`build` (Motion Rebuild pass, 2026-08-19)
