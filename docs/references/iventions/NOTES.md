# Iventions (iventions.com) — technique reference

**Rule:** technique source only. Never copy this site's layout, color, or
type as a target look. MaCo's Obsidian/Cobalt identity is the target,
always. (AGENTS.md §1/§2/§33, REFACTOR_PLAN.md §10b)

**Captured:** 2026-08-27, live DOM/computed-style inspection via Playwright
(`browser_navigate` + `browser_evaluate`). Mechanism notes only — no
palette, no typefaces, no copy. See the rule above.

## Stack & motion architecture

- React, styled via CSS-in-JS (Emotion — class names of the form
  `css-<hash>`, e.g. `css-12ixfif`).
- No GSAP detected on `window` — the sticky-panel effect below is achieved
  with plain CSS `position: sticky`, not a scroll-linked JS library.

## Structural patterns

- 5 elements computed to `position: sticky` on the homepage. Confirms the
  "sticky-panel / scrolling-copy split" technique: a visual panel stays put
  via native sticky positioning while copy scrolls past it, no
  `ScrollTrigger` pin math involved.
- 4 elements whose entire text content is a two-digit number (`01`–`04`
  pattern) with no children — the numbered service/showcase list structure
  (big image/panel + one line + a number badge, repeated 4 times).
- Homepage copy structure (labels only, not verbatim body copy): a
  dual-path closing CTA — one path framed as "get a quote" (transactional,
  has-a-project), the other framed as "got a big idea" (exploratory,
  no-project-yet) — two distinct entry points into contact rather than one
  generic form.

## Motion mechanisms

- Sticky-panel split: because it's native `position: sticky` rather than a
  pinned/scrubbed animation, it doesn't need frame-accurate scroll math —
  it's "stay in place while this text passes," a much lighter technique
  than a GSAP pin for sections that don't need multi-property scrub.
- Nav labels observed: About / Events / Exhibits / Congresses / Sports /
  Work / Insights / Contact — a flat top-level list, no mega-menu, no
  nested reveal.

## Maps to MaCo

- **PRODUCTS** (`product-showcase.tsx`) — MaCo already uses
  `position: sticky` here per `CONTEXT.md` §10's own note ("no
  (`position: sticky`)" in the pin column) — this reference confirms the
  same lightweight-sticky reasoning independently, not a change to make.
- **CAPABILITY / SERVICES** (`services-convergence.tsx`) — the numbered
  `01`/`04` showcase pattern maps to MaCo's actual 2 real services; a
  numbered badge (`01`/`02`) is a plausible small addition to the existing
  card treatment, not a restructure.
- **CLOSE** (`close-intake.tsx`) — the dual-path CTA (quote path vs.
  general/exploratory contact) is a candidate structural idea for CLOSE's
  single link-to-`/contact` treatment, if MaCo ever wants to split
  "ready to start" visitors from "just exploring" ones. Not committed —
  MaCo currently has one contact flow and content/maco.ts doesn't yet
  define two.

## Explicitly not taking

- Iventions' actual nav copy, section names (Events/Exhibits/Congresses/
  Sports), or any of its body copy — different industry entirely (event
  agency vs. MaCo's software/IT), nothing here is content to reuse.
- Retrofitting the 4 existing GSAP-pinned MaCo sections (EVIDENCE,
  CAPABILITY, IDENTITY, METHOD) to sticky — `PHASE-2-MOTION-PLAN.md` item
  2d-8 already scopes this to *future* sections only, since the 4 existing
  pins correctly need frame-accurate multi-property scrub that sticky can't
  do.

## Measured values (skillui, 2026-08-27)

Captured via `npx skillui@1.3.4 --url https://iventions.com --mode ultra
--screens 6` (see `../cuberto/NOTES.md`'s Measured values section for the
tool's provenance and the quarantine rule — palette/type/spacing are not
reproduced here). Raw output:
`docs/references/iventions/skillui/iventions-skillui-design/`.

### Easing tokens in use

```
--easeOutQuart:    cubic-bezier(0.165, 0.84, 0.44, 1)
--easeInOutQuart:  cubic-bezier(0.76, 0, 0.24, 1)
--easeInQuart:     cubic-bezier(0.895, 0.03, 0.685, 0.22)
--easeOutQuad:     cubic-bezier(0.5, 1, 0.89, 1)
--easeInOutQuad:   cubic-bezier(0.45, 0, 0.55, 1)
--easeOutCubic:    cubic-bezier(0.33, 1, 0.68, 1)
--easeInOutCubic:  cubic-bezier(0.65, 0, 0.35, 1)
```

Named as reusable CSS custom properties, not per-declaration literals —
same discipline as MaCo's own `--ease-standard`/`--ease-emphasis`/
`--ease-overshoot` tokens (`styles.css:31-40`). None of these seven curves
is identical to MaCo's three; `--easeOutQuart` is the closest cousin to
`--ease-emphasis` (both a fast-out settle) but not the same numbers —
worth a side-by-side feel comparison before adopting, not a drop-in match
like Cuberto's curves were.

### Durations in use

`.3s · .4s · .6s · .8s · 1.2s` for transform/opacity/color transitions.
Sticky-panel elements themselves carry no transition — native
`position: sticky` needs none, confirming the mechanism note above.

### Page structure (measured, informational only)

- Total scroll height: **14,895px**.
- One scroll pattern detected: "parallax / sticky scroll," 4 elements —
  matches the 5 `position: sticky` elements found in the earlier DOM pass
  (one is likely a sticky nav, not part of the panel-split count).
