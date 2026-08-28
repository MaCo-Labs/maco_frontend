# MaCo Website — Media Gap Inventory

Last verified: 2026-08-27, against `frontend/src/content/maco.ts` and every
`SurfaceMedia`/`ProductVideo` call site in `frontend/src/components/home/`.

**Purpose:** `docs/REFACTOR_PLAN.md` §6 Phase 0 asked for an explicit list of
every homepage slot still showing a tier-3 designed fallback (`SurfaceMedia`,
`components/media/surface-media.tsx`) instead of real tier-1 (video) or
tier-2 (image) media, so real capture can be planned instead of discovered
by reading component code. This is that list. See `CONTEXT.md` §10 for the
three-tier system's definition.

## Summary

| Tier | What it means | Count |
|---|---|---|
| 1 — video | Real screen capture, poster + `.webm`/`.mp4` | 1 asset (Bridge) |
| 2 — image | Real screenshot/photo, no video | 0 |
| 2b — brand illustration standing in | A real file, but not product UI | 1 asset (Driver's Diary) |
| 3 — designed fallback | `SurfaceMedia`'s gradient + caption, no real asset at all | 4 client projects |

Only Bridge has genuine tier-1 media. Everything else on the homepage that
looks like "product/project media" is either a brand mark, a brand-mark
illustration standing in for UI, or the honest tier-3 fallback.

## Per-section detail

Updated 2026-08-28 for the Cuberto-parity homepage rebuild (`CONTEXT.md`
§10) — same assets, new components/render paths. `work-reveal.tsx`,
`client-field.tsx`, `product-showcase.tsx` and `working-surface.tsx` no
longer exist; their media call sites moved to `summary.tsx` (one shared
`<Summary>`/`<SummaryCard>`/`<CardMedia>` used by both the WORK-equivalent
and PRODUCTS-equivalent sections) and `logo-reel.tsx`.

| Section | File | Renders today | Tier | What would upgrade it |
|---|---|---|---|---|
| PREVIEW | `evidence-expand.tsx` | Bridge `ProductVideo` (real capture) | 1 | Source is 1024x576 (`build-media.mjs`); frame caps growth at that width so it never upscales. Real clarity beyond that needs a 1920x1080 re-capture of Bridge — asset-blocked. |
| SUMMARY / FeaturedWork | `summary.tsx` | Client project brand marks only (`CardMedia`, brand-mark-on-plate) | — (brand, not product media) | Real screen capture of each of the 4 client products (Ananta Nethralaya, Al Afzah, Soorath Autos, HeadGreen) would let this swap from a brand plate to an actual UI shot/loop |
| LOGOREEL | `logo-reel.tsx` | Client brand marks only | — (brand, not product media) | Same 4 clients; this section never claimed to show product UI, so no gap to close here specifically |
| SUMMARY / ProductSummary | `summary.tsx` | Bridge `ProductVideo` (real) and Driver's Diary `ProductVideo` (brand illustration, poster only, **captioned as a stand-in** since 2026-08-27), same card grid, one path at every viewport width | 1 and 2b | Real screen capture of Driver's Diary (video ideally, poster at minimum) |

The previous architecture's desktop/mobile fork for PRODUCTS (a pinned
expand-to-fullscreen crossfade on desktop, a separate `ProductStack` on
mobile) is gone with `product-showcase.tsx` — `summary.tsx`'s `cb-cards`
grid is the same markup at every width, so there's only one render path to
track now, not two.

**The 4 client projects** (Ananta Nethralaya, Al Afzah, Soorath Autos,
HeadGreen) have a `brand` field (logo) and, as of 2026-08-27, a `media?:
Media` field too — `frontend/src/content/maco.ts`'s `Project` interface now
mirrors `Product`'s shape, and `summary.tsx`'s `CardMedia` renders
`ProductVideo` when a project's `media` is set, falling back to the brand
plate otherwise (see `docs/references/cuberto/NOTES.md`'s two-tier-showreel
mapping). The schema and render path are live; no project has `media` set
yet — all 4 still render the brand-mark plate, unchanged. Adding real
capture for any of them is now a pure content edit to `content/maco.ts`, no
further code change needed.

## What's genuinely asset-blocked vs. what's a real gap to close

- **Bridge**: no gap. Only asset with real tier-1 capture end to end.
- **Driver's Diary**: real gap, now honestly labeled rather than silently
  passed off as product UI (`content/maco.ts`'s `media.note`, rendered by
  `components/media/product-video.tsx`). Closing it needs a real screen
  recording or screenshot of the actual PWA — HeadGreen's brand mark is not
  a substitute and was flagged in `AI_HANDOFF.md` as part of what made the
  earlier PRODUCTS compositing bug read so badly.
- **The 4 client projects**: asset-blocked, same status as
  `docs/references/cuberto/NOTES.md` already records for WORK's hover-reveal
  cards. No real capture exists for any of Ananta Nethralaya, Al Afzah,
  Soorath Autos, or HeadGreen's product UI — only their brand marks. Closing
  this needs either real screen capture (matching Bridge's treatment) or an
  explicit decision that brand-mark plates are the permanent design for
  WORK/CLIENTS, not a placeholder awaiting an upgrade.

## Non-goals

This inventory does not recommend AI-generated video as a substitute for any
of the above — `docs/REFACTOR_PLAN.md` §2 already covers why (risks the
generic-AI-SaaS look MaCo is fighting) and where AI generation is fine
(abstract, non-representational atmosphere only, never as a stand-in for
real product UI or client work).
