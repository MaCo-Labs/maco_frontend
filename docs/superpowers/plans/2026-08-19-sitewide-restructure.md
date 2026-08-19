# Sitewide Ground Regroup, Curved Sheet & Full-Page ScrollThread Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Regroup the homepage's 10 sections from 7 alternating light/dark runs into 5 larger chapters, add a curved-sheet transition at the 2 boundaries where it's structurally safe, and extend the `ScrollThread` line motif from 3 sections to the full page.

**Architecture:** Two `data-ground` flips (no reordering) consolidate the runs. `GroundHandoff` — which already recedes an outgoing section into an incoming one at 4 hand-picked pairs — gains an optional curved-corner reveal on 2 of those 4 pairs, driven by the same scroll window, using a `clip-path: inset(... round ...)` tween (no new DOM, no new file). `ScrollThread`'s wrapper widens from 3 sections to the whole page; its stroke switches from ground-token inheritance (`var(--line-strong)`) to `mix-blend-mode: difference`, which computes against whatever's actually rendered behind it instead of relying on DOM ancestry — the only way one continuous stroke can stay legible across 5 different ground regions.

**Tech Stack:** React 19 + TanStack Router/Start, GSAP 3 (ScrollTrigger) via the existing lazy `scroll-runtime.ts` singleton, Lenis, Tailwind v4 (`@utility`), no test runner in this repo (`frontend/package.json` has no `test` script) — verification is `npm run lint`, `npm run build`, and manual scroll-through in the dev server, matching how every other motion task in this codebase (see recent commits) was actually verified.

**Spec:** [docs/superpowers/specs/2026-08-19-sitewide-restructure-design.md](../specs/2026-08-19-sitewide-restructure-design.md) — read this first; it has the full boundary-by-boundary hazard table this plan implements.

## Global Constraints

- Never apply a `transform` (or a GSAP tween that produces one) to a section that hosts a ScrollTrigger pin, directly or via a `matchMedia`-gated descendant: **EVIDENCE, CAPABILITY, IDENTITY, METHOD**. Only touch outgoing sections that are pin-free.
- `data-ground="paper"|"deep"` is a CSS custom-property remap (`styles.css:284-310`), not a transform — safe to flip on any section regardless of pin status.
- Every scroll-linked effect in this codebase goes through `useScrollScene` (`frontend/src/hooks/use-scroll-scene.ts`), which resolves `getScrollRuntime()` and bails to a no-op on SSR, reduced motion, or a blocked dynamic import — so a section's default JSX (no inline transform/clip-path) must always be its own correct static composition. Do not add a separate reduced-motion branch to code that already goes through `useScrollScene`.
- One accessible/visual family per device: the curved-sheet mechanism in this plan reuses `ground-handoff.tsx`'s existing hand-picked-pairs pattern and its existing `rt.gsap.fromTo(...)` idiom — do not introduce a second, differently-shaped mechanism for it.

---

## Task 1: Ground regroup — flip SURFACE and WORK

**Files:**
- Modify: `frontend/src/components/home/working-surface.tsx:56`
- Modify: `frontend/src/components/home/portfolio-grid.tsx:49` (section ground)
- Modify: `frontend/src/components/home/portfolio-grid.tsx:138-143` (tint comment)
- Modify: `frontend/src/components/home/portfolio-grid.tsx:157-168` (card comment + nested `data-ground`)
- Modify: `frontend/src/components/home/product-story.tsx:17-20` (stale cross-reference comment)

**Interfaces:** None — this task changes only `data-ground` attribute values and their explanatory comments. No new props, no new exports.

- [ ] **Step 1: Flip SURFACE's outer ground**

In `frontend/src/components/home/working-surface.tsx:56`, change:

```tsx
    <section data-ground="paper" className="rule-t" aria-label="What MaCo does">
```

to:

```tsx
    <section data-ground="deep" className="rule-t" aria-label="What MaCo does">
```

- [ ] **Step 2: Flip WORK's outer ground**

In `frontend/src/components/home/portfolio-grid.tsx:49`, change:

```tsx
    <section data-ground="deep" className="rule-t" aria-label="Selected client work">
```

to:

```tsx
    <section data-ground="paper" className="rule-t" aria-label="Selected client work">
```

- [ ] **Step 3: Flip WORK's nested card tile so it still pops**

