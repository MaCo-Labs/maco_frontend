# MaCo Website — AI Handoff

## Status

Overall: **STABLE.** The homepage was fully rebuilt on Cuberto's structural
foundation 2026-08-28 (11 sections, new order — see `CONTEXT.md` §10 and
the seventh-pass entry below), then refined the same day (eighth pass:
EVIDENCE crop fix, dead-code sweep, hero treatment, client consolidation,
adaptive navbar — see below), and a full dead-code/dependency cleanup pass
ran 2026-08-21 (see `CONTEXT.md` §11). Build/lint are clean.

## 2026-08-27 session — re-audit + 2 confirmed bugs fixed

A prior "STABLE, no open bugs" claim was false — verified live in a real
browser (Playwright, prod build via `bun run preview`), not just by reading
code. Two bugs found and fixed this session, both personally verified live,
both themes, 1440px and 390px:

1. **OPEN/header text collision** (originally filed as "OPEN renders
   blank/white on initial paint" — that literal symptom did NOT reproduce
   under heavy instrumentation: CDP CPU 6x throttle + network throttle +
   cache disabled + storage cleared, dev and prod builds, sampled DOM every
   50-150ms through load. What DID reproduce, live, on every single page
   load, both themes: `chrome.tsx`'s `<header>` is `fixed` (out of flow,
   real height 80px/96px at mobile/desktop), so nothing pushed
   `open-logo.tsx`'s own top-row content (site name + location) down —
   it rendered at `pt-8`/`md:pt-10` (32px/40px), landing in the same band
   as the header's own logo/nav/CTA and visually overlapping it. Fixed by
   changing that row to `pt-24`/`md:pt-28` (96px/112px, ~15px clearance
   under the header's real measured height). Likely regressed by commit
   `9f3d6b4` (header changed from sticky to fixed to overlay the hero).

2. **PRODUCTS compositing bug** — confirmed and root-caused: during the
   desktop (lg+) PRODUCTS scroll-stage crossfade between Bridge and
   Driver's Diary, the two opacity curves in `styles.css`
   (`product-expand-media`/`product-reel-media`) were asymmetric
   (`1 - reel*1.6` vs `reel`), leaving both media layers significantly
   opaque simultaneously across ~28% of the section's scroll range.
   Made visually worse because Driver's Diary has no real product
   screenshot yet — its poster (`content/maco.ts`) is a HeadGreen
   brand-mark-on-map illustration, not app UI, so the long overlap read as
   one company's logo blended into another's real screenshot rather than a
   clean handoff. Fixed by tightening both curves to a symmetric
   hold-then-cross around the existing reel=0.5 handoff point, narrowing
   the double-visible band to ~2.5% of the section's scroll range (still a
   crossfade, not an instant cut — a true zero-overlap cut was considered
   and rejected as a visible pop; flagged for the user to reconsider if
   they want literally zero overlap instead). Mobile's separate
   `ProductStack` path (stacked cards, no crossfade) was unaffected and
   confirmed clean throughout.

Also found this session: `ThemeProvider` (`theme.tsx`) defaulted React state
to `"obsidian"` always, corrected from `localStorage` only in a post-mount
effect, so a returning Cobalt visitor got one render of Obsidian-tinted
`PrismField`/glow colors before it corrected. **Fixed and verified live** in
the motion-audit pass below — moved the correction to an SSR-safe
`useLayoutEffect`.

Verified this session: `bun run build`, `bun run lint` (0 errors), and full
Playwright screenshot passes (obsidian@1440, cobalt@1440, obsidian@390,
all 11 sections + both bug locations before/after) against the **production
build** (`bun run preview`), not just dev server. Screenshots retained in
`audit/` (gitignored, local only). Console: 0 errors/warnings across every
pass checked.

## 2026-08-27, later pass — motion audit fixes

A `design-motion-principles` audit (Jakub primary/Jhey secondary/Emil
selective — the marketing-page weighting) ran against all 11 homepage
sections plus the shared motion vocabulary. Full report:
`motion-audits/maco-website-v2-2026-08-27.html`. Verdict: not a slop
codebase — craft edges, not a missing vocabulary. Six findings implemented
and verified live this pass; full detail in `PHASE-2-MOTION-PLAN.md`
(items 2a/2b/2c):

1. **Mobile nav sheet had no exit animation** (`chrome.tsx`) — scrim and
   panel now use `motion/react`'s `AnimatePresence`, mirroring the existing
   `work-reveal.tsx` carve-out for discrete UI state. Verified live at
   390px under both normal and `prefers-reduced-motion: reduce`.
2. **"Visit site ↗" invisible on keyboard focus** (`work-reveal.tsx`) —
   added `group-focus-within:opacity-100` alongside the existing
   `group-hover:opacity-100`. Verified: opacity flips 0→1 on focus.
3. **RECORD's About paragraph over-animated** (`record.tsx`) — downgraded
   from `LineReveal mode="scrub"` to `ScrubReveal hold`, the site's own
   default for body copy, matching the section's own "quiet beat" intent.
4. **ClientField's ambient float looped indefinitely** (`client-field.tsx`)
   — gated the `repeat: -1` tween to the section's own `ScrollTrigger`
   visibility (WCAG 2.2.2 pause affordance).
5. **`transition-all` on hover-lift cards** (`client-field.tsx`,
   `record.tsx`) — scoped to `transition-[transform,border-color]`.
6. **ThemeSwitch hover-rotate trimmed** (`chrome.tsx`) — 500ms → 300ms.

Verified: `bun run build`/`bun run lint` clean (one pre-existing
`react-refresh` warning in `theme.tsx`, unrelated), live Playwright pass
(390px mobile nav cycle under normal and reduced motion, 1440px
keyboard-focus check, full-page scroll-through) — 0 console errors
introduced.

Item 2d from `PHASE-2-MOTION-PLAN.md` (optional cursor-state hook system,
sticky-vs-pin evaluation for future sections) remains open, pending its own
go/no-go per rule #8 below.

## 2026-08-27, third pass — `removeChild` route-transition crash, root-caused and fixed

The `removeChild` bug flagged in the motion-audit pass above is fixed.
Root cause: `useScrollScene` (`hooks/use-scroll-scene.ts`) ran its GSAP
setup — and, critically, its `ctx.revert()` cleanup — inside a plain
`useEffect`. Four sections use `ScrollTrigger`'s `pin: true`
(`evidence-expand.tsx`, `identity.tsx` ×2, `services-convergence.tsx`,
plus `method-line.tsx`'s own bespoke pin effect), which reparents the
pinned element into a generated `.pin-spacer` div — invisible to React's
fiber tree. On route change, React's mutation phase runs first and calls
`parent.removeChild(section)` expecting `section` to still be `parent`'s
direct child; since it's actually nested inside the spacer, this threw
`NotFoundError: Failed to execute 'removeChild' on 'Node': the node to be
removed is not a child of this node`. Passive (`useEffect`) cleanups don't
run until after that mutation phase, so `ctx.revert()` — which un-nests
the spacer — always fired too late to prevent it.

Fixed by switching `useScrollScene` to an SSR-safe `useLayoutEffect`
(`useIsomorphicLayoutEffect`, same pattern as `theme.tsx`), so
`ctx.revert()` runs synchronously in React's layout phase, before any
mutation. Also migrated `method-line.tsx`'s standalone
`getScrollRuntime().then(...) / trigger.kill()` pin effect onto the shared
`useScrollScene` hook — it was the one pinned section not already using
the shared substrate, so it would have kept the same bug independently.

Verified live via Playwright, dev server: reproduced the original crash
first (full stack trace, `commitDeletionEffectsOnFiber`), confirmed the
fix eliminates it across repeated forward/back navigation cycles between
`/` and `/work/$slug` (0 console errors), and confirmed METHOD's pin still
correctly toggles `position: relative` → `fixed` → `relative` through its
scroll range via real wheel-driven scroll (not `window.scrollTo()`, which
this project's own prior testing already found gives false readings
against Lenis). `bun run build` / `bun run lint` clean.

For detailed session-by-session history of how the homepage was built (the
WebGL hero attempts, the mount-order-race bugs, the pin/transform bugs, the
GSAP+Lenis adoption story), read `git log --oneline` and the individual
commit messages/diffs — that history is preserved there and is more reliable
than a hand-maintained changelog, which drifted badly out of sync with the
code across several passes (that drift is exactly what the 2026-08-21
cleanup fixed). This file now tracks **current** state only.

## 2026-08-27, fourth pass — OPEN hero: Prism WebGL replaced with type-driven treatment

Executed `docs/REFACTOR_PLAN.md` §12's original hero ask (previously marked
superseded) after building it on a throwaway dev route first, not
committing blind. `npx skillui@1.3.4` (real npm package,
`amaancoderx/npxskillui`, MIT) ran against all four reference sites,
producing measured easing/timing data absent from the earlier
DOM-inspection-only `docs/references/*/NOTES.md` — see each file's new
"Measured values" section. Notable: 3 of 4 independent agency sites
converge on the identical `cubic-bezier(0.165, 0.84, 0.44, 1)` easing curve;
Cuberto's primary settle ease already matches MaCo's existing
`--ease-emphasis` token verbatim.

Three OPEN directions were then built on a temporary `dev.hero-preview.tsx`
route (never linked, deleted after the decision) and screenshotted at
1440px/390px, both themes:

- **A — keep Prism, add a scrub-revealed tagline.** Worked, but the tagline
  sat on the shader's brightest band and was hard to read.
- **B — oversized ghost wordmark + `<RakingSurface>`, no WebGL.** Strongest
  result in both themes and on mobile, literally what §12 asked for. Chosen.
- **C — Bridge dashboard footage as an ambient `object-cover` plate.**
  Rejected outright: the raw capture rendered full app chrome (sidebar,
  calendar, task cards) behind the wordmark — exactly the generic-AI-SaaS
  read rule #8 below warns against. Confirms why this wasn't done already;
  would need heavy treatment (blur/crop/desaturate) to be usable, not a
  quick win.

`open-logo.tsx` now uses direction B: the real wordmark and mark sit over
an `aria-hidden` oversized duplicate of the same word at ~5% opacity,
lit by `<RakingSurface>` (MaCo's existing signature light-pass device,
reused rather than inventing a new one). No tagline/statement text was
added — that copy already lives one section down in `working-surface.tsx`
(`site.statement`); repeating it in OPEN would have been the same copy
twice, one scroll apart. `prism-field.tsx` is deleted — it was OPEN's only
consumer, verified via `grep -rn PrismField frontend/src`.

Verified: `tsc --noEmit` (only the pre-existing `MaCoGlobe.tsx` error,
unrelated), `bun run lint` clean, `bun run build` clean, live Playwright
screenshots of the throwaway preview route in both themes at 1440/390
before the swap was applied to the real component.

## 2026-08-27, fifth pass — section-divider lines removed; WORK video-card scaffolding wired

**Divider lines.** Removed the `rule-t` utility (`border-top: 1px solid
var(--line)`, `styles.css:409`) from all 9 homepage sections that had it on
their `<section>` root — `working-surface.tsx`, `work-reveal.tsx`,
`client-field.tsx`, `services-convergence.tsx`, `product-showcase.tsx`,
`identity.tsx`, `method-line.tsx` (both its reduced-motion and pinned
render branches), `record.tsx`, and `close-intake.tsx` (`"light-pass
rule-t"` → `"light-pass"`). OPEN and EVIDENCE never had one. Vertical
padding was left untouched — `py-24 md:py-32` was already consistent
across every non-pinned section, so removing the line alone produces the
seamless scroll. Deliberately did NOT touch `border-t`/`border-b` inside
`method-line.tsx`'s step grid (the animated progress-spine track, and each
step's hover-interactive border segment) or `work-reveal.tsx`'s
`divide-y`/`border-t` list separators — those are functional component
chrome, not section dividers, and stay. Verified: `tsc`/`lint`/`build`
clean, full 154-shot live matrix — 0 console errors on any of the 9
touched sections. (Six cells logged a pre-existing "Clients and company"/
"Start a project" `settleScroll` capture flake in the QA harness itself,
unrelated — confirmed by viewing an unaffected cell's screenshot, which
renders correctly.)

