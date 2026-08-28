# Phase 2 — Homepage Visual/Motion Enhancement Plan

Status: **2a/2b/2c done and verified live (2026-08-27). 2d still open —
optional, needs its own go/no-go per AI_HANDOFF.md #8.**

Last updated: 2026-08-27

## Recap: how Phase 2 got here

Phase 2 was scoped into 3 items this session:

1. **Driver's Diary real footage** — held. User is providing the capture
   separately; out of scope for this plan.
2. **ThemeProvider hydration race** — done, verified live. `theme.tsx`'s
   `localStorage` correction moved from `useEffect` to an SSR-safe
   `useLayoutEffect` (falls back to `useEffect` on the server), so a
   returning Cobalt visitor's theme resolves before first paint instead of
   one visible Obsidian-tinted frame after it. Verified: reload with
   `cobalt` stored → correct theme from first paint, 0 console warnings
   (no hydration mismatch introduced), `bun run build`/`bun run lint` clean.
3. **Full pinned-scroll motion QA + reduced-motion fallback pass** — done,
   verified live. All four pinned sections (EVIDENCE, CAPABILITY, IDENTITY,
   METHOD) correctly hold `position: fixed` through their scroll range and
   release cleanly after — verified with real wheel-driven scroll (an
   initial pass using raw `window.scrollTo()` gave false drift readings
   because it fights Lenis's own smoothing loop; the corrected methodology
   confirmed no product bug). Reduced-motion pass clean across all 11
   sections at 1440px (0 console errors). Mobile smoke pass (390px, full
   motion, full scroll-through) clean, and the header/hero collision fix
   from earlier this session still holds.

This plan covers what comes **after** that bug-cleanup round: the actual
visual/motion enhancement work.

## Motion audit findings

Full report (branded HTML, looping demos per finding):
`motion-audits/maco-website-v2-2026-08-27.html`

Run via the `design-motion-principles` skill (Jakub primary / Jhey
secondary / Emil selective — the standard marketing-page weighting,
confirmed with the user before the full audit ran). Overall verdict: **not
a slop codebase** — the scroll substrate is disciplined, reduced-motion is
a first-class citizen everywhere, and two genuinely inventive pieces (the
OPEN shader hero, IDENTITY's CSS-only script dial) earn their place. The
gaps are craft edges, not a missing vocabulary.

### Critical (2)

| Issue | File | Fix |
|---|---|---|
| Mobile nav sheet has no exit — snaps out of existence, backdrop has no transition either direction | `chrome.tsx:110,122` | Mirror the 350ms rise on exit (AnimatePresence or a `data-state` transition); fade the scrim too |
| "Visit site ↗" link invisible to keyboard focus (`opacity-0`, only `group-hover:`, no `group-focus-within:`) | `work-reveal.tsx:122` | Add `group-focus-within:opacity-100` alongside the existing `group-hover:opacity-100` |

### Important (2)

| Issue | File | Fix |
|---|---|---|
| RECORD's About paragraph uses the same line-mask reveal as the page's two biggest headlines, undercutting the section's own documented "quiet beat" intent | `record.tsx:84` | Downgrade to the site's own default `<ScrubReveal hold>` (already used for WorkingSurface/WorkReveal/ClientField headings) |
| Client-logo ambient float (`repeat: -1`) loops indefinitely with no pause affordance — a WCAG 2.2.2 concern independent of `prefers-reduced-motion` | `client-field.tsx:129` | Cap to a few cycles and settle, or gate `play()`/`pause()` to the section's own `ScrollTrigger` visibility |

### Opportunities (3)

- Hover-lift cards use `transition-all` instead of scoped properties (`client-field.tsx:74`, `record.tsx:46`) — scope to `transform`/`border-color`.
- ThemeSwitch's icon hover-rotate runs 500ms (`chrome.tsx:31`) — a touch long by production-polish standards; low frequency makes this taste, not a fix.
- The scrubbed line-mask reveal repeats near-identically across WorkingSurface / ProductShowcase / CloseIntake headlines — a deliberate signature device (same spirit as `.light-pass`), not slop, but worth a gut-check on whether the third use still reads as an event by CLOSE.

## Reference-site technique study (mechanism only — no layout/color/type copied)

Visited live via Playwright, inspected DOM/motion architecture, not screen-scraped for design:

| Site | Technique observed | Mechanism |
|---|---|---|
| cuberto.com | Contextual cursor | Single cursor element with swappable inner slots (`cb-cursor-media`, `cb-cursor-media-box`, `cb-cursor-text`) — the cursor itself previews hovered content (image/label) instead of a separate tooltip |
| iventions.com | Sticky-panel / scrolling-copy split | Plain `position: sticky` (React/Emotion) pairs a fixed visual panel against scrolling text — a lighter-weight alternative to a GSAP `ScrollTrigger` pin when a section doesn't need frame-accurate scrub, just "stay put while this copy scrolls past" |
| uncommondesign.group | Cursor reel | Pre-built cursor state variants (arrow / play / pause) cross-faded via class toggle instead of injecting dynamic content per hover — cheaper (no layout recalculation) and preloadable |
| minhpham.design | Semantic cursor-state hooks | One global cursor controller reads `.js-cursor-contract` / `.js-cursor-extend` classes on whatever's currently hovered, rather than computing per-element cursor behavior inline — much more maintainable as new hover targets are added. Also confirmed as a live Lenis user (`lenis-stopped` class present), and gates scroll behind an intro loader (`is-loading`/`is-ready` states) |

None of these are being proposed as literal ports — MaCo has no custom
cursor today and adding one is explicitly flagged as risky in
`AI_HANDOFF.md`'s "Do NOT change without a real reason" list (#8: no
custom cursor without live-browser verification, given two earlier WebGL
attempts were built and reverted for reading like a generic template).
Any cursor work below is scoped narrow and optional precisely because of
that history.

