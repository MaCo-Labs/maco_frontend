# Sitewide scroll/layout restructure — design spec

**Date:** 2026-08-19
**Status:** Approved by user in chat; implementation plan pending (writing-plans skill)
**Scope:** `frontend/src/routes/index.tsx` and the 10 homepage section components it renders, plus `ScrollThread`, `GroundHandoff`, and `styles.css`'s ground-token layer.

## Problem

The homepage currently alternates light/dark ("paper"/"deep") ground on almost every section boundary, producing 7 short runs (1-2 sections each) instead of a small number of deliberate visual chapters. `ScrollThread`, the hand-drawn scroll-linked line motif, is scoped to only 3 of the 10 sections (WORK, CAPABILITY, PRODUCTS). This work regroups sections into fewer, larger light/dark blocks, adds a curved "sheet" transition device at chapter boundaries where it's structurally safe, and extends `ScrollThread` to run the full page.

This task was deferred until after the hero WebGL upgrade (now complete) per prior planning in `ROADMAP.md`. Classified **architectural** under `superpowers:brainstorming` (restructures how sections relate to each other and changes an existing shared component's scope/interface) — full spec + `writing-plans` handoff applies.

## Constraint that shapes every decision here

`ground-handoff.tsx` documents the hazard this design is built around:

> A `transform` on an ancestor of a `position: fixed` element repositions that fixed element relative to the transformed ancestor instead of the viewport.

Four sections host a GSAP ScrollTrigger pin, directly or via a `matchMedia`-gated desktop-only descendant: **EVIDENCE, CAPABILITY, IDENTITY, METHOD**. Any device that applies a `transform` to a section as it exits (recede, curved-sheet reveal) is only safe when that *outgoing* section is pin-free. `data-ground` itself is safe everywhere — it's a CSS custom-property remap (`styles.css:278-309`), not a transform.

WORK and PRODUCTS are pin-free (PRODUCTS' cards use `position: sticky`, which ancestor transforms don't affect); so are OPEN, SURFACE, RECORD, CLOSE.

## Current ground assignment (verified against source, route order)

| Section | Component | Ground today |
|---|---|---|
| OPEN | `open-logo.tsx` | deep |
| SURFACE | `working-surface.tsx` | paper |
| EVIDENCE | `evidence-expand.tsx` | deep |
| WORK | `portfolio-grid.tsx` | deep |
| CAPABILITY | `services-convergence.tsx` | paper |
| PRODUCTS | `product-story.tsx` | paper |
| IDENTITY | `identity.tsx` | deep |
| METHOD | `method-line.tsx` | paper |
| RECORD | `record.tsx` | paper |
| CLOSE | `close-intake.tsx` | deep |

Sequence: `deep, paper, deep, deep, paper, paper, deep, paper, paper, deep` → **7 runs**, longest run 2 sections.

## Approaches considered

### A. Full re-sequencing of sections
Reorder sections themselves (not just ground) to group naturally-dark and naturally-light content. Rejected: no content/narrative reason to reorder; would touch nav anchors, analytics events, and any deep links keyed to section order for no visual gain that a ground-only regroup doesn't already achieve.

### B. Single flip
Flip only `WORK` deep→paper. Produces 6 runs, longest run still 2. Cheaper (1-line diff) but doesn't meaningfully change the alternating rhythm — rejected as under-delivering on the stated goal.

### C. Two-flip regroup (chosen)
Flip `SURFACE` paper→deep and `WORK` deep→paper. Zero reordering, 2-line diff (both are single-attribute changes on each component's outer `<section>`). Produces 5 runs, longest run 3 — a genuinely different, chaptered rhythm — while (as a side effect, not a design goal) landing exactly 2 of the resulting ground-change boundaries on already pin-free outgoing sections, making them candidates for the curved-sheet device without inventing new pin-avoidance logic.

**Chosen: C.**

## 1. Ground regroup

```
OPEN=deep, SURFACE=deep(flip), EVIDENCE=deep | WORK=paper(flip), CAPABILITY=paper, PRODUCTS=paper | IDENTITY=deep | METHOD=paper, RECORD=paper | CLOSE=deep
```

Five chapters:
- **Arrival** (deep): OPEN, SURFACE, EVIDENCE
- **Substance** (paper): WORK, CAPABILITY, PRODUCTS
- **Character** (deep, solo beat): IDENTITY
- **Process & record** (paper): METHOD, RECORD
- **Close** (deep): CLOSE

Implementation: change the `data-ground` value on `working-surface.tsx`'s and `portfolio-grid.tsx`'s outer `<section>` tags. `product-story.tsx`'s outer ground (paper) is unchanged, so its nested `data-ground="deep"` tile (the "dark tile sitting on" a paper card) keeps working as-is — out of scope.

`portfolio-grid.tsx` is different: its `GridCard` nests a `data-ground="paper"` image plate, and the component's own comment (lines 157-166) is explicit that this only pops because "WORK's section ground is deep" — a paper tile on a now-paper section is no contrast at all. Flipping WORK's outer ground to paper must also flip that nested tile's `data-ground` to `"deep"` (and its explanatory comment) to preserve the pop; this is a direct, in-scope consequence of the outer flip, not an unrelated nested override.

## 2. Curved-sheet device — boundary selection

Checked every boundary in the new sequence for (a) a ground change and (b) a pin-free outgoing section:

| Boundary | Ground change? | Outgoing section pinned? | Sheet? |
|---|---|---|---|
| OPEN→SURFACE | no | — | no |
| SURFACE→EVIDENCE | no | — | no |
| EVIDENCE→WORK | **yes** | EVIDENCE: yes | no — hard cut |
| WORK→CAPABILITY | no | — | no (existing GroundHandoff recede pair kept as arrival cue) |
| CAPABILITY→PRODUCTS | no | — | no |
| **PRODUCTS→IDENTITY** | **yes** | PRODUCTS: no (sticky) | **yes** |
| IDENTITY→METHOD | **yes** | IDENTITY: yes | no — hard cut |
| METHOD→RECORD | no | — | no |
| **RECORD→CLOSE** | **yes** | RECORD: no | **yes** |

Two boundaries get the curved-sheet treatment: **PRODUCTS→IDENTITY** and **RECORD→CLOSE**. Both already have a `GroundHandoff` recede pair (`aria-label`-matched, GSAP `fromTo` scrub) — the sheet is an added visual layer on the existing incoming-section entrance, not a new trigger. Mechanism: the incoming section's top edge is clipped/masked with a curved (concave) top border and rises over the outgoing section as the existing recede scrub progresses, so the two motions read as one gesture. Two boundaries changed ground but keep a hard cut (EVIDENCE→WORK, IDENTITY→METHOD) because their outgoing section hosts a pin — consistent with the user's explicit "hand-picked, safe boundaries only" choice over a generic everywhere-applied primitive.

## 3. `ScrollThread` full-page extension

**Wrapper:** currently scoped to a `position: relative` wrapper around WORK+CAPABILITY+PRODUCTS only (`routes/index.tsx`). Extend by wrapping the entire `<Home>` body in an equivalent non-transformed `relative` wrapper. This is mechanically identical to the existing pattern — a non-transformed ancestor doesn't interfere with any descendant's `position: fixed`/pin — so no new hazard is introduced by widening it.

**Stroke color:** today's `stroke: var(--line-strong)` (`styles.css` `@utility maco-scroll-thread`, ~line 684) works because the whole path currently lives inside a single, uniform-ground DOM region. Once the path spans 5 ground chapters it cannot resolve to one correct color by DOM-ancestry inheritance. Replace with `mix-blend-mode: difference` (or `exclusion`) on the stroke: a fixed stroke color that computes against whatever's actually rendered behind it at each point along the path, adapting per-chapter without needing per-segment DOM color logic. This is what satisfies "per-ground blend-mode color adaptation."

**Path:** the current hand-authored bezier path and its `viewBox` are sized for the 3-section span. Re-authoring the waypoints for the full ~10-section height is a hand-tuning task done during implementation (visual, not a mechanism decision) — same as how the original path was authored.

Unchanged: `stroke-dashoffset` scroll-linked draw via one `ScrollTrigger` (`scrub: 0.4`, `invalidateOnRefresh: true`), `z-[42]`, `pointer-events-none`, `hidden md:block` (mobile stays hidden).

## 4. Lenis lerp

Current `lerp: 0.085` in `lib/scroll-runtime.ts` was already hand-tuned once (inline comment notes it's heavier than the `0.1` stock default). No concrete complaint or target exists to design against. Treat as a live-tuned value during implementation (~0.075-0.095 range), not a structural decision — not a blocking item for this spec.

## Files touched

- `frontend/src/components/home/working-surface.tsx` — ground flip
- `frontend/src/components/home/portfolio-grid.tsx` — ground flip
- `frontend/src/components/home/ground-handoff.tsx` — add sheet visual to the PRODUCTS→IDENTITY and RECORD→CLOSE pairs
- `frontend/src/components/home/scroll-thread.tsx` — full-page path re-author, blend-mode stroke
- `frontend/src/routes/index.tsx` — widen the `relative` wrapper to the full `<Home>` body
- `frontend/src/styles.css` — `@utility maco-scroll-thread` blend-mode change; possibly a new utility class for the sheet's curved-top clip/mask

## Testing / validation

- Visual: confirm each of the 4 sections that still host a ScrollTrigger pin (EVIDENCE, CAPABILITY, IDENTITY, METHOD) has no `transform` on any ancestor between it and its pinned/fixed descendant, before and after the wrapper widening.
- Visual: scroll through full page at both light and dark starting themes (`obsidian`/`cobalt` per `theme.tsx`) to confirm `ScrollThread`'s blend-mode stroke stays legible across all 5 chapters.
- Motion: verify `prefers-reduced-motion` still disables/simplifies the sheet reveal and thread draw consistent with existing `useReducedMotion` usage elsewhere in these components.
- Regression: confirm the 2 existing `GroundHandoff` pairs that keep their recede motion without a ground change (SURFACE→EVIDENCE, WORK→CAPABILITY) still read correctly as arrival cues after the ground regroup.

## Explicitly out of scope

QA test matrix, `forced-colors`/`prefers-contrast` support, touch-device pass, performance measurement, motion audit, keyboard/screen-reader walkthrough, OPEN-mark→header handoff, `--sweep` token unification, and the MCP-blocked `/21st-ai` sketch — all remain queued in `ROADMAP.md`, not selected for this pass.