**WORK video cards.** `Project.media?: Media` added to `content/maco.ts`,
mirroring `Product`'s existing shape. `work-reveal.tsx`'s `ProjectPlate`
now renders `ProductVideo` when a project has `media`, falling back to the
brand-mark plate otherwise — same fallback chain `Product` already uses.
No project has `media` set yet, so all 4 client plates render byte-for-byte
unchanged; this is schema + render-path scaffolding only, gated on real
footage per `docs/MEDIA-GAP.md`. Verified: `tsc`/`lint`/`build` clean, live
screenshot of WORK confirms unchanged output.

## 2026-08-27, sixth pass — GroundHandoff pacing + CLOSE reveal differentiation

Closed out the rest of the Cuberto plan's Stage 2 queue:

- **GroundHandoff**: added a fifth pair, `["Who we work with",
  "Capabilities"]` (CLIENTS -> CAPABILITY), plain recede, no `sheet`. After
  this session's `rule-t` divider removal, that boundary was the one spot
  in the WORK/CLIENTS/CAPABILITY/PRODUCTS run of four same-ground sections
  with neither a line nor a ground-color change nor a handoff cue — the
  flattest transition on the page. CLIENTS is pin-free (already established
  in `ground-handoff.tsx`'s own doc comment) and CAPABILITY only needs to
  be safe as an *incoming* target here, which it is.
- **CLOSE's line-mask reveal**: given custom `start="top 95%" end="top
  30%"` (was inheriting `LineReveal`'s default 85%/55%, identical to
  SURFACE and PRODUCTS — the same scrub reveal used verbatim a third time,
  `PHASE-2-MOTION-PLAN.md` Opportunity #3). Wider range, same mechanism —
  no new component, just a slower/later unfurl on the page's biggest
  heading so the third occurrence reads as the close, not a repeat.
- **PRODUCTS crossfade** (`AI_HANDOFF.md`'s flagged ~2.5% overlap band):
  re-checked `product-expand-media`/`product-reel-media` in `styles.css` —
  still the symmetric 0.475-0.525 hold-then-cross documented in the third
  pass above. Kept as-is; the zero-overlap alternative was already tried
  and rejected as a visible pop, so this is the better of the two, not an
  open question.
- **Easing retime**: re-confirmed against `docs/references/*/NOTES.md`'s
  measured values — no change made. MaCo's `--ease-standard`/
  `--ease-emphasis` already match Cuberto's measured curves verbatim, and
  the one genuinely new curve found (`cubic-bezier(0.19, 1, 0.22, 1)`) has
  no concrete section that needs it — adding an unused token would be
  dead CSS.
- **Cursor system** (item 2f, `AI_HANDOFF.md` rule #8 / `PHASE-2-MOTION-
  PLAN.md` item 2d-7): intentionally not touched. Two prior WebGL/cursor
  attempts were built and reverted for reading as a generic template; the
  rule requires its own explicit go/no-go before building, which hasn't
  happened.

Verified: `tsc`/`lint`/`build` clean, full 154-shot live matrix — 0 new
console errors (same pre-existing "Clients and company" `settleScroll`
harness flake as prior passes, confirmed unrelated).

## 2026-08-28, seventh pass — Cuberto-parity full structural rebuild

The owner directly overrode the standing "reference sites are technique-only,
never a target layout" rule (`AGENTS.md` §2/§33, `docs/REFACTOR_PLAN.md`
§10b/§12, `ROADMAP.md`'s "explicitly out of scope" list, every
`docs/references/*/NOTES.md`'s opening line): *"do exactly like the cuberto
wesbite... change our everything... but with the 2 themes of ours."* Asked
to disambiguate structural clone vs. deeper technique fidelity, they chose
**full structural clone**, then personally reinforced the one thing NOT up
for override, unprompted: *"but keep our 2 themes obsidian and cobalt."*

What shipped — plan "Cuberto-parity homepage rebuild," full detail in
`CONTEXT.md` §10:

- Adopted Cuberto's actual homepage section inventory, order, and
  spacing/grid rhythm (measured from `docs/references/cuberto/skillui/`):
  `TopHead` → `EvidenceExpand` (kept) → `Overview` → `FeatureAccordion` →
  `LogoReel` → `Summary`/`FeaturedWork` → `Summary`/`ProductSummary` →
  `Identity` (kept, ground flipped) → `Record` (kept, ground flipped) →
  `Faq` → `Outro`.
- Retired outright (imported only by `routes/index.tsx`, verified before
  deleting): `open-logo.tsx`, `working-surface.tsx`, `client-field.tsx`,
  `services-convergence.tsx`, `product-showcase.tsx`, `method-line.tsx`,
  `work-reveal.tsx`, `close-intake.tsx`. Their CSS-only utilities
  (`converge-card`/`-detail`, `client-tile`, `product-expand-media`/
  `-reel-media`, the now-orphaned `--c`/`--d`/`--reach`/`--scatter`/
  `--expand`/`--reel` `@property` registrations, and the pre-existing dead
  `grid-column-drift`) were pruned from `styles.css` with them.
- New shared `<Accordion>` (`components/home/accordion.tsx`) backs both
  FEATURE and FAQ — real `<button aria-expanded>` + `role="region"`,
  single-open, the `grid-template-rows 0fr->1fr` open/close transition
  taken verbatim off Cuberto's own extracted stylesheet.
- Cuberto's measured rhythm landed as literal tokens in `styles.css`
  (`cb-section`/`cb-tophead`/`cb-cards`/`cb-panel`/`cb-plus`/`cb-reel` +
  `--radius-chip/card/plate/pill`), not eyeballed approximations.
- The eleven `aria-label`s are unchanged — same labels, new order, new
  component per label — so `scripts/shoot.mjs`'s `SECTIONS` list needed
  reordering only, not renaming.
- **The floor held**: MaCo's Obsidian/Cobalt tokens, MaCo's six typefaces,
  `content/maco.ts`'s real copy throughout. `grep -ri
  "fc0019|f1f3fa|494949|Suisse|Manrope" frontend/src` returns nothing
  (one comment explicitly naming `#fc0019` as *what not to use* is the only
  hit, by design).

**`scripts/shoot.mjs`'s `settleScroll` was hardened during this pass**, not
just re-run: the previous architecture's four pinned sections gave the
harness's synthetic wheel-scroll natural places to arrest momentum; this
architecture's mostly-pin-free, much shorter sections don't, so Lenis's own
scroll-smoothing was measured coasting past a short section entirely
(confirmed live: a section settling with only 26px of its 459px height
still inside the viewport) during what used to be a flat 500ms "settle"
wait. Root-caused and fixed with a bounded retry (re-aim, don't just nudge
once) and a tightened in-range band (`top > -200`, was `top > -height`,
which had accepted "one pixel still visible" as settled). Confirmed via
direct DOM inspection (not just screenshots) that every section reporting a
settle failure renders correctly with real content and real geometry —
these are 100% harness artifacts, never a rendering bug. ~24 failures out
of 154 before the fix, 10 after; the remaining 10 are the same mechanism at
a lower rate (a short section — LOGOREEL/RECORD/FAQ — directly following a
tall one — FEATURE/PRODUCTS — occasionally still outruns the retry budget).
Don't re-chase this further without a concrete new failure mode; it's
understood and bounded.

Verified: `tsc --noEmit`, `bun run lint` (0 errors — the CSS-comment
`*/`-inside-a-glob-path bug this pass introduced and then caught, see
`styles.css`'s Cuberto-parity block header, is a cautionary example for
writing doc comments that mention `docs/references/*/NOTES.md`-style
paths), `bun run build` (client + server, 0 warnings), full 154-shot live
matrix (144/154 clean, 10 known-flake as above), spot-checked screenshots
in both themes confirming the accordion, reel, card grids, and all three
ground flips render correctly.

## 2026-08-28, eighth pass — §13 refinement pass (crop fix, hero, clients, adaptive navbar)

The seventh-pass Cuberto-parity rebuild landed entirely uncommitted; this
pass committed it as a baseline (`d6e567f`) and then executed
`docs/REFACTOR_PLAN.md` §13's five refinement items (1, 5, 2, 3, 4 in that
order — 6 stays deferred, see `ROADMAP.md`). Each item verified live in a
real browser against a production build (`bun run preview`), not just
`tsc`/`eslint`/`build`, before being committed.

1. **EVIDENCE frame crop, root-caused and fixed** — the clip-path aperture
   in `evidence-expand.tsx` was correctly 16:9-locked, but the media box
   underneath it (`mediaRef`, full `inset-0`) was the whole viewport;
   `objectFit="cover"` into a non-16:9 box cropped the video's long axis at
   almost every aspect ratio, and an extra `scale(1.1->1)` cropped further
   at progress 0. Now a real sized box (`width`/`height` written in
   `onUpdate`, `mediaRef` and the scale gone); `wMax` dropped 1280->1024
   (the Bridge recording's actual source resolution) so it never upscales
   past what's sharp. `summary.tsx`'s portrait card had the same defect,
   switched to `objectFit="contain"`.
2. **Dead-code sweep** — the "dead prefooter" was `Footer` duplicating
   `Outro`'s closing CTA (no literal prefooter component ever existed);
   stripped. Removed unused `@property --lay`/`--p`, the `.maco-aurora`/
   `.maco-thread` block (`ThemeAtmosphere` is gone), `--radius-plate`.
   Fixed stale comments naming deleted components (Prism WebGL, OPEN,
   method-line) and a backwards z-index comment on EVIDENCE.
3. **Hero treatment** — `TopHead` gets a `site.category` eyebrow, a static
   `display-glow` gradient-fill on the `<h1>` (`.maco-shine`'s
   background-clip:text device, vertical not diagonal — a diagonal band
   crossed a 3-line headline at a different horizontal offset per line,
   read as a legibility bug, not a glow), a `hero-backlight` radial glow, a
   CSS-only `hero-grain` film-grain texture, and a one-shot `hero-reveal`
   scale-in. Live preview surfaced a real interaction: the section's
   pre-existing `light-pass` sweep (shipped before this pass) washed out
   words in both the new glow headline and the plain lead paragraph via its
   `overlay` blend, worst on Cobalt's near-white paper ground — dampened
   with a scoped `[aria-label="Introduction"] .light-pass::after` opacity
   rule, same pattern `styles.css` already uses for `[data-media]` content.
4. **Clients consolidated to one section** — `LogoReel` survives, carrying
   each client's `industry` under the mark (the one thing `Record`'s old
   logo wall showed that the reel didn't); `Record`'s client wall is gone,
   About-only now. `Record`'s `aria-label` moved "Clients and company" ->
   "About MaCo", updated in the three other places that string is a
   selector: `ground-handoff.tsx`'s `PAIRS`, `shoot.mjs`'s `SECTIONS`,
   `CONTEXT.md` §10.
5. **Adaptive navbar** — `Header`/`MobilePillNav` are both `fixed`, mounted
   in `__root.tsx` outside every section, so they never resolved anything
   but paper's tokens. Now carry `data-over`, kept in sync with whichever
   `[data-ground]` section is behind them
   (`.chrome-adaptive[data-over]` in `styles.css`). Took three attempts to
   get the JS right, each one caught live: a ScrollTrigger per section read
   stale past a section that ALSO hosts its own pinning ScrollTrigger
   (EvidenceExpand, Identity); a single whole-document ScrollTrigger
   (`start 0, end "max"`) fixed that but went stale past Identity
   specifically at 390px; `rt.gsap.ticker` (re-derive from live
   `getBoundingClientRect()` every frame, no ScrollTrigger trigger/pin
   geometry at all) is what actually holds up — verified 44/44 (11
   sections x 2 themes x 2 widths).

Verified this pass: `bun run build`/`bun run lint` clean after every item
(only the pre-existing `MaCoGlobe.tsx` tsc error, unchanged); live
production-build checks per item as described above; `/work`, `/about`,
`/contact` confirmed to default the header to paper with no new console
errors (the one React #419 error on `/about` is `MaCoGlobe`-related and
pre-existing — confirmed present on the pre-eighth-pass build too).

## Read this first

1. `CONTEXT.md` — authoritative current-state reference (stack, content, homepage architecture)
2. `PROJECT_STATUS.md` — done / partial / not-started matrix
3. `ROADMAP.md` — what's left, in order
4. `frontend/src/content/maco.ts` — the only source of copy facts

## What the homepage is now

11 sections, `routes/index.tsx` → `components/home/*`. Full table with
ground/aria-label/pin behavior in `CONTEXT.md` §10 — don't duplicate it here,
it will drift again.

## Typography

Two themes, fully separate font sets (not a recolor) — see `CONTEXT.md` §9.
Obsidian: Unbounded/Jost/Agdasima. Cobalt: Michroma/Tenor Sans/Krona One.

## Logo

`Mark` component (`components/mark.tsx`), CSS `mask-image` + `currentColor` —
one asset, correct on every ground/theme. `logo-mark.png` (chrome, small) and
`maco-mark-hero.png` (OPEN hero, large).

## The signature device — light-pass

`@utility light-pass` in `styles.css`, driven by a `--sweep` custom property
(0–1). One raking-light gradient reused at every scale instead of per-section
decoration. See `CONTEXT.md` §10.

## Contact form (`routes/contact.tsx`)

Real `POST /api/v1/contact/`, requires `VITE_API_BASE_URL` set or it errors
loudly (by design — no silent-discard fallback).

## Mobile nav (`components/chrome.tsx`, `MobilePillNav`)

Real focus trap (Tab/Shift+Tab wrap), Escape, backdrop click-to-dismiss.

## Do NOT change without a real reason

1. Don't reintroduce grid overlays, marquees, pulsing dots, or `NN —`
   numbered eyebrows — removed deliberately in the homepage reset.
2. Don't invent claims, metrics, or names not traceable to `content/maco.ts`.
   The pre-reset homepage shipped false claims once; never again.
3. Don't add a second contact form on the homepage — `Outro` (the
   Cuberto-parity rebuild's OUTRO section, formerly `CloseIntake`)
   deliberately links to `/contact` instead of duplicating it.
4. Don't resurrect the deleted `components/ui/` shadcn scaffold in bulk —
   it was 47 files of dead code removed 2026-08-21. Install a primitive
   fresh if a real feature needs one.
5. Keep `system-field.tsx` — retired from the homepage but still imported by
   `/products/$slug`.
6. Two themes must stay genuinely different type systems, not a shared font
   with recolored surfaces.
7. Don't add a second scroll-smoothing layer on top of Lenis — no
   `useSpring`/`useTransform` on `scrollYProgress` anywhere. Lenis owns
   scroll, GSAP `ScrollTrigger` owns pins/scrubs, `motion` owns discrete UI
   state only.
8. Don't reintroduce WebGL, a custom cursor, or text-scramble without
   live-browser verification before calling it done — three separate WebGL
   hero attempts have now been built and rejected/reverted after actually
   being seen scrolling: two same-session for reading as a generic agency
   template, and `prism-field.tsx` itself replaced 2026-08-27 (fourth pass
   above) once a type-driven, no-WebGL treatment tested stronger in a
   live A/B/C preview. That treatment was itself superseded 2026-08-28
   (seventh pass) by `TopHead` (Cuberto's actual `cb-tophead` shape — brand
   row, large statement, subtext, CTA), also with no WebGL. The current
   hero has never had a WebGL layer since the fourth pass.
9. Don't compute a pin's `end` distance and its transform from two different
   measurements — a real 4× bug in an earlier WORK implementation came from
   exactly that. Derive both from the same measurement function.
10. Don't claim a pass "tested" or "verified" beyond `tsc`/`eslint`/`build`
    unless it was actually driven in a real browser.

## Next exact actions

See `ROADMAP.md` — kept in sync with this file, not duplicated here.
