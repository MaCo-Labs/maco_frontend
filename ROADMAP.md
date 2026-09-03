# MaCo Website — Roadmap

Last updated: 2026-09-03 — item 13 (chrome/motion/reveal pass) got two 2026-09-02 follow-ups (FEATURE reveal pacing/layout fixes, then a separate six-item pass: dynamic panel tone, logo crop, layout 3 mobile hygiene) and a 2026-09-03 fix pass (FEATURE reverted to hover accordion, `groundAt()` fallback fix). See `AI_HANDOFF.md`'s dated entries. **Nothing from 2026-09-01 onward is committed to git yet** — see `AI_HANDOFF.md`'s "What's uncommitted" note; committing that backlog is effectively item 0 below.

The homepage creative reset (`HOMEPAGE_REDESIGN_PLAN.md`, historical) is
**implemented and shipped** — current architecture is `CONTEXT.md` §10, not
that plan's original 9-movement draft (it grew to 11 sections during build).

## Current homepage architecture (reference)

```
OPEN → SURFACE → EVIDENCE → WORK → CLIENTS → CAPABILITY
     → PRODUCTS → IDENTITY → METHOD → RECORD → CLOSE
```

See `CONTEXT.md` §10 for the full per-section table (ground, file, pin behavior).

## What's left, roughly in order

0. **Commit the 2026-09-01 through 2026-09-03 working-tree backlog.** ~1,700
   lines across 17 files, all live-verified pass by pass (see
   `AI_HANDOFF.md`), none of it committed — including two files
   (`components/nav/edge-nav.tsx`, `lib/ground.ts`) that don't exist in git
   history at all yet. Split roughly one commit per dated pass rather than
   one giant commit, so `git log`/`git blame` stay useful the way this
   project's own docs lean on them (`AI_HANDOFF.md`'s "third pass" note).
1. **Decide a deployment target and add its config.** Nothing is committed yet — no CI workflow, no platform config. `AGENTS.md` previously named Amplify/Vercel/Netlify (frontend) and EC2/Railway/Render (backend) as candidates; none chosen.
2. **Run and verify `seed_content` against a real Postgres instance** — confirm the seeded catalog matches `frontend/src/content/maco.ts` exactly (they should mirror each other but haven't been diffed).
3. **Full responsive + accessibility verification pass** — real devices, `forced-colors`, screen reader, Lighthouse numbers. See `PROJECT_STATUS.md` "Not yet verified".
4. **Decide whether a test suite is worth adding.** Currently zero tests; `build` + `lint` are the only gates. Fine for a marketing site with no business logic on the frontend, worth revisiting if the backend API surface grows.
5. **`react-globe.gl` type error in `MaCoGlobe.tsx`** — one pre-existing `tsc` error, harmless (build succeeds), low priority.
5a. **Small dead-code/asset cleanup, found while documenting 2026-09-03's changes, not yet acted on:** `components/motion/split-reveal.tsx` has zero call sites (its one use, TOPHEAD's brand row, was dropped 2026-09-01 — see `CONTEXT.md` §10); `frontend/public/white.png`/`white-2.png` are untracked and unreferenced anywhere in `src/`, likely scratch exports from the 2026-09-02 logo-crop work. Confirm both are truly unused (`grep -rn` each name) before deleting, same discipline as the 2026-08-21 cleanup pass.
6. ~~**Item 2d from `PHASE-2-MOTION-PLAN.md`**~~ — **DONE, 2026-08-30 eleventh pass**, its go/no-go per `AI_HANDOFF.md` #8. The semantic cursor-state hook system now exists (`cursor.tsx`'s `resolveState`, a `data-cursor` attribute per hoverable), theme/ground-aware via the existing `[data-ground]` token remap. **Ships behind `?v2=cursor` only — not yet flipped to default.** `position: sticky` as a lighter pin alternative remains a future-sections idea, not committed.
7. ~~**`docs/REFACTOR_PLAN.md` §13 item 6**~~ — **DONE, 2026-08-29 tenth pass.** The deferred motion-polish/reference-study pass (Iventions' footer name reveal + hamburger diagonal wipe, Minh Pham's centred-hero layout, By-Kin's numbered layout switcher) shipped as: a full-width footer wordmark with a cursor-following gradient trace, a three-mode layout switcher (chrome-wide hamburger/wipe + homepage-scoped centred hero), and a first-paint preloader (Minh Pham's own loader mechanism, not on this list originally but studied and shipped alongside it). See `AI_HANDOFF.md`'s tenth-pass entry.
8. ~~**`/about` SSR fallback**~~ — **DONE, 2026-08-30 eleventh pass.** Root cause was a module-scope `window.THREE` read in `three-globe` (not `MaCoGlobe.tsx` itself), which `React.lazy` can't prevent from running server-side. Fixed with a `mounted` gate on the Suspense boundary. See `AI_HANDOFF.md`'s eleventh-pass entry.
9. ~~**Flip the eleventh pass's `?v2=` preview items to default**~~ — **DONE.** `cursor,torch`, `nav2`, `nav3` are all default; the flag and every old code path behind it are gone.
10. ~~**Layout mode 2's trigger button can't be clicked to close the panel**~~ — **DONE.** The trigger now renders as a `<header>` sibling (`chrome.tsx`'s `data-nav-trigger-overlay`) instead of a descendant, so its `z-[47]` actually outranks the panel's `z-[46]`.
11. ~~**Act on `docs/PREMIUM-AUDIT.md`'s findings**~~ — **DONE.** Every item in the doc's own ranked summary is applied: logo-reel hover-pause, TOPHEAD eyebrow/lead reveal + OVERVIEW's `/about` Magnetic wrap, `/products/$slug`'s scroll wiring, `data-cursor="media"` on PREVIEW + both Summary cards, `/work/$slug` imagery + `Stagger`, and the four non-home routes' `MotionSection`→homepage-vocabulary swap with `data-ground`/`aria-label` (extended to all five stale routes, including `/clients`, `/services`, `/services/$slug`, `/work`, `/products` — the audit only covered the four it directly reviewed). `components/motion-section.tsx` itself is deleted, no importers left.
12. **motion/nav pass** (owner brief, 2026-08-31, revised twice same day from live owner feedback): Layout 3's chrome went through two shapes in one sitting — first a rebuild from one six-link column into two edge columns (bordered, blurred pill boxes), then, once the owner reviewed that live, a full replacement with `EdgeNav` (`components/nav/edge-nav.tsx`): quiet, unboxed dots at both viewport edges, no container/border/backdrop. Each dot is one of the six site pages (Services/Work/Products left, Clients/About/Contact right — not in-page sections), active state tracks the current route (`pathname` match, the same check every other nav surface already uses), and a dot's label only reveals on hover/focus/active. Section clearance dropped from the boxed rails' 10rem to 4.5rem now that the center has real width back. Mode 3 gained the same compact MENU/CLOSE trigger mode 2 already had (its slot was already reserved in the header markup, just never enabled) — EdgeNav's dots are wayfinding only, not a way to reach a page from elsewhere, so mode 3 needed its own path to the full nav. Opening either mode's full-screen panel now fades the edge dots to 0 (`data-nav-open` set on `<html>` by `chrome.tsx`'s `useLayoutNavState`, read by `styles.css`) so the two navigation systems never compete at equal weight — the panel's own translucency would otherwise let the dots show through as faint ghosts. The panel itself (`LayoutNavPanel`) is unchanged in mechanism — diagonal clip-path wipe, `color-mix(--accent 92%, transparent)` + blur so page content still shows through, per the owner's own reference recording — but its links gained a quiet hover-reveal arrow (`.layout-nav-link-arrow`). Also this pass: hero's decorative corner-register marks removed per the owner's annotated screenshots; preloader now gates on a click-through "Enter" action instead of auto-transitioning the instant the counter finishes (and its scroll-lock unlock moved into the click handler itself — the effect cleanup it previously relied on only fires on unmount/dep-change, neither of which happens on that path); cursor gained optional word/phrase labels (`data-cursor-label`, "View"/"Explore" on PREVIEW and the Summary cards); motion easing/duration constants centralized in `lib/motion.ts` (`EASE_EMPHASIS`/`EASE_EXIT`/`DUR`) instead of duplicated literals across `chrome.tsx`/`preloader.tsx` (the `MotionSection`→homepage-vocabulary route migration is item 11, not this item — same day, separate commit).

13. **chrome/motion/reveal pass** (owner brief, 2026-08-31, 8 numbered items
    executed 2026-09-01): Layout 2 rebuilt to match iventions.com's actual
    silhouette — a hard diagonal wipe leaving a real uncovered bottom-left
    triangle (was closer to a full-bleed rectangle), with CLOSE/wordmark/CTA
    now rendered as a persistent row above the wipe (`.layout-nav-overlay-
    brand`/`-cta` in `chrome.tsx`) instead of just the trigger, and its own
    backdrop blur so it's never illegible over TOPHEAD's headline. EdgeNav
    narrowed to mode 3 only (was 2 and 3) — mode 2's panel already covers
    every route, running the dots alongside it was two navigation systems
    competing with no reference backing that combination. Mode 3's header
    now shows nothing but the dots — wordmark and MENU trigger removed,
    both were leftover from the dots' earlier "wayfinding only" design,
    stale now that the dots are real links covering all six routes. FEATURE
    replaced with `FeatureScroll` (`components/home/feature-scroll.tsx`) —
    rows open in sequence as they cross the top of the viewport for
    full-motion visitors, falling back to the existing click `<Accordion>`
    under reduced motion; FAQ (`Accordion`'s other call site) is untouched.
    GroundHandoff's recede now has two weights (`"emphasis"`/default
    `"interior"`) instead of one fixed intensity across all 9 recede pairs,
    plus a new pair closing the one boundary that had no handoff at all
    (Outro → the footer, which gained `aria-label="Site footer"` for this).
    Preloader retimed (ring 0→92 over 2.6s linear, was 1.6s `power1.inOut`
    — the counter now visibly ticks through nearly every integer instead of
    skipping) and enlarged (200px ring, was 128px); `maco-mark-hero.png`
    deleted (zero code references, dead since the 2026-08-28 Cuberto-parity
    rebuild). Cursor's ground-awareness now tracks the section under the
    pointer continuously (`lib/ground.ts`'s `groundAt`, shared with
    EdgeNav's dot coloring) instead of only while actively hovering
    something.

    Two real, pre-existing bugs were found and fixed during this pass's own
    live verification, not requested by the brief: (1) the header/EdgeNav
    ground color was correct after a hard reload but permanently wrong
    after any client-side navigation TO the homepage — root cause was a
    `[data-ground]` snapshot captured once per route instead of every
    frame, so it went stale the moment a visitor navigated; fixed by
    re-querying inside the ticker itself, the same self-correcting
    philosophy the ticker already used for scroll position. (2) The
    header's `--header-solid` transparency scrub got stuck permanently at 0
    (a solid header floating over a transparent hero) after the same kind
    of navigation — root cause was an `aria-label="Introduction"` collision
    with every other route's own intro section (`/about`, `/clients`,
    `/contact`, `/products`, `/services`, `/work` all have one), so a fast
    client-nav could grab the OUTGOING route's about-to-be-unmounted
    section instead of TOPHEAD's; fixed by also matching
    `[data-ground="deep"]`, the one attribute that actually disambiguates
    TOPHEAD from every other route's same-named section. See
    `AI_HANDOFF.md`'s pass entry for the full root-cause writeup of both.

14. **Two 2026-09-02 follow-ups + a 2026-09-03 fix pass on top of item 13.**
    First follow-up (owner review against 3 screen recordings): FEATURE's
    reveal paced too fast (fixed runway instead of section-height-linked),
    Layout 2's desktop wipe re-geometried closer to the reference, its
    header row lost a shared backdrop bar in favor of per-element glass
    chips, its panel recolored and mobile collisions fixed, Layout 3's
    mobile CTA/cluster collision fixed. Second follow-up (a separate
    six-item defect list): Layout 2's panel tone made dynamic (inverts to
    the section behind it on open, was effectively hardcoded); the logo
    mark (`logo-mark.png`) cropped to its real alpha content, `Mark`'s
    `size` prop now means width with height derived from a fixed aspect
    ratio; Layout 3 mobile hygiene (wordmark text hidden/mark kept,
    control cluster moved top-left, TOPHEAD padding retuned, ThemeSwitch
    label hidden). 2026-09-03: FEATURE reverted from the scroll-driven
    reveal back to `Accordion`'s `hoverToOpen` — the scroll version lagged
    real scroll gestures enough that rows could be skipped past; `feature-
    scroll.tsx` deleted. `groundAt()` (`lib/ground.ts`) gained a `fallback`
    parameter so the header/EdgeNav ticker and the cursor stop flashing to
    paper at momentary gaps between two `deep` sections (most visible at
    the RECORD -> FAQ / "About MaCo" -> "How MaCo works" boundary). See
    `AI_HANDOFF.md`'s three dated entries for full detail.

The `removeChild`/`NotFoundError` route-transition bug (item 6, listed here
2026-08-27) is fixed — see `AI_HANDOFF.md`'s "third pass" entry.

## Explicitly out of scope

- Rebuilding the homepage sections again — the current 11-section Cuberto-parity architecture (`CONTEXT.md` §10, rebuilt 2026-08-28 at the owner's explicit direction) is the intended shape, not a placeholder. That rebuild was itself a one-time, owner-approved override of this same rule as it stood before that date — see `AI_HANDOFF.md`'s dated entry for why, and what still doesn't override (Cuberto's actual colours/typefaces/copy)
- Adding back any of the deleted `components/ui/` shadcn scaffold unless a real feature needs a specific primitive — install it fresh, don't resurrect the bulk scaffold
- Fabricated content of any kind (stats, testimonials, extra clients/projects) — see `CONTEXT.md` §16
