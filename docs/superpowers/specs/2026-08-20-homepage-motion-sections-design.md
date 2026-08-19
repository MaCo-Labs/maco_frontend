# Four homepage motion sections — design spec

**Date:** 2026-08-20
**Status:** Design approved in chat (section order, sticky-not-pin decision, content reframing). Awaiting written-spec review before `writing-plans`.
**Scope:** Replaces `frontend/src/components/home/portfolio-grid.tsx` (WORK) and `frontend/src/components/home/product-story.tsx` (PRODUCTS); adds one new section (CLIENTS) between them. Touches `frontend/src/routes/index.tsx` and `frontend/src/components/home/ground-handoff.tsx`. Does not touch CAPABILITY, IDENTITY, METHOD, RECORD, or any section outside this run.

## Problem

The user supplied a complete brief for four Attio/Cuberto-inspired motion sections — an expanding product window, an "exploding" client-logo grid, a hover-reveal work list, and a product showcase reel — with binding technical rules (GSAP ScrollTrigger + `useScrollScene()` own all scroll motion; Framer Motion is discrete-state-only; no React re-renders on scroll; `quickSetter`/CSS custom properties for anything scrubbed). Classified **architectural** under `superpowers:brainstorming`: new subsystems, a restructured section order, and changes to interfaces `GroundHandoff` depends on via exact `aria-label` string matches.

User decision (via `AskUserQuestion`): these four sections **replace WORK and PRODUCTS** rather than sitting alongside them — Task 3 (hover-reveal list) replaces WORK, Tasks 1+4 (expanding window + showcase reel) merge into one replacement for PRODUCTS, Task 2 (client logos) is a new section. The homepage stays at 10 sections.

## Constraints that shape every decision here

**1. The `GroundHandoff` pin hazard, extended.** `ground-handoff.tsx`'s existing rule: a section can only be safely used as the *outgoing* side of a recede/sheet pair if it is pin-free when the crossing-window transform fires. WORK is pin-free today; PRODUCTS uses `position: sticky` (not a real ScrollTrigger pin) specifically so it can remain the outgoing side of the sheet transition into IDENTITY. This spec's four tasks each ask for a "pinned section" — a literal `pin: true` on any of WORK's, CLIENTS', or PRODUCTS' replacements would break that section's eligibility as an outgoing side, silently killing the PRODUCTS→IDENTITY sheet moment (a signature device from the prior sitewide-restructure work) and the WORK→CAPABILITY recede.

**Resolution: no literal `pin: true` anywhere in this spec.** Every "pin the section" / "pinned section" instruction from the brief is implemented as `position: sticky` on the element that needs to stay in view, with all visual change driven by scrub — the exact device `product-story.tsx`'s current card stack already proves out. This is not a workaround invented against the brief: Task 4's own text says "similar to the current product-story.tsx architecture," which *is* the sticky approach. Net effect: WORK's replacement, CLIENTS, and PRODUCTS' replacement all stay pin-free, so every existing `GroundHandoff` pair either survives unchanged or gets a straightforward pointer-string update — none need to be dropped for safety.

**2. Content reality.** The brief's language ("multiple photos, videos, and GIFs," "a wall of client logos") describes a media library this repo doesn't have:

| Content | What exists |
|---|---|
| `clients` (`content/maco.ts`) | Exactly 4 entries, each with one logo. Already rendered twice today — as WORK's per-card brand mark, and as RECORD's logo wall. |
| `products` | Exactly 2 entries. Driver's Diary: 1 poster image. Bridge: 1 poster image + 1 video (webm/mp4). No galleries, no GIFs, anywhere in the repo. |
| Project photography | None. `portfolio-grid.tsx`'s own comment confirms this and cites `AGENTS.md`'s no-fabricated-content rule — WORK's cards use a tokenized backdrop plate carrying the real brand mark, not screenshots. |
| `image_19ffae.jpg` (referenced by the brief for Task 1) | Does not exist in the repo or session. |

Every task below is scoped to what's real:
- Task 3's hover media is the same brand-mark-on-plate device WORK already uses, not invented photography.
- Task 2's "exploding" grid scatters exactly 4 logos — tasteful, not a dense wall.
- Task 4's "reel" scrubs **between the 2 real products** (Bridge → Driver's Diary), not through a non-existent per-product gallery.
- Task 1's placeholder media is Bridge's real poster (`/media/bridge/poster.jpg`) — already-live product photography, closer to the brief's intent than a fabricated file.

## Current state (verified against source, route order)

| Section | Component | `data-ground` | `aria-label` | Hosts a pin? |
|---|---|---|---|---|
| OPEN | `open-logo.tsx` | deep | Introduction | no |
| SURFACE | `working-surface.tsx` | deep | What MaCo does | no |
| EVIDENCE | `evidence-expand.tsx` | deep | Bridge in motion | yes |
| **WORK** | `portfolio-grid.tsx` | paper | Selected client work | no |
| CAPABILITY | `services-convergence.tsx` | paper | Capabilities | yes (desktop `matchMedia`) |
| **PRODUCTS** | `product-story.tsx` | paper | Products | no (sticky) |
| IDENTITY | `identity.tsx` | deep | MaCo, in one name and many scripts | yes |
| METHOD | `method-line.tsx` | paper | How MaCo works | yes |
| RECORD | `record.tsx` | paper | Clients and company | no |
| CLOSE | `close-intake.tsx` | deep | Start a project | no |

Existing `GroundHandoff` `PAIRS`:
```ts
["What MaCo does", "Bridge in motion"],
["Selected client work", "Capabilities"],
["Products", "MaCo, in one name and many scripts", true],  // sheet
["Clients and company", "Start a project", true],           // sheet
```

## Approaches considered (how Task 1 + Task 4 combine into one PRODUCTS replacement)

**A. Two separate stacked scenes.** Task 1's expand as one full-height scene, Task 4's reel as a second full-height scene immediately below, each with its own trigger. Simple to build in isolation, but reads as two unrelated sections glued together — the expand's fullscreen takeover has no reason to hand off to a second, differently-mechanised scene right after, and it roughly doubles PRODUCTS' scroll length for a page that already has 10 sections.

**B. Task 1 as a lead-in that resolves into Task 4's reel (chosen).** One sticky stage, one continuous scroll range. Phase 1 scrubs the expand (small rounded card → fullscreen, border-radius to 0) using Bridge's media. Phase 2, once fullscreen, crossfades/tilts from Bridge into Driver's Diary as the "reel" — the expand *becomes* the reel's first frame instead of a separate scene before it. One mental gesture, one sticky element, no wasted scroll length change from today's PRODUCTS.

**C. Task 4 only, drop Task 1's expand.** Simplest, but ignores explicit brief content (Task 1 is a named, separate requirement) and loses the "window filling the viewport" moment that's the whole Attio reference point.

**Chosen: B.**

## 1. WORK replacement — Cuberto-style hover reveal

**New file:** `frontend/src/components/home/work-reveal.tsx`, exporting `WorkReveal`. Replaces `portfolio-grid.tsx`, which is deleted. Same `aria-label="Selected client work"`, same `data-ground="paper"`, pin-free (preserves its role as the outgoing side of the WORK→CLIENTS pair below).

