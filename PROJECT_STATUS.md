# MaCo Website — Project Status

Last updated: 2026-08-19

Statuses: **DONE** | **IN PROGRESS** | **PARTIAL** | **NOT STARTED** | **NEEDS REVIEW**

---

## What this reflects

The homepage went through a full creative reset (see `HOMEPAGE_REDESIGN_PLAN.md`), replacing every prior section (Monument hero, capability-statement, cta-banner, work-strip, process-sticky, service-vocabulary, products-section, clients-ticker, signature-system-section, multilingual-identity) with nine new movements under `frontend/src/components/home/`. The entries below describing those old files in earlier versions of this document were stale and have been removed rather than carried forward.

---

## Overall

| Metric | Value |
|--------|--------|
| Overall | **IN PROGRESS** — homepage reset + Immersive Motion Rebuild + Brand Hero & Bug Fix + **2026-08-19 Motion Rebuild** + **2026-08-19 Hero WebGL Blinds Field pass** functionally complete; the last three passes were all **live-verified via Playwright at every commit** (see `AI_HANDOFF.md`). Remaining: full 7-width × 2-theme QA matrix, `forced-colors`/`prefers-contrast`, real touch-device input, a formal performance audit, and the deferred sitewide section-regroup/curved-overlay/full-page-thread request |
| `@types/three` | **DONE (2026-08-19)** — devDependency added alongside `<BlindsField>`; also fixes one of the two pre-existing `tsc` errors in `MaCoGlobe.tsx` for free (1 pre-existing `react-globe.gl` type error remains, unrelated) |
| `npm run build` | **PASSED** (client + SSR), re-verified after the Brand Hero & Bug Fix pass |
| TypeScript | **0 new errors** (2 pre-existing errors remain in `hero/MaCoGlobe.tsx`, `/about`-only, out of scope) |
| Contact form | **DONE** — real `POST /api/v1/contact/`, verified against a live Django + Postgres backend |
| Typography system | **DONE** — Krona One / Michroma / Unbounded / Tenor Sans / Agdasima / Jost, split per theme |
| Logo integration | **DONE** — real mark (`logo-mark.png` in chrome, `maco-mark-hero.png` in the hero) via CSS `mask-image`, recolors with `currentColor` |
| Signature light-pass device | **DONE** — scroll/pointer-driven `--sweep` wired on SURFACE, EVIDENCE, and each PRODUCTS card, driven by GSAP `ScrollTrigger` writing directly to inline style/CSS vars (no React state per scroll frame) |
| Mobile nav accessibility | **DONE** — focus trap, Escape, backdrop dismissal |
| Real media | **DONE** — Bridge product recording (poster-first, gated autoplay) in SURFACE/EVIDENCE/PRODUCTS, now filling its frame edge-to-edge; real client + product logos in WORK, RECORD, PRODUCTS, CAPABILITY |
| IDENTITY | **DONE** — rebuilt as a script reel (centred + falling-off neighbours) with a real WCAG 2.2.2 pause control |
| METHOD | **DONE** — a `ScrollTrigger`-pinned vertical step-through; a real mount-order race against WORK (found and fixed 2026-08-18, see below) previously made it fire mid-WORK with a large empty gap |
| **Immersive Motion Rebuild** | **DONE, superseded in part** — Lenis + GSAP `ScrollTrigger`/`SplitText` scroll substrate kept and still in use. The WebGL2 hero field, hover-distortion, text scramble, and cursor ring shipped in this pass were **reverted the same day** once actually driven in a browser — see the Brand Hero & Bug Fix pass below |
| **Brand Hero & Bug Fix pass (2026-08-18)** | **DONE (statically verified only, at the time)** — fixed WORK's 4× pin/transform mismatch and METHOD's mount-order race (both real bugs, root-caused from code, not tuned); rebuilt the hero as MaCo's brand alone; merged the old hero+CLAIM into one SURFACE section with an edge-to-edge video; reverted WebGL/cursor/scramble; collapsed services 5→2. `tsc`/`eslint`/`build`/SSR-curl clean. Not verified in a live browser at the time — superseded by the live-verified pass below |
| **Motion Rebuild pass (2026-08-19)** | **DONE, live-verified via Playwright** — fixed the reduced-motion resolver split-brain (confirmed this dev machine reports `reduce=true` by default), the dev-HMR Lenis-singleton leak, pin z-order under the header, and a second mount-order race (IDENTITY vs. WORK, same bug class as METHOD's earlier one). All 10 homepage sections now carry real scroll-linked motion (6 previously had none); CAPABILITY and PRODUCTS got sticky scroll-driven mechanics; IDENTITY rewritten fully scroll-driven; `GroundHandoff` added for cross-section recession continuity. Full detail in `AI_HANDOFF.md` "Homepage Motion Rebuild" |
| **Convergence / Grid / Thread pass (2026-08-19, same day)** | **DONE, live-verified via Playwright** — CAPABILITY rebuilt as `ServicesConvergence` (two service cards fly in from opposite edges and lock into a centred, tilted stack, `scrub`-driven, both services' full content always present — no tablist to maintain); WORK rebuilt as `PortfolioGrid` (two-column grid, real brand marks only, per-column scroll drift, pointer tilt), which drops WORK's pin entirely; a new `ScrollThread` draws one SVG line across WORK→CAPABILITY→PRODUCTS via `stroke-dashoffset`; a small pointer-driven interaction added to six existing sections (OPEN, EVIDENCE, PRODUCTS, IDENTITY, METHOD, RECORD). Pin count unchanged at 4 (WORK's pin traded for CAPABILITY's). Full detail below and in `AI_HANDOFF.md` |
| New runtime dependencies | `gsap`, `lenis` — this ends the project's prior zero-new-dependency line, by explicit user decision. ≈53.6 KB gzip in lazy chunks; homepage eager chunk is now 141.93 KB gzip (down from the immersive-rebuild's 148.61 KB after the WebGL/cursor/scramble revert, still above the pre-rebuild 106 KB — see `CONTEXT.md §11`). No new runtime package for the 2026-08-19 Hero WebGL pass — `<BlindsField>` reuses the already-installed `three` rather than adding `ogl` — but `three`'s own dynamic chunk (561 KB / **141 KB gzip**) is now fetched async on the homepage too, not just `/about`; `@types/three` was added as a devDependency only |

---

## Done

- **Nine-movement homepage** (`routes/index.tsx`): OPEN, CLAIM, EVIDENCE, WORK, CAPABILITY, PRODUCTS, IDENTITY, METHOD, RECORD, CLOSE. All built under `components/home/`.
- **Typography pivot** — 6 user-selected fonts (Krona One, Michroma, Unbounded, Tenor Sans, Agdasima, Jost), split so Obsidian (Unbounded/Jost/Agdasima) and Cobalt (Michroma/Tenor Sans/Krona One) read as genuinely different modes, not a recolor. Verified for legibility across both themes down to 375px.
- **Real logo mark** — `public/logo-mark.png` (from the existing `logo final-07 (1).png`), rendered via `Mark` (`components/mark.tsx`) using `mask-image` + `background-color: currentColor`, so one asset auto-recolors on any ground.
- **Light-pass signature device** (`.light-pass` utility, `styles.css`) — a single raking-light gradient reused at three scales: hero (pointer-driven, tied to the existing `--px` tilt field), EVIDENCE's expand frame (driven by the section's own scroll progress), and each PRODUCTS card (driven by that card's own transit through the viewport). Previously the CSS utility existed but no component ever set `--sweep`, so it was inert everywhere — fixed 2026-08-18.
- **Contact form fix** (`routes/contact.tsx`) — removed a silent-fake-success shortcut that discarded every submission when `VITE_API_BASE_URL` was unset. Now performs a real POST and surfaces real DRF validation errors. Verified end-to-end against a running backend, including a real row landing in Postgres.
- **Mobile nav accessibility** (`components/chrome.tsx`) — added a focus trap (Tab/Shift+Tab wrap) and a backdrop button for click-to-dismiss on `MobilePillNav`.
- **WORK section desktop enhancement** (`components/home/work-sequence.tsx`) — pinned horizontal rail on `lg+`/no-reduced-motion, plain vertical list otherwise. Fixed a real panel-straddling bug (found by manually scrubbing the built section) with per-panel scroll-linked opacity.
- **Hydration fix** (`routes/__root.tsx`) — `suppressHydrationWarning` on `<html>` for the pre-hydration theme script; verified no console error on a fresh load with a persisted Cobalt preference.
- **Dead code removed** — old hero, `multilingual-identity.tsx` (rebuilt cleanly as `IDENTITY`, see below), `components/sections/*`, `signature-system-section.tsx`, `react-bits/*`, `use-scroll-progress.ts`, orphaned brand PNGs, `clear-sw.html`.
- **IDENTITY movement rebuilt** — "One name. Many scripts." restored by request, rebuilt from scratch rather than carried over: the old version did 20 `querySelector`+`getBoundingClientRect()` calls per `pointermove` inside the render loop. New version is one `setInterval` + a single cross-fading word, with correct BCP-47 `lang` codes per script for screen readers.
- **Immersive Motion Rebuild** (2026-08-18, see `AI_HANDOFF.md` for full detail) — Lenis smooth-scroll substrate + GSAP `ScrollTrigger`/`SplitText` now drive every pinned/scrubbed scene (EVIDENCE, WORK, METHOD, PRODUCTS' sweep, CLAIM/CLOSE line reveals), replacing `motion`'s `useScroll`+`useSpring` and deleting the double-smoothing bug that combination would have caused against Lenis. This pass also added a raw-WebGL2 cursor-reactive hero field, hover-distortion shader, magnetic buttons, text-scramble hovers, and a blend-difference cursor-ring companion — the WebGL/cursor/scramble pieces were reverted the next entry below. Two real bugs found and fixed in `<Magnetic>` (a hardcoded `display:"inline-block"` that silently broke the responsive `hidden lg:inline-flex` header CTA; an early bail-out that discarded `className` entirely) — found by reasoning through the header-CTA wiring, not from a test failure, since no live browser test caught them.
- **Brand Hero & Bug Fix pass** (2026-08-18, same day, see `AI_HANDOFF.md` for full detail) — the user drove the Immersive Motion Rebuild in a real browser for the first time and reported it back precisely: WORK's horizontal rail raced through its four panels and left a long empty pinned stretch; METHOD then popped up mid-WORK, out of order, with a large empty gap where it should have appeared; and the WebGL/cursor/scramble devices read as a generic agency template, not as MaCo. All root-caused from the code (not tuned): WORK's `end` (px) and its rail transform (%) resolved against two different widths, 4× apart; METHOD's `ScrollTrigger` was created before WORK's due to `useMediaQuery`'s SSR-safe mount order, measured against a document missing WORK's pin-spacer. Fixed by deriving WORK's `end`/transform from one shared measurement, and by adding `scheduleRefresh()` to `lib/scroll-runtime.ts` so every scene's trigger gets re-measured together regardless of creation order. The hero was rebuilt as MaCo's brand alone (`open-logo.tsx`: the real mark + an animated "MaCo" wordmark, `<SplitReveal>` — GSAP SplitText char-rise then a continuous 115° shine, the same angle as `.light-pass`); the old hero's promise/proof/video merged with the old standalone CLAIM into `working-surface.tsx`, with the Bridge video now filling a single 16/9 panel edge-to-edge. `components/webgl/*`, `cursor-ring.tsx`, and `motion/scramble.tsx` were deleted outright, all call sites and `data-cursor` attributes removed. Services collapsed from 5 to 2 (`business-software`, `digital-solutions`) at the owner's direction, with capability copy reusing the retired services' real descriptions wherever one substantively overlaps. `<LineReveal>`/`<Magnetic>` added to all 9 inner routes.

---

- **Hero WebGL Blinds Field pass** (2026-08-19, same day, see `AI_HANDOFF.md` for full detail) — OPEN's background is now a cursor-reactive WebGL gradient-blinds field (`components/home/blinds-field.tsx`, reimplemented on `three` rather than adding `ogl`, per the house rule against copying React Bits code or adding a redundant WebGL runtime), the mark got a `<Magnetic>` wrapper (reusing the existing component) and a theme-colored proximity glow, the shell row and mark now animate in via a GSAP timeline ahead of `<SplitReveal>`'s existing char-stagger, and the theme toggle now triggers a radial `clip-path` wipe (`components/theme.tsx`) instead of an instant color snap. This is the third WebGL attempt on this homepage — the first two were reverted the same session for reading generic; this one was scoped to OPEN only, built on the existing pointer-field/theme/magnetic infrastructure rather than new bespoke systems, and live-verified via Playwright before being called done (rule 8 in `AI_HANDOFF.md`'s "Do NOT change" list). The sitewide half of the same request (section regrouping, curved overlays, full-page scroll thread) was explicitly deferred to a later pass.

## Verified this pass — real media (2026-08-18, Playwright browser session)

- `npm run build` + `tsc --noEmit` clean (same 2 pre-existing `/about`-only errors, unrelated to the homepage).
- Zero console errors on a fresh load, in both themes, including the theme toggle exercised as a real click (not just a DOM attribute change).
- Zero horizontal overflow at 390px and 1440px after scrolling the full page.
- Mobile (390×844): all nine movements checked by screenshot — WORK correctly falls back to a plain list, CAPABILITY renders as an accordion, no overflow anywhere.
- `prefers-reduced-motion: reduce` (emulated via Playwright): EVIDENCE renders its static composed layout (not a frozen mid-animation frame), WORK falls back to the plain list, IDENTITY stops cycling — zero console errors.
- Keyboard: skip link + full nav reachable by Tab in logical order; focus ring visibly present (2px solid outline) on the active element.

**Note: the above browser verification predates the Immersive Motion Rebuild below and does not cover it.**

## Verified this pass — Immersive Motion Rebuild (2026-08-18, static checks only)

- `npx tsc --noEmit` clean (same 2 pre-existing `/about`-only errors).
- `npx eslint` — 0 errors/warnings.
- `npm run build` — client + SSR both succeed; bundle sizes measured directly from build output (see Overall table above).
- SSR-level `curl` check of the running dev server's rendered HTML: title/h1/IDENTITY script text present, exactly 10 `<section>` tags, 0 `<canvas>` tags server-side (confirms the client-only WebGL/cursor components don't cause an SSR/hydration mismatch), 0 error-string occurrences.

**Note: this predates and does not cover the Brand Hero & Bug Fix pass below — most of what it verified (WebGL, cursor ring, scramble) no longer exists.**

## Verified this pass — Brand Hero & Bug Fix (2026-08-18, static checks only)

- `npx tsc --noEmit` clean (same 2 pre-existing `/about`-only errors) — re-run after every batch of edits (hero rebuild, both bug fixes, services content, inner-page motion).
- `npx eslint --fix` — 0 errors/warnings (12 pre-existing/self-introduced Prettier formatting diffs auto-fixed, no logic changes).
- `npm run build` — client + SSR both succeed. Homepage eager chunk: 452.03 KB / **141.96 KB gzip** (down from the immersive-rebuild's 148.61 KB).
- SSR-level `curl` check of a running dev server (`localhost:5183`): title correct, `<h1>` renders plain "MaCo" text (SSR-safe, `<SplitReveal>` mutates client-side only), exactly 10 `<section>` tags, 0 `<canvas>` tags, 0 error-string occurrences, "Business Software"/"Digital Solutions" present, 0 occurrences of any of the 5 retired service slugs.
- Repo-wide grep confirms zero remaining references to `FieldCanvas`, `DistortSurface`, `CursorRing`, `Scramble`, or `data-cursor` anywhere in `frontend/src` — the revert removed call sites, not just the component definitions.
- Confirmed via direct PNG decode (not assumed) that `maco-mark-hero.png`'s alpha channel matches `white-logo.png`'s shape (23.5%/59.0% opaque/transparent vs. source's 23.2%/59.2%) at 61.6KB vs. the source's 637KB.

## Verified this pass — Motion Rebuild (2026-08-19, live Playwright checks)

- Full-page scroll (0→18683px, 12 sampled steps) with zero console errors.
- Every `.scrub-reveal`/`.stagger-item` element (21 total) confirmed non-invisible under `?motion=reduced` — the "JSX default is the correct at-rest composition" guarantee holds in practice.
- CAPABILITY's `aria-selected` sampled across the scroll range, switches exactly at the `floor(progress * serviceCount)` boundary; reduced-motion fallback confirmed to drop the extra scroll height entirely.
- WORK/IDENTITY's fixed mount-order race confirmed via computed `--t`/`--p` matching hand-derived expected values (not just "looks fine").
- Cobalt spot-checked on CLOSE as a genuine saturated blue material, not "Obsidian with a blue background."
- `GroundHandoff`: scale/opacity plateau exactly at coded targets; all 4 real pins confirmed still `position:fixed` after mount.
- `tsc --noEmit`/`eslint`/`npm run build` clean at every one of the 9 commits (same 2 pre-existing `/about`-only `MaCoGlobe` errors throughout).

## Verified this pass — Convergence / Grid / Thread (2026-08-19, live Playwright checks)

- `tsc --noEmit`/`eslint`/`npm run build` clean (same 2 pre-existing `/about`-only `MaCoGlobe` errors; homepage eager gzip 141.91 KB, marginally smaller than the prior 141.96 KB).
- SSR `curl` of `/`: `aria-label`s render in the corrected order (`Selected client work` → `Capabilities` → `Products`), all 7 capability rows and all 4 client projects present server-side, in both the mobile and desktop DOM variants (both mount unconditionally per house rule).
- Live wheel-driven scroll (Lenis-aware — `window.scrollTo` alone doesn't move Lenis's real position, confirmed the hard way): `--c` and `--d` on `ServicesConvergence`'s stage both sweep cleanly 0→1, the pin releases from `fixed` to `relative` exactly when `--d` reaches 1, and at `--c≈0` the off-stage cards sit outside the viewport (`getBoundingClientRect` confirmed) with `document.scrollingElement.scrollWidth === clientWidth` — no horizontal scrollbar from the off-stage start.
- All 4 pin-hosting sections (EVIDENCE, CAPABILITY, IDENTITY, METHOD) confirmed reaching `position: fixed` across a full top-to-bottom scroll; OPEN confirmed never pinning (as designed). Zero console errors across the full scroll.
- `PortfolioGrid`'s two `.grid-column-drift` columns confirmed with differing `transform` values at the same scroll offset (parallax genuinely differs, not just present).
- `ScrollThread`'s `--thread-len` confirmed non-zero after `document.fonts.ready`, `--thread` progresses in sync with the convergence/grid scroll.
- Screenshotted the convergence at rest, mid-flight, and locked, and the grid in both themes — caught and fixed a real design gap live: the initial backdrop-card tint (`color-mix` toward `var(--accent)`) was correct on Cobalt (a chromatic accent) but read as a muddy near-black wash on Obsidian, whose `--accent` is achromatic by design. Fixed by flipping the image plate to `data-ground="paper"` (the same ground-swap `product-story.tsx`'s `ProductMedia` already uses, inverted), giving real value-contrast in both themes instead of color-only contrast that only worked in one.
- Mobile 375px: both new sections confirmed single-column, legible, zero horizontal overflow across a full scroll.
- Phase 5 interaction pass spot-checked: METHOD/RECORD's new hover classes present in the rendered DOM, IDENTITY's pointer field confirmed initialized (`--px: 0.5` at rest), RECORD's tile-lift-on-hover confirmed by screenshot.

## Verified this pass — Hero WebGL Blinds Field & Radial Theme Transition (2026-08-19, live Playwright checks)

- `tsc --noEmit`/`eslint`/`npm run build` clean in every touched file (only the 1 pre-existing, unrelated `MaCoGlobe.tsx`/`react-globe.gl` error remains — the other pre-existing `tsc` error, missing `three` types, is now fixed by `@types/three`).
- SSR curl of `/`: 0 `<canvas>` tags, all 10 `<section>` tags present — same guarantee the earlier (reverted) WebGL hero verified, held again here.
- Live browser: `<canvas>` mounts and sizes to the section's real dimensions; a dispatched `pointermove` updated the section's `--px`/`--py` from `0.5,0.5` to the injected `0.8,0.2`; zero console errors.
- Theme toggle clicked live end-to-end: `data-theme` confirmed to stay on the outgoing theme through the full ~0.7s radial wipe (the flip is genuinely deferred, not an instant snap hidden under an unrelated animation), landed on the incoming theme after, the mark's glow `drop-shadow` updated to the new theme's color, and the wipe overlay element was confirmed removed from the DOM afterward (no leak). Zero console errors through the whole sequence.
- `?motion=reduced`: 0 canvas elements, static CSS gradient fallback rendered in its place, zero console errors.
- Full detail, including what was explicitly deferred, in `AI_HANDOFF.md` "Hero WebGL Blinds Field & Radial Theme Transition pass".

## Not yet verified

- The full 7-width matrix from the plan (375, 390, 430, 768, 1024, 1280, 1440) × 2 themes = 14 passes. The 2026-08-19 pass sampled spot-widths live, not the full matrix.
- `forced-colors: active` and `prefers-contrast: more` — not checked in any pass.
- Real touch-device input — DevTools emulation only, not a physical device.
- Formal performance budget measurement (LCP, CLS, long-task profiling) — not run. Bundle size not re-measured since the Brand Hero & Bug Fix pass (homepage entry chunk was 452.03 KB / **141.96 KB gzip** at that point); the 2026-08-19 motion rebuild added no new npm dependencies, only components/CSS.
- A dedicated motion audit pass (plan Phase M) — animations reviewed incidentally while building, not audited as a standalone pass.
- Full screen-reader walkthrough beyond keyboard-nav spot-checks.

---

## Not started

- Tiers 1–2 of `SurfaceMedia` (real video/image) — the repo still has zero product photography or screen recordings, so every media slot ships the plan's tier-3 designed fallback. This is a content gap, not a code gap; upgrading one slot is a one-file change to `content/maco.ts` per the plan (§11).
- Backend seed verification on a fresh machine (unrelated to this reset).
- Sitewide section-order regroup, curved "sheet" section overlays, and extending `ScrollThread` to the full page — the second half of the 2026-08-19 hero-upgrade request, deferred to a later pass at the user's choice. Would change the current deliberate `paper`/`deep` alternation into continuous light/dark blocks; needs its own brainstorm/design pass, not a small tweak.
