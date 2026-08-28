# Cuberto (cuberto.com) — technique reference

**Rule:** technique source only. Never copy this site's layout, color, or
type as a target look. MaCo's Obsidian/Cobalt identity is the target,
always. (AGENTS.md §1/§2/§33, REFACTOR_PLAN.md §10b)

**2026-08-28 update:** the layout half of this rule was explicitly
overridden by the owner for the homepage only — see `CONTEXT.md` §10 and
the "Cuberto-parity homepage rebuild" plan referenced in
`docs/REFACTOR_PLAN.md` §12 and `AI_HANDOFF.md`'s seventh-pass entry. The
homepage now clones Cuberto's actual section inventory, order, and
spacing/grid system. **The color/type/copy half of the rule was NOT
overridden and never will be** — the owner reconfirmed it personally,
unprompted, mid-request ("keep our 2 themes obsidian and cobalt"). This
file's own captured notes (below) remain mechanism-only, as always; no
Cuberto hex value, typeface, or text has ever entered `frontend/src`. Any
future page (not homepage) still follows the original rule above in full —
this override was scoped to the homepage rebuild that already happened,
not a standing license to reach for Cuberto's layout again elsewhere.

**Captured:** 2026-08-27, live DOM/computed-style inspection via Playwright
(`browser_navigate` + `browser_evaluate`). Mechanism notes only — no
palette, no typefaces, no copy. See the rule above.

## Stack & motion architecture

- Lenis smooth scroll (`<html class="lenis">`).
- No React root detected (`#__next`/`#root` absent) — looks like a
  server-rendered/vanilla-JS build, not React. Doesn't change the mapping to
  MaCo (MaCo already owns its own React + GSAP + Lenis stack) — noted only
  so nobody assumes there's a component architecture worth importing.

## Structural patterns

- Hero section root: `cb-tophead`.
- 12 `<video>` elements on the homepage across three distinct roles:
  - `cb-preview-media` — autoplay, loop, muted (ambient hero/section loop).
  - `cb-modal_box-embedded` — not autoplay, has audio (opened case-study
    modal, user-initiated).
  - `cb-card-preview-media -video` — autoplay, loop, muted (the WORK grid
    card loops themselves).
- Zero `position: sticky` elements — Cuberto does not use the sticky-panel
  technique at all (that's Iventions', see `../iventions/NOTES.md`).

## Motion mechanisms

- **Contextual cursor**: one cursor root (`cb-cursor`, toggles `-hidden`)
  with swappable inner slots — `cb-cursor-inner`, `cb-cursor-media`,
  `cb-cursor-media-box`, `cb-cursor-text`. Hoverable elements carry a
  `data-cursor` attribute; a single global controller reads it and swaps
  which inner slot is populated/visible, so the cursor previews the hovered
  content (image, label, or plain arrow) instead of a separate tooltip
  element trailing the pointer.
