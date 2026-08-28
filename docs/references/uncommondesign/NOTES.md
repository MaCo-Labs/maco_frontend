# Uncommon Design Group (uncommondesign.group) — technique reference

**Rule:** technique source only. Never copy this site's layout, color, or
type as a target look. MaCo's Obsidian/Cobalt identity is the target,
always. (AGENTS.md §1/§2/§33, REFACTOR_PLAN.md §10b)

**Captured:** 2026-08-27, live DOM/computed-style inspection via Playwright
(`browser_navigate` + `browser_evaluate`). Mechanism notes only — no
palette, no typefaces, no copy. See the rule above.

## Stack & motion architecture

- CSS Modules build (hashed class names, e.g. `styles_cursor_reel__8jJqH`)
  — a bundler-based React/Vue-style setup, not a raw hand-rolled DOM.

## Structural patterns

- Hero plays a real, native `<video>` element (one `<video>` found on the
  homepage) — not an abstract generated scene. A visible mute toggle button
  and a "Play reel" trigger sit alongside it.
- Nav labels close to MaCo's own already, per REFACTOR_PLAN.md §10b's prior
  observation — no new structural finding here beyond confirming the site
  is unchanged in that respect.

## Motion mechanisms

- **Cursor reel**: pre-built state variants baked into the DOM ahead of
  time — `styles_cursor_reel_item__play` and
  `styles_cursor_reel_item__pause` both exist simultaneously as sibling
  elements; a class toggle (not a mount/unmount, not injected content per
  hover) swaps visibility between them. This is the "cheaper, preloadable"
  approach called out in `PHASE-2-MOTION-PLAN.md`'s reference-site table:
  no per-hover DOM writes or layout recalculation, both states are already
  painted and ready.
- A second, separate cursor root (`styles_cursor__5xsQT` /
  `styles_cursor_view__RWyRi`) plus plain `js_cursor__arrow` /
  `js_cursor__text` hook classes coexist with the reel — i.e. this site
  layers a *generic* cursor-follow arrow/label system underneath the
  *specific* play/pause reel variant, rather than one cursor doing
  everything inline.

## Maps to MaCo

- **EVIDENCE** (`evidence-expand.tsx`) — the pinned Bridge video set-piece
  is MaCo's closest analog to this hero. If a play/pause affordance is ever
  added there, the pre-built-sibling-toggle approach (both states exist,
  CSS class swap) is lighter than conditionally rendering an icon.
- **CLOSE / global** — the two-tier cursor idea (a generic arrow/label
  layer, with specific reel-style variants only where something specific is
  playing) is the more maintainable shape *if* MaCo ever pursues a cursor
  system — see `minhpham/NOTES.md` for the more directly reusable version
  of this same idea (semantic hook classes read by one controller).

## Explicitly not taking

- A custom cursor as a blanket sitewide feature — same caution as
  `../cuberto/NOTES.md`: `AI_HANDOFF.md` rule #8, two prior reverted
  WebGL/cursor attempts, any such work needs its own narrow go/no-go
  discussion (`PHASE-2-MOTION-PLAN.md` item 2d-7).
- Any of this site's actual visual treatment, video framing, or copy.

## Measured values (skillui, 2026-08-27)

Captured via `npx skillui@1.3.4 --url https://uncommondesign.group --mode
ultra --screens 6` (see `../cuberto/NOTES.md`'s Measured values section for
tool provenance and the quarantine rule). Raw output:
`docs/references/uncommondesign/skillui/uncommondesign-skillui-design/`.

**New finding not caught by the earlier DOM pass:** a `<canvas>` element
with a live WebGL context on the homepage — the earlier pass's "one native
`<video>` hero" note is still correct (the video is confirmed present,
1440×900, autoplay/loop/muted), but there's a *second*, separate WebGL
layer this site also runs, likely driving an effect independent of the
cursor-reel system already documented above. Not investigated further —
flagged only so nobody assumes the hero video is the whole motion picture
here.

### Easing tokens in use

```
--easeOutQuart:    cubic-bezier(0.165, 0.84, 0.44, 1)
--easeInOutQuart:  cubic-bezier(0.76, 0, 0.24, 1)
--easeInOutCubic:  cubic-bezier(0.65, 0, 0.35, 1)
--easeInOutQuad:   cubic-bezier(0.45, 0, 0.55, 1)
```

Same four-curve subset of Iventions' seven-token set (`easeOutQuart`,
`easeInOutQuart`, `easeInOutCubic`, `easeInOutQuad` match verbatim) — two
otherwise-unrelated agency sites sharing an identical easing-token naming
convention and identical curve numbers suggests a common boilerplate/
starter template, not independently designed motion. Worth knowing before
treating either as a bespoke reference.

### Durations in use

`.2s · .3s · .4s · .6s · 1.2s` — narrower and faster than Iventions'
scale, consistent with this being mostly hover/color-state transitions
(fill, stroke, background-color, color) rather than large-element reveals.

### Page structure (measured, informational only)

- Total scroll height: **8,938px** — shortest of the four references.
