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
9. **Flip the eleventh pass's `?v2=` preview items to default**, per their own go/no-go: `cursor,torch` (cursor system + footer torch), `nav2` (layout mode 2 beam/stagger), `nav3` (layout mode 3 edge rails). Once approved, remove the old code path and the flag itself for each — the flags are not meant to survive past this review.
10. **Layout mode 2's trigger button can't be clicked to close the panel** — its `z-[46]` sits above the header's `position:fixed` `z-[42]` stacking context, which no descendant z-index can escape. Escape and link-navigation both close it correctly; only the mouse-click-same-button path is affected. Found during the eleventh pass, logged in `docs/PREMIUM-AUDIT.md`'s cross-cutting findings — real fix means moving where the trigger renders.
11. **Act on `docs/PREMIUM-AUDIT.md`'s findings**, per the owner's own prioritization once reviewed (the doc's own "ranked summary" section orders them by cost-to-value). Proposal-only as of the eleventh pass — nothing in it is implemented yet.

The `removeChild`/`NotFoundError` route-transition bug (item 6, listed here
2026-08-27) is fixed — see `AI_HANDOFF.md`'s "third pass" entry.

## Explicitly out of scope

- Rebuilding the homepage sections again — the current 11-section Cuberto-parity architecture (`CONTEXT.md` §10, rebuilt 2026-08-28 at the owner's explicit direction) is the intended shape, not a placeholder. That rebuild was itself a one-time, owner-approved override of this same rule as it stood before that date — see `AI_HANDOFF.md`'s dated entry for why, and what still doesn't override (Cuberto's actual colours/typefaces/copy)
- Adding back any of the deleted `components/ui/` shadcn scaffold unless a real feature needs a specific primitive — install it fresh, don't resurrect the bulk scaffold
- Fabricated content of any kind (stats, testimonials, extra clients/projects) — see `CONTEXT.md` §16
