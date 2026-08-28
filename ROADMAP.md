# MaCo Website — Roadmap

Last updated: 2026-08-28

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
6. **Item 2d from `PHASE-2-MOTION-PLAN.md`** (optional cursor-state hook system generalizing WORK's existing `gsap.quickSetter` cursor-follow; `position: sticky` as a lighter alternative to `ScrollTrigger` pin for future sections) — proposals only, not commitments. Needs its own go/no-go per `AI_HANDOFF.md` #8's documented caution around cursor/WebGL work.

The `removeChild`/`NotFoundError` route-transition bug (item 6, listed here
2026-08-27) is fixed — see `AI_HANDOFF.md`'s "third pass" entry.

## Explicitly out of scope

- Rebuilding the homepage sections again — the current 11-section Cuberto-parity architecture (`CONTEXT.md` §10, rebuilt 2026-08-28 at the owner's explicit direction) is the intended shape, not a placeholder. That rebuild was itself a one-time, owner-approved override of this same rule as it stood before that date — see `AI_HANDOFF.md`'s dated entry for why, and what still doesn't override (Cuberto's actual colours/typefaces/copy)
- Adding back any of the deleted `components/ui/` shadcn scaffold unless a real feature needs a specific primitive — install it fresh, don't resurrect the bulk scaffold
- Fabricated content of any kind (stats, testimonials, extra clients/projects) — see `CONTEXT.md` §16
