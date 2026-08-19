# MaCo Website — Project Status

Last updated: 2026-08-19 (edits made 2026-08-18; date rolled over during the session)

Statuses: **DONE** | **IN PROGRESS** | **PARTIAL** | **NOT STARTED** | **NEEDS REVIEW**

---

## What this reflects

The homepage went through a full creative reset (see `HOMEPAGE_REDESIGN_PLAN.md`), replacing every prior section (Monument hero, capability-statement, cta-banner, work-strip, process-sticky, service-vocabulary, products-section, clients-ticker, signature-system-section, multilingual-identity) with nine new movements under `frontend/src/components/home/`. The entries below describing those old files in earlier versions of this document were stale and have been removed rather than carried forward.

---

## Overall

| Metric | Value |
|--------|--------|
| Overall | **IN PROGRESS** — homepage reset + Immersive Motion Rebuild + Brand Hero & Bug Fix pass functionally complete and statically verified; full 7-width × 2-theme QA matrix, a formal performance audit, and **live-browser verification of this session's changes** all remain |
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
| **Brand Hero & Bug Fix pass (2026-08-18)** | **DONE (statically verified only)** — fixed WORK's 4× pin/transform mismatch and METHOD's mount-order race (both real bugs, root-caused from code, not tuned); rebuilt the hero as MaCo's brand alone; merged the old hero+CLAIM into one SURFACE section with an edge-to-edge video; reverted WebGL/cursor/scramble; collapsed services 5→2. `tsc`/`eslint`/`build`/SSR-curl clean. **Not** verified in a live browser this session — no browser-automation tool was available |
| New runtime dependencies | `gsap`, `lenis` — this ends the project's prior zero-new-dependency line, by explicit user decision. ≈53.6 KB gzip in lazy chunks; homepage eager chunk is now 141.96 KB gzip (down from the immersive-rebuild's 148.61 KB after the WebGL/cursor/scramble revert, still above the pre-rebuild 106 KB — see `CONTEXT.md §11`) |

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

## Not yet verified this pass

- **Neither the Immersive Motion Rebuild nor the Brand Hero & Bug Fix pass has been checked in a live browser.** No browser-automation tool was available this session. Specifically unverified: that WORK's panels now traverse the full pin with no blank stretch and METHOD no longer fires mid-WORK (both fixed by reading the code, not re-tested live); the new hero's legibility/sizing in both themes; `.maco-shine`'s idle animation actually reading as subtle rather than distracting; scrubbing EVIDENCE/WORK/METHOD's pinned scenes by hand; `prefers-reduced-motion` fully disabling Lenis/magnet/split-reveal; the skip link's focus behavior under Lenis; `forced-colors`/`prefers-contrast`; touch-device behavior; and route-change leak checks (`ScrollTrigger`/Lenis instances torn down cleanly). Do not treat any of this as done until it's actually been driven in a browser.
- The full 7-width matrix from the plan (375, 390, 430, 768, 1024, 1280, 1440) × 2 themes = 14 passes. Only 390 and 1440 were ever screenshotted, and only against the pre-immersive-rebuild build — i.e. two full rebuilds out of date.
- Formal performance budget measurement (LCP, CLS, long-task profiling) — not run. Current bundle size: homepage entry chunk is 452.03 KB / **141.96 KB gzip** (up from 340.5 KB / 106 KB gzip pre-rebuild, down from the immersive-rebuild peak of 470.80 KB / 148.61 KB gzip); lazy chunks `lenis` 18.60 KB/5.39 KB gzip, `scroll-runtime` 14.59 KB/5.39 KB gzip, `gsap` 69.96 KB/27.42 KB gzip, `ScrollTrigger` 42.76 KB/17.54 KB gzip, `SplitText` 7.06 KB/3.26 KB gzip. (`MaCoGlobe` at 1.78 MB/500.70 KB gzip remains `/about`-only and does not load on the homepage.)
- A dedicated motion audit pass (plan Phase M) — animations reviewed incidentally while building, not audited as a standalone pass.

---

## Not started

- Tiers 1–2 of `SurfaceMedia` (real video/image) — the repo still has zero product photography or screen recordings, so every media slot ships the plan's tier-3 designed fallback. This is a content gap, not a code gap; upgrading one slot is a one-file change to `content/maco.ts` per the plan (§11).
- Backend seed verification on a fresh machine (unrelated to this reset).
