# MaCo Homepage — Creative Reset Plan

Status: **Approved 2026-08-18. Implementation in progress.**
Branch: `homepage-reset` (off `main`, which holds the pre-reset baseline at commit `54bfb02`).
Scope: **homepage only** (`frontend/src/routes/index.tsx` and its section components). No other route, the backend, or the CMS schema changes.

This document is the working reference for the reset. It is derived from a full read-only audit of the documentation, content, backend, frontend architecture and current visual language (three parallel audits, ~470 tool calls total) — see §1.

---

## 1. Current-state audit — summary

Full detail lives in the audit transcripts; the load-bearing findings:

- **The homepage has one repeated visual grammar across 9 of 10 sections:** dark inverted slab + dotted grid overlay (6 near-identical copies) + monospace telemetry label + `NN — Title` numbered eyebrow + giant display text + pulsing status dot. 82 monospace micro-labels across 14 files, 5 marquee crawls, 7 pulsing dots.
- **Zero imagery exists in the repository.** No photography, no product screenshots, no client logos, no video. `content/maco.ts` has no `image`/`cover`/`thumbnail` field on any project, product, or client. The only raster asset on the homepage is one 637 KB PNG logo; every other visual is CSS/DOM decoration.
- **The contact form silently discards every submission.** `frontend/src/routes/contact.tsx:42-45` — when `VITE_API_BASE_URL` is unset (it is unset everywhere in this repo), the handler sets `state = "sent"` and shows a success message without ever calling the Django API.
- **The live homepage currently states false claims**, in direct violation of the project's own `AGENTS.md §10` ("NO FABRICATED CONTENT"): `4 Products Deployed` (2 exist), `2+ Years Engineering` (no founding date exists anywhere in the repo), `PRODUCTION LIVE` telemetry on Bridge, `VERIFIED` evidence badges, `HeadGreen Mobility` (the real client name is `HeadGreen`), and `DELIVERED · —` because every project's `year` field is the literal string `"—"`.
- **Doc/code conflicts found and to be corrected at close-out (§20):** `AI_HANDOFF.md` records React Bits `ScrollExpand` as "Pro-locked" — it is MIT + Commons Clause and free; `CONTEXT.md` describes both themes as light-canvas-only while the shipped code has multiple full-bleed dark sections; `AGENTS.md` approves a tagline and a font (Geist) that don't match `content/maco.ts` or `__root.tsx`.
- **Reusable infrastructure confirmed sound, kept as-is:** `hooks/use-reduced-motion.ts` (17 consumers, SSR-safe), `lib/utils.ts` `cn()`, the `@/*` alias, the `theme.tsx` mechanism, `content/maco.ts` as sole content source, the skip link and `:focus-visible` system.
- **Dead code confirmed and scheduled for deletion:** `components/react-bits/*` (3 files, zero imports), `hooks/use-mobile.tsx`, the `ogl` dependency (zero imports anywhere), 6 orphaned images (255 KB), ~18 unused CSS rules. The 46 `components/ui/*` shadcn primitives are also dead but are explicitly **out of scope** — purging them is an infrastructure project, not a homepage redesign; logged in §21.

---

## 2. What must be removed

| Category | Detail |
|---|---|
| Visual devices | 6 grid overlays, `SystemField` (from the homepage only — kept for `/about`, `/products/$slug`), 9 numbered eyebrows, 82 mono labels, 5 marquee crawls, 7 pulsing dots, corner crosshairs, film-frame brackets, 8 datum hairlines, the Monument hero, the Multilingual Identity hive |
| False claims | `4 Products Deployed`, `2+ Years Engineering`, `PRODUCTION LIVE`, `VERIFIED`, `Verified record`, `HeadGreen Mobility`, `DELIVERED · —`, `MACO SYSTEM FIELD [ACTIVE CORE]`, `STABILITY MATRIX`, unsourced 2-day SLA |
| Fonts | Bricolage Grotesque, Anybody, Syne, IBM Plex Sans, JetBrains Mono (6 families → 3) + the 18-family lazy Noto request |
| Dead code | `components/react-bits/*`, `hooks/use-mobile.tsx`, `ogl`, 6 orphaned images, `public/clear-sw.html`, ~18 unused CSS rules, `frontend/dist/` from the tree |

## 3. What must be preserved

`hooks/use-reduced-motion.ts` · `lib/utils.ts` · the `@/*` alias · `shell`/`rule-t`/`rule-b` utilities · the theme mechanism (`data-theme`, `localStorage["maco-theme"]`) · nav IA (Services/Work/Products/Clients/About/Contact) · the mobile pill nav (polished, not replaced) · all non-homepage routes · `content/maco.ts` as sole source of truth · TanStack routing/SSR · the Django API · `motion` v13 · `components/system-field.tsx` (file kept, homepage usage removed).

## 4. New visual thesis

