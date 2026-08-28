# MaCo Website — Project Status

Last updated: 2026-08-28

Statuses: **DONE** | **PARTIAL** | **NOT STARTED**

## Overall

| Area | Status | Notes |
|---|---|---|
| Homepage (11 sections, Cuberto-parity structure) | DONE — full structural rebuild 2026-08-28 plus same-day §13 refinement pass (crop fix, dead-code sweep, hero treatment, client consolidation, adaptive navbar), plus 3 bug-fix passes + 6 motion-audit fixes from 2026-08-27 predating it | See `CONTEXT.md` §10 for the current architecture; see `AI_HANDOFF.md`'s eighth-pass entry for the refinement pass, seventh-pass for the rebuild, and its earlier three 2026-08-27 entries for the pre-rebuild fixes — all verified live |
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

None open. The one issue found this pass — `NotFoundError:
'removeChild'` on homepage→`/work/$slug` navigation — is fixed; see
`AI_HANDOFF.md`'s 2026-08-27 "third pass" entry.

## Not yet verified

- Full responsive matrix (only desktop widths spot-checked historically)
- `forced-colors` / high-contrast mode
- Real touch device (not just DevTools emulation)
- Lighthouse LCP/CLS numbers on the current build
- Screen reader pass