## Proposed Phase 2 scope

Ordered by what a visitor feels, matching the audit's own severity order.
**Nothing here is implemented yet.**

### 2a. Critical fixes (from the audit) — Done (2026-08-27)
1. ~~Mobile nav sheet exit animation + scrim fade (`chrome.tsx`)~~ — done.
   Both the scrim and panel now use `motion/react`'s `AnimatePresence`
   (matching `work-reveal.tsx`'s existing carve-out for discrete UI state)
   instead of a CSS `animation` that only covered enter. Verified live at
   390px: opens to opacity 1, closes and fully unmounts, under both normal
   and `prefers-reduced-motion: reduce` (duration collapses to 0, no stuck
   panel). 0 console errors through the cycle.
2. ~~Keyboard-focus visibility on WorkReveal's "Visit site" link
   (`work-reveal.tsx`)~~ — done. Added `group-focus-within:opacity-100`
   alongside the existing `group-hover:opacity-100` on both the link and
   its sector label. Verified live: focusing the row sets the link's
   computed opacity to 1; blurring returns it to 0.

### 2b. Important fixes (from the audit) — Done (2026-08-27)
3. ~~RECORD About paragraph: downgrade to `ScrubReveal hold`
   (`record.tsx`)~~ — done. Swapped `<LineReveal mode="scrub">` for
   `<ScrubReveal hold>`, the site's own default for body copy (already
   used in `work-reveal.tsx`/`client-field.tsx`), matching the section's
   own "quiet beat" doc comment.
4. ~~ClientField ambient float: cap cycles or gate to `ScrollTrigger`
   visibility (`client-field.tsx`)~~ — done. Gated the per-tile
   `repeat: -1` float tween to the section's own `ScrollTrigger`
   (`toggleActions: "play pause resume pause"`) instead of running
   indefinitely off-screen (WCAG 2.2.2).

### 2c. Opportunity cleanup (from the audit, low effort) — Done (2026-08-27)
5. ~~Scope `transition-all` to `transform`/`border-color` on hover-lift
   cards~~ — done, both `client-field.tsx` and `record.tsx`.
6. ~~Trim ThemeSwitch's icon hover-rotate toward ~300ms~~ — done,
   `duration-500` → `duration-300` in `chrome.tsx`.

All six verified via `bun run build` + `bun run lint` (clean) and a live
Playwright pass (390px mobile nav cycle, 1440px keyboard-focus check,
full-page scroll-through) — 0 console errors introduced. One pre-existing,
unrelated issue was found during verification and is **not** part of this
plan: navigating from the homepage to a `/work/$slug` route throws a
React `NotFoundError: Failed to execute 'removeChild'` in the console,
reproducible on a clean reload with no interaction with any file this plan
touched — likely a GSAP `ScrollTrigger` cleanup race during the route
transition. Worth its own investigation, separately.

### 2d. New enhancement candidates (from reference-site technique study)
These are **proposals to discuss, not commitments** — each needs its own
go/no-go given item #8's history with cursor/WebGL work reading as
templated:
7. *(optional, needs discussion)* A restrained cursor-state hook system
   (minhpham.design's `.js-cursor-contract`/`.js-cursor-extend` pattern) —
   only if scoped to something MaCo-specific (e.g., WORK's hover-reveal
   panel already has bespoke cursor-follow logic via `gsap.quickSetter`;
   this would generalize that into a reusable primitive, not add a new
   decorative cursor sitewide)
8. *(optional, needs discussion)* Evaluate `position: sticky` as a lighter
   alternative to `ScrollTrigger` pin for any FUTURE section that doesn't
   need frame-accurate scrub (PRODUCTS already uses sticky for exactly
   this reason) — not a retrofit of the 4 existing pins, which are
   correctly using GSAP pin for good reasons (frame-accurate multi-property
   scrub)

## What's NOT in this plan

- Driver's Diary real footage (held, separate item)
- Any layout, color palette, typography, or content taken from the 4
  reference sites — technique only, per the explicit brief
- A new custom cursor as a blanket sitewide feature — AI_HANDOFF.md's
  history with this is explicit and this plan respects it

## Approval gate

Do not implement 2a/2b/2c/2d without explicit sign-off. 2a and 2b are the
audit's must-fix items; 2c is minor cleanup; 2d is genuinely optional and
should be discussed item-by-item given the site's documented caution
around cursor/WebGL work.