**Material & Record.** MaCo builds software people log into every working day — unglamorous, load-bearing, durable. One signature device — **a raking light pass** across material surfaces — replaces every decorative device on the site, reused at four scales (hero, scroll-expand, work cards, product stage) so the page reads as one visual language, not a section list. Nothing else glows: no grids, no particles, no HUD, no crosshairs. Test: remove the logo, the page should still read as a company that keeps things working.

## 5. Typography

| Role | Family | Notes |
|---|---|---|
| Display | Instrument Serif (400 + italic) | Statements, movement openers |
| Body/UI | Instrument Sans variable (`wght 400-700`, `wdth 75-100`) | Already loaded, kept |
| Label | Instrument Sans `wdth 75`, uppercase, `0.14em` | Replaces every monospace label |

Scale, tracking and Google Fonts request are specified in the approved plan (`C:\Users\LENOVO\.claude\plans\you-are-working-on-robust-flute.md §4`), reproduced in `styles.css` as the source of truth once Phase A lands.

## 6. Colour & material

Two grounds (`paper`, `deep`) replace the current light-canvas + ad-hoc-dark-section + separate-hero-namespace split, fixing the bug where `signature-system-section.tsx` uses `text-muted-inverted` / `bg-accent-inverted` classes that Tailwind never generates (they aren't in `@theme inline`). Both Obsidian and Cobalt get both grounds; Cobalt's deep ground is blue-as-material, not a tint. Section rhythm: `deep → paper → deep(full) → paper → paper → deep → paper → paper → deep`. A pre-hydration theme script is added to `__root.tsx` to remove the current Obsidian flash on Cobalt page loads.

## 7. Information architecture — 9 movements

OPEN (hero) → CLAIM → EVIDENCE (scroll-expand) → WORK → CAPABILITY → PRODUCTS → METHOD → RECORD → CLOSE. Full behaviour table, headline copy options, and rationale in the approved plan §6.

## 8. Hero concept — "The Working Surface"

A dimensional material slab lit from a raking angle, in deep space, with a media slot for the real Bridge UI. CSS 3D transforms + layered gradients + one masked light sweep — no WebGL, no canvas, no particles. Full composition sketch and the continuous hero → CLAIM scroll story in the approved plan §7.

## 9. Scroll choreography map

| Movement | Behaviour |
|---|---|
| OPEN → CLAIM | *transform* — hero becomes the next section, no hard cut |
| EVIDENCE | *expand* — contained media frame grows to full viewport |
| WORK | *pinned horizontal* (desktop) / vertical sequence (mobile) |
| CAPABILITY | *sticky swap* |
| PRODUCTS | *zoom* + *overlap* |
| METHOD | *progressive draw* |
| RECORD | deliberate rest — no scroll behaviour |
| CLOSE | *collapse* |

## 10. Section-by-section interaction plan

See approved plan §7–§8 (hero + scroll-expand in full detail) and §10 (component list). Each movement gets its own component under `components/home/`.

## 11. React Bits opportunities

Techniques adopted (reimplemented on our own `motion` v13, zero new dependencies): `ScrollExpand` concept → EVIDENCE movement; `Magnet` concept → desktop-only CTA weighting; `VariableProximity` (already `motion/react`-only) → candidate for CAPABILITY. Rejected: everything requiring GSAP, Lenis, or `ogl` (`ScrollFloat`, `MaskedHeading`, `ScrollStack`, `CircularGallery`, `FlyingPosters`), and every background effect (DotGrid, Particles, Aurora, etc.) as those recreate exactly the language being removed. Full dependency table in approved plan §9.

## 12. 21st.dev opportunities

Unavailable this session — the MCP server needs OAuth that can't complete non-interactively. Not a blocker; nothing in this plan depends on it. Run `/mcp` in an interactive terminal to authorise, then it can inform later iteration.

## 13. Custom components to build

`components/home/{open-surface,claim,evidence-expand,work-sequence,work-sequence-mobile,capability-selector,product-story,method-line,record,close-intake}.tsx`, `components/media/{surface-media,light-pass}.tsx`, `lib/motion.ts`, `hooks/{use-scroll-scene,use-pointer-field}.ts`. Full table with purpose per file: approved plan §10.

## 14. Existing components to modify

`routes/index.tsx` (recomposed) · `styles.css` (token layer rebuilt) · `routes/__root.tsx` (fonts + pre-hydration theme script) · `components/chrome.tsx` (typography, mobile-nav focus trap + backdrop) · `routes/contact.tsx` (the silent-success bug, fixed for real).

## 15. Components to retire (homepage only)

All 7 `components/sections/*`, `signature-system-section.tsx`, `multilingual-identity.tsx`, `hero.tsx`, `hero/hero-monument.tsx`, `hero/hero-scroll-indicator.tsx`. None are deleted from the repo if imported elsewhere; verified only `system-field.tsx` is (by `/about` and `/products/$slug`).

## 16. Dependency changes

**Net new dependencies: zero.** Everything is built on `motion` (already installed), CSS, and SVG. `ogl` is removed (zero imports found). No GSAP, no Lenis, no new WebGL library.

## 17. Performance risks & mitigations

Three unthrottled `scroll` listeners → one rAF-batched `use-scroll-scene`. Seven unthrottled `pointermove` handlers driving React state (including 48-cell and 20-glyph recomputes) → CSS-variable pointer tracking with zero re-renders. `querySelector`/`getBoundingClientRect()` inside a render loop (Multilingual Identity) → section retired. 840vh of stacked sticky sections → ~520vh across two pinned movements. 637 KB unoptimised PNG LCP with two stacked `mix-blend-mode: screen` layers → new hero, AVIF/WebP pipeline. Budgets: LCP < 2.0s, CLS < 0.05, no long task > 200ms during scroll, 60fps mid-range Android. Full table: approved plan §13.

## 18. Accessibility strategy

Keep: skip link, `:focus-visible`, `aria-hidden` on decorative layers, `sr-only` real content, `useReducedMotion` (17 consumers). Fix: hero `<h1>` becomes the actual visible headline (currently `sr-only` while a `<p>` carries the visible text); CAPABILITY's tablist gets real arrow-key handling; PRODUCTS' clickable `<div>`s become `<button>`s; mobile nav gets a focus trap and backdrop dismissal; METHOD's `aria-hidden` no longer hides real content from non-reduced-motion screen readers. `prefers-reduced-motion` renders a *designed* static composition for every cinematic moment, not a frozen frame. Full detail: approved plan §14.

## 19. Mobile strategy

Designed first at 375/390/430/768/1024/1280/1440, not derived from desktop. Pinned horizontal → vertical snap sequence. Sticky swap → tap accordion. Pointer parallax/magnet → removed entirely below the hover-capable breakpoint. Hard rules: no horizontal overflow, no pinned traps, no hover-only information, ≥44px touch targets, no WebGL, never below 14px type. Full table: approved plan §15.

## 20. Content/copy changes

All copy derives from `content/maco.ts` `site.tagline`/`site.statement`, already strong and real — no new facts invented. Headline candidates ranked in approved plan §6; recommended: **"Software that has work to do."** Doc corrections at close-out: the stale "Scroll Expand is Pro-locked" note in `AI_HANDOFF.md`, the counter-stats documented as shipped while the same file bans invented metrics, and the three-way theme-description conflict between `CONTEXT.md`, `AGENTS.md`, and the actual code.

## 21. Exact implementation order

A0 `git init`, restore-point commit, `homepage-reset` branch — **done**.
A: this doc + fonts + design tokens + grounds + type scale + `lib/motion.ts` + scroll/pointer hooks + pre-hydration theme script.
B: Hero. C: Hero→Claim transform. D: Evidence scroll-expand + `SurfaceMedia`. E: Work sequence (desktop+mobile). F: Capability selector. G: Products. H: Method + Record. I: Close intake + contact API fix. J: Mobile pass. K: Accessibility pass. L: Performance pass. M: Motion audit. N: Browser QA.

Each phase: build + typecheck, inspect diff, fix regressions before moving on. Explicitly out of scope: purging the 46 dead `components/ui/*` shadcn files — logged as a follow-up, not part of this reset.

## 22. Verification checklist

- [ ] 7 widths × 2 themes screenshot pass (Playwright CLI, real browser)
- [ ] Zero console errors, zero horizontal overflow at every width
- [ ] Full keyboard traversal, visible focus throughout
- [ ] `prefers-reduced-motion` → deliberate static composition everywhere
- [ ] No Obsidian flash on Cobalt load
- [ ] Scroll choreography interruptible, no jump on reversal
- [ ] Contact form performs a real POST; errors surface for real
- [ ] Claim audit — every number/name on the page traces to `content/maco.ts`
- [ ] `npm run build` + `tsc` clean

## 23. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| No imagery exists | High | Three-tier `SurfaceMedia` (video → image → designed fallback); drop-in manifest so one file upgrades one section |
| Bridge recording never arrives | High | EVIDENCE expands a composed still with identical choreography |
| Redesign drifts into "a different template" | High | Phase M is a hard gate — any section that still looks templated gets redesigned, not shipped |
| Two pinned sections + scroll-expand fight on mobile | Med | Only one pinned behaviour below 1024px |
| Instrument Serif weight on Windows | Med | Verified in Phase B; fallback is weight compensation |
| Scope creep into dead shadcn files | Med | Explicitly out of scope, logged above |
| Contact fix "breaks" a form that worked | Low | It never worked — every submission was silently discarded. Failing loudly for real errors is the fix. |

---

*Full working detail, including the exact CSS token values, spring parameters, and per-movement composition sketches, lives in the approved plan file used to drive implementation. This document is the durable repo record.*
