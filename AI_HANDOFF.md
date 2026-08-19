# MaCo Website — AI Handoff

## Status

Overall: **IN PROGRESS** — the homepage motion rebuild (plan:
`C:\Users\LENOVO\.claude\plans\act-as-an-elite-piped-scone.md`) is functionally
complete and, unlike the two passes before it, **live-verified via Playwright**
at every commit, not just statically checked. All 10 sections now carry real
scroll-linked choreography (previously 6 had none), the reduced-motion kill
switch and dev-mode Lenis-death bugs are fixed, WORK's mount-order race and a
matching one in IDENTITY are fixed, CAPABILITY and PRODUCTS got sticky
scroll-driven mechanics, and cross-section recession continuity (`GroundHandoff`)
ties all 10 movements into one surface. Remaining work is QA breadth (full
width matrix, formal performance audit, screen-reader walkthrough) and two
lower-priority polish items never requested again after being deferred — see
"Next exact actions."

Same day, second pass (plan: `C:\Users\LENOVO\.claude\plans\act-as-an-elite-wondrous-harbor.md`):
CAPABILITY rebuilt as a scroll-driven services convergence, WORK rebuilt as a
two-column portfolio grid (dropping WORK's pin — pin count stays at 4), a
single drawn `ScrollThread` added across WORK→CAPABILITY→PRODUCTS, and a small
pointer-driven interaction added to six existing sections. Also
**live-verified via Playwright** — see "Convergence, Grid, Thread & Interaction
pass" below.

Same day, third pass: OPEN got a cursor-reactive WebGL background
(`<BlindsField>`), a magnetic mark, a proximity glow, a cinematic load
sequence, and a radial clip-path theme-switch transition. This is the
**third** attempt at a WebGL device on this homepage (the first two were
built and reverted the same day, 2026-08-18 — see rule 8 under "Do NOT
change without a real reason"); this one is reimplemented on `three`
(already a dependency) rather than adding `ogl`, and was **live-verified
via Playwright** before being called done — see "Hero WebGL Blinds Field &
Radial Theme Transition pass" below.

Current phase: homepage motion rebuild (see "Homepage Motion Rebuild" section
below) complete at both the code and live-verification level — next is
`HOMEPAGE_REDESIGN_PLAN.md` Phases J/K/L/N (QA breadth: full 7-width matrix,
accessibility walkthrough, performance budget measurement) or Pass 2 (inner
pages), whichever the user prioritizes.

Confidence: **HIGH** — this pass broke from the prior two by verifying nearly
every claim against a live dev server via Playwright (computed styles,
`elementFromPoint`, scroll-offset sampling, screenshots), documented commit by
commit below. The `?motion=reduced` matrix and Cobalt-vs-Obsidian material
divergence were spot-checked live, not assumed. Not yet checked live: the full
7-width matrix (only spot-widths were sampled), `forced-colors`/
`prefers-contrast`, real touch-device input (only DevTools emulation), and any
LCP/CLS/long-task numbers.

Last updated: 2026-08-19

---

## Hero WebGL Blinds Field & Radial Theme Transition pass (2026-08-19, same day, third pass)

Requested as an upgrade to OPEN's hero: a cursor-reactive WebGL gradient
background, magnetic/glow micro-physics on the mark, a cinematic load
sequence, and a radial theme-switch transition. The request's original spec
(GradientBlinds from React Bits, via `ogl`, in a `HeroSection.jsx` with a
"Start a project" button and a separate theme toggle inside the hero) didn't
match this repo at all — no such file, no button/toggle in OPEN, TSX not
JSX — and asked for exactly the two things `CONTEXT.md` and this file both
flag as house rules: never copy React Bits code verbatim (`CONTEXT.md:137`,
`split-reveal.tsx`'s doc comment), and don't reintroduce WebGL without a new
reason and live verification (rule 8 below — two prior WebGL passes were
built and reverted the same day, 2026-08-18, for reading as a generic
agency template). Both were raised with the user before writing any code;
the shader was reimplemented on `three` (already a dependency, used by
`MaCoGlobe`) instead of adding `ogl`, scoped to OPEN only (the section's
own restructure — theme grouping, curved overlays, a full-page scroll
thread — was requested in the same message but deferred to a later pass).

**What changed:**

- **`components/home/blinds-field.tsx`** (new) — a custom GLSL fragment
  shader (rotated-stripe blinds over a 4-stop gradient, a mouse-centred
  spotlight, distortion, noise, a slow diagonal shine sweep) rendered via a
  raw `three` `WebGLRenderer`/`OrthographicCamera`/`ShaderMaterial`, mounted
  client-only through a dynamic `import("three")` inside a `useEffect` so
  it never renders a `<canvas>` server-side (confirmed via SSR curl, same
  guarantee the earlier reverted hero verified). Two config objects
  (Cobalt/Obsidian — the user's exact hex/prop values) are picked off the
  existing `useTheme()`, re-read every frame so a theme switch updates the
  shader live with no WebGL restart. Mouse input is read via
  `getComputedStyle` off `--px`/`--py`, inherited from `open-logo.tsx`'s
  own pointer field rather than a second listener. `prefers-reduced-motion`
  renders a static CSS gradient instead — no WebGL, no render loop.
- **`components/home/open-logo.tsx`** — `usePointerField` moved from just
  the centre row up to the whole `<section>`, so one field now drives the
  mark's existing parallax, the shader's mouse uniform, and a new
  cursor-tracking ambient-glow halo behind the mark. The mark is wrapped in
  the existing `<Magnetic>` (reused, not rebuilt — the hero has no buttons
  to magnetize; the header's `<ThemeSwitch>` was already `<Magnetic>`-
  wrapped). A GSAP timeline added to the section's existing mount effect
  animates the shell row (`y:-30→0`) and the mark (`scale:0.8→1`) just
  ahead of `<SplitReveal>`'s own existing char-stagger, which already does
  the clip-path-masked rise the brief asked for — reused, not duplicated.
- **`components/theme.tsx`** — `setTheme` now accepts an optional click
  origin. When given one (and motion isn't reduced), the real `data-theme`
  flip is deferred until a GSAP `clipPath: circle()` overlay — tinted with
  the *incoming* theme's `var(--bg)` via its own scoped `data-theme`
  attribute — has grown from the origin to cover the viewport; the swap
  underneath is invisible because the overlay already matches. Falls back
  to an instant flip if the scroll runtime fails to load or motion is
  reduced.
- **`components/chrome.tsx`** — `<ThemeSwitch>` now passes its own
  `getBoundingClientRect()` centre as the click origin.
- **`@types/three@0.180.0`** added as a devDependency — `MaCoGlobe.tsx` was
  already importing `three` untyped (one of the two pre-existing `tsc`
  errors); this fixes that one for free as well as this new file's.

**Verified this pass (live Playwright, `localhost:5183`):**

- `tsc --noEmit`: 0 errors in touched files (1 pre-existing, unrelated
  `react-globe.gl` type error remains in `MaCoGlobe.tsx`, same as every
  prior pass). `eslint`: 0 errors, 1 pre-existing fast-refresh warning in
  `theme.tsx` (same export shape as before this pass). `npm run build`:
  client + SSR both clean.
- SSR curl of `/`: 0 `<canvas>` tags, all 10 `<section>` tags present,
  full DOM intact.
- Live browser: canvas mounts and sizes to the section
  (`canvas.width/height` matched viewport), a dispatched `pointermove`
  updated `--px`/`--py` on the section (`0.5,0.5` → `0.8,0.2`), zero
  console errors.
- Theme toggle clicked live: `data-theme` stayed `obsidian` through the
  ~0.7s wipe (confirming the flip is genuinely deferred, not instant),
  landed on `cobalt` after, the mark's `drop-shadow` filter updated to
  Cobalt's rgba live, the overlay element was removed from the DOM after
  completion (no leak), zero console errors.
- `?motion=reduced`: 0 canvas elements, the static gradient fallback
  rendered instead, zero console errors.
- Bundle cost measured (this is the one real, honest downside): `three`
  is a genuinely large dynamic chunk — 561 KB / **141 KB gzip** — fetched
  async on OPEN's mount. The homepage's own eager chunk is unchanged
  (141.93 KB gzip, same as the prior pass). This is the accepted cost of
  reusing `three` over adding a lighter dedicated shader library, per the
  house rule against a second WebGL runtime.

**Not done / deferred:** the second half of the same request — grouping
homepage sections into continuous light/dark blocks, curved "sheet" section
overlays, and extending `ScrollThread` to the full page — was explicitly
deferred to a later pass at the user's choice ("hero first").

Nine commits (`0882664`..`2469975`), each independently live-verified against
a running dev server via Playwright — not just `tsc`/`build`, per the standing
rule in "Do NOT change without a real reason" item 10 below. Full diagnosis in
the plan file; summary of what shipped:

**Root causes fixed (`aa26585`):**
- `getScrollRuntime()` and `useReducedMotion()` previously ran two independent
  `matchMedia` calls that could disagree — now share one resolver
  (`lib/motion.ts`) layering a `?motion=full|reduced` override (persisted to
  `localStorage`) over `prefers-reduced-motion`. **Confirmed live that this
  dev machine reports `reduce=true`** — every prior animation pass on this
  machine was invisible by default without the new override.
- `ScrollRuntime` gained `destroy()`; the provider called `lenis.destroy()`
  but never cleared the module singleton, so every dev HMR remount handed
  every scene the same dead Lenis instance until a hard refresh. Verified live
  via a decaying-wheel-scroll HMR probe that smooth scroll now survives a
  remount.
- Lenis tuned (`lerp: 0.085`, `wheelMultiplier: 0.9`) instead of stock
  defaults.
- Pinned sections get `z-[41]` so they render above the sticky `z-40` header
  instead of underneath it — confirmed via `elementFromPoint` at the header's
  screen position mid-pin.
- Mobile nav scroll-lock now stops Lenis directly rather than relying on
  `overflow: hidden` alone. Router's `scrollRestoration` disabled (was racing
  Lenis's own route-change scroll reset).
- New `useScrollScene()` hook (~30 lines, `hooks/use-scroll-scene.ts`) wraps
  GSAP's `gsap.context()` for auto-cleanup — used in place of adding
  `@gsap/react`, which would have pulled `gsap`/`ScrollTrigger`/`SplitText`
  into the eager bundle (confirmed via build output they stayed lazy chunks).

**Motion vocabulary (`4b45ea1`, `5c18b1f`):** `components/motion/scrub-reveal.tsx`,
`rule-draw.tsx`, `stagger.tsx`, `raking-surface.tsx` replace `MotionSection`
(one-shot 20px `IntersectionObserver` fade) with reversible, scroll-linked
primitives writing to registered `@property` CSS custom properties
(`--r`/`--sr`/`--sweep`/`--p`/`--t`/`--lay`) whose initial-value IS the at-rest
composition — SSR/no-JS/reduced-motion/a blocked GSAP import all render
correctly with no second branch. One real bug caught before shipping further
(`5c18b1f`): `--sweep`/`--p`/`--t` were registered `inherits:false`, which
silently blocks a pseudo-element or child from reading a value set on its
parent — would have frozen WORK's existing rail and made every new
`RakingSurface` inert. Fixed to `inherits:true`, verified live (computed
`--p` on a child matched the parent's live value exactly). `RakingSurface`
unifies `.light-pass`'s three previously-independent `--sweep` sources onto
one: each surface's own transit through the viewport. Cobalt's deep ground
darkened (0.34L → 0.24L) — verified live as a genuine saturated blue material
next to Obsidian's near-black, the explicit anti-goal from `CONTEXT.md §2`.

**All 10 sections choreographed** — the six that had zero scroll motion
(SURFACE, CAPABILITY, RECORD, CLOSE — `5e3c69e`; IDENTITY, WORK's mount race —
`13ae3a5`) now do:
- **SURFACE**: full line-height headline scrub, Bridge panel "lays flat" on
  scroll (composed with the existing pointer tilt, not replacing it), proof
  row staggers via one shared `ScrollTrigger`.
- **CAPABILITY** (`c815197`): sticky scroll-selection — 70vh extra scroll
  height on desktop, tablist sticky, a section-spanning `ScrollTrigger` maps
  its own progress to the active service index; click/arrow-key sets a
  `userPicked` flag that wins outright until the section scrolls fully past.
  Verified live: `aria-selected` switches exactly at the `floor(progress *
  serviceCount)` boundary. Reduced motion drops the extra height entirely
  rather than reserving dead scroll space.
- **PRODUCTS** (`0f7a78e`, `c815197`): moved deep→paper ground (each card is
  now a `data-ground="deep"` tile ON the paper page — stronger material read
  than dark-on-dark, and the release after EVIDENCE+WORK's dark passage).
  Cards are `position:sticky` with ascending z-index so the second visibly
  rises and covers the first — verified via screenshot. Aspect ratio derived
  from real asset dimensions (was hardcoded `4/3`, cropping Driver's Diary's
  real 900×1203 portrait poster by ~44%).
- **IDENTITY** (`13ae3a5`): rewritten fully scroll-driven — `--t` (a
  registered, inherited `@property`) replaces the old `setInterval` reel.
  Removed an animated `filter: blur()` (against the site's own motion rules),
  removed `motion/react` involvement (ownership is GSAP for anything
  scroll-adjacent), removed the signed circular-distance wraparound math (a
  scrubbed dial never wraps), removed the WCAG 2.2.2 pause control (motion the
  user drives by scrolling isn't "automatic" under that criterion). Ground
  flipped paper→deep per the plan's Phase 4 rhythm.
- **RECORD**: intentionally near-motionless (the page's one rest beat) but now
  arrives at rest rather than just sitting static — one `RakingSurface` lights
  the logo grid once, tiles settle via a low-amplitude `Stagger`.
- **CLOSE**: a rule draws outward from centre (the only place on the page a
  rule draws from the middle, not the left), the biggest scrub reveal on the
  page, one last light pass.
- **EVIDENCE** (`0f7a78e`): clip-path frame now grows locked to the video's
  real 16:9 aspect (previously grew to the *viewport's* aspect and let
  `objectFit:cover` crop real footage off the sides — was barely readable as
  motion, ~0.21px of growth per pixel scrolled). Pin extended 120%→160%,
  radius 32→6px, scrim 0.62→0.10, plus a vignette for viewports above 1600px
  where the 1024px source caps out.

**WORK's mount-order race (`13ae3a5`)** — the same class of bug `AI_HANDOFF.md`
previously documented for METHOD (see "Brand Hero & Bug Fix pass" below) was
still live for WORK itself: `useMediaQuery`'s SSR-safe `false`-then-`true` flip
meant `<WorkRail>` (and its pin-spacer) mounted one render late, so IDENTITY's
`ScrollTrigger` — created before WORK's pin fully existed — measured its start
~4300px short of the real document height, landing inside WORK's own
still-forming pin range. Fixed by mounting both `<WorkList>` and `<WorkRail>`
unconditionally (split by CSS breakpoint) and gating the pin itself with
`gsap.matchMedia()`, which reverts automatically on a breakpoint crossing — a
mount-time `isDesktop` check cannot do that. A second bug found while fixing
the first: WORK's actually-pinned element was a *child* of the
`data-ground="deep"` section, not the ground element itself — `background`
doesn't inherit in CSS, so once pinned (`position:fixed`, painting
independently of its parent) the rail was background-transparent and the
header showed through underneath it. Fixed by repeating `data-ground="deep"`
directly on the pinned element.

**Cross-section continuity — `GroundHandoff`** (`2469975`,
`components/home/ground-handoff.tsx`): the outgoing section of 4 hand-picked
boundary pairs scales down/dims/lifts as the next section arrives, so the
boundary reads as one section being overtaken rather than a hard cut. Only
pairs whose outgoing side is pin-free are eligible (a `transform` on the
ancestor of a `position:fixed` pinned element repositions it relative to that
ancestor instead of the viewport) — EVIDENCE/WORK/IDENTITY/METHOD are excluded
by construction since each hosts a pin; PRODUCTS is safe outgoing since its
cards are `position:sticky`, not `fixed`.

**Verified live this pass, comprehensively** (Playwright against a running dev
server, not just `tsc`/`eslint`/`build`): full-page scroll (0→18683px, 12
steps) with zero console errors; all four sections' motion mid-scroll
screenshotted; every `.scrub-reveal`/`.stagger-item` element (21 total)
confirmed non-invisible under `?motion=reduced`; Cobalt spot-checked on CLOSE
as genuine blue material with a visible sweep; CAPABILITY's `aria-selected`
sampled across the scroll range and matched the expected formula exactly;
PRODUCTS' sticky overlap confirmed by screenshot; WORK/IDENTITY's fixed race
confirmed via computed `--t`/`--p` matching hand-derived expected values, not
just "no visual glitch"; all 4 real pins confirmed still `position:fixed`
after `GroundHandoff` mounted (ruling out a false alarm that turned out to be
stale HMR state). `tsc --noEmit`/`eslint`/`npm run build` clean at every
commit (same 2 pre-existing `/about`-only `MaCoGlobe` errors throughout).

**Not done this pass** (lower priority, not re-requested since being deferred):
Phase 3.2 — a shared-element handoff where the OPEN hero mark scales down and
travels to the header wordmark's slot as OPEN scrolls out. Phase 3.3 — a
single document-level `--sweep` driven directly by Lenis progress on
`documentElement`; currently each `RakingSurface` instance still runs its own
independent `ScrollTrigger` rather than one shared driver (functionally
similar result, architecturally different from the plan's original ask).

---

## Convergence, Grid, Thread & Interaction pass (2026-08-19, same day, plan: `act-as-an-elite-wondrous-harbor.md`)

A user brief asked for a Next.js build (Lenis wrapper, GSAP convergence
cards, a masonry device-mockup grid, self-drawing SVG line art, a custom
cursor). This repo is TanStack Start, not Next.js, and already has a better
Lenis/GSAP substrate than the brief's own — so the work was landing three
genuinely new movements inside the existing system, not building the brief
literally. Four decisions were made with the user up front: the convergence
**replaces** CAPABILITY rather than sitting alongside it; the portfolio grid
uses **honest media only** (no fabricated device mockups — none exist in the
repo); **typography stays as-is** (both theme font systems untouched); and
the only new global signature is **one continuous SVG thread** — no custom
cursor (one was built and reverted earlier this same day, read as "generic
agency template," and stays reverted).

**`ServicesConvergence`** (`components/home/services-convergence.tsx`,
replaces `capability-selector.tsx`) — two cards (`services[0]`/`services[1]`
from `content/maco.ts`) fly in from opposite viewport edges and lock into a
centred, tilted stack as the section pins, `scrub`-driven. Unlike the old
ARIA tablist it replaces (which showed one service at a time, selectable by
click or arrow key), both services' full capability lists, evidence chips
and CTAs are simply always present — no tab role, no keyboard router, no
`userPicked` override state to maintain. Two new registered `@property`
customs properties drive it: `--c` (convergence, `initial-value: 1` — the
locked stack IS the at-rest composition) and `--d` (detail reveal,
`initial-value: 1`), plus `--reach` (`initial-value: 0px`, a length so a
JS-blocked render never leaves cards off-stage). A single `reach()`
measurement function feeds both the pin's `end` and every card's travel
distance — same discipline as WORK's `distance()` (`work-sequence.tsx`'s
documented 4× bug). The off-stage start is genuinely off-viewport
(`getBoundingClientRect` confirmed live) but produces zero horizontal
scrollbar, because the pinned stage's own `overflow-hidden` clips it — the
same mechanism `WorkRail` already used, not a new one.

**`PortfolioGrid`** (`components/home/portfolio-grid.tsx`, replaces
`work-sequence.tsx` entirely — both `WorkList` and the pinned `WorkRail`)
— a two-column grid of the four real client projects, asynchronous heights,
one scroll-driven `--p` on the wrapper multiplying into a per-column
`grid-column-drift` (`-3rem` left, `-7.5rem` right, so the columns pass each
other at different speeds), and pointer-driven 3D tilt via the existing
`usePointerField`. Dropping the rail's pin was deliberate, not incidental:
it takes the page from what would have been 5 pinned sections back to 4
(CAPABILITY's new pin traded for WORK's old one), and it's what makes WORK
legal as the **outgoing** side of a `GroundHandoff` pair (a `transform` on
an ancestor of a `position: fixed` pin silently breaks it — see that file's
doc comment). There is no project photography or device mockups anywhere in
the repo — only each client's real brand mark — so each cell is a tokenized
backdrop plate carrying that mark, not a fabricated screenshot. **A real
design gap was caught and fixed live**: the first backdrop-plate attempt
mixed `var(--accent)` into the card's own dark surface, which on Cobalt (a
chromatic accent) read as a legible blue block but on Obsidian (achromatic
by design — the two themes are genuinely different, not a recolor) produced
a muddy near-black wash, screenshotted and visibly wrong. Fixed by flipping
just the image plate to `data-ground="paper"` — the same ground-swap device
`product-story.tsx`'s `ProductMedia` already established (a deep tile on a
paper card there; a paper tile on a deep card here) — giving real
brightness contrast in both themes instead of a color-only effect that only
existed in one of them.

**`ScrollThread`** (`components/home/scroll-thread.tsx`) — one SVG path
spanning WORK→CAPABILITY→PRODUCTS (wrapped in a plain, transform-free
`<div className="relative">` in `routes/index.tsx`, safe as a pin ancestor),
drawn via `stroke-dashoffset` off a `--thread` progress property and a
`--thread-len` measured from `path.getTotalLength()` on `ScrollTrigger`'s
`onRefresh` — not once at setup, so it re-measures after
`document.fonts.ready` changes section heights. `initial-value: 0` on
`--thread-len` means `stroke-dasharray: 0`, which the SVG spec defines as
*no dash pattern at all* — so a blocked import or reduced motion draws one
continuous hairline, not a half-drawn animation frame. Supersedes
`.maco-thread` for this run of the page without deleting it —
`theme-atmosphere.tsx` still references it.

**Interaction pass** — six existing sections each got one small,
pointer-fine-gated addition reusing `usePointerField`/CSS-only hover, no new
per-frame React state, no custom cursor: OPEN's mark now drifts with the
pointer (word-scale version of WORK's watermark parallax); EVIDENCE's
vignette centre follows the pointer while pinned; PRODUCTS' media panel
lifts on hover; IDENTITY's dial takes a small pointer nudge (±0.15 of a
step) layered on top of its scroll-driven position via one `calc()` term in
`identity-script`; METHOD's steps brighten their own border segment and
numeral on hover; RECORD's client tiles lift on hover.

**Verified live via Playwright** (`?motion=full` — this dev machine reports
`prefers-reduced-motion: reduce` by default): `--c`/`--d` sweep cleanly 0→1
with the pin releasing exactly when `--d` reaches 1; all 4 pins (EVIDENCE,
CAPABILITY, IDENTITY, METHOD) confirmed reaching `position: fixed` across a
full scroll, OPEN confirmed never pinning; the two grid columns' computed
`transform` values confirmed differing at the same scroll offset;
`--thread-len` confirmed non-zero after fonts load; zero console errors
across a full top-to-bottom scroll; zero horizontal overflow at 375px; both
themes screenshotted at the convergence's off-stage, mid-flight and locked
states and the grid's fixed backdrop. One correctness note for whoever
drives this next: `window.scrollTo()` alone does **not** move Lenis's real
scroll position — Lenis's own raf loop owns and re-asserts it every frame
(`autoRaf: false`, driven by `gsap.ticker`), so it snaps back. Live
verification has to scroll via `page.mouse.wheel()` (or `lenis.scrollTo()`
if scripting against the runtime directly), not `window.scrollTo`.
`tsc --noEmit`/`eslint`/`npm run build` clean throughout (same 2
pre-existing `/about`-only `MaCoGlobe` errors; homepage eager gzip 141.91 KB,
marginally smaller than before this pass).

---

## Brand Hero & Bug Fix pass (2026-08-18, same day, immediately after the Immersive Motion Rebuild below)

The user drove the Immersive Motion Rebuild in a real browser for the first
time — the first live feedback on any of it — and reported back four things,
verbatim in substance: the hero should be MaCo's brand alone (the real
`white-logo.png` mark + a big animated "MaCo"); the old hero and CLAIM should
merge into one stronger section with the video filling its frame; there's a
large empty gap after IDENTITY; and WORK moves horizontally then something is
"really wrong" when METHOD pops up mid-scroll. Separately, on the visual
language: the last update reads like `evirexsoft.com`, not MaCo — revert the
borrowed template devices, keep and deepen the real motion craft, make it "the
best animated, best smoothly animation website".

**Both scroll complaints were real bugs with provable root causes, found by
reading the code, not by guessing at tuning values:**

1. **WORK's pin distance and its rail transform measured two different
   things.** `work-sequence.tsx`'s `ScrollTrigger` `end` was
   `"+=" + (rail.scrollWidth - window.innerWidth)` — pixels, ≈3 viewport
   widths for 4 panels. But the rail was moved with
   `translate3d(${-progress * (n-1) * 100}%, 0, 0)` — a CSS percentage, which
   resolves against the rail's **own** width, not the viewport's. The rail is
   4 panels × `w-screen` wide, so `-300%` moved it `-12` viewport-widths where
   `-3` was intended: **4× too far**. The panels finished travelling at
   `progress ≈ 0.25`, and the remaining ~75% of the pinned scroll distance sat
   on an empty, fully-transitioned viewport — exactly "moves horizontally"
   then a long dead stretch. Fixed by computing `end` and the transform from
   the *same* function (`rail.scrollWidth - rail.clientWidth`, applied in
   pixels via `gsap.quickSetter(rail, "x", "px")`), so the two literally
   cannot disagree again.
2. **METHOD's `ScrollTrigger` was created before WORK's.**
   `useMediaQuery("(min-width: 1024px)")` — SSR-safe by design — initialises
   to `false` and only becomes `true` in an effect that runs after mount. So
   on the first render, `WorkSequence` renders the non-pinning `<WorkList>`
   (no trigger created) while `MethodLine` creates its trigger immediately.
   `<WorkRail>` (and its own trigger, with ~3 viewport-widths of pin-spacer)
   mounts one render later. `ScrollTrigger.refresh()` only re-measures the
   trigger currently being created, never siblings that already exist — so
   METHOD's `start` was measured against a document that didn't yet contain
   WORK's spacer, and its pin fired roughly 3 viewport-widths too early: it
   **popped up while WORK was still pinned**, and the space where METHOD
   should have been sat empty — the exact two symptoms reported, from one
   shared cause. Fixed by adding `scheduleRefresh()` to
   `lib/scroll-runtime.ts`: every scene calls it right after creating its own
   trigger, coalescing into one `ScrollTrigger.refresh()` on the next frame
   regardless of which scene mounted first. Also added
   `ScrollTrigger.config({ ignoreMobileResize: true })` at boot so a mobile
   URL-bar resize doesn't retrigger this cascade, and `invalidateOnRefresh:
   true` on WORK since its `end` is itself a measuring function.

**The four template-reading devices were deleted outright, not tuned down.**
`components/webgl/field-canvas.tsx` + `field-shader.ts` (the WebGL hero
field), `components/webgl/distort-surface.tsx` + `distort-shader.ts` (the
hover-distortion shader), `components/webgl/gl-utils.ts`,
`components/cursor-ring.tsx` (the blend-difference cursor companion), and
`components/motion/scramble.tsx` (text-scramble hovers) are all gone, along
with every call site and every `data-cursor="…"` attribute (dead once the
ring that read them was gone). This is a **design verdict, not a technical
one** — the code worked, `tsc`/`eslint`/`build` were clean, the shaders
rendered — but the combination read as generic-agency-template rather than as
MaCo. **Lenis and GSAP `ScrollTrigger`/`SplitText` were kept and deepened,
not reverted** — those are the actual scroll substrate (the pins, the
scrubs, `<LineReveal>`) and were judged to still be working; only the four
decorative devices layered on top of them are gone.

**New hero — `components/home/open-logo.tsx`.** Full-viewport, centred,
`data-ground="deep"`: the real mark (`<Mark src="/maco-mark-hero.png">`) +
the animated "MaCo" wordmark via a new `<SplitReveal>`
(`components/motion/split-reveal.tsx`) + the existing `MaCo`/location
eyebrows + a scroll cue that fades on its own `ScrollTrigger` scrub.
`white-logo.png` (1672×941 RGBA, confirmed by decoding its alpha channel
directly rather than assuming — 23.2% fully-opaque / 59.2% fully-transparent,
a white "m" monogram with no wordmark) was too heavy to ship as-is (637KB) for
something rendered purely as a CSS mask, where only the alpha channel is ever
read. `scripts/shrink-hero-mark.cjs` (pure Node `zlib`, no new dependency)
decodes the PNG, box-filters it down 2×, forces the color channel flat (dead
weight for a mask), and re-encodes as color-type-4 (grayscale+alpha) —
**637KB → 61.6KB**, confirmed to preserve the same alpha shape
(23.5%/59.0%) by decoding the output and comparing.

**`<SplitReveal>`** is the React Bits *Split Text* + *Shiny Text* concepts,
reimplemented on the runtime's own GSAP `SplitText` (same precedent as
`evidence-expand.tsx`'s ScrollExpand note — concept only, never copied code).
On mount: `SplitText(el, {type:"chars", mask:"chars"})` stagger-rises the
characters, then `split.revert()` restores plain text and a `.maco-shine`
class is added — a continuous `background-clip:text` gradient animated on
`background-position` at **115°**, deliberately the same angle
`.light-pass` uses everywhere else (`styles.css`), so the hero ties into
MaCo's one existing signature device instead of importing an unrelated
shimmer. SSR ships plain "MaCo" text the whole time; the split only exists
transiently client-side during the ~1s entrance.

**New `components/home/working-surface.tsx`** replaces `open-surface.tsx`
(deleted) and `claim.tsx` (deleted) — merges the old hero's statement/CTAs/
proof-row/video with the old standalone CLAIM into one section. The video fix:
previously a `16/9` window inset `left-[6%] right-[6%]` inside a taller `4/3`
(`lg:aspect-square`) panel — a small screen floating in a mostly-empty slab.
Now a single panel at the recording's own `16/9` aspect ratio, filled
edge-to-edge with `objectFit:"cover"`, zero crop — and at a typical ~640px
column width that's a ~0.63× downscale of the 1024px source, sharper than the
previous framing, not softer.

**Removed a full React re-render per scroll frame in four scenes.**
EVIDENCE, WORK, METHOD, and PRODUCTS all previously called `setProgress`/
`setSweep` from inside `ScrollTrigger.onUpdate` — a state update, and a full
component re-render, on every single scroll frame. All four now write
straight to refs' inline style / CSS custom properties in `onUpdate`
(`gsap.quickSetter` for WORK's transform), with derived values computed in
CSS `calc()` where that was cleaner (WORK's per-panel crossfade). Same visual
result, zero React involvement during scroll. This was found while fixing the
WORK bug (already touching that file) and applied consistently to the other
three scroll-driven scenes rather than leaving them inconsistent.

**Services collapsed from 5 to 2**, at the owner's direction — `content/maco.ts`'s
`services` array is now `business-software` (Task Management, CRM, Custom
Software) and `digital-solutions` (Websites, E-commerce, Branding and Design,
Social Media Management), as `capabilities` on each. Capability descriptions
reuse the retired five services' real copy wherever one substantively
overlaps (Task Management ← the old App Development's role/reporting text;
Custom Software ← Software Support's codebase/dependency text; Websites ←
Web Development's site-architecture text; Social Media Management ← Social
Media Managing's text, verbatim) — CRM, E-commerce, and Branding & Design have
no exact retired predecessor and are written in the same restrained,
procedural voice as the rest of the copy, no metrics or superlatives. Verified
service-slug references exist **only** inside `content/maco.ts` itself
(`evidence` arrays, `projects[].services`) — no component or route hardcodes a
slug — so remapping was a contained change: all four `services.index.tsx`
copy that claimed "five services" was fixed to match.

**`<LineReveal>`/`<Magnetic>` added to all 9 inner routes** (`about.tsx`,
`clients.tsx`, `products.index.tsx`, `products.$slug.tsx` — which already had
`MotionSection` from an earlier pass, so only the h1/CTAs needed it —
`services.index.tsx`, `services.$slug.tsx`, `work.index.tsx`,
`work.$slug.tsx`, `contact.tsx`). Headlines get `<LineReveal>`, index-row/
content blocks get staggered `MotionSection`, primary CTAs get `<Magnetic>`.
No pinned scenes outside the homepage — those stay homepage-only.

**Verified this pass:** `npx tsc --noEmit` clean (same 2 pre-existing
`/about`-only `MaCoGlobe` errors) after every batch of edits; `npx eslint
--fix` clean (0 errors/warnings — 12 pre-existing/self-introduced Prettier
diffs auto-fixed, no logic touched by the fix); `npm run build` clean, client
+ SSR, homepage eager chunk down to **141.96 KB gzip** (452.03 KB raw, from
the immersive-rebuild's 148.61 KB, still above the pre-rebuild 106 KB); an
SSR-level `curl` check of a running dev server confirming: correct `<title>`,
`<h1>` renders plain "MaCo" text server-side (the split is client-only, no
hydration mismatch risk), exactly 10 `<section>` tags, 0 `<canvas>` tags, 0
error-string occurrences, "Business Software"/"Digital Solutions" present, 0
occurrences of any of the 5 retired service slugs anywhere in the rendered
HTML; and a repo-wide grep confirming zero remaining references to
`FieldCanvas`/`DistortSurface`/`CursorRing`/`Scramble`/`data-cursor` anywhere
in `frontend/src`.

**No live-browser verification was performed this pass either** — same
constraint as the Immersive Motion Rebuild below, no browser-automation tool
was available this session. This means the two bug fixes above are verified
by re-deriving the exact arithmetic that was wrong and confirming the fix
removes the disagreement — not by actually scrolling the fixed page and
watching it. See "Next exact actions."

---

## Immersive Motion Rebuild (2026-08-18, same day as the real-media pass below)

Full plan at `C:\Users\LENOVO\.claude\plans\you-are-working-on-robust-flute.md`
("MaCo — Immersive Motion Rebuild"). The verdict after the real-media pass was
still "section to section very bore static feel" — the page had motion, but no
continuity, because every scene animated independently off its own
IntersectionObserver and the scroll itself was a raw native jump between them.
I raised concerns and offered a lighter alternative; **the user explicitly
chose the full immersive rebuild**, overriding that recommendation — a
deliberate call, not revisited here.

**Two research findings changed the risk picture before implementation.**
Lenis runs on real `window.scrollTo`, not a transform-wrapper like Locomotive
Scroll v4 — so the originally-flagged "Lenis will break the two pinned
sections" risk turned out not to be real, and `position:sticky` /
`getBoundingClientRect()` / `motion`'s own hooks all kept working. And GSAP
3.15 (ScrollTrigger + SplitText included) is free for commercial use — no Club
GSAP paywall.

**One finding was a real bug, not just a risk.** `evidence-expand.tsx`,
`work-sequence.tsx`, and `product-story.tsx` each ran
`useSpring(scrollYProgress, SPRING_SCROLL)` — correct when scroll itself was
instantaneous, but once Lenis smooths the scroll *source*, springing the
already-smoothed result double-smooths into visible lag, the opposite of what
was being asked for. Deleted all three as a mandatory, non-optional part of
the integration (not layered under Lenis). `SPRING_SCROLL` itself is now
removed from `lib/motion.ts` as dead code. Also deleted `hooks/use-scroll-scene.ts`,
confirmed dead (referenced by nothing but itself) during the same audit.

**Architecture — ownership is split, not layered.** Lenis owns raw scroll
position; GSAP `ScrollTrigger` owns every pin/scrub; `motion` v13 keeps only
discrete UI state (tabs, IDENTITY's reel, hover springs) and no longer touches
scroll; raw WebGL2 owns the hero field and hover-distortion. One rAF loop for
everything scroll-related (`gsap.ticker` drives `lenis.raf()`, `lenis`'s
scroll event drives `ScrollTrigger.update`); `motion` keeps its own
independent frameloop for the parts that never touch scroll. Full detail:
`CONTEXT.md §10` ("Scroll substrate & interaction layer") and `§12`.

**New: `src/lib/scroll-runtime.ts`** — a module-level singleton,
`getScrollRuntime(): Promise<ScrollRuntime | null>`. Returns `null` on the
server, under `prefers-reduced-motion: reduce`, or if construction throws, so
every consumer has exactly one `if (!rt) return;` bail-out. Dynamically
imports `lenis`/`gsap`/`ScrollTrigger`/`SplitText` in one chunk after first
paint. Wires `lenis.on("scroll", ScrollTrigger.update)` +
`gsap.ticker.add((t) => lenis.raf(t * 1000))` + `gsap.ticker.lagSmoothing(0)`.
Also exposes an `onScroll` subscription (used by `<FieldCanvas>` to drift the
WebGL field with scroll).

**New: `<ScrollRuntimeProvider>`** (`components/scroll-runtime-provider.tsx`),
mounted once in `__root.tsx`. Lifecycle only — boots the runtime, calls
`ScrollTrigger.refresh()` on `document.fonts.ready` and on a new
`"maco:media-ready"` custom event (dispatched by `ProductVideo`'s
`onLoadedData`, since a video's real dimensions arriving late is a classic
cause of pin start/end drift), re-homes scroll to 0 and refreshes
`ScrollTrigger` on route change, and tears everything down on unmount.

**New: `src/lib/skip-to-main.ts`** — the `#main` skip link now calls
`lenis.scrollTo(target, { immediate: true })` then explicitly focuses the
target, instead of a plain anchor jump that would otherwise fight Lenis's own
scroll ownership and leave keyboard focus somewhere the page didn't visually
land.

**The WebGL hero field — raw WebGL2, not `three`/R3F.** `three` is already
installed (for `/about`'s globe) but only via `react-globe.gl`; pulling it in
here for one fullscreen quad would cost ~170KB gzip for nothing. Hand-written:
`components/webgl/field-canvas.tsx` (~150 lines) + `field-shader.ts` (fbm
noise + cursor wake + a 115° raking moiré, matching `.light-pass`'s angle) +
`gl-utils.ts` (fullscreen-triangle trick — one triangle overflowing clip space
on all sides, cheaper than a two-triangle quad since there's no shared
diagonal edge to rasterize twice). Re-themes from `--bg`/`--text` via
`lib/read-css-color.ts` (resolves any CSS color, including OKLCH, to concrete
sRGB bytes by setting it on a hidden probe element, reading the computed
string, then rasterizing it through a 1×1 Canvas2D context — no hand-rolled
color-space math). Gated on `(pointer:fine)`, `!reduced`, `≥768px`, an
obtainable WebGL2 context, `!navigator.connection.saveData`; pauses its rAF
loop via `IntersectionObserver` (hero off-screen) and `visibilitychange`
(hidden tab); handles `webglcontextlost`; DPR capped at 1.5. Renders `null` if
any gate fails — the container is always `position:absolute`, so there is
**zero CLS** whether it mounts or not.

**Hover-distortion — scoped to real imagery only.** `<DistortSurface>`
(`components/webgl/distort-surface.tsx` + `distort-shader.ts`) ships on the
two PRODUCTS posters and the EVIDENCE frame — the only real raster assets in
the repo besides logos. Deliberately **not** applied to WORK: there are no
case-study screenshots, and sourcing/inventing stock imagery to have a surface
to distort would violate the project's own standing rule against fabricated
evidence (`CONTEXT.md §2`). One WebGL context per instance, created lazily on
first `pointerenter` (fine pointers only) and torn down on unmount — at most
two are ever live at once.

**Interaction layer (global chrome):** `<CursorRing>` (native cursor stays
visible; a small `mix-blend-mode:difference` ring trails it via two
independent critically-damped springs — never a single 2D-distance spring,
per the apple-design rule — expands and labels itself over `data-cursor="…"`
targets); `<Magnetic>` (finally uses the `rubberband()`/`SPRING_MOMENTUM` pair
that had sat unused in `lib/motion.ts` since an earlier session; wraps header/
footer CTAs, `ThemeSwitch`, WORK's "All work" link); `<Scramble>` (text-scramble
on hover, charset restricted to a ±8-codepoint neighborhood of the string's
own script so an Indic/Arabic/etc. label can never scramble into another
script's glyphs; width pinned by a hidden sizing copy so nothing reflows
mid-scramble); `<LineReveal>` (GSAP `SplitText` line-mask reveal + a one-shot
`ScrollTrigger`, on CLAIM/CLOSE headlines).

**Scene rewrites.** EVIDENCE and WORK moved from `motion`'s
`useScroll`+`useSpring`+pin-via-sticky-div to `ScrollTrigger.create({ pin:
true, scrub: 0.3, ... })`, which computes its own pin-spacing — the
hard-coded `height:"220vh"` wrapper is gone. METHOD became a genuinely
different mechanic on purpose (the plan's own rule against repeating a
device): a pinned **vertical** step-through (~150vh pin) with a progress spine,
rather than WORK's horizontal rail — its four-step reduced-motion fallback (the
static grid) is unchanged. PRODUCTS' `--sweep` moved from `useScroll`+
`useSpring` to a `ScrollTrigger` `scrub` writing the custom property directly
in `onUpdate`.

**Two real bugs found in `<Magnetic>`**, both while reasoning through the
responsive header CTA (`chrome.tsx`), not from a live test — no browser tool
was available to catch them by trial:
1. The component hardcoded `style={{ display: "inline-block" }}` on its
   `motion.div`. Inline styles always beat class-based `display` rules, so
   passing `className="hidden lg:inline-flex"` (the header CTA's actual
   responsive class) would have been silently ignored — the CTA would render
   on every viewport regardless of the `lg:` breakpoint. Fixed by removing the
   hardcoded `display` and letting `className` fully own it.
2. The `!capable || reduced` early return was `<>{children}</>` — a bare
   fragment that discarded `className` entirely. On a touch device or under
   reduced motion, the header CTA's `hidden lg:inline-flex` class would be
   lost, making it always-visible on mobile (duplicating `MobilePillNav`'s own
   separate CTA). Fixed by returning `<div className={className}>{children}</div>`.

**One real bug found in `<ScrollRuntimeProvider>`** on final review: the
`"maco:media-ready"` listener's cleanup function was `return`ed from inside
the `getScrollRuntime().then(...)` callback — but a `.then()` callback's
return value is just the resolved promise value, not an effect-cleanup
function, so that cleanup was silently discarded and the listener would leak
on unmount. Fixed by hoisting the listener reference to the outer effect scope
and removing it from the *outer* effect's own returned cleanup instead.

**A recurring TypeScript pattern, fixed everywhere it appeared (~30 sites
across 4 files):** a nested `function foo(){}` declaration inside a
`useEffect` does not preserve an outer `const x = ref.current; if (!x) return;`
non-null narrowing of `x` when referenced inside it — because a hoisted
function declaration is conceptually callable from anywhere in the enclosing
scope, including before the narrowing check runs. A `const foo = () => {}`
arrow expression does not have this problem, since that binding can't exist
before its own declaration point. Converted every nested function to a const
arrow in `field-canvas.tsx`, `distort-surface.tsx`, `cursor-ring.tsx`, and
`scramble.tsx`.

**Honest costs, measured from a real build (not estimated):** lazy chunks —
`lenis` 5.39 KB, `gsap` core 27.42 KB, `ScrollTrigger` 17.54 KB, `SplitText`
3.26 KB gzip, **≈53.6 KB total**, fetched after first paint (LCP unaffected).
The homepage's *eager* entry chunk also grew — **106 KB → 148.61 KB gzip** —
more than the plan's own estimate implied, because the new component glue
code (not the lazy-loaded libraries) is statically imported. Two new runtime
dependencies (`gsap`, `lenis`) end this project's prior zero-new-dependency
line, by the user's explicit decision.

**What was actually verified this pass, and what wasn't (read this
carefully):** `npx tsc --noEmit` clean (same 2 pre-existing `/about`-only
`MaCoGlobe` errors), `npx eslint` clean (0 errors/warnings — including after
extracting `skipToMain` out of `scroll-runtime-provider.tsx` to satisfy
`react-refresh/only-export-components`), `npm run build` clean (client + SSR),
and an SSR-level `curl` check of the running dev server's rendered HTML
(title/h1/IDENTITY script text present, exactly 10 `<section>` tags, 0
`<canvas>` tags server-side — confirming the client-only WebGL/cursor
components don't cause a hydration mismatch, 0 error-string occurrences).

**No live-browser verification was performed this session.** I looked for a
working browser-automation tool (`ToolSearch` for playwright/browser tools,
checked for a `playwright`/`playwright-cli` package in the repo and globally)
and found none available, despite `.playwright-cli/*` artifacts existing from
an earlier session that apparently had one. This means none of the following
has actually been checked, only reasoned about: how the WebGL field actually
looks/performs, headline contrast over it in either theme, whether the two
`ScrollTrigger` pins actually scrub smoothly end to end, keyboard/skip-link
behavior under Lenis, `prefers-reduced-motion`/`forced-colors`/
`prefers-contrast` in a real browser, touch-device behavior, or any real
performance number (LCP/CLS/TBT). Per `CONTEXT.md §16`, this must not be
reported as done — see "Next exact actions" below for the concrete list.

---

## Real media pass (2026-08-18, same day as the QA pass above)

The user supplied real assets — `src/assets/Bridge Demo.mp4` (a 10.4 MB / 55 s screen recording of Bridge), and 6 real logo/product PNGs in `public/` (Ananta Nethralaya, Al Afzah, Soorath Autos, HeadGreen, Bridge, plus a Driver's Diary product photo). This closed the biggest remaining gap from the QA pass: six of ten movements had been rendering `SurfaceMedia`'s empty gradient fallback because no imagery existed.

**Pipeline** — `scripts/build-media.mjs` (`npm run media`), a dev-only script using `ffmpeg-static` (devDependency, never imported by app code). Produces `public/media/bridge/{capture.webm,capture.mp4,poster.{jpg,avif,webp}}` (video trimmed to the most legible ~26s of the recording — dashboard → calendar → tasks kanban, chosen by reviewing extracted frames, not guessed) and `public/media/brand/*.webp` (resized, WebP-encoded logos). Two sources (`Ananta Nethralaya.png`, `Bridge.png`) had an opaque baked-in matte (black and near-white respectively) — keyed to real transparency with ffmpeg's `colorkey` filter and verified by compositing the output onto both a dark and light test background before shipping (no fringing on either).

**Content model** — `content/maco.ts` gained `Brand` (logo: src/alt/width/height) and `Media` (poster/video/width/height) interfaces, applied to `Project.brand`, `Product.brand`/`media`, and a newly-typed `Client` interface with `brand`. Also fixed a pre-existing slug mismatch (`al-afzah-group` client vs. `al-afzah` project).

**New component** — `components/media/product-video.tsx` (`ProductVideo`): poster-first (the `<picture>` is server-rendered, the LCP candidate), `<video>` never fetches (`preload="none"`, no `<source>`) until armed by an IntersectionObserver on a capable device or a user pressing play. Never autoplays on touch-primary devices, viewports under 768px, `saveData`, or a throttled connection — those get the poster and an explicit play control instead, verified with a real tap on a 390px viewport. `prefers-reduced-motion` gets the same treatment. Reused in the hero (`open-surface.tsx`, inset 16:9 window inside the tilted panel — deliberately NOT filling the whole panel, so the `<h1>` stays the LCP element, not the video), EVIDENCE (`evidence-expand.tsx`), and PRODUCTS (`product-story.tsx`).

**EVIDENCE's expansion range was capped** — the source video is 1024×576; expanding the clip-path all the way to `inset(0)` at a 1440px viewport would have upscaled it ~1.56×, reading as soft. Capped at `inset(6%)` (~1.24× upscale, still sharp), with the scrim carrying a bit more of the "fills the screen" feeling to compensate (`0.5 → 0.22` instead of `0.5 → 0.05`).

**WORK** rail/list panels gained the client's real logo plus a new internal `/work/$slug` "Case study" link alongside the existing external "Visit site" link (the case-study copy already existed in `content/maco.ts` and was never surfaced on the homepage).

**RECORD** — the client list became a real logo wall (bordered tiles). One real, visible issue found and fixed: Soorath's bright-yellow logo read poorly on a plain white tile — fixed by using `--surface-2` (a token that already existed) for the tile background instead of `--surface`, plus a uniform, subtle `drop-shadow` on every logo (not a per-logo special case) for edge definition. Verified by screenshot before/after.

**CAPABILITY** gained real `service.evidence[]` chips (linking to the actual projects/products that prove each service) — data that already existed and was already used on `/services/$slug`, just never surfaced on the homepage.

**IDENTITY was rebuilt as a script reel** — the active script centred and prominent, neighbours visible either side and falling off toward the edges, rather than a single cross-fading word. Position is per-item, from signed circular distance to the active index (not a translated track — with 13 items a translated track would visibly rewind 12 slots on the wrap; circular distance puts that seam at the point where opacity is already 0). Zero DOM measurement — every item occupies an identical CSS `--slot` width. Added a real WCAG 2.2.2 pause control (the auto-advancing interval had none before). Reduced motion freezes the reel as a static multi-script composition, not a blank state.

**METHOD had a real, verified bug**: each of the four A→B→C→D steps carried `className="reveal"`, a CSS animation that starts at **mount**, not on scroll — so all four had already finished animating before anyone scrolled far enough to see them. This section was *guaranteed* to look static regardless of any other work. Fixed by moving each step to its own `MotionSection` (now supports `as="li"`), and added the progressive top-rule scroll-linked draw the original plan specified and never built.

**Chrome** — the navbar mark was genuinely too small (`size=28` in an 80px bar); `Wordmark` gained a `size` prop, default raised to 36, header height bumped slightly. The footer had no logo at all (verified) — added a `Wordmark` lockup at the top of the footer content.

**Cross-cutting fix**: `[data-ground="paper"]` had no CSS rule block at all (verified — it appeared only in a comment); it worked by accident because paper happened to equal the `:root` defaults, so a paper section nested inside a deep one would have silently inherited deep tokens. Added an explicit reset block, mirroring the existing `-inverted` token-naming convention with a new `-paper` suffix.

**Deliberately not done**, stated as a decision: no invented metrics/testimonials/counters (evirexsoft.com's strongest devices, but MaCo has no data for any of them), no marquees/carousels (the exact devices the original reset removed), no WebGL (Lusion/Unseen Studio/14islands were cited as references for pacing ambition only, not technique — a marketing site for operational software opening with a 3D world would contradict its own message).

Verified this pass: `tsc`/`build` clean, zero console errors (fresh load, both themes via a real click not a DOM hack, mobile, reduced motion), zero horizontal overflow at 390/1440, tap-to-play confirmed on mobile, the reel's advance confirmed via direct DOM state reads (not just screenshots, which can land mid-transition and mislead).

---

## Read this first

`HOMEPAGE_REDESIGN_PLAN.md` at the repo root is the authoritative plan for the homepage — visual thesis, what was removed, what was preserved, the full component architecture, and the phase-by-phase implementation order. This file is a status snapshot, not a replacement for it. If they disagree, trust the plan for intent and this file for "is it actually built."

Entries in earlier versions of this document describing "THE MONUMENT" hero, `capability-statement.tsx`, `work-strip.tsx`, `process-sticky.tsx`, `service-vocabulary.tsx`, `products-section.tsx`, `clients-ticker.tsx`, `cta-banner.tsx`, and `signature-system-section.tsx` **described files that have since been deleted.** They are not carried forward here — do not assume any of that architecture still exists. Verify against the actual repo, not this file's history.

---

## What the homepage is now

Ten movements, composed in `frontend/src/routes/index.tsx`, each built under `frontend/src/components/home/`:

```
OPEN         deep    open-logo.tsx            hero — MaCo's brand alone: mark + animated "MaCo" (SplitReveal)
SURFACE      paper   working-surface.tsx      promise + proof row + CTAs + Bridge video, scrubbed lay-flat + sweep
EVIDENCE     deep    evidence-expand.tsx      ScrollTrigger pin+scrub expand, aspect-locked to real 16:9 footage
WORK         deep    work-sequence.tsx        4 real projects — ScrollTrigger pin+scrub rail (desktop) / list (mobile)
CAPABILITY   paper   capability-selector.tsx  sticky scroll-driven service selection (2 tabs), click/arrow still wins
PRODUCTS     paper   product-story.tsx        sticky overlap stack — each card a deep tile on the paper page
IDENTITY     deep    identity.tsx             "One name. Many scripts." — fully scroll-driven dial, --t custom prop
METHOD       paper   method-line.tsx          A → B → C → D — ScrollTrigger pinned vertical step-through
RECORD       paper   record.tsx               clients + company — one RakingSurface pass + low-amplitude settle
CLOSE        deep    close-intake.tsx         center-out rule draw, biggest scrub reveal, final light pass
```

Plus `components/home/ground-handoff.tsx` (`<GroundHandoff>`), mounted once
after `<CloseIntake>` in `routes/index.tsx` — renders nothing itself, drives
the 4 cross-section recession pairs described above.

`open-surface.tsx` and `claim.tsx` are deleted — OPEN and SURFACE above
replace them (see the Brand Hero & Bug Fix section). No `components/webgl/*`,
`cursor-ring.tsx`, or `motion/scramble.tsx` exist anymore — reverted the same
day they were added, see that section for why. `MotionSection` has exactly one
remaining call site on the homepage (`method-line.tsx`'s reduced-motion
static branch, inert by construction) — every other homepage call site
migrated to the `ScrubReveal`/`RuleDraw`/`Stagger`/`RakingSurface` vocabulary
during the 2026-08-19 motion rebuild (see that section above).

Scroll substrate: `lib/scroll-runtime.ts` (Lenis + GSAP singleton, exposing
`scheduleRefresh()` + `destroy()`) + `components/scroll-runtime-provider.tsx`
(lifecycle, mounted in `__root.tsx`). `hooks/use-scroll-scene.ts` (~30 lines,
wraps `gsap.context()` for auto-cleanup) is the standard entry point every
scroll-linked component uses now — re-added 2026-08-19 after being deleted as
dead code in an earlier pass, in place of adding `@gsap/react`. Interaction
layer (global, site-wide — homepage and inner pages both):
`components/motion/{magnetic,line-reveal,split-reveal,scrub-reveal,rule-draw,stagger,raking-surface}.tsx`.
Shared infrastructure: `components/media/surface-media.tsx` (three-tier media
slot), `components/media/product-video.tsx` (`ProductVideo`),
`hooks/use-media-query.ts`, `hooks/use-pointer-field.ts`, `lib/motion.ts`
(shared motion-preference resolver, §"Homepage Motion Rebuild" above, plus
motion-only springs — scroll-linked smoothing is Lenis/`ScrollTrigger`'s job).

---

## Typography (pivoted 2026-08-18, superseding an earlier Instrument Serif / Fraunces attempt)

User's explicit picks, split per theme so Obsidian and Cobalt are genuinely different type systems, not a recolor:

| Theme | Display | Body | Label |
|---|---|---|---|
| Obsidian | Unbounded | Jost | Agdasima |
| Cobalt | Michroma | Tenor Sans | Krona One |

Declared as `--maco-font-display` / `--maco-font-body` / `--maco-font-label` in per-theme blocks in `styles.css`. Loaded via a single combined Google Fonts request in `routes/__root.tsx`:

```
https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&family=Jost:ital,wght@0,100..900;1,100..900&family=Agdasima:wght@400;700&family=Michroma&family=Tenor+Sans&family=Krona+One&display=swap
```

Michroma, Tenor Sans, and Krona One are single-static-weight families (verified via the CSS2 API before wiring in) — do not add `wght` axes to their font-family declarations, they don't exist.

---

## Logo

Real brand mark, not an invented approximation. `public/logo-mark.png` is a URL-safe copy of the existing `logo final-07 (1).png`, used throughout chrome (header, footer, mobile nav) at small sizes. `components/mark.tsx`'s `Mark` component renders it via `mask-image` (+ `-webkit-mask-image`) with `background-color: currentColor` — so the same asset auto-recolors correctly on any ground/theme without needing separate light/dark exports; `Mark` now also accepts a `src` override for exactly this reason.

**`white-logo.png` is used now** (2026-08-18, Brand Hero pass) — the earlier note that it was "deliberately not used" is superseded. The user asked for it specifically for the hero. Decoded directly (not assumed): RGBA 1672×941, a white "m" monogram with a real alpha channel (23.2% fully-opaque / 59.2% fully-transparent), no wordmark baked in. At 637KB it was too heavy to ship as-is for a mask that only ever reads alpha — `scripts/shrink-hero-mark.cjs` downsamples 2× and re-encodes as grayscale+alpha (dropping the unused color channels), producing `public/maco-mark-hero.png` at 61.6KB, confirmed (by decoding the output) to preserve the same alpha shape. `open-logo.tsx` renders it via `<Mark src="/maco-mark-hero.png">`, same mask technique as the small mark.

---

## The signature device — light-pass

The plan's central visual thesis (§1) is one raking-light device reused at multiple scales. The CSS (`@utility light-pass`, `styles.css`) reads a `--sweep` custom property (0–1) to position the light band. Originally inert everywhere (no component set `--sweep`) — fixed in the real-media pass, then re-plumbed onto GSAP `ScrollTrigger` in the Immersive Motion Rebuild, and updated again this pass when `open-surface.tsx` was replaced:

- `working-surface.tsx` (was `open-surface.tsx`) — `--sweep` tied to the existing pointer-tilt field (`var(--px, 0.5)`), so the light follows the same cursor input as the video panel's 3D tilt.
- `evidence-expand.tsx` — `--sweep` written directly (`frame.style.setProperty("--sweep", String(progress))`) from a `ScrollTrigger.onUpdate`, not through React state or a `motion` `MotionValue`.
- `product-story.tsx` — `ProductMedia` gives each product card its own `ScrollTrigger` (`start: "top bottom"`, `end: "bottom top"`, `scrub: 0.3`) writing `--sweep` directly onto that card's element, so the sweep is per-card, not global.

The hero wordmark's `.maco-shine` (new this pass, `<SplitReveal>`) is a
related but separate device — same 115° angle, but a `background-clip:text`
gradient animated on `background-position`, not a `.light-pass` instance.

`WorkPanel` (WORK's rail cards) does not carry `light-pass` — it never had a media slot to begin with (pure text + numeral), so nothing was retrofitted there rather than inventing a surface that doesn't exist in the design.

---

## Contact form (`routes/contact.tsx`)

Was silently fake: if `VITE_API_BASE_URL` was unset (it was, everywhere), the handler did `setState("sent")` and showed a success message while sending nothing. Every submission was discarded. Fixed:

- Real `POST` to `/api/v1/contact/`, explicit payload construction (`service_interest` omitted entirely when empty, since DRF's `SlugRelatedField` 400s on `""`).
- Errors surfaced from DRF's response body, not swallowed.
- Honeypot field (`website`) wired client-side to match the backend's existing spam check.
- Verified end-to-end against a live Django + Postgres backend: curl tests, a real Playwright browser submission, and a direct DB query confirming the row landed (then cleaned up).

`frontend/.env.example` documents `VITE_API_BASE_URL=http://localhost:8000`.

---

## Mobile nav (`components/chrome.tsx`, `MobilePillNav`)

Had `aria-modal="true"` with no actual focus trap and no backdrop dismissal. Added: Tab/Shift+Tab wrapping inside the panel, a backdrop `<button>` for click-to-dismiss, Escape already worked via existing logic. Verified via real keyboard-driven Playwright interaction (not just code review) — Tab wrap, Shift+Tab wrap, Escape, backdrop click all confirmed.

---

## WORK section desktop rail (`components/home/work-sequence.tsx`)

Desktop (`lg+`, no reduced motion): pinned horizontal rail, one panel per project, driven by GSAP `ScrollTrigger` (`pin`+`scrub`, see the Brand Hero & Bug Fix section above for the 4× pin/transform bug found and fixed here 2026-08-18). Mobile / reduced-motion: plain vertical list (`WorkList`), no pinning.

A real straddling bug was found by manually scrubbing the built rail (not assumed from reading the code, in an earlier pass before ScrollTrigger): with no scroll-snap, stopping mid-scroll left two projects' content straddling the viewport simultaneously, with a numeral orphaned from its own title. Fixed with per-panel scroll-linked opacity in `WorkPanel` — the panel closer to full-frame reads clearly, its neighbor fades. This fix survived the later move to `ScrollTrigger` and the later move to a CSS `calc()`-driven `--opacity` (Brand Hero & Bug Fix pass) — same behavior, different mechanism underneath.

---

## Hydration fix (`routes/__root.tsx`)

`RootShell`'s pre-hydration `<script>` reads `localStorage["maco-theme"]` and sets `data-theme` on `<html>` before React hydrates — necessary so a Cobalt user never sees an Obsidian flash. This legitimately mutates the DOM before hydration, which without `suppressHydrationWarning` produces a real (verified, not hypothetical) console hydration-mismatch error on every load where the persisted theme differs from the hardcoded server default. Fixed by adding `suppressHydrationWarning` to the `<html>` tag. Re-verified with a fresh navigation carrying a persisted Cobalt preference: zero console errors.

---

## Tests / checks run

| Command | Result |
|---------|--------|
| `npm run build` | PASSED (client + SSR), re-run after the Brand Hero & Bug Fix pass — eager chunk 452.03 KB / 141.96 KB gzip |
| `npx tsc --noEmit` | 2 pre-existing errors only, both in `hero/MaCoGlobe.tsx` (`/about`-only, unrelated — missing `@types/three`, a `GeoJsonGeometry` accessor mismatch) |
| `npx eslint --fix` | 0 errors/warnings (12 Prettier-only diffs auto-fixed, no logic changed) |
| SSR `curl` check of `npm run dev` (port 5183) | title correct, `<h1>` = plain "MaCo" text, 10 `<section>` tags, 0 `<canvas>` tags, 0 error-string occurrences, both new service names present, 0 old service slugs |
| Repo-wide grep | 0 remaining references to `FieldCanvas`/`DistortSurface`/`CursorRing`/`Scramble`/`data-cursor` in `frontend/src` |

**The browser QA below is from the real-media pass and predates BOTH the
Immersive Motion Rebuild and the Brand Hero & Bug Fix pass — none of it
covers Lenis, GSAP ScrollTrigger, the new hero, or either bug fix. No
browser-automation tool was available in either later session to re-run any
of this against the new code — see "Next exact actions."**

Manual browser QA run 2026-08-18 (Playwright CLI against a live `npm run dev`), predates the Immersive Motion Rebuild:

- Fresh load, both themes: zero console errors, including the theme toggle exercised as a real click (not a DOM attribute hack).
- Full-page scroll at 1440px and 390px: zero horizontal overflow.
- Mobile (390×844) screenshotted through every movement: WORK falls back correctly to a list, CAPABILITY renders as an accordion, no layout breaks.
- `prefers-reduced-motion: reduce` emulated via `page.emulateMedia`: EVIDENCE renders its static composed layout (not a frozen mid-animation frame), WORK falls back to the list — zero console errors.
- Keyboard: skip link + full desktop nav reachable via Tab in order; focus ring (2px solid outline) confirmed present on the active element via computed style.

**Not yet run:** the full 7-width matrix (375/430/768/1024/1280 not re-checked against the current font/logo system), Cobalt at widths other than 1440, any real performance measurement (LCP/CLS/long-task), a dedicated motion audit pass, or a full screen-reader walkthrough.

Twice during this session, the browser console showed a `ReferenceError: <Component> is not defined` for a component that plainly existed in the saved source and passed both `tsc` and `npm run build`. Both times this was stale Vite HMR module-swap noise from editing the file live under the dev server — confirmed by a fresh `goto()` navigation showing zero errors immediately after. If you see this pattern again, don't chase it as a real bug without first trying a clean navigation.

---

## Do NOT change without a real reason

1. Don't reintroduce grid overlays, marquees, pulsing dots, or `NN —` numbered eyebrows — the plan's entire premise is removing this template, and it was removed deliberately across 14 files.
2. Don't invent claims, metrics, or names not traceable to `content/maco.ts` — the reset's second major finding was that the old homepage was making false claims (`4 Products Deployed`, `2+ Years Engineering`, `HeadGreen Mobility`, fake delivery dates). Any new copy needs the same audit. This now also covers the services rewrite: every capability description either reuses a retired service's real copy or is a plain, unembellished statement — no invented metrics were added to justify the new CRM/E-commerce/Branding sub-items.
3. Don't add a second contact form on the homepage — `CloseIntake` deliberately links to `/contact` rather than duplicating it (see the comment in `close-intake.tsx`).
4. Don't touch the 46 `components/ui/` shadcn files as part of homepage work — dead code, logged as an explicit out-of-scope follow-up in the plan's risk register.
5. Keep `system-field.tsx` — retired from the homepage but still imported by `/about` and `/products/$slug`.
6. Two themes must stay genuinely different type systems (current split above), not a shared font with recolored surfaces.
7. Don't add a second scroll-smoothing layer on top of Lenis — no `useSpring`/`useTransform` on `scrollYProgress` anywhere. Lenis owns scroll, GSAP `ScrollTrigger` owns pins/scrubs, `motion` owns discrete UI state only.
8. Don't reintroduce WebGL, a custom cursor, or text-scramble to the homepage without a genuinely new reason and, this time, actual live-browser verification before calling it done. Two WebGL passes were built and reverted the same session (§ Brand Hero & Bug Fix above). A third, `<BlindsField>` (§ Hero WebGL Blinds Field pass above), shipped 2026-08-19 — reimplemented on `three` rather than a new WebGL dependency, scoped to OPEN only, and live-verified via Playwright (canvas mounts/sizes correctly, mouse-reactive, reduced-motion fallback confirmed, zero console errors). If it's touched again or extended to another section, it still needs to survive being looked at in a real browser first — this rule isn't retired, just satisfied for the current scope.
9. Don't let WORK's pin `end` and its transform be computed from two different measurements again — that was the 4× bug. If either changes, change both from the same `distance()`/measurement function.
10. Don't claim a pass "tested" or "verified" beyond `tsc`/`eslint`/`build`/SSR-curl unless it was actually driven in a real browser — two consecutive passes shipped on static verification alone before a Playwright tool became available; the 2026-08-19 motion rebuild broke that pattern (every commit above was live-verified). Keep doing that going forward — it's the standard now, not an exception.

---

## Next exact actions

1. Full 7-width matrix (375, 390, 430, 768, 1024, 1280, 1440), both themes,
   against the current (2026-08-19 motion-rebuild) build — only spot-widths
   were sampled live this pass, not the full matrix.
2. `forced-colors: active` and `prefers-contrast: more` — not checked this
   pass or any prior one.
3. Real touch-device input — this pass used DevTools touch emulation only,
   not a physical device.
4. Measure real performance: LCP, CLS, and long-task profiling during scroll
   on a throttled CPU profile — the plan defines budgets (§13) never actually
   measured against.
5. Full screen-reader walkthrough beyond the keyboard-nav spot-check already
   done.
6. Optional, deferred (not re-requested since being deferred, see "Homepage
   Motion Rebuild" above): Phase 3.2's OPEN-mark→header shared-element
   handoff; Phase 3.3's single document-level `--sweep` driven off Lenis
   `documentElement` progress (currently each `RakingSurface` runs its own
   independent `ScrollTrigger`).
7. Deferred at the user's explicit choice ("hero first", 2026-08-19): the
   second half of the hero-upgrade request — regrouping homepage sections
   into continuous light/dark blocks instead of the current deliberate
   `paper`/`deep` alternation, curved "sheet" section overlays, and
   extending `ScrollThread` from WORK→CAPABILITY→PRODUCTS to the full
   page. Needs its own brainstorm/design pass before implementation — it's
   a genuine re-theme of the homepage's visual rhythm, not a small tweak.
8. Once the above land, update `PROJECT_STATUS.md`, `ROADMAP.md`, and
   `CONTEXT.md` again (all four updated 2026-08-19 alongside this file to
   reflect the motion rebuild, and again the same day for the hero WebGL
   pass).
