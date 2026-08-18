# MaCo Website — Project Status

Last updated: 2026-08-15

Statuses: **DONE** | **IN PROGRESS** | **PARTIAL** | **NOT STARTED** | **NEEDS REVIEW**

---

## Overall

| Metric | Value |
|--------|--------|
| Overall | **IN PROGRESS** (~93% of visual evolution brief) |
| Foundation | **DONE** |
| Hero "THE MONUMENT" v3 | **DONE** (code complete; manual QA pending) |
| Phase 18 — Homepage motion evolution | **DONE** (original MaCo choreography) |
| Phase 19 — Non-generic experience evolution | **DONE** (code complete; manual QA pending) |
| Multilingual center cycle | **DONE** (code complete; manual QA pending) |
| Signature inverted section | **DONE** |
| Visual rhythm (dark → light → dark → light → dark → light → dark) | **DONE** (Phase 19) |
| Production build | **PASSED** |
| TypeScript | **0 errors** |

---

## Done

- Repo structure, Vite, docs suite
- Typography tokens + lazy script fonts (extended for Armenian, Georgian, Thai, Bengali, Oriya)
- Hero scroll narrative + ThemeAtmosphere
- **MaCoGlobe** — correct API, transparent renderer, country polygons, 24 network arcs, theme tokens
- **Hero scroll copy bug** — fixed progress calculation + removed fade-to-zero on eyebrow/descriptions
- **Multilingual Identity v2** — 20-script oval hive, viewport-gated center cycle, blur transitions, center flex positioning
- Mobile pill nav (v1)
- Home MotionSection + Bridge emphasis
- **React Bits free patterns** — Blur Text (Hero, Capability), Scroll Reveal (sections), CenterScriptTransition (Multilingual)
- **Phase 16B** — Signature inverted section, inverted footer, editorial row interactions, process progression, scroll storytelling
- **Phase 17v3 "THE MONUMENT"** — Hero creative reset. Exact `white-logo.png` mark as sculptural object. Beams/grid/glow-pile removed. Gentle scroll recede (copy floor 0.68). CSS-timed entrance.
- **Phase 18** — Homepage motion & experience evolution. Work = pinned horizontal cinema rail; Products = Bridge flagship; Services = interactive vocabulary; Clients = restrained name marquee; Process = pinned A→B→C→D; CTA = directional closing type.
- **Phase 19 — Non-Generic Experience Evolution (2026-08-15)**:
  - `capability-statement.tsx` — full-bleed dark inverted typographic event (crawl + word reveals + kinetic cycling word)
  - `cta-banner.tsx` — grand dark closing with ticker, stats, kinetic heading, outline CTA
  - `service-vocabulary.tsx` — full-bleed dark inverted console with scroll-reveal
  - `products-section.tsx` — Bridge: dark software-environment stage; Driver's Diary: compact light card
  - `work-strip.tsx` — per-project accent colors + L-bracket corner markers + accent pips
  - `process-sticky.tsx` — per-phase accent colors (A=cobalt, B=emerald, C=amber, D=violet) + glowing progress bar
  - `clients-ticker.tsx` — dual-rail ambient tape (large names + small industry, opposing directions)
  - `styles.css` — crawl keyframes (`maco-crawl-ltr`/`maco-crawl-rtl`), `sr-reveal`, `display-counter`, `ticker-sep`

---

## Partial / needs review

- Manual visual QA — Phase 19 dark sections, both themes (Obsidian + Cobalt)
- Inverted sections: confirm all use `var(--surface-inverted)` tokens (not hard-coded hex) on Cobalt
- Full manual responsive pass (375–1440) — especially crawl text overflow
- Reduced-motion walkthrough — crawl animations must stop; word reveals must appear immediately
- Keyboard walkthrough — ServiceVocabulary tabs, CTABanner links
- Console error verification
- Globe bundle size (consider lazy import — ~1.8MB chunk)

---

## Not started

- Final visual polish pass (spacing, type scale, rhythm)
- Work card live-URL hover preview (optional, needs real screenshot assets)
- Backend seed verification on user machine

---

## Next when resuming

1. `npm run dev` → scroll full homepage; observe dark/light alternation
2. Check CapabilityStatement dark section enters cleanly from dark Hero
3. Check Bridge section reads as a live software environment
4. Check per-project colors in WorkStrip are distinct and readable
5. Check ProcessSticky phase colors change correctly A→B→C→D
6. Check CTABanner finale — ticker, word reveals, stats, CTA button
7. Toggle Obsidian/Cobalt — all inverted sections should stay dark on both themes
8. Test `prefers-reduced-motion: reduce`
9. Responsive pass (375, 430, 768, 1024, 1280, 1440)