- Layout: a vertical list of the 4 project titles (large display type) on one side; a media panel on the other (desktop) that's empty/hidden at rest.
- Hover or focus on a title (`onPointerEnter`/`onFocus`, mirrored for keyboard access) sets the media panel's content to that project's brand-mark-on-plate — same tokenized backdrop (`color-mix` tinted plate on `--surface-2`, brand mark centred) `GridCard` already builds, so no new visual language is invented, just relocated.
- Panel visibility/crossfade between projects: Framer Motion (`AnimatePresence`/`motion.div` opacity+scale) — this is discrete hover UI state, explicitly the case the brief carves out for Framer Motion.
- If the panel floats with the cursor: position tracked via `gsap.quickSetter(el, "y", "px")` on `pointermove` over the list bounds, per the brief's explicit instruction — zero React re-renders, panel x stays fixed to its column.
- Touch (`pointer: coarse`): no hover exists, so each project's media renders inline under its title instead of gating on hover — functional parity, matching `usePointerField`'s existing coarse-pointer bail-out convention.
- `Link to="/work/$slug"` / external link stay as they are today, just re-laid-out under the list.

## 2. CLIENTS — new section, "exploding" logo scatter

**New file:** `frontend/src/components/home/client-field.tsx`, exporting `ClientField`. New section, inserted between WORK and CAPABILITY. `data-ground="paper"`, `aria-label="Who we work with"` (distinct from RECORD's "Clients and company" — no string collision, no semantic overlap in the DOM).

- Renders the same 4 `clients` entries WORK's cards and RECORD's wall already use — the design accepts this as normal trust-mark repetition, not a defect to engineer around.
- Scroll-scrubbed, not pinned: one `ScrollTrigger` on the section (`scrub`, no `pin`) drives a single inherited, registered custom property (`--scatter`, `@property`, `syntax: "<number>"`, `initial-value: 0`) from 0 (all 4 logos stacked dead-centre) to 1 (each logo at its own hand-authored scattered offset/rotation) — the same one-property-drives-many-children device `services-convergence.tsx`'s `--c`/`--d` already uses. 4 fixed target positions, hand-tuned, not randomly generated (nothing to gain from runtime randomization at n=4).
- Ambient float once scattered: a small per-logo GSAP `yoyo`/`repeat: -1` sine-ish tween (randomized duration/delay per logo), amplitude low enough it doesn't fight the scatter scrub; disabled under `useReducedMotion`.
- Magnetic hover: reuse `<Magnetic>` (`components/motion/magnetic.tsx`) per logo — it already wraps a child in a Framer `useSpring`-driven pointer-follow with rubber-banding and a momentum-spring release, which is exactly "pulled toward the cursor, snaps back cleanly on leave." The brief's "near" (proximity, not just literal hover) is served by giving each logo's `<Magnetic>` wrapper a padded invisible hit area larger than the visual mark, rather than building a second spring primitive — same mechanism, wider capture zone.
- Pin-free throughout (this is what keeps it eligible as either side of a `GroundHandoff` pair, though this spec doesn't give it one — see §4).

## 3. PRODUCTS replacement — expanding window into showcase reel

**New file:** `frontend/src/components/home/product-showcase.tsx`, exporting `ProductShowcase`. Replaces `product-story.tsx`, which is deleted. Same `aria-label="Products"`, same outer `data-ground="paper"` — both unchanged, so the existing sheet pair into IDENTITY needs no pointer update, only the sticky-not-pin guarantee from §Constraints.

- One `position: sticky` stage inside a tall scroll container (multi-viewport height, mirroring today's sticky card-stack sizing) — no literal pin.
- **Phase 1 (Task 1):** Bridge's media (`/media/bridge/poster.jpg` poster, `capture.webm`/`capture.mp4` video) starts as a small rounded card and scrubs to fullscreen. One registered custom property (`--expand`, `@property`, 0→1) drives `scale`/`border-radius`/`inset` through `calc()` inside `ScrollTrigger.onUpdate`, written via `quickSetter` — border-radius scrubs to 0 exactly as the brief specifies.
- **Phase 2 (Task 4, reframed to 2 real products):** once fullscreen, a second scrub range crossfades/tilts from Bridge to Driver's Diary — `rotateX`/`rotateY` plus opacity, driven by a second registered property, continuing the brief's "3D-tilt overlapping stack" language against the catalog that actually exists (2 items) instead of an invented gallery.
- Feature copy (title, feature list, CTA) reuses the existing `ScrubReveal`/`Stagger`/`LineReveal`/`Magnetic` primitives `product-story.tsx` already uses for this content — not reinvented, just re-laid-out around the new sticky stage.
- Nested `data-ground="deep"` tile treatment on the media itself is preserved from today's `ProductMedia` (explicitly called out there as intentional — a dark tile reading as more material on a paper page than dark-on-dark).

## 4. Updated `GroundHandoff` PAIRS

```ts
const PAIRS: readonly [outgoing: string, incoming: string, sheet?: boolean][] = [
  ["What MaCo does", "Bridge in motion"],                                    // unchanged
  ["Selected client work", "Who we work with"],                              // WORK -> CLIENTS, plain recede
  ["Products", "MaCo, in one name and many scripts", true],                  // unchanged, sheet preserved
  ["Clients and company", "Start a project", true],                         // unchanged
];
```

CLIENTS→CAPABILITY gets no pair — not every boundary has one today (5 of 9 don't), and nothing about this boundary calls for one. Since CLIENTS is pin-free (§2), this is a scope choice, not a hazard workaround; a pair could be added later with no re-architecture.

## Files touched

- Create: `frontend/src/components/home/work-reveal.tsx`
- Create: `frontend/src/components/home/client-field.tsx`
- Create: `frontend/src/components/home/product-showcase.tsx`
- Delete: `frontend/src/components/home/portfolio-grid.tsx`
- Delete: `frontend/src/components/home/product-story.tsx`
- Modify: `frontend/src/routes/index.tsx` — swap `PortfolioGrid`/`ProductStory` imports and JSX for `WorkReveal`/`ClientField`/`ProductShowcase`, in the order WORK → CLIENTS → CAPABILITY → PRODUCTS
- Modify: `frontend/src/components/home/ground-handoff.tsx` — `PAIRS` update in §4, doc comment update reflecting the new outgoing-side roster
- Modify: `frontend/src/styles.css` — new `@property` registrations (`--scatter`, `--expand`, and Phase 2's tilt property), each following the existing block's `syntax`/`inherits`/`initial-value` convention and comment style

## Testing / validation

- Visual: confirm WORK's replacement, CLIENTS, and PRODUCTS' replacement never set `pin: true` anywhere (grep the diff for `pin:` in these three files) — the entire GroundHandoff-safety argument in this spec depends on that staying true.
- Visual: scroll through WORK→CLIENTS→CAPABILITY→PRODUCTS→IDENTITY at both themes (`obsidian`/`cobalt`), confirm the WORK→CLIENTS recede and the PRODUCTS→IDENTITY sheet both still fire correctly against the new `aria-label`s.
- Functional: tab through WORK's replacement with keyboard only — hover-reveal media must also trigger on focus, per §1.
- Functional: verify CLIENTS and WORK's replacement both render usable fallbacks under `(pointer: coarse)` — scatter/hover-reveal must not be the only way to see the content.
- Motion: `prefers-reduced-motion` disables CLIENTS' ambient float, and all three sections must render their correct static rest-state composition with `useScrollScene`'s runtime `null` (SSR / reduced motion / blocked import), consistent with every other homepage section.
- Regression: `npm run build` clean (no test suite exists in this repo — build is the verification gate, consistent with the rest of this session).

## Explicitly out of scope

Any change to CAPABILITY, IDENTITY, METHOD, RECORD, CLOSE, or `ScrollThread`. RECORD's existing logo wall is left exactly as-is — the repetition with CLIENTS is accepted, not resolved, per §Constraints. New brand/product photography, video, or GIF assets (none are supplied; nothing is fabricated). Any GroundHandoff pair for the CLIENTS→CAPABILITY boundary. Performance measurement, motion audit, `forced-colors`/`prefers-contrast` support — all remain queued in `ROADMAP.md`, not selected for this pass.