The `GridCard` image plate only reads as a "bright card popping out of a dark frame" because WORK's own ground used to be deep. With WORK now paper, a paper-on-paper tile has no contrast — flip it to deep so it becomes a dark tile on a light frame instead (the same device `product-story.tsx`'s `ProductMedia` already uses).

In `frontend/src/components/home/portfolio-grid.tsx`, replace the comment block at lines 138-143:

```tsx
  // 20 -> 55%: on Cobalt (a chromatic --accent) this reads as an
  // increasingly saturated blue block. On Obsidian, where --accent is
  // achromatic by design (two genuinely different themes, not a recolor
  // — see styles.css), the same formula degrades gracefully to a
  // deliberate light/dark value block instead of a color one, which is
  // what data-ground="paper" below is actually doing the work for.
```

with:

```tsx
  // 20 -> 55%: on Cobalt (a chromatic --accent) this reads as an
  // increasingly saturated blue block. On Obsidian, where --accent is
  // achromatic by design (two genuinely different themes, not a recolor
  // — see styles.css), the same formula degrades gracefully to a
  // deliberate light/dark value block instead of a color one, which is
  // what data-ground="deep" below is actually doing the work for.
```

Then replace the comment block + nested element at lines 157-168:

```tsx
      {/* The "vibrant backdrop card" the reference asks for, adapted to
          this design system's actual palette: WORK's section ground is
          deep (dark), so flipping just this image plate to
          `data-ground="paper"` reads as a bright card popping out of a
          dark frame — real value contrast in both themes, and on Cobalt
          the paper ground's OWN accent is still chromatic, so the
          color-mix below still lands as a genuine blue tint on top of
          that brightness. Same ground-swap device product-story.tsx's
          `ProductMedia` already uses, just inverted (paper tile on a
          deep card here, vs. a deep tile on a paper card there). */}
      <div
        data-ground="paper"
        className="relative"
```

with:

```tsx
      {/* The "vibrant backdrop card" the reference asks for, adapted to
          this design system's actual palette: WORK's section ground is
          paper (light) since the Phase 5 ground regroup, so flipping
          just this image plate to `data-ground="deep"` reads as a dark
          tile sitting on a light frame — real value contrast in both
          themes, and on Cobalt the deep ground's OWN accent is still
          chromatic, so the color-mix below still lands as a genuine blue
          tint on top of that darkness. Same ground-swap device
          product-story.tsx's `ProductMedia` already uses, same direction
          this time (deep tile on a paper card, both places). */}
      <div
        data-ground="deep"
        className="relative"
```

- [ ] **Step 4: Fix PRODUCTS' stale "dark passage" comment**

`product-story.tsx`'s doc comment says PRODUCTS' paper ground "reads as a release after EVIDENCE+WORK's dark passage" — WORK is paper now, so that's no longer accurate. In `frontend/src/components/home/product-story.tsx:17-20`, replace:

```tsx
 * Paper ground (Phase 4 rhythm swap, was deep): each product's media
 * panel is a deep-ground tile SITTING on a paper page — that's a
 * stronger material read than dark-on-dark, and reads as a release after
 * EVIDENCE+WORK's dark passage just before it.
```

with:

```tsx
 * Paper ground (Phase 4 rhythm swap, was deep): each product's media
 * panel is a deep-ground tile SITTING on a paper page — that's a
 * stronger material read than dark-on-dark. Since the Phase 5 ground
 * regroup, PRODUCTS continues the same paper run WORK and CAPABILITY
 * already started rather than releasing out of a preceding dark
 * passage — EVIDENCE (deep) is now the only dark section directly
 * before this chapter.
```

- [ ] **Step 5: Verify**

Run:

```bash
cd frontend && npm run lint && npm run build
```

