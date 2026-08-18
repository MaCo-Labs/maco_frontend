# MaCo Website — Roadmap

Aligned with the visual evolution brief phases.
Update this file when a phase completes; also update `AI_HANDOFF.md` and `PROJECT_STATUS.md`.

Last updated: 2026-08-15

---

## Phase checklist

| Phase | Name | Status |
|-------|------|--------|
| 1 | Repository audit | DONE |
| 2 | Implementation plan | DONE |
| 3 | Typography system | DONE |
| 4 | React Bits integration (selective) | PARTIAL (Blur Text, Scroll Reveal, CenterScriptTransition free only) |
| 5 | SystemField evolution | DONE (v1) — signature section |
| 6 | Hero scroll choreography | DONE (v2 — copy visibility fix) |
| 7 | Obsidian theme depth | PARTIAL — section inversions done; full QA pending |
| 8 | Cobalt theme depth | PARTIAL — section inversions done; full QA pending |
| 9 | Mobile Pill Nav polish | DONE (v1) |
| 10 | Multilingual Identity | DONE (v2 — center language cycle + oval hive) |
| 11 | Work / Product / Service motion | DONE (Phase 18 + Phase 19 complete) |
| 12 | Responsive refinement | NOT STARTED (manual pass pending) |
| 13 | Accessibility | PARTIAL (reduced-motion hooks in place; manual pass pending) |
| 14 | Performance | PARTIAL (lazy script fonts; globe chunk large ~1.8MB) |
| 15 | QA | PARTIAL (`build` clean; browser QA pending) |
| 16 | Final visual polish | PARTIAL (Phase 16B rhythm shipped; spacing pass pending) |
| 16B | Signature visual rhythm | DONE (code) — inverted section + footer + interactions |
| 17 | Hero "The System Becomes The Logo" | SUPERSEDED (v3 reset) |
| 17v2 | Hero formation-stage correction | SUPERSEDED (v3 reset) |
| 17v3 | Hero "THE MONUMENT" — creative reset | DONE (code) — exact white-logo.png mark standing alone; one light-pass sweep; hairline datum; gentle scroll recede (copy floor ~0.68); CSS-timed entrance; reduced-motion resolved state |
| 18 | Homepage motion & experience evolution | DONE (code) — motion map as original MaCo components: Work cinema rail, Products spotlight/expand, Services vocabulary, Clients marquee, Process pin, CTA directional |
| 19 | Non-generic experience evolution | DONE (code) — breaks formulaic section template. Dark/light rhythm: full-bleed inverted CapabilityStatement + ServiceVocabulary + BridgeProductStage + CTABanner; per-project accent colors in WorkStrip; per-phase accent colors in ProcessSticky; dual-rail ambient ClientsTicker; crawl keyframe animations |

---

## Visual rhythm (after Phase 19)

```
HERO                  dark monument
CAPABILITY STATEMENT  dark inverted  ← first surprise
SIGNATURE SYSTEM      dark inverted  (existing)
WORK CINEMA RAIL      light          per-project accent colors
BRIDGE PRODUCT        dark           software-environment
DRIVER'S DIARY        light          compact
MULTILINGUAL          light          (existing)
SERVICE VOCABULARY    dark inverted  immersive console
CLIENTS TICKER        light          dual-rail ambient tape
PROCESS STICKY        light          per-phase accent colors
CTA BANNER            dark           grand closing finale
FOOTER                dark inverted  (existing)
```

Intentional alternation. Never two identical light sections back-to-back without a dark break.

---

## Next exact implementation order

1. Manual browser QA — Phase 19 dark sections (both themes): CapabilityStatement, BridgeStage, ServiceVocabulary, CTABanner
2. Verify crawl text does not overflow horizontally on any breakpoint
3. Verify per-project + per-phase accent colors are distinct and readable
4. Reduced-motion walkthrough — crawl stops, word reveals appear immediately
5. Keyboard walkthrough — ServiceVocabulary tabs, all CTAs focusable
6. Responsive pass (375, 430, 768, 1024, 1280, 1440)
7. Cobalt theme pass — all dark sections must remain dark (check `var(--surface-inverted)` renders correctly)
8. Optional: lazy-load MaCoGlobe for bundle size
9. Final visual polish — spacing, type scale refinement

---

## Explicitly out of scope unless requested

- Full backend rewrite
- Inventing new case studies / metrics / testimonials
- Replacing editorial desktop nav with glassmorphic mega-nav
- Making the site a React Bits gallery
- Reintroducing SystemField, beams, or glow-piles in Hero
- Replacing the real `white-logo.png` mark with invented geometry
- Adding Three.js / WebGL effects (Globe already present on About page)

---

## Success criteria (from brief — track here)

- [x] Existing functionality preserved (build green)
- [x] Real MaCo content preserved
- [x] Hero memorable with scroll narrative
- [x] Hero copy stays visible during scroll (no fade-to-zero bug)
- [x] Globe shows countries + network arcs (on About page)
- [x] SystemField retained (not in Hero)
- [ ] Obsidian architectural / Cobalt energetic (code done; full-site QA pending)
- [x] Theme typography mappings live
- [x] Multilingual section — center MaCo default, viewport-gated cycle
- [x] Multilingual — 20 distinct scripts, no duplicate Latin in orbit
- [x] Mobile pill polished (v1)
- [x] No fake claims
- [ ] Reduced-motion compatible (hooks + crawl overrides in place; manual QA pending)
- [x] Production build successful
- [x] TypeScript 0 errors
- [ ] No console errors / horizontal overflow (needs manual QA)
- [x] Hero "THE MONUMENT" — exact white-logo.png mark alone, one light-pass materializes it
- [x] Motion map — Work cinema rail, Products flagship, Services vocabulary, Clients marquee, Process pin, CTA directional
- [x] Non-generic visual rhythm — dark/light alternation with section-specific personality
- [x] Per-project accent colors in WorkStrip (healthcare / construction / automotive / EV)
- [x] Per-phase accent colors in ProcessSticky (cobalt / emerald / amber / violet)
- [x] Full-bleed crawl text animations (edge-to-edge, no shell container clipping)
- [x] Crawl animations reduced-motion safe