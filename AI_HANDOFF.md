# MaCo Website — AI Handoff

## Status

Overall: **IN PROGRESS** (~93%)

Current phase: **Phase 19 — Non-Generic Experience Evolution**

Completion estimate: **~93%** of visual evolution scope

Confidence: **HIGH** for all homepage sections; **MEDIUM** for full-site manual QA

Last updated: 2026-08-15

---

## Current objective

**Phase 19 — Make MaCo feel alive, spatially varied, and editorially distinctive.**

The user's feedback: "feels like a very generic version of websites — do something different, not static regular websites."

The response was a section-by-section redesign to break the formulaic `shell > dot + number + heading > grid cards` pattern that made every section look like the same template.

### What changed in Phase 19

```
CapabilityStatement  → Full-bleed DARK inverted typographic event
                        (animated word-by-word reveals, kinetic cycling word,
                         oversized crawl text edge-to-edge, 3 repeating crawl bands)

ServiceVocabulary    → Full-bleed DARK inverted capability console
                        (immersive terminal aesthetic, scroll-reveal, same
                         tab/vocabulary/evidence logic retained)

ProductsSection      → Bridge: full-bleed DARK with live-status bar,
                        cobalt accent pointer glow, capability matrix
                        Driver's Diary: compact light editorial card

WorkStrip            → Per-project accent colors (healthcare / construction /
                        automotive / EV-mobility) with L-bracket corner markers,
                        colored progress pips, accent-tinted spotlight

ProcessSticky        → Per-phase accent colors (A=cobalt, B=emerald,
                        C=amber, D=violet) — giant letter, glowing progress bar,
                        color-reactive sequence rail

ClientsTicker        → Two separate rails at different speeds (client names large
                        + industry text small), no section-header box, raw ambient tape

CTABanner            → Grand dark closing statement — kinetic typing ticker, animated
                        word reveals, oversized heading, outline CTA button, counter stats,
                        oversized text crawl backdrop

styles.css           → Added @keyframes maco-crawl-ltr / maco-crawl-rtl,
                        sr-reveal utility, display-counter, ticker-sep
```

### Visual rhythm after Phase 19

```
HERO (dark monument)
  ↓
CAPABILITY STATEMENT (dark inverted — first visual surprise)
  ↓
SIGNATURE SYSTEM (dark inverted, existing)
  ↓
WORK CINEMA RAIL (light, per-project accent colors)
  ↓
PRODUCTS: BRIDGE (dark — software-environment aesthetic)
PRODUCTS: DRIVER'S DIARY (light, compact)
  ↓
MULTILINGUAL IDENTITY (light, existing)
  ↓
SERVICE VOCABULARY (dark inverted — immersive console)
  ↓
CLIENTS TICKER (light, ambient dual-rail tape)
  ↓
PROCESS STICKY (light, per-phase accent colors)
  ↓
CTA BANNER (dark — grand closing finale)
  ↓
FOOTER (dark inverted, existing)
```

---

## Completed work (Phase 19 — 2026-08-15)

- **`capability-statement.tsx` (REWRITTEN)** — dark inverted full-bleed section. Oversized
  crawl text (8rem) runs edge-to-edge on 3 repeating bands. Word-by-word animated reveals
  using IntersectionObserver + CSS transitions. Kinetic cycling accent word (SCHEMA / ADMIN /
  DEPLOYMENT etc.) with underline. No more white-card shell formula.

- **`cta-banner.tsx` (REWRITTEN)** — dark inverted grand finale. Top and bottom oversized crawl
  text bands (opacity 0.05). Scrolling keyword ticker (BRIEF US / SEND THE PROBLEM etc.).
  Animated word-by-word heading reveal. Outline-style CTA button with hover fill. Three counter
  stats (4 Products / 5 Disciplines / 2+ Years). Secondary "View selected work" link.

- **`service-vocabulary.tsx` (REWRITTEN)** — full-bleed dark inverted console. Same tab/vocabulary/
  evidence logic as before, but now on dark `var(--surface-inverted-2)` background. Corner
  crosshairs, fine-grid overlay, datum lines. All text uses `--text-inverted` / `--muted-inverted`.
  Hover border-color via JS inline styles (no Tailwind dependency). Scroll-reveal fade-in.

- **`products-section.tsx` (REWRITTEN)** — Bridge gets dark inverted full-bleed with cobalt
  `oklch(0.55 0.14 264)` accent. Live-status production bar with pulsing dot. Feature matrix
  cells highlight cobalt on click. Pointer glow traces across the stage. Driver's Diary
  remains compact light card below. Removed motion/react dependency from products-section.

- **`work-strip.tsx` (REWRITTEN)** — per-project accent colors via `PROJECT_ACCENTS` map
  (healthcare teal / construction amber / automotive orange / mobility green). L-bracket corner
  markers (precise CSS border-top/bottom/left/right), not "+" text glyphs. Active pip indicator
  uses accent color. Footer line reacts to active-project accent. Mobile cards have left accent
  border stripe.

- **`process-sticky.tsx` (REWRITTEN)** — `STEP_ACCENTS` map per phase (A=cobalt, B=emerald,
  C=amber, D=violet). Giant glyph color = step accent. Progress laser bar uses step accent +
  box-shadow glow. Sequence rail highlights current step in its accent with translucent bg.
  Static fallback cards have top border in step accent.

- **`clients-ticker.tsx` (REWRITTEN)** — no section-header box, no white cards. Two rails at
  different speeds and sizes: Rail 1 (large client names, `maco-crawl-ltr 22s`) + Rail 2 (small
  industry labels, `maco-crawl-rtl 34s`). Editorial ambient strip. Scroll-reveal fade on label
  and statement. No motion/react dependency.

- **`styles.css`** — added:
  - `@keyframes maco-crawl-ltr` — `translateX(0 → -50%)` with reduced-motion override
  - `@keyframes maco-crawl-rtl` — `translateX(-50% → 0)` with reduced-motion override
  - `.sr-reveal` / `.sr-reveal.is-visible` scroll-reveal utility
  - `.maco-dark-section` shared dark-section override
  - `.display-counter` — counter number display typography
  - `.ticker-sep` — ornament separator

### Tests (this pass)

| Command | Result |
|---------|--------|
| `npm run build` | **PASSED** (client + SSR, exit code 0) |
| TypeScript | **0 errors** (build clean) |

Manual visual QA: not run (dev server on localhost:5173).

---

## Next exact actions

1. `npm run dev` → scroll full homepage. Verify:
   - CapabilityStatement dark section appears immediately after Hero without white-card pattern
   - Crawl text animates edge-to-edge
   - Word reveals trigger on scroll entry
   - Bridge section reads like a live software environment
   - Work rail per-project accent colors are visible and distinct
   - Process phases change color (A=cobalt → B=emerald → C=amber → D=violet)
   - CTA closing statement feels like a finale, not a footer
2. Check both Obsidian + Cobalt themes — inverted tokens should hold for all dark sections
3. Verify `prefers-reduced-motion: reduce` — crawl animations stop; word reveals appear immediately
4. Responsive pass (375 → 1440) — crawl text must not overflow horizontally; dark sections must not bleed
5. Keyboard walkthrough — ServiceVocabulary tabs, CTABanner links focusable
6. Check console for errors

---

## Completed work (Phase 18 — 2026-08-14)

- **`work-strip.tsx` (NEW)** — selected work as a pinned horizontal "cinema" rail. Desktop stage N×100vh, sticky viewport, cards glide laterally via `useScroll`/`useTransform`. Mobile = editorial vertical list; reduced-motion = static list.
- **`process-sticky.tsx` (NEW)** — pinned A→B→C→D journey. Giant step letter cross-fades, progress hairline. Responsive pin; reduced-motion = static 4-column list.
- **`clients-ticker.tsx` (NEW)** — restrained scroll-velocity marquee of real client names. `sr-only` real list for AT.
- **`service-vocabulary.tsx` (NEW)** — interactive capability vocabulary. Five real services, selectable (role=tab), capabilities + evidence links.
- **`products-section.tsx` (NEW)** — Bridge flagship SpotlightCard; Driver's Diary depth card.
- **`cta-banner.tsx` (NEW)** — large directional closing type.
- **`routes/index.tsx`** — section order choreographed.
- **CSS** — `.spotlight-card-glow`, `.work-strip*`, `.process-ghost/.process-current`, `.clients-ticker-track`, `.cta-magnet`.

### Tests (Phase 18)

| Command | Result |
|---------|--------|
| `npm run build` | **PASSED** |
| `npm run lint` | **0 errors** (7 pre-existing ui/* warnings) |

---

## Completed work (Hero "THE MONUMENT" — 2026-08-14)

> See previous full entry in git history. Summary: Removed all beams, 6×8 grid field, and layered glow piles. New Hero = one centered stage with the exact `white-logo.png` mark as a sculptural object. Gentle scroll recede (copy floor 0.68). CSS-timed entrance. Reduced-motion: resolved state.

---

## In progress / needs review

- Manual visual QA — Phase 19 dark sections, both themes
- Full responsive pass (375–1440)
- Reduced-motion + keyboard walkthrough
- Console error verification
- Globe bundle size (consider lazy import — still ~1.8MB chunk)

---

## Do NOT change

1. Do not reintroduce SystemField, beams, grid, or glow-pile in Hero — the mark stands alone
2. Do not replace the real `white-logo.png` mark with invented geometry
3. Dual themes (Obsidian / Cobalt) — all inverted sections must use `var(--surface-inverted)` tokens, not hard-coded hex
4. Real content only — no invented clients/metrics/awards
5. Editorial desktop nav
6. Mobile pill nav pattern
7. Multilingual center must default to **MaCo** (Latin)
8. Section numbers (01–07 on homepage) — preserve existing numbering
9. Crawl animations must have `prefers-reduced-motion` overrides (already in styles.css)

---

## Key files changed (Phase 19 — 2026-08-15)

```
frontend/src/components/sections/capability-statement.tsx  (REWRITTEN)
frontend/src/components/sections/cta-banner.tsx            (REWRITTEN)
frontend/src/components/sections/service-vocabulary.tsx    (REWRITTEN)
frontend/src/components/sections/products-section.tsx      (REWRITTEN)
frontend/src/components/sections/work-strip.tsx            (REWRITTEN)
frontend/src/components/sections/process-sticky.tsx        (REWRITTEN)
frontend/src/components/sections/clients-ticker.tsx        (REWRITTEN)
frontend/src/styles.css                                    (AMENDED — crawl keyframes + utilities)
```

---

## React Bits decisions (Phase 19)

```
USED:
  None (all original MaCo components)

REJECTED:
  Scroll Velocity (ClientsTicker) — replaced with CSS-only dual-rail marquee, no dependency
  Scroll Expand (ProductsSection) — replaced with IntersectionObserver reveal, simpler
  Flying Posters / Spotlight Card (WorkStrip) — replaced with CSS accent system

REASON:
  Pro-locked per AGENTS §22, and original implementation is more controlled / MaCo-specific.
```