Expected: both succeed with no errors. Then run `npm run dev`, open the homepage, and scroll top to bottom confirming: OPEN, SURFACE, EVIDENCE all render dark; WORK, CAPABILITY, PRODUCTS all render light with WORK's grid images now reading as dark tiles on a light frame; IDENTITY dark; METHOD, RECORD light; CLOSE dark.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/home/working-surface.tsx frontend/src/components/home/portfolio-grid.tsx frontend/src/components/home/product-story.tsx
git commit -m "Regroup homepage ground into 5 chapters (flip SURFACE, WORK)"
```

---

## Task 2: Curved-sheet reveal on the 2 safe GroundHandoff pairs

**Files:**
- Modify: `frontend/src/components/home/ground-handoff.tsx`

**Interfaces:**
- Consumes: nothing new — still just `useScrollScene` and `document.querySelector`.
- Produces: nothing new is exported; `GroundHandoff` keeps its existing no-arg, no-return signature. Later tasks don't depend on anything from this one.

- [ ] **Step 1: Add a `sheet` flag to the pairs list**

In `frontend/src/components/home/ground-handoff.tsx`, replace the `PAIRS` declaration (currently lines 27-32):

```tsx
const PAIRS: readonly [outgoing: string, incoming: string][] = [
  ["What MaCo does", "Bridge in motion"],
  ["Selected client work", "Capabilities"],
  ["Products", "MaCo, in one name and many scripts"],
  ["Clients and company", "Start a project"],
];
```

with:

```tsx
const PAIRS: readonly [outgoing: string, incoming: string, sheet?: boolean][] = [
  ["What MaCo does", "Bridge in motion"],
  ["Selected client work", "Capabilities"],
  ["Products", "MaCo, in one name and many scripts", true],
  ["Clients and company", "Start a project", true],
];
```

`sheet: true` marks the 2 boundaries that are also a ground change (PRODUCTS→IDENTITY, RECORD→CLOSE) — see the spec's boundary table. The other 2 pairs keep today's plain recede.

- [ ] **Step 2: Add the curved-sheet clip-path tween for `sheet` pairs**

In the same file, replace the loop body (currently lines 36-59):

```tsx
    for (const [outLabel, inLabel] of PAIRS) {
      const outgoing = document.querySelector<HTMLElement>(`[aria-label="${outLabel}"]`);
      const incoming = document.querySelector<HTMLElement>(`[aria-label="${inLabel}"]`);
      if (!outgoing || !incoming) continue;

      rt.gsap.fromTo(
        outgoing,
        { yPercent: 0, scale: 1, opacity: 1 },
        {
          yPercent: -4,
          scale: 0.965,
          opacity: 0.55,
          ease: "none",
          transformOrigin: "50% 0%",
          scrollTrigger: {
            trigger: incoming,
            start: "top bottom",
            end: "top 25%",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );
    }
```

with:

```tsx
    for (const [outLabel, inLabel, sheet] of PAIRS) {
      const outgoing = document.querySelector<HTMLElement>(`[aria-label="${outLabel}"]`);
      const incoming = document.querySelector<HTMLElement>(`[aria-label="${inLabel}"]`);
      if (!outgoing || !incoming) continue;

      const scrollTrigger = {
        trigger: incoming,
        start: "top bottom",
        end: "top 25%",
        scrub: 0.4,
        invalidateOnRefresh: true,
      };

      rt.gsap.fromTo(
        outgoing,
        { yPercent: 0, scale: 1, opacity: 1 },
        {
          yPercent: -4,
          scale: 0.965,
          opacity: 0.55,
          ease: "none",
          transformOrigin: "50% 0%",
          scrollTrigger,
        },
      );

      // Curved sheet: the incoming section's top corners round off as it
      // rises, then flatten back to square once settled — a transient
      // "sheet lifting into place" cue layered on the recede above, only
      // where the boundary is ALSO a ground change (see PAIRS above).
      // clip-path defaults to `none` in the JSX (no inline style), so with
      // no JS / reduced motion the section just renders with its normal
      // square top edge — the settled end-state, per this file's own
      // "only the OUTGOING section is ever transformed" rule: this reads
      // as an incoming-side reveal, not a transform, so it never touches
      // a pinned section's ancestor chain.
      if (sheet) {
        rt.gsap.fromTo(
          incoming,
          { clipPath: "inset(0px round 48px 48px 0px 0px)" },
          { clipPath: "inset(0px round 0px 0px 0px 0px)", ease: "none", scrollTrigger },
        );
      }
    }
```

- [ ] **Step 3: Update the file's doc comment**

Append to the doc comment at the top of `ground-handoff.tsx` (after the existing paragraph ending "...so PRODUCTS is safe as an outgoing section too."):

```tsx
 *
 * Two of the four pairs (marked `sheet: true` in PAIRS) also get a
 * curved-corner reveal on the INCOMING side: `clip-path: inset(...
 * round ...)` scrubbed from a rounded rect down to square, on the same
 * scrollTrigger window as the recede above, so the two motions read as
 * one gesture. Only applied where the boundary is also a ground change
 * (PRODUCTS -> IDENTITY, RECORD -> CLOSE) — the other two pairs keep a
 * plain recede since their ground doesn't change either side.
```

- [ ] **Step 4: Verify**

Run:

```bash
cd frontend && npm run lint && npm run build
```

Expected: both succeed. Then `npm run dev`, scroll through PRODUCTS→IDENTITY and RECORD→CLOSE and confirm IDENTITY's and CLOSE's top corners visibly round off then flatten as they settle into place, while WORK→CAPABILITY and SURFACE→EVIDENCE keep their existing plain recede with no corner rounding. Also confirm with `prefers-reduced-motion` enabled (OS setting or the site's `?motion=reduced` override) that all 4 sections render with flat square top edges and no jump/flash.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/home/ground-handoff.tsx
git commit -m "Add curved-sheet reveal to the 2 ground-changing GroundHandoff pairs"
```

---

## Task 3: Extend ScrollThread to the full page

**Files:**
- Modify: `frontend/src/routes/index.tsx`
- Modify: `frontend/src/components/home/scroll-thread.tsx`
- Modify: `frontend/src/styles.css:680-693`

**Interfaces:**
- Consumes: `ScrollThread` is still a bare `<ScrollThread />` with no props — this task doesn't change its signature.
- Produces: nothing new is exported.

- [ ] **Step 1: Widen the non-transformed wrapper to the whole page**

In `frontend/src/routes/index.tsx`, replace the `Home` function body (currently lines 35-79):

```tsx
function Home() {
  return (
    <>
      {/* OPEN — the brand alone: mark + "MaCo" */}
      <OpenLogo />

      {/* SURFACE — the promise, the proof row, Bridge in motion (merges the old hero + CLAIM) */}
      <WorkingSurface />

      {/* EVIDENCE — cinematic scroll-expand, Bridge in motion */}
      <EvidenceExpand />

      {/* WORK, CAPABILITY, PRODUCTS share one drawn thread (ScrollThread) —
          the wrapper carries no transform of its own, so it's safe as an
          ancestor of CAPABILITY's pin. */}
      <div className="relative">
        {/* WORK — four real client projects, as a two-column grid */}
        <PortfolioGrid />

        {/* CAPABILITY — services convergence */}
        <ServicesConvergence />

        {/* PRODUCTS — Bridge + Driver's Diary */}
        <ProductStory />

        <ScrollThread />
      </div>

      {/* IDENTITY — one name, many scripts */}
      <Identity />

      {/* METHOD — A→B→C→D, launch is not the finish line */}
      <MethodLine />

      {/* RECORD — clients + company, deliberate rest */}
      <Record />

      {/* CLOSE — intake + final statement */}
      <CloseIntake />

      {/* Cross-section continuity — renders nothing itself */}
      <GroundHandoff />
    </>
  );
}
```

with:

```tsx
function Home() {
  return (
    <>
      {/* Every section (but not GroundHandoff, which renders nothing) is
          wrapped so ScrollThread can draw one continuous line the full
          page — the wrapper carries no transform of its own, so it stays
          safe as an ancestor of EVIDENCE's, CAPABILITY's, IDENTITY's and
          METHOD's pins (see scroll-thread.tsx's doc comment). */}
      <div className="relative">
        {/* OPEN — the brand alone: mark + "MaCo" */}
        <OpenLogo />

        {/* SURFACE — the promise, the proof row, Bridge in motion (merges the old hero + CLAIM) */}
        <WorkingSurface />

        {/* EVIDENCE — cinematic scroll-expand, Bridge in motion */}
        <EvidenceExpand />

        {/* WORK — four real client projects, as a two-column grid */}
        <PortfolioGrid />

        {/* CAPABILITY — services convergence */}
        <ServicesConvergence />

        {/* PRODUCTS — Bridge + Driver's Diary */}
        <ProductStory />

        {/* IDENTITY — one name, many scripts */}
        <Identity />

        {/* METHOD — A→B→C→D, launch is not the finish line */}
        <MethodLine />

        {/* RECORD — clients + company, deliberate rest */}
        <Record />

        {/* CLOSE — intake + final statement */}
        <CloseIntake />

        <ScrollThread />
      </div>

      {/* Cross-section continuity — renders nothing itself */}
      <GroundHandoff />
    </>
  );
}
```

- [ ] **Step 2: Re-author the path for the full-page span**

`viewBox="0 0 100 1000"` is a normalized coordinate space stretched non-uniformly (`preserveAspectRatio="none"`) to whatever real height the wrapper ends up — it does not need to change just because the wrapper now covers 10 sections instead of 3, but the path needs more waypoints so it reads as a meander across the whole span rather than a 3-section fragment repeated. In `frontend/src/components/home/scroll-thread.tsx`, replace line 77:

```tsx
        d="M 8 0 C 34 160, 6 300, 30 470 S 82 700, 60 1000"
```

with:

```tsx
        d="M 10 0 C 38 90, 8 160, 32 260 S 88 380, 55 480 S 12 560, 38 660 S 90 760, 58 860 S 15 940, 42 1000"
```

This is a first-pass hand-authored extension of the original curve's style (chained smooth `S` segments); tune the exact numbers by eye against the real rendered page in Step 4 below — same as how the original 3-section path was authored.

- [ ] **Step 3: Switch the stroke to mix-blend-mode**

In `frontend/src/styles.css`, replace the comment + utility at lines 680-693:

```css
/* Supersedes .maco-thread for the WORK -> CAPABILITY -> PRODUCTS run
   (scroll-thread.tsx). The dormant .maco-thread keyframe below is left
   alone — theme-atmosphere.tsx still references it; removing it belongs
   to a separate dead-code purge, not this feature. */
@utility maco-scroll-thread {
  fill: none;
  stroke: var(--line-strong);
  stroke-width: 1;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  opacity: 0.3;
  stroke-dasharray: var(--thread-len, 0);
  stroke-dashoffset: calc(var(--thread-len, 0) * (1 - var(--thread, 1)));
}
```

with:

```css
/* Supersedes .maco-thread for the full page (scroll-thread.tsx). The
   dormant .maco-thread keyframe below is left alone — theme-atmosphere.tsx
   still references it; removing it belongs to a separate dead-code purge,
   not this feature.
   
   stroke is a fixed white + mix-blend-mode: difference, not a --line-*
   token: the path now crosses 5 different [data-ground] regions, and a
   token-based stroke can only resolve one color via DOM-ancestry
   inheritance — it can't adapt per ground region it visually passes
   over. difference(white, backdrop) is an exact channel-wise inversion
   of whatever's actually rendered behind the stroke at each point along
   it, so it stays legible crossing any ground region without per-segment
   color logic. */
@utility maco-scroll-thread {
  fill: none;
  stroke: #fff;
  mix-blend-mode: difference;
  stroke-width: 1;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  opacity: 0.3;
  stroke-dasharray: var(--thread-len, 0);
  stroke-dashoffset: calc(var(--thread-len, 0) * (1 - var(--thread, 1)));
}
```

- [ ] **Step 4: Update ScrollThread's doc comment**

In `frontend/src/components/home/scroll-thread.tsx`, replace the doc comment (currently lines 4-30):

```tsx
/**
 * One continuous vector thread connecting WORK, CAPABILITY and PRODUCTS —
 * a single line drawing itself across three sections via `stroke-dashoffset`,
 * not a per-section doodle. Mounted once, as a direct child of the
 * `<div className="relative">` wrapper `routes/index.tsx` puts around
 * those three sections; that wrapper carries no `transform` of its own, so
 * it's safe as an ancestor of CAPABILITY's pin (a `transform` on a pin's
 * ancestor breaks `position: fixed` — see ground-handoff.tsx's doc
 * comment for the same constraint applied elsewhere).
 *
 * `viewBox="0 0 100 1000"` + `preserveAspectRatio="none"` lets one fixed
 * coordinate space stretch to whatever height the three sections total,
 * however tall that turns out to be at any width or content length.
 * `vector-effect: non-scaling-stroke` (in the `maco-scroll-thread`
 * utility) is what stops that non-uniform stretch from smearing the
 * hairline's width along with its length.
 *
 * `z-[42]` — one above every pinned section's `z-[41]` and the header's
 * `z-40` — so the thread stays visible while a pinned section is fixed
 * beneath it; `pointer-events-none` keeps it from ever intercepting a
 * click. `hidden md:block`: under 768px a full-height vector spanning
 * roughly four screens reads as noise rather than a thread.
 *
 * Supersedes `.maco-thread` (styles.css) for this run of the page. That
 * utility is left in place rather than deleted — `theme-atmosphere.tsx`
 * still references it, and removing dormant code is a separate purge.
 */
```

with:

```tsx
/**
 * One continuous vector thread running the full page — a single line
 * drawing itself across all ten sections via `stroke-dashoffset`, not a
 * per-section doodle. Mounted once, as the last child of the
 * `<div className="relative">` wrapper `routes/index.tsx` puts around
 * the entire `<Home>` body; that wrapper carries no `transform` of its
 * own, so it's safe as an ancestor of EVIDENCE's, CAPABILITY's,
 * IDENTITY's and METHOD's pins (a `transform` on a pin's ancestor breaks
 * `position: fixed` — see ground-handoff.tsx's doc comment for the same
 * constraint applied elsewhere).
 *
 * `viewBox="0 0 100 1000"` + `preserveAspectRatio="none"` lets one fixed
 * coordinate space stretch to whatever height the ten sections total,
 * however tall that turns out to be at any width or content length.
 * `vector-effect: non-scaling-stroke` (in the `maco-scroll-thread`
 * utility) is what stops that non-uniform stretch from smearing the
 * hairline's width along with its length.
 *
 * The stroke is `mix-blend-mode: difference` (styles.css), not a
 * ground-token color: the path now visually crosses five different
 * [data-ground] regions, and a token-based color can only resolve one
 * value via DOM-ancestry inheritance. A difference blend instead
 * computes against whatever's actually rendered behind each point of
 * the stroke, so it stays legible everywhere the path goes without
 * per-segment logic.
 *
 * `z-[42]` — one above every pinned section's `z-[41]` and the header's
 * `z-40` — so the thread stays visible while a pinned section is fixed
 * beneath it; `pointer-events-none` keeps it from ever intercepting a
 * click. `hidden md:block`: under 768px a full-height vector spanning
 * roughly ten screens reads as noise rather than a thread.
 *
 * Supersedes `.maco-thread` (styles.css) for this run of the page. That
 * utility is left in place rather than deleted — `theme-atmosphere.tsx`
 * still references it, and removing dormant code is a separate purge.
 */
```

- [ ] **Step 5: Verify**

Run:

```bash
cd frontend && npm run lint && npm run build
```

Expected: both succeed. Then `npm run dev` and check, at `md` (768px) and above:
1. The thread renders as one continuous line from OPEN to CLOSE, growing as you scroll (not stopping after PRODUCTS).
2. It stays visibly legible (neither invisible nor solid black/white) crossing every ground boundary, in both `obsidian` and `cobalt` themes.
3. EVIDENCE's, CAPABILITY's, IDENTITY's, and METHOD's pins still work correctly (frame/cards/track/spine still pin and unpin at the right scroll position, nothing jumps or fails to release) — confirms the wider wrapper introduced no transform hazard.
4. Below 768px width, the thread stays hidden (`hidden md:block` unchanged).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/routes/index.tsx frontend/src/components/home/scroll-thread.tsx frontend/src/styles.css
git commit -m "Extend ScrollThread to the full page with mix-blend-mode stroke"
```

---

## Task 4: Live-tune Lenis lerp against the new page rhythm

**Files:**
- Modify (only if a change is warranted): `frontend/src/lib/scroll-runtime.ts:94`

**Interfaces:** None.

- [ ] **Step 1: Baseline check**

`frontend/src/lib/scroll-runtime.ts:94` currently reads `lerp: 0.085` (already hand-tuned heavier than Lenis's stock `0.1` default, per the comment above it). With `npm run dev` running from Task 3, scroll the full page top to bottom at normal wheel speed and note whether the feel still matches the rest of the page now that a full-page scroll covers 5 chapters and 2 curved-sheet handoffs instead of the previous shorter passages.

- [ ] **Step 2: Adjust only if it feels off**

If the scroll feel is unchanged or still reads correctly, make no code change — this step exists to confirm, not to force a diff. If it reads as too loose or too heavy against the new full-page rhythm, adjust the value in `frontend/src/lib/scroll-runtime.ts:94` within the `0.075`–`0.095` range (lower = heavier/slower to catch up, higher = lighter/closer to instant), re-test, and repeat until it feels right.

- [ ] **Step 3: Commit (only if Step 2 changed the value)**

```bash
git add frontend/src/lib/scroll-runtime.ts
git commit -m "Retune Lenis lerp for the full-page scroll restructure"
```

If no change was made, skip this step — there is nothing to commit.

---

## Post-plan cleanup

- [ ] After Task 4, confirm `git status` is clean (all 4 tasks' changes committed) and run `npm run lint && npm run build` one final time on the full combined diff before considering the plan complete.
