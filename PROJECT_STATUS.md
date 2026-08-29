# MaCo Website — Project Status

Last updated: 2026-08-30

Statuses: **DONE** | **PARTIAL** | **NOT STARTED**

## Overall

| Area | Status | Notes |
|---|---|---|
| Homepage (11 sections, Cuberto-parity structure) | DONE — full structural rebuild 2026-08-28, same-day §13 refinement pass, a 2026-08-29 pass (dark-first ground sequence, Capabilities dark-panel accordion, masked video-in-text hero, custom cursor + word-reveal text device), a further same-day tenth pass (clients reel geometry fix, Lenis retune, IDENTITY script curation + footer sync, first-paint preloader, full-width footer wordmark, three-mode layout switcher), and a 2026-08-30 eleventh pass (`/about` SSR fix, cursor generalized to a semantic per-state/theme/ground-aware system + footer torch, layout modes 2/3 rebuilt to match their references, 15-unit premium audit), plus 3 bug-fix passes + 6 motion-audit fixes from 2026-08-27 predating it | See `CONTEXT.md` §10 for the current architecture; see `AI_HANDOFF.md`'s eleventh-pass entry (2026-08-30) for the latest — its cursor/torch/nav2/nav3 work ships behind `?v2=` preview flags, not yet flipped to default. Tenth-pass entry before it, ninth-pass before that, eighth-pass for the refinement pass, seventh-pass for the rebuild, and its earlier three 2026-08-27 entries for the pre-rebuild fixes — all verified live. One pre-existing, out-of-scope finding remains open: a headless-screenshot-only artifact noted in the ninth-pass entry. The `/about` SSR fallback noted in the tenth-pass entry is resolved (eleventh pass) |
| Two-theme system (Obsidian/Cobalt) | DONE | Separate font set per theme, radial clip-path wipe on switch |
| Contact form → backend | DONE | Real `POST /api/v1/contact/`, throttled + honeypot |
| Mobile nav | DONE | Focus trap, Escape, backdrop dismiss |
| Dead-code / dependency cleanup | DONE | 2026-08-21 pass — see `CONTEXT.md` §11 |
| Docs resynced to code | DONE | This pass |
| `tsc --noEmit` | PARTIAL | One pre-existing error in `MaCoGlobe.tsx` (react-globe.gl type mismatch), unrelated to any recent change |
| Test suite | NOT STARTED | No test runner installed. Verification gate is `bun run build` + `bun run lint` |
| Deployment config | NOT STARTED | No CI, no `vercel.json`/`amplify.yml`/`Dockerfile`. Host not yet decided |
| Backend seed data verified against live DB | NOT STARTED | `seed_content` command exists, not run-verified this pass |
| Cross-browser / real-device motion audit | NOT STARTED | Only desktop-viewport Playwright checks have been run historically |

## Verified this pass (2026-08-21, cleanup)

- `bun install` — 343 packages resolve cleanly after removing 45 of 52 dependencies
- `bun run build` — client + SSR build succeed, no new errors
- `bun run lint` — zero errors (fixed pre-existing Prettier issues in `scripts/build-media.mjs` as a drive-by)
- `./node_modules/.bin/tsc --noEmit` — only the one pre-existing `MaCoGlobe.tsx` error, present before this pass
- Grepped every deletion target for importers across `src/` before removing — zero dangling references

## Known issues

The `/about` SSR fallback ("window is not defined") is fixed — see
`AI_HANDOFF.md`'s eleventh-pass entry (2026-08-30). Root cause was a
module-scope `window.THREE` read three layers down the `react-globe.gl`
import chain, not `MaCoGlobe.tsx` itself; `React.lazy` doesn't stop the
server from running that import to resolve a Suspense boundary. Fixed
with a `mounted` gate on the Suspense.

Layout mode 2's own trigger button can't be clicked to close the panel
once open (the panel's `z-[46]` sits above the header's `z-[42]`
stacking context) — pre-existing, confirmed via `git stash`, found during
the eleventh pass's own mode-2 work. Escape and link-navigation both
close it correctly. Logged in `docs/PREMIUM-AUDIT.md`, not yet fixed.

The earlier `NotFoundError: 'removeChild'` on homepage→`/work/$slug`
navigation is fixed; see `AI_HANDOFF.md`'s 2026-08-27 "third pass" entry.

## Not yet verified

- Full responsive matrix (only desktop widths spot-checked historically)
- `forced-colors` / high-contrast mode
- Real touch device (not just DevTools emulation)
- Lighthouse LCP/CLS numbers on the current build
- Screen reader pass
