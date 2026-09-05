# MaCo Website — Project Status

Last updated: 2026-09-05, later — "contact/client/fix" pass: real contact
email + 3 phone numbers wired into `/contact` and the footer; a 5th
client/project (Ozone Fitout & Contracting W.L.L., a brochure-only
engagement with no live site, which made `Project.external_url` and
`Client.website` optional sitewide); Soorath Autos's upscaled logo re-keyed
to remove a baked-in black background; `/about`'s decorative `SystemField`
grid removed from the intro; Cobalt's `.ambient-field` glow brought back in
line with Obsidian's; "the Gulf" renamed to "the Middle East" in all visible
copy. **Verified live** in a real browser this pass (Playwright MCP, dev
server) — see "Verified this pass" below. Uncommitted, layered on top of the
prior uncommitted "Services + About elevation" and "ambient motion" passes —
see `AI_HANDOFF.md`'s newest entry and `git status`.

Previously: 2026-09-04/05 — "ambient motion" pass (5 staged items: scrub
retuned to `0.6` on 6 reveal primitives; a CSS-only `ambient-field`
breathing layer added to OVERVIEW/FEATURE/FAQ/IDENTITY; `MorphSlider`
folded onto the shared `gsap.ticker`, off its own `requestAnimationFrame`;
a `--vel` scroll-velocity custom property; a new ogl-shader `<AmbientCanvas>`
FBM-noise layer on OVERVIEW/FAQ/IDENTITY) plus a layout-3 `.hero-nav-hint`
pointing at EdgeNav's dot rail and the native scrollbar hidden site-wide.
**Verified live** in a real browser this pass (Playwright MCP, dev server)
— see "Verified this pass" below. **Uncommitted as of this writing**,
layered on top of the prior uncommitted "premium motion & interaction" and
"real-media" passes — see `AI_HANDOFF.md`'s newest entry and `git status`.

A further 2026-09-05 pass — `/services/$slug` and `/about`, not the
homepage — added a capability-row hover, an Evidence-grid mouse-tracked
spotlight, an Origin narrative, an 8-person Team grid, and 5 real
operational hubs on the globe. Also uncommitted; see its own "Verified
this pass" entry below and `AI_HANDOFF.md`'s newest entry.

Statuses: **DONE** | **PARTIAL** | **NOT STARTED**

## Overall