- **WORK grid cards**: the card's own `<video>` (`cb-card-preview-media
  -video`) autoplays muted on load — the loop *is* the card artwork, not a
  hover-triggered preview. A second longer/audible cut opens in a modal
  (`cb-modal_box-embedded`) on click, unmuted, not autoplaying until opened.
  Two-tier showreel: short ambient loop always visible, full clip gated
  behind an explicit open action.

## Maps to MaCo

- **WORK** (`work-reveal.tsx`) — MaCo's WORK section already does a
  Cuberto-style hover-reveal per REFACTOR_PLAN.md's own commit history
  (`75472fb Add WorkReveal: Cuberto-style hover-reveal replacement for
  WORK`). As of 2026-08-27, `Project.media` and `ProjectPlate`'s
  `ProductVideo` render path exist (mirroring `Product`), so the two-tier
  ambient-loop pattern is wired and ready — the render path renders
  identically to before until a project actually gets a `media` value.
  Still gated on real footage, not a placeholder: no project has one yet.
- **EVIDENCE** (`evidence-expand.tsx`) — already the site's one real video
  set-piece (Bridge clip). Cuberto's `cb-modal_box-embedded` (unmuted,
  user-initiated) is a possible pattern for a future "watch more" expansion
  if a second, longer Bridge cut is ever captured — not proposed now, no
  such footage exists yet.

## Explicitly not taking

- Cuberto's invented stat block (years/projects count) — MaCo has no
  equivalent real numbers to put there (already called out in
  REFACTOR_PLAN.md §10b).
- The contextual-cursor system as a sitewide feature — `AI_HANDOFF.md`'s
  "Do NOT change without a real reason" list (#8) explicitly flags custom
  cursor/WebGL work as risky without live-browser verification, given two
  earlier WebGL hero attempts were built and reverted for reading like a
  generic template. Any cursor work stays narrow/optional and needs its own
  go/no-go (see `PHASE-2-MOTION-PLAN.md` item 2d-7).
- Any of Cuberto's actual visual treatment — grid proportions, card corner
  radius, type, color — per the rule at the top of this file.

## Measured values (skillui, 2026-08-27)

Captured via `npx skillui@1.3.4 --url https://cuberto.com --mode ultra
--screens 6` (real npm package, `amaancoderx/npxskillui`, MIT, pure static
+ Playwright computed-style analysis — see REFACTOR_PLAN.md §10). Raw
output: `docs/references/cuberto/skillui/cuberto-skillui-design/`. This
section extracts only **timing and easing** — the one thing the mechanism
notes above lacked. Palette, type, radii, and spacing values also present
in the raw output are **not** reproduced here and must never enter
`frontend/src/styles.css` — they're Cuberto's visual identity, out of
scope per the rule at the top of this file. Only mechanism crosses over.

### Easing curves in use

```
cubic-bezier(0.16, 1, 0.3, 1)   — transform, 0.8s and 1s variants (primary "settle" ease)
cubic-bezier(0.19, 1, 0.22, 1)  — transform, 0.8s and 1.2s variants (softer settle, longer)
cubic-bezier(0.35, 0, 0, 1)     — transform, 0.5s
cubic-bezier(0.4, 0, 0.2, 1)    — the scroll-reveal opacity/transform pattern (standard ease)
```

Cross-reference: MaCo's existing `--ease-emphasis: cubic-bezier(0.16, 1,
0.3, 1)` (`styles.css:31-40`) is **already the same curve** as Cuberto's
primary settle ease — no change needed there. `--ease-standard:
cubic-bezier(0.4, 0, 0.2, 1)` also already matches Cuberto's scroll-reveal
curve. The two curves MaCo doesn't have are `cubic-bezier(0.19, 1, 0.22,
1)` (softer/longer settle) and `cubic-bezier(0.35, 0, 0, 1)`.

### Durations in use

`0.3s · 0.4s · 0.5s · 0.75s · 0.8s · 1s · 1.2s` for transform/opacity
transitions; `5s linear infinite` for continuous rotation/stroke loops
(icon-only, not page motion). Skillui's own guidance: "use these values,
never invent new durations" — matches MaCo's existing discipline of
central duration tokens over per-component magic numbers.

### Page structure (measured, informational only)

- Total scroll height: **13,596px** across 7 sections (`cb-tophead` →
  `cb-preview` → `cb-overview` → `cb-feature` → `cb-logoreel` →
  `cb-summary` ×2 → `cb-overview` → `cb-summary` ×1 → `cb-faq`).
- Hero (`cb-tophead`) padding: `180px 0px 108px` — asymmetric, more
  breathing room above than below.
- Footer padding: `108px 0px`, `54px` column gap.
- No box-shadow anywhere; flat elevation via border/surface-color shifts
  only. No CSS gradients. No backdrop-blur.
- Transition property scoped, not `all` (except one incidental `all` on
  a link's inherited box-model transition) — matches
  `AI_HANDOFF.md`'s own motion-audit finding (`transition-all` →
  `transition-[transform,border-color]` on ThemeSwitch).

### What this changes in Stage 2a

`cubic-bezier(0.19, 1, 0.22, 1)` is the one genuinely new curve worth
considering for `--ease-overshoot` or a new `--ease-settle-soft` token —
everything else Cuberto uses, MaCo's token set already covers. No
justification found here to change Lenis `lerp`/`wheelMultiplier`
(`scroll-runtime.ts:98-99`) — Cuberto's motion stack is pure CSS, not a
comparable smooth-scroll library, so its timings aren't a benchmark for
Lenis's feel.
