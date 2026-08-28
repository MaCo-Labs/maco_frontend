# Minh Pham (minhpham.design) — technique reference

**Rule:** technique source only. Never copy this site's layout, color, or
type as a target look. MaCo's Obsidian/Cobalt identity is the target,
always. (AGENTS.md §1/§2/§33, REFACTOR_PLAN.md §10b)

**Captured:** 2026-08-27, live DOM/computed-style inspection via Playwright
(`browser_navigate` + `browser_evaluate`). Mechanism notes only — no
palette, no typefaces, no copy. See the rule above.

## Stack & motion architecture

- Lenis smooth scroll, currently in a stopped state on load
  (`<html class="js no-system-cursor lenis-stopped">`) — scroll is
  deliberately held until the intro loader finishes (see below).
- `no-system-cursor` class on `<html>` confirms the native OS cursor is
  hidden sitewide in favor of the custom one.

## Structural patterns

- Intro/loading gate: `js-page-loading` root cycles through
  `is-progress` → (implied) `is-ready` state classes; `<body>` itself
  carries `is-loading is-ready` simultaneously at the moment of capture
  (mid-transition), plus a `js-ready` class. Scroll is locked
  (`lenis-stopped`) until this resolves — visitors can't scroll-skip past
  the loader.
- 35 elements carry `.js-cursor-contract` and 8 carry `.js-cursor-extend` —
  two semantic states applied directly to whatever content is currently
  hoverable, rather than the cursor controller computing per-element
  behavior from tag/role. "Contract" (shrink the cursor, e.g. over text/
  links) is far more common than "extend" (8 elements) on this homepage —
  extend appears reserved for a few specific large hover targets (likely
  project thumbnails), not applied everywhere.

## Motion mechanisms

- **Semantic cursor-state hooks**: one global cursor controller reads
  `.js-cursor-contract` / `.js-cursor-extend` off whatever's currently
  hovered. Adding a new hoverable element that should affect the cursor is
  a one-class addition on that element, not a new branch in the cursor
  controller's logic — this is the most maintainable of the three cursor
  approaches captured across these four reference sites (compare
  `cuberto/NOTES.md`'s `data-cursor` content-swap and
  `uncommondesign/NOTES.md`'s pre-built play/pause reel).
- Intro-loader gating scroll via Lenis's own stop/start (`lenis-stopped`
  class, presumably paired with a `lenis.stop()`/`lenis.start()` call once
  the loader's `is-ready` state lands) rather than a separate scroll-lock
  mechanism.

## Maps to MaCo

- **WORK** (`work-reveal.tsx`) — WORK already has bespoke cursor-follow
  logic via `gsap.quickSetter` (per `CONTEXT.md` §10). If MaCo generalizes
  cursor behavior into a reusable primitive (per
  `PHASE-2-MOTION-PLAN.md` item 2d-7), this semantic-class-hook shape is
  the recommended pattern to follow — a `data-cursor-state` (or similar)
  attribute set once per hoverable element, read by one controller, rather
  than each component computing cursor behavior inline. Scoped narrow: this
  generalizes WORK's *existing* cursor-follow, not a new sitewide cursor.
- **CAPABILITY** (`services-convergence.tsx`) — Minh Pham's "what I do"
  capability grid (plain sentence per capability, no imagery) maps to
  CAPABILITY's card shape; already noted in REFACTOR_PLAN.md §10b, no new
  finding this pass.
- **CLIENTS** (`client-field.tsx`) — his name+one-sentence client treatment
  (no logos) is the inverse of MaCo's actual real-logo approach; MaCo has
  real client logos (`CONTEXT.md` §10, "4 client logos"), so this pattern
  isn't a fit — noted for completeness, not proposed.

## Explicitly not taking

- The joke-toggle copy and testimonial carousel on his homepage — wrong
  tone for MaCo, and MaCo has no real testimonials to place there (already
  called out in REFACTOR_PLAN.md §10b).
- A sitewide custom cursor or intro/scroll-lock loader as a blanket
  feature — same `AI_HANDOFF.md` #8 caution as the other three files; an
  intro loader that blocks scroll is also a UX-risk pattern (delays access
  to real content) that would need its own explicit case, not an implicit
  port.
- Any of his actual visual treatment, layout proportions, or copy.

## Measured values (skillui, 2026-08-27)

Captured via `npx skillui@1.3.4 --url https://minhpham.design --mode ultra
--screens 6` (see `../cuberto/NOTES.md`'s Measured values section for tool
provenance and the quarantine rule). Raw output:
`docs/references/minhpham/skillui/minhpham-skillui-design/`.

Confirms the earlier pass's WebGL/canvas note and adds two background
videos beyond the hero (`hero.mp4` plus a `reel.mp4` used twice, both
autoplay/loop/muted with a shared poster) — the reel section runs the same
clip in two places rather than two different cuts.

### Easing in use

Unlike the other three references, this site's transitions declare
`cubic-bezier(...)` **literally inline**, not via named CSS custom
properties — and every single transition on the homepage uses the same
one curve:

```
cubic-bezier(0.165, 0.84, 0.44, 1)   — every transition on the page
```

This is the exact same numeric curve as Iventions' and Uncommon Design's
`--easeOutQuart` token, just un-tokenized here. Three of the four
reference sites converge on this one curve for their primary transition
easing — the strongest cross-site signal in this recon pass. It is
*not* one of MaCo's three existing tokens (`styles.css:31-40`); closest is
`--ease-emphasis` (`cubic-bezier(0.16, 1, 0.3, 1)`), a different shape
(that one front-loads the deceleration harder).

### Durations in use

`.3s · .4s · .6s` only — the narrowest, most disciplined duration scale of
the four sites (compare Iventions' six-value spread). One duration
(`0.4s`) does most of the work; `.3s`/`.6s` are used for smaller/larger
elements respectively rather than different interaction types.

### Page structure (measured, informational only)

- Total scroll height: **9,777px**.
