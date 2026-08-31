# MaCo Website — Roadmap

Last updated: 2026-08-30

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

1. **Decide a deployment target and add its config.** Nothing is committed yet — no CI workflow, no platform config. `AGENTS.md` previously named Amplify/Vercel/Netlify (frontend) and EC2/Railway/Render (backend) as candidates; none chosen.
2. **Run and verify `seed_content` against a real Postgres instance** — confirm the seeded catalog matches `frontend/src/content/maco.ts` exactly (they should mirror each other but haven't been diffed).
3. **Full responsive + accessibility verification pass** — real devices, `forced-colors`, screen reader, Lighthouse numbers. See `PROJECT_STATUS.md` "Not yet verified".
4. **Decide whether a test suite is worth adding.** Currently zero tests; `build` + `lint` are the only gates. Fine for a marketing site with no business logic on the frontend, worth revisiting if the backend API surface grows.
5. **`react-globe.gl` type error in `MaCoGlobe.tsx`** — one pre-existing `tsc` error, harmless (build succeeds), low priority.
6. ~~**Item 2d from `PHASE-2-MOTION-PLAN.md`**~~ — **DONE, 2026-08-30 eleventh pass**, its go/no-go per `AI_HANDOFF.md` #8. The semantic cursor-state hook system now exists (`cursor.tsx`'s `resolveState`, a `data-cursor` attribute per hoverable), theme/ground-aware via the existing `[data-ground]` token remap. **Ships behind `?v2=cursor` only — not yet flipped to default.** `position: sticky` as a lighter pin alternative remains a future-sections idea, not committed.
7. ~~**`docs/REFACTOR_PLAN.md` §13 item 6**~~ — **DONE, 2026-08-29 tenth pass.** The deferred motion-polish/reference-study pass (Iventions' footer name reveal + hamburger diagonal wipe, Minh Pham's centred-hero layout, By-Kin's numbered layout switcher) shipped as: a full-width footer wordmark with a cursor-following gradient trace, a three-mode layout switcher (chrome-wide hamburger/wipe + homepage-scoped centred hero), and a first-paint preloader (Minh Pham's own loader mechanism, not on this list originally but studied and shipped alongside it). See `AI_HANDOFF.md`'s tenth-pass entry.
8. ~~**`/about` SSR fallback**~~ — **DONE, 2026-08-30 eleventh pass.** Root cause was a module-scope `window.THREE` read in `three-globe` (not `MaCoGlobe.tsx` itself), which `React.lazy` can't prevent from running server-side. Fixed with a `mounted` gate on the Suspense boundary. See `AI_HANDOFF.md`'s eleventh-pass entry.
9. ~~**Flip the eleventh pass's `?v2=` preview items to default**~~ — **DONE.** `cursor,torch`, `nav2`, `nav3` are all default; the flag and every old code path behind it are gone.
10. ~~**Layout mode 2's trigger button can't be clicked to close the panel**~~ — **DONE.** The trigger now renders as a `<header>` sibling (`chrome.tsx`'s `data-nav-trigger-overlay`) instead of a descendant, so its `z-[47]` actually outranks the panel's `z-[46]`.
11. ~~**Act on `docs/PREMIUM-AUDIT.md`'s findings**~~ — **DONE.** Every item in the doc's own ranked summary is applied: logo-reel hover-pause, TOPHEAD eyebrow/lead reveal + OVERVIEW's `/about` Magnetic wrap, `/products/$slug`'s scroll wiring, `data-cursor="media"` on PREVIEW + both Summary cards, `/work/$slug` imagery + `Stagger`, and the four non-home routes' `MotionSection`→homepage-vocabulary swap with `data-ground`/`aria-label` (extended to all five stale routes, including `/clients`, `/services`, `/services/$slug`, `/work`, `/products` — the audit only covered the four it directly reviewed). `components/motion-section.tsx` itself is deleted, no importers left.
12. **motion/nav pass** (owner brief, 2026-08-31): Layout 3 rebuilt to true 3-left/3-right split rails (was one six-link column) with controls moved to a fixed bottom-left cluster; Layout 2's full-screen panel is now translucent (`color-mix(--accent 92%, transparent)` + blur) so page content shows through, per the owner's own reference recording; hero's decorative corner-register marks removed per the owner's annotated screenshots; preloader now gates on a click-through "Enter" action instead of auto-transitioning the instant the counter finishes; cursor gained optional word/phrase labels (`data-cursor-label`, "View"/"Explore" on PREVIEW and the Summary cards); motion easing/duration constants centralized in `lib/motion.ts` (`EASE_EMPHASIS`/`EASE_EXIT`/`DUR`) instead of duplicated literals across `chrome.tsx`/`preloader.tsx`.

The `removeChild`/`NotFoundError` route-transition bug (item 6, listed here
2026-08-27) is fixed — see `AI_HANDOFF.md`'s "third pass" entry.

## Explicitly out of scope

- Rebuilding the homepage sections again — the current 11-section Cuberto-parity architecture (`CONTEXT.md` §10, rebuilt 2026-08-28 at the owner's explicit direction) is the intended shape, not a placeholder. That rebuild was itself a one-time, owner-approved override of this same rule as it stood before that date — see `AI_HANDOFF.md`'s dated entry for why, and what still doesn't override (Cuberto's actual colours/typefaces/copy)
- Adding back any of the deleted `components/ui/` shadcn scaffold unless a real feature needs a specific primitive — install it fresh, don't resurrect the bulk scaffold
- Fabricated content of any kind (stats, testimonials, extra clients/projects) — see `CONTEXT.md` §16