| Area | Status | Notes |
|---|---|---|
| Homepage (10 sections, Cuberto-parity structure) | DONE — full structural rebuild 2026-08-28, same-day §13 refinement pass, a 2026-08-29 pass (dark-first ground sequence, Capabilities dark-panel accordion, masked video-in-text hero, custom cursor + word-reveal text device), a tenth pass (clients reel geometry fix, Lenis retune, IDENTITY script curation + footer sync, first-paint preloader, full-width footer wordmark, three-mode layout switcher), an eleventh pass (`/about` SSR fix, cursor generalized to a semantic per-state/theme/ground-aware system + footer torch, layout modes 2/3 rebuilt to match their references, 15-unit premium audit, `?v2=` flags flipped to default and removed), a 2026-08-31 motion/nav pass (all five non-homepage routes migrated off the deprecated `MotionSection`; Layout 3's nav replaced twice same day — first with boxed split rails, then with `EdgeNav`'s unboxed page-indicator dots once the owner reviewed the rails live; mode 3 gained the same compact menu mode 2 has; the menu panel and edge dots now defer to each other instead of both showing at once; Layout 2's panel made translucent; hero corner marks removed; preloader gated on a click-through Enter action; cursor word labels; motion tokens centralized), a 2026-09-01 chrome/motion/reveal pass (Layout 2 rebuilt to iventions.com's actual diagonal-wipe silhouette with a persistent CLOSE/wordmark/CTA row above it, EdgeNav narrowed to mode 3 only, preloader retimed and enlarged, FEATURE's accordion temporarily replaced with a scroll-driven sequential reveal, GroundHandoff's recede weighted by structural role, cursor color made ground-aware everywhere instead of only while hovering), two 2026-09-02 passes (FEATURE pacing/Layout 2 wipe/mobile collision fixes from 3 owner screen recordings, then a separate six-item pass: dynamic Layout 2 panel tone, logo mark cropped to its real content, Layout 3 mobile control-cluster/wordmark/TOPHEAD-padding hygiene), and a 2026-09-03 pass (FEATURE reverted from the scroll-driven reveal back to `Accordion`'s hover-to-open — the scroll version lagged real scroll gestures; `groundAt()` gained a `fallback` param fixing a ground-tone flash at deep-to-deep section seams), plus 3 bug-fix passes + 6 motion-audit fixes from 2026-08-27 predating it, and a 2026-09-03 later pass (4 UI bugs fixed, the two "About" sections merged into one — Record deleted, homepage 11→10 sections — GroundHandoff rebuilt as opacity-only fades + real rounded overlaps at the 2 ground-flip boundaries) | See `CONTEXT.md` §10 for the current architecture. All layout modes/cursor/torch ship as default, no preview flag. Everything through the earlier 2026-09-03 pass is committed (`git log`); the later homepage-premium-pass commit is **not yet live-browser-verified** (see "Not yet verified" below). One pre-existing, out-of-scope finding remains open: a headless-screenshot-only artifact noted in the ninth-pass entry |
| Two-theme system (Obsidian/Cobalt) | DONE | Separate font set per theme, radial clip-path wipe on switch |
| Contact form → backend | DEGRADED (by design) | Posts to `VITE_API_BASE_URL` (throttled + honeypot) when set; backend moved to `../maco-backend`, var unset here so form shows mailto fallback |
| Mobile nav | DONE | Focus trap, Escape, backdrop dismiss |
| Dead-code / dependency cleanup | DONE | 2026-08-21 pass — see `CONTEXT.md` §11 |
| Docs resynced to code | DONE | This pass |
| `tsc --noEmit` | PARTIAL | One pre-existing error in `MaCoGlobe.tsx` (react-globe.gl type mismatch), unrelated to any recent change |
| Test suite | NOT STARTED | No test runner installed. Verification gate is `bun run build` + `bun run lint` |
| Deployment config | NOT STARTED | No CI, no `vercel.json`/`amplify.yml`/`Dockerfile`. Host not yet decided. Repo is frontend-only now |
| Cross-browser / real-device motion audit | NOT STARTED | Only desktop-viewport Playwright checks have been run historically |

## Verified this pass (2026-09-05, later — contact/client/fix pass)

- `npx tsc --noEmit` — only the one pre-existing `MaCoGlobe.tsx` error
- `npx eslint` on every touched file — clean (prettier auto-fixed one wrap
  in `about.tsx`)
- `npm run build` — succeeds
- Soorath Autos's re-keyed logo verified by compositing it over a light
  background before shipping — clean edges, no black fringe, `hasAlpha: true`
- **Real browser pass performed** (Playwright MCP, dev server, 1440×900,
  both themes): `/about` reflows correctly with `SystemField` gone (no
  empty column, no layout jump); `/clients` shows Soorath's logo clean on
  its plate and Ozone's teal brand tile rendering; Cobalt's IDENTITY
  ("MaCo works with clients across India and the Middle East.") and
  FEATURE sections show the same restrained `.ambient-field` glow Obsidian
  does, not the previous stronger blue haze; `/contact` renders
  `info@maco.codes` and all three phone numbers as working `tel:`/`mailto:`
  links

## Verified this pass (2026-09-05 — Services + About elevation pass)

- `npx tsc --noEmit` — only the one pre-existing `MaCoGlobe.tsx` error
- `npm run lint` — clean
- `npm run build` — client + SSR succeed
- SSR HTML grepped (dev server + `curl`) — confirmed `evidence-spotlight`,
  `group-hover:translate-x-1`, `Operational hubs`, all 8 team names, and
  `Role — pending`/`Bio — pending` all present in the compiled output for
  `/about` and `/services/business-software`
- **Real browser pass performed** (Playwright MCP, dev server): `/about`
  and `/services/business-software` both 0 console errors (1 pre-existing
  `THREE.Color` alpha warning on `/about`, traced to `tokens.atmosphere`
  in `MaCoGlobe.tsx`'s cobalt branch, confirmed present before this pass);
  accessibility-tree snapshot confirmed `/about`'s section order
  (Introduction → Origin → Method → Principles → Team → Contact MaCo) and
  every Team card's content (initials monogram, real name, pending
  role/bio)

**Pending inputs (owner):** real `role`/`bio` text for the 8 named team
members, and portrait image files (`public/media/team/<slug>.webp`) —
`TeamMember.portrait?: Media` is wired and ready to receive them with
zero layout shift.

## Verified this pass (2026-09-04/05 — ambient motion pass + layout 3 nav hint)

- `npx tsc --noEmit` — only the one pre-existing `MaCoGlobe.tsx` error
- `npm run lint` — 0 errors, same 3 pre-existing warnings
- **Real browser pass performed** (Playwright MCP, dev server, both themes):
  - `<AmbientCanvas>`: confirmed correct grayscale field on Obsidian and a
    blue-shifted field on Cobalt after a live theme toggle (`MutationObserver`
    resample); confirmed zero `<canvas>` elements before a section scrolls
    near (IntersectionObserver gate) and zero under `?motion=reduced`
  - `MorphSlider`: confirmed `gsap.ticker.add`/`.remove` calls present in
    source at every mount/pause/resume/unmount site, replacing the prior
    private `requestAnimationFrame`/`cancelAnimationFrame` pair
  - `.hero-nav-hint`: confirmed `display: none` at layout 1 and at 390px
    width in layout 3; confirmed pixel alignment against the real
    `.edge-nav-col` at 1440×900 (same `28px`/`1.75rem` horizontal inset,
    hint sitting directly above the rail with a deliberate ~19px gap);
    confirmed the reduced-motion override actually applies
    (`getComputedStyle` → `animationName: "none"`, `opacity: "0.7"`) after
    fixing a specificity mismatch that had silently defeated the first
    version of that rule
  - Scrollbar: confirmed `window.innerWidth - document.documentElement.clientWidth`
    reads `0` after the site-wide `scrollbar-width: none` rule (was
    reserving native scrollbar width before)
  - Zero console errors across every check

## Verified this pass (2026-09-04, later — premium motion & interaction pass)

- `npx eslint .` — 0 errors, same 3 pre-existing warnings as before this pass
- `npx tsc --noEmit` — only the one pre-existing `MaCoGlobe.tsx` error
- `npm run build` — client + SSR build succeed
- **Real browser pass performed** (Playwright MCP, production `npm run preview` build) — both themes, 1440px and 390px, plus a `prefers-reduced-motion: reduce` pass:
  - Preloader → Enter → hero wipe confirmed in the correct order (`maco:entered` event fires from both the skip branch and the click handler; `showMasked` correctly waits on it); confirmed the ring holds at `ready` until an explicit click, no auto-dismiss
  - Hero backlight confirmed tracking real `--px`/`--py` writes from `usePointerField` (0.5/0.5 rest → moves with a dispatched `pointermove`)
  - IDENTITY's enlarged type measured at 1440px (128px font, 240px track height — both hit their `clamp()` ceiling as intended) and confirmed no horizontal overflow or clipping at 390px, including Arabic driven to `--t: 8` directly to check RTL shaping at the new scale
  - WORK card gallery: confirmed `MorphSlider` only mounts its WebGL canvas once scrolled near (zero canvases before the section is reached), confirmed a real trusted `Enter` keypress on the focused slider stage does not navigate the parent `<Link>` (only a genuine click on the card outside the slider does), confirmed a slide-arrow click doesn't navigate either
  - FEATURE accordion: confirmed `--sweep` transitions to `1` on open (`transition-property: --sweep`, `0.9s`) under normal motion, and confirmed that rule does not apply at all under `prefers-reduced-motion: reduce` (`transition-property: all`, i.e. no rule matched)
  - `.ground-sheet`'s permanent CSS rest state (48px radius, negative margin, shadow) confirmed present with zero JS under reduced motion
  - Static `display-glow` heading (not the masked video) confirmed rendering under reduced motion; preloader confirmed absent (`data-preload="skip"`) under reduced motion
  - Zero console errors/warnings across every check
- **Not independently re-verified this pass**: `MorphSlider`'s `pause()`/`resume()` on repeated scroll-away/back (code-reviewed correct — mirrors `product-video.tsx`'s IntersectionObserver pattern — but not measured live via DevTools Performance for WebGL-context count under continuous scroll)

## Verified this pass (2026-09-04, real-media pass)

- `npx eslint .` — 0 errors, only 3 pre-existing `react-refresh/only-export-components` warnings (unrelated files: `layout-mode.tsx`, `product-video.tsx`, `theme.tsx` — all predate this pass)
- `npx tsc --noEmit` — only the one pre-existing `MaCoGlobe.tsx` error (react-globe.gl type mismatch), unrelated to this pass
- `npm run build` — client + SSR build succeed, no new errors (`MaCoGlobe` chunk is 1.78MB uncompressed / 500KB gzipped and flagged by Vite's chunk-size warning — pre-existing, `/about`-only, lazy-loaded, not touched this pass)
- **No real-browser check performed** — no browser automation used this session (not requested/approved). The MorphSlider/PhoneMockup additions in particular (a new WebGL runtime, a new video autoplay policy) need a real browser pass — sizing, the carousel's feel/performance, and logo-chip placement should be confirmed live on the dev server before this is called done

## Verified this pass (2026-08-21, cleanup)

- `bun install` — 343 packages resolve cleanly after removing 45 of 52 dependencies
- `bun run build` — client + SSR build succeed, no new errors
- `bun run lint` — zero errors (fixed pre-existing Prettier issues in `scripts/build-media.mjs` as a drive-by)
- `./node_modules/.bin/tsc --noEmit` — only the one pre-existing `MaCoGlobe.tsx` error, present before this pass
- Grepped every deletion target for importers across `src/` before removing — zero dangling references

## Verified this pass (2026-09-03, later — homepage premium pass)

- `bun run build`, `bun run lint`, `./node_modules/.bin/tsc --noEmit` — clean (only the pre-existing `MaCoGlobe.tsx` error)
- **No real-browser check** — `agent-browser` MCP hung on launch (same failure mode as the 2026-09-01 pass), and the `playwright` MCP server failed to connect (`CONNECT_TIMEOUT`) all session. Verified instead against the actual production build's output: fetched the SSR HTML (`bun run preview` + `curl`) and confirmed the 10 sections render in the correct order with the right `aria-label`s, `ground-sheet` is on exactly Overview and Faq, the absorbed About paragraph renders the exact `content/maco.ts` copy, the preloader's new `bottom-8`/`min-h-[3.25rem]` markup is present; fetched the compiled CSS/JS bundles and confirmed `.ground-sheet`, the retimed `.footer-giant-mark` line-height, both Layout-2-mobile rules, and GroundHandoff's new `borderRadius` GSAP tween all compiled with the intended values. This confirms the code is wired correctly but **not** how it actually looks/animates on screen — a real visual pass is still owed, see `ROADMAP.md`.

## Verified this pass (2026-09-03, earlier — FEATURE revert + ground-tone fallback)

- `bun run build`, `bun run lint`, `./node_modules/.bin/tsc --noEmit` — clean (only the pre-existing `MaCoGlobe.tsx` error)
- Confirmed live: FEATURE rows open on real mouse hover and close on hover-out (first row open by default); confirmed click-only still works with hover disabled (coarse-pointer emulation) — no scroll-driven behavior remains
- Confirmed live: the RECORD ("About MaCo") -> FAQ ("How MaCo works") ground boundary, scrolled through repeatedly in both themes, no longer flashes to paper mid-transition
- Zero console/page errors

## Verified this pass (2026-09-01, chrome/motion/reveal)

- `bun run build`, `bun run lint`, `./node_modules/.bin/tsc --noEmit` — clean after every item (only the pre-existing `MaCoGlobe.tsx` error, unchanged)
- Live checks via a Playwright script driven directly (the `agent-browser` MCP tool hung on launch this session and was abandoned) against a production build (`bun run preview`), both themes, layout modes 1/2/3, 1440px
- Confirmed live: reload vs. client-navigation now agree — landed on `/about` then client-navigated to `/`, and separately `/work/$slug` then client-navigated to `/`, header ground and the `--header-solid` scrub both matched the hard-reload baseline in every case
- Confirmed live: Layout 2 has zero edge dots at any scroll position; the CLOSE label, wordmark, and CTA all stayed visible above the diagonal wipe throughout; hover on any panel link dimmed every other link to 0.45 and bolded the hovered one; Escape closed the panel; keyboard Tab reached the trigger, Enter opened it, focus moved into the panel
- Confirmed live: Layout 3 shows only the edge dots at any scroll position — no wordmark, no MENU trigger, no CTA; dots stayed legible (opacity 1) scrolled over PREVIEW; a dot was reachable via keyboard Tab
- Confirmed live: FEATURE's rows opened in sequence scrolling down (4 of 7 open partway through, all 7 by the section's end) and re-collapsed scrolling back up; FAQ's click accordion was unaffected (still single-open, still click-toggle)
- Confirmed live: reduced motion (`reducedMotion: "reduce"`) — preloader absent immediately, zero cursor elements rendered, FEATURE fell back to the click `<Accordion>` (7 real buttons, first row open by default, zero scroll-driven rows)
- Confirmed live: cursor ground color tracked the section under the pointer even with nothing hovered (deep over the hero, paper over a paper section) — previously only tracked ground while actively hovering something
- Preloader: ring/mark visibly larger (200px ring, was 128px), Enter-ready took ~4s wall-clock on a local production preview (was ~1.85s), counter reached 100 before the Enter button appeared
- Zero console/page errors across every check above

## Known issues

The `/about` SSR fallback ("window is not defined") is fixed — see
`AI_HANDOFF.md`'s eleventh-pass entry (2026-08-30). Root cause was a
module-scope `window.THREE` read three layers down the `react-globe.gl`
import chain, not `MaCoGlobe.tsx` itself; `React.lazy` doesn't stop the
server from running that import to resolve a Suspense boundary. Fixed
with a `mounted` gate on the Suspense.

Layout mode 2's trigger-can't-close-by-click bug (panel `z-[46]` above
header `z-[42]`) is fixed — the trigger now renders as a `<header>`
sibling at `z-[47]`. See `ROADMAP.md` item 10.

The earlier `NotFoundError: 'removeChild'` on homepage→`/work/$slug`
navigation is fixed; see `AI_HANDOFF.md`'s 2026-08-27 "third pass" entry.

The header/EdgeNav "reload correct, client-nav wrong" ground-color bug and a
related `--header-solid` scrub that stuck at 0 forever after a client-side
navigation to the homepage are both fixed — see `AI_HANDOFF.md`'s
2026-09-01 pass entry for the two distinct root causes (a stale DOM
snapshot in one case, an `aria-label="Introduction"` collision across
routes in the other).

## Not yet verified

- **The 2026-09-03 homepage premium pass, in a real browser** (highest priority — see `AI_HANDOFF.md`'s newest entry). Verified structurally (SSR HTML + compiled CSS/JS bundle inspection) but never actually rendered/scrolled: the preloader's numeral/button fix, both Layout-2-mobile fixes, the footer wordmark line-height, and — most importantly — whether the new rounded-overlap sheet transitions and opacity-only fades actually read as intended when scrolling. Both `agent-browser` and the `playwright` MCP server were unavailable all session; try again first before doing anything else with this pass.
- Full responsive matrix (only desktop widths spot-checked historically)
- `forced-colors` / high-contrast mode
- Real touch device (not just DevTools emulation)
- Lighthouse LCP/CLS numbers on the current build
- Screen reader pass
