# MaCo Website — CONTEXT

Complete project context for developers and AI agents.
Last updated: 2026-08-19 (Motion Rebuild pass — all 10 homepage sections now carry real scroll-linked motion, live-verified via Playwright; see §10/§12 and `AI_HANDOFF.md` "Homepage Motion Rebuild" for what changed)

---

## 1. What this project is

**MaCo** is a software / IT solutions company based in **Kochi, Kerala, India**.

This repository is the **company website** (marketing + editorial surface) with:

- A **React / TanStack Start** frontend
- A **Django REST + Admin** backend / CMS
- Two brand themes: **Obsidian** and **Cobalt**

The site must feel: premium, technical, distinctive, confident, humble, editorial, modern, memorable — while still reading as a real software company.

It must **not** feel like: generic AI SaaS, React Bits demo, Lovable template, Framer template, or WebGL showcase.

The homepage went through a full creative reset in August 2026 (`HOMEPAGE_REDESIGN_PLAN.md`) — that document is the authoritative source for the current visual system and architecture. This file gives current-state facts; where the two disagree, verify against the actual repo.

---

## 2. Non-negotiable principles

1. **Make MaCo look like MaCo** — React Bits (and any reference library) is a technique source, not the identity; take concepts, reimplement on the installed `motion` stack, don't copy files.
2. **Do not invent** projects, products, clients, testimonials, metrics, awards, or claims. Every number/name on the page must trace to `content/maco.ts`.
3. **Keep `SystemField`** — retired from the homepage in the reset, but still imported by `/about` and `/products/$slug`. Don't delete the file.
4. **Two themes must be genuinely different**, not a recolor — currently enforced via a full separate font set per theme (§9), not just accent-color swaps.
5. **Prefer restraint** — motion should serve reveal, hierarchy, continuity, feedback, or storytelling. Nothing purely decorative.
6. **Performance matters** — avoid unthrottled scroll/pointer listeners driving React state; prefer `motion` `MotionValue`s and direct CSS-variable writes.
7. **Accessibility** — honor `prefers-reduced-motion`; every cinematic moment needs a designed static fallback, not just a disabled animation.

---

## 3. Repository layout

```
maco-website-v2/
├── AI_HANDOFF.md                # Agent handoff (live status)
├── CONTEXT.md                   # This file
├── PROJECT_STATUS.md
├── ROADMAP.md
├── HOMEPAGE_REDESIGN_PLAN.md    # Authoritative plan for the current homepage
├── DOCS.md
├── README.md
├── AGENTS.md                    # Lovable-connected note (history safety)
├── frontend/                    # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/             # the 10 homepage movements (see §10)
│   │   │   ├── media/             # SurfaceMedia, ProductVideo — media slots
│   │   │   ├── motion/             # Magnetic, LineReveal, SplitReveal (see §10)
│   │   │   ├── chrome.tsx         # header, footer, mobile pill nav
│   │   │   ├── scroll-runtime-provider.tsx  # Lenis/GSAP lifecycle owner (see §10)
│   │   │   ├── mark.tsx           # real logo mark (CSS mask + currentColor), `src` prop for the hero variant
│   │   │   ├── system-field.tsx   # kept for /about, /products/$slug only
│   │   │   ├── theme.tsx          # ThemeProvider / useTheme
│   │   │   └── ui/                # shadcn primitives (46 files, dead — see §11)
│   │   ├── content/maco.ts        # sole content source of truth
│   │   ├── hooks/
│   │   ├── lib/motion.ts          # shared springs (motion-only; scroll is Lenis/ScrollTrigger, see §10)
│   │   ├── lib/scroll-runtime.ts  # Lenis + GSAP singleton (see §10)
│   │   ├── routes/                # file-based TanStack routes
│   │   ├── styles.css             # design tokens + utilities
│   │   ├── router.tsx / server.ts / start.ts
│   ├── public/                    # logo-mark.png, maco-mark-hero.png, favicon, geo data
│   ├── scripts/shrink-hero-mark.cjs  # one-off: white-logo.png -> maco-mark-hero.png (637KB -> 61.6KB)
│   ├── package.json
│   └── vite.config.ts
└── backend/                     # Django
    ├── maco/                     # settings, urls, wsgi
    ├── content/                  # models, API, admin, seed_content
    ├── manage.py
    ├── requirements.txt
    ├── .env.example
    └── venv/                     # local virtualenv (gitignored)
```

---

## 4. Tech stack

### Frontend

| Piece | Choice |
|-------|--------|
| Runtime | React 19 |
| Framework | TanStack Start + TanStack Router |
| Bundler | Vite 8 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme inline` + CSS variables) |
| UI primitives | Radix / shadcn-style under `components/ui` (mostly dead — §11) |
| Data (client) | TanStack Query (wired in root) |
| Motion / scroll | Ownership split (§12): **Lenis** (scroll substrate) + **GSAP** `ScrollTrigger`/`SplitText` (pinned/scrubbed scenes, line reveals, the hero wordmark's split-and-shine) + `motion` v13 (`motion/react`) for discrete UI state only (tabs, IDENTITY reel, hover springs) — `motion` no longer touches scroll |
| Path alias | `@/*` → `src/*` |

### Backend

| Piece | Choice |
|-------|--------|
| Framework | Django 5.1 |
| API | Django REST Framework |
| CORS | django-cors-headers |
| DB | PostgreSQL via `DATABASE_URL` |
| CMS | Django Admin |
| Seed | `python manage.py seed_content` |

### Installed 2026-08-18 — Immersive Motion Rebuild, by explicit user decision

This reverses an earlier version of this section, which read "Not installed (by
design unless needed later): GSAP, Lenis..." That held for the homepage reset;
it stopped holding when the user chose the full immersive rebuild over a
lighter, dependency-free alternative I recommended instead. Both are free for
commercial use — GSAP 3.15 (ScrollTrigger + SplitText included, no Club GSAP
paywall) and Lenis 1.3 (MIT).

- `gsap`, `lenis` — see §11 for the measured bundle cost, §12 for the ownership split with `motion`.

### Reverted the same day — WebGL, cursor ring, text scramble (Brand Hero & Bug Fix pass, 2026-08-18)

The immersive rebuild above also shipped a raw-WebGL2 cursor-reactive hero
field, a hover-distortion shader on PRODUCTS/EVIDENCE imagery, a
blend-difference cursor-ring companion, and text-scramble hovers. Once actually
driven in a browser, the user's verdict was that this combination read as a
generic agency template (`evirexsoft.com`-like), not as MaCo. All four were
deleted outright (`components/webgl/*`, `components/cursor-ring.tsx`,
`components/motion/scramble.tsx`, plus every call site) rather than
tuned — see §10/§11 below and `AI_HANDOFF.md` for the full list. **Lenis and
GSAP stay** (smooth scroll, pins/scrubs, `SplitText` reveals) — those were kept
and deepened, not reverted; only the four devices above are gone.

### Reintroduced, third attempt — WebGL on OPEN (Hero Blinds Field pass, 2026-08-19, same day as the motion rebuild)

A cursor-reactive WebGL gradient background (`<BlindsField>`,
`components/home/blinds-field.tsx`) was added to OPEN, plus magnetic/glow
micro-physics on the mark and a radial `clip-path` theme-switch transition.
Requested with a spec that named React Bits' GradientBlinds via a new `ogl`
dependency; reimplemented instead on `three` (already installed for
`MaCoGlobe`) per the "Not installed" rule directly below, and scoped to
OPEN only, unlike the two prior WebGL passes which touched multiple
sections. Unlike those two, this one was live-verified via Playwright
(canvas mounts/sizes, mouse-reactive, reduced-motion fallback, zero console
errors) before being called done — see `AI_HANDOFF.md` for the full
verification list and rule 8 of its "Do NOT change" section.

### Not installed (by design)

- Official React Bits npm bundle (concepts are reimplemented on `motion`/GSAP or, for WebGL, `three` — never copied verbatim, and never on a second WebGL runtime like `ogl`)
- R3F (`@react-three/fiber`) — both homepage (`<BlindsField>`) and `/about` (`MaCoGlobe`) use raw `three` directly, not R3F

---

## 5. Brand & messaging

| Field | Value |
|-------|-------|
| Name | MaCo |
| Category | Software / IT solutions |
| Tagline | Software and IT solutions for products that need to work. |
| Statement | MaCo builds and maintains software that carries real operational weight — client platforms, internal tooling and the systems people log into every working day. |
| Email | hello@maco.dev |
| Location | Kochi, Kerala, India |

Tone: factual, simple, confident. Avoid "passionate team revolutionizing digital transformation."

---

## 6. Confirmed content catalog

Source: `frontend/src/content/maco.ts` (mirrors the DRF schema).

### Services (2, collapsed from 5 on 2026-08-18 at the owner's direction)

1. **Business Software** — `business-software` — capabilities: Task Management, CRM, Custom Software
2. **Digital Solutions** — `digital-solutions` — capabilities: Websites, E-commerce, Branding and Design, Social Media Management

The previous five (`web-development`, `app-development`, `technical-support`,
`software-support`, `social-media-managing`) no longer exist as slugs anywhere
in `content/maco.ts` — `projects[].services` was remapped, not left dangling.
Capability copy reuses the retired services' real descriptions wherever one
substantively overlaps; see the comment above `services` in `content/maco.ts`
for exactly which capability inherited which retired entry's text.

### Projects / selected work (4)

1. **Ananta Nethralaya** — eye clinic website — `ananta-nethralaya`
2. **Al Afzah** — Qatar construction company website — `al-afzah`
3. **Soorath Autos** — used-car dealership website — `soorath-autos`
4. **HeadGreen** — EV fleet/cab service (Kochi) website — `headgreen` — the client is **HeadGreen**, not "HeadGreen Mobility" (a fabricated name that shipped on the pre-reset homepage and has since been corrected)

### Products (2)

1. **Driver's Diary** — PWA/platform for HeadGreen ops (attendance, rides, payroll, docs, reporting) — `drivers-diary`
2. **Bridge** — MaCo's own SaaS/PWA + desktop task/project platform — `bridge` — gets the strongest product treatment (EVIDENCE movement + first PRODUCTS card)

### Clients (4 — names only; no logos without permission)

- Ananta Nethralaya (Healthcare)
- Al Afzah Group WLL (Construction)
- Soorath Autos (Automotive retail)
- HeadGreen (EV mobility)

### Process steps

A Scope → B Model → C Build → D Hand over

---

## 7. Routes (frontend)

| Path | File | Purpose |
|------|------|---------|
| `/` | `routes/index.tsx` | Home — the 10-movement homepage (§10) |
| `/services` | `services.index.tsx` | Services index |
| `/services/$slug` | `services.$slug.tsx` | Service detail |
| `/work` | `work.index.tsx` | Work index |
| `/work/$slug` | `work.$slug.tsx` | Case study |
| `/products` | `products.index.tsx` | Products index |
| `/products/$slug` | `products.$slug.tsx` | Product detail |
| `/clients` | `clients.tsx` | Clients |
| `/about` | `about.tsx` | About (still uses `MaCoGlobe`, `SystemField`) |
| `/contact` | `contact.tsx` | Contact / lead — real POST, see §8 |
| `__root.tsx` | Shell, theme, pre-hydration theme script, header/footer, SEO head links |

Nav labels: Services, Work, Products, Clients, About, Contact.

---

## 8. Backend API

Documented in `backend/README.md`. Base: `/api/v1/`

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/settings/` | Site settings |
| GET | `/api/v1/services/` | Published services |
| GET | `/api/v1/services/<slug>/` | Detail |
| GET | `/api/v1/projects/` | Work (`?featured=true`) |
| GET | `/api/v1/projects/<slug>/` | Case study |
| GET | `/api/v1/products/` | Products |
| GET | `/api/v1/products/<slug>/` | Detail |
| GET | `/api/v1/clients/` | Only approved for publication |
| POST | `/api/v1/contact/` | Lead capture (`ScopedRateThrottle` 10/hour, honeypot field `website`) |

Writes (except contact) via Django Admin only.

**The contact form is now actually wired to this.** `frontend/.env.example` documents `VITE_API_BASE_URL=http://localhost:8000` — without it, the frontend contact form errors loudly rather than silently discarding the submission (the pre-fix behavior; see `AI_HANDOFF.md`).

---

## 9. Design system

### Themes

Stored in `localStorage` key `maco-theme`. Applied as `data-theme` on `<html>`, set pre-hydration by an inline script in `RootShell` (`__root.tsx`) so a returning Cobalt user never sees an Obsidian flash.

Both themes share the same two-ground model (`data-ground="paper" | "deep"` on each section) — the difference between themes is the color mapping under each ground **and, critically, a completely different font set** (below). This is the mechanism that makes the two themes feel like different modes rather than a palette swap.

### Typography (pivoted 2026-08-18)

User-selected fonts, deliberately split per theme:

| Role | Obsidian | Cobalt |
|---|---|---|
| Display (`--maco-font-display`) | Unbounded | Michroma |
| Body (`--maco-font-body`) | Jost | Tenor Sans |
| Label (`--maco-font-label`) | Agdasima | Krona One |

Loaded via one combined Google Fonts request in `__root.tsx`. Michroma, Tenor Sans, and Krona One are single-static-weight families — verified against the Google Fonts CSS2 API before wiring in; don't request weight axes that don't exist for them.

Type scale (`display-hero` / `display-lg` / `display-md` / `lead` / `body` / `label`) is defined once in `styles.css` and shared across themes; only the family tokens differ.

### Structural utilities

`shell`, `rule-t` / `rule-b`, `label`, `display-hero|lg|md`, `lead`, `btn-solid`, `btn-line`, `link-draw`, `index-row`, `light-pass` (the signature raking-light device, driven by a `--sweep` custom property 0–1 — see §10).

### Brand assets (`frontend/public/`)

- `logo-mark.png` — the real mark, URL-safe copy of `logo final-07 (1).png`, used by `Mark` via CSS `mask-image` everywhere in chrome (header/footer/nav) at small sizes
- `maco-mark-hero.png` — the OPEN hero's mark, generated from `white-logo.png` by `scripts/shrink-hero-mark.cjs` (2026-08-18): 637KB RGBA → 61.6KB grayscale+alpha at half-resolution. Rendered via the same CSS-mask technique (`<Mark src="/maco-mark-hero.png">`) — only the alpha channel is ever read, so the RGB-channel downsample is lossless for this use. Confirmed by decoding both PNGs' alpha channels directly: source is 23.2%/59.2% fully-opaque/fully-transparent, output is 23.5%/59.0% — same shape
- `logo final-04.png`, `logo final-07 (1).png/.jpg`, `logo final-10.png`, `white-logo.png` — original exports; `white-logo.png` is now the source for `maco-mark-hero.png` above, the rest remain unused
- `favicon.png`

---

## 10. The homepage (post Motion Rebuild architecture, 2026-08-19)

Ten movements, composed in `routes/index.tsx`, built under `components/home/`,
plus `<GroundHandoff>` (renders nothing — see below). OPEN (brand alone) and
SURFACE (the old hero's promise/proof/video merged with the old standalone
CLAIM) replace the previous two-section OPEN+CLAIM opening. Ground sequence
retuned this pass per the plan's Phase 4 rhythm: deep · paper · deep deep ·
paper paper · deep · paper paper · deep — no run longer than two.

| Movement | Ground | File | Behaviour |
|---|---|---|---|
| OPEN | deep | `open-logo.tsx` | Hero — MaCo's brand alone: the real mark (`<Mark src="/maco-mark-hero.png">`) + the animated "MaCo" wordmark (`<SplitReveal>`, GSAP `SplitText` char-rise then a continuous 115° `.maco-shine` rake), existing eyebrows, a scroll cue fading on a `ScrollTrigger` scrub |
| SURFACE | paper | `working-surface.tsx` | The promise, the 4-cell proof row (staggered via one shared `ScrollTrigger`), two magnetic CTAs, and Bridge in motion — the video panel "lays flat" on scroll (composed with the existing pointer tilt), its light-pass sweep moved off the pointer onto its own scroll transit |
| EVIDENCE | deep | `evidence-expand.tsx` | Scroll-linked clip-path expand, now aspect-locked to the video's real 16:9 (previously grew to the viewport's aspect and let `objectFit:cover` crop real footage) — GSAP `ScrollTrigger` `pin`+`scrub` writing straight to inline style/CSS vars in `onUpdate`, pin extended 120%→160% |
| WORK | deep | `work-sequence.tsx` | 4 real projects — pinned horizontal rail (`lg+`) via `WorkRail`/`WorkPanel`, mounted unconditionally with the pin itself gated by `gsap.matchMedia()` (fixed a mount-order race that previously let `useMediaQuery`'s SSR-safe flip desync the pin from its own transform, see §10's bug note below); plain vertical list (`WorkList`) on mobile, migrated onto the same `ScrubReveal`/`Stagger` vocabulary as the rest of the page. Progress on a registered, inherited `--p` custom property |
| CAPABILITY | paper | `capability-selector.tsx` | Services selector, 2 tabs (Business Software, Digital Solutions) — sticky on desktop, a section-spanning `ScrollTrigger` maps scroll progress to the active tab; click/arrow-key sets a flag that wins outright until the section scrolls fully past |
| PRODUCTS | paper | `product-story.tsx` | Bridge + Driver's Diary as a sticky overlap stack — each card `position:sticky` with ascending z-index so the second visibly covers the first, each card itself a `data-ground="deep"` tile with its own `ScrollTrigger`-scrubbed light-pass sweep (`ProductMedia`); aspect ratio derived from real asset dimensions (Driver's Diary is a real 900×1203 portrait) |
| IDENTITY | deep | `identity.tsx` | "One name. Many scripts." — fully scroll-driven dial via a registered, inherited `--t` custom property (replaces a prior `setInterval` reel); no animated `filter:blur()`, no `motion/react` involvement, correct `lang` code per script, `sr-only` full listing |
| METHOD | paper | `method-line.tsx` | A → B → C → D — pinned vertical step-through (GSAP `ScrollTrigger`, `~150vh` pin, `scrub`), a *different* pin mechanic from WORK's horizontal rail deliberately; progress written straight to refs, not React state; reduced-motion keeps the static 4-step grid |
| RECORD | paper | `record.tsx` | Clients + company — the plan's one deliberate rest point: a single `RakingSurface` lights the logo grid once, tiles settle via a low-amplitude `Stagger` (not motionless, but restrained) |
| CLOSE | deep | `close-intake.tsx` | A rule draws outward from centre (the one place on the page a rule draws from the middle), the page's biggest scrub reveal, a final light pass; links to `/contact` rather than duplicating a form |

### Cross-section continuity — `GroundHandoff` (2026-08-19)

`components/home/ground-handoff.tsx`, mounted once after CLOSE in
`routes/index.tsx`, renders nothing itself. On 4 hand-picked boundary pairs,
the outgoing section scales down/dims/lifts as the incoming section arrives,
so the boundary reads as one section being overtaken rather than a hard cut.
Only pairs whose outgoing side is pin-free are eligible — a `transform` on the
ancestor of a `position:fixed` pinned element repositions it relative to that
ancestor instead of the viewport, so EVIDENCE/WORK/IDENTITY/METHOD (each hosts
a pin) can never be an outgoing side; PRODUCTS is safe outgoing since its
cards are `position:sticky`, not `fixed`.

### Two mount-order races found and fixed (2026-08-18 and 2026-08-19)

Same bug class, found twice: `useMediaQuery("(min-width: 1024px)")` is
SSR-safe by initialising to `false` and only flipping to `true` in an effect
after mount, so whichever section conditionally renders its pinned variant off
that hook mounts its pin-spacer one render late. Any `ScrollTrigger` created
in the meantime (by a sibling section) measures against a document missing
that spacer and fires at the wrong offset. First hit METHOD-vs-WORK
(2026-08-18, fixed via `scheduleRefresh()` coalescing all trigger creation
into one next-frame `ScrollTrigger.refresh()`). Recurred as IDENTITY-vs-WORK
(2026-08-19) because WORK itself was still switching `<WorkRail>`/`<WorkList>`
via the same `useMediaQuery` pattern — fixed by mounting both unconditionally
(split by CSS breakpoint) and gating the pin itself with `gsap.matchMedia()`,
which reverts automatically on a breakpoint crossing, closing the bug class
rather than patching another instance of it.

### Two real bugs found and fixed in this pass (Brand Hero & Bug Fix, 2026-08-18)

Both reported by the user after actually scrolling the built page ("WORK races
past its panels, then METHOD pops up mid-scroll, then a big empty gap"), both
traced to a provable root cause in the code, not tuned by guesswork:

- **WORK's pin distance and its transform disagreed by 4×.** `end` was
  measured in pixels (`rail.scrollWidth - window.innerWidth`, ≈3 viewport
  widths for 4 panels) but the rail was moved by `-progress * (n-1) * 100%` —
  a percentage that resolves against the rail's own width (4 × viewport
  width), not the viewport. The panels finished travelling at `progress ≈
  0.25`; the remaining ~75% of the pin held an empty pinned viewport. Fixed by
  deriving both `end` and the transform from the exact same
  `rail.scrollWidth - rail.clientWidth` measurement, applied as `gsap.quickSetter(rail, "x", "px")`.
- **METHOD's `ScrollTrigger` was created before WORK's, against a document
  that didn't yet contain WORK's pin-spacer.** `useMediaQuery` initialises to
  `false` and only flips to `true` in an effect after mount, so on first
  render `WorkSequence` renders the non-pinning `<WorkList>` and creates no
  trigger, while `MethodLine` creates its trigger immediately. `<WorkRail>`
  (and its trigger) mount one render later. `ScrollTrigger` only measures the
  trigger it's currently creating, not siblings, so METHOD's `start` was
  measured too early and fired while WORK was still pinned, with a
  correspondingly large empty gap where METHOD should have appeared. Fixed by
  adding `scheduleRefresh()` to `lib/scroll-runtime.ts` — every scene calls it
  right after creating its trigger, coalescing into one `ScrollTrigger.refresh()`
  next frame regardless of mount order.

### `SurfaceMedia` (`components/media/surface-media.tsx`)

Three-tier media slot, because the repo has zero product photography or video: tier 1 (video, not yet used), tier 2 (image, not yet used), tier 3 (designed fallback — a material gradient + the `light-pass` device + an honest caption naming what's missing). Extending `content/maco.ts` with a `media` field on a project/product and swapping in a real `<video>`/`<picture>` upgrades one slot without touching the component's shape.

### The light-pass device (`@utility light-pass`, `styles.css`)

The plan's single signature device — one raking-light gradient (`::after`, `mix-blend-mode: overlay`) reused at multiple scales rather than a different decorative device per section. Position is read from a `--sweep` CSS custom property (0–1). Drivers: SURFACE's pointer field, EVIDENCE's scroll progress, per-PRODUCTS-card scroll progress. The hero wordmark's `.maco-shine` (below) is the same 115° angle applied at word-scale via `background-clip:text`, not a `.light-pass` instance itself.

### Scroll substrate & interaction layer (current, 2026-08-19)

Ownership is split, not layered — see §12 for the full rule. **Lenis** owns raw
scroll position (`src/lib/scroll-runtime.ts`, a lazy module-level singleton
booted by `<ScrollRuntimeProvider>` in `__root.tsx`, `null` on the server or
under reduced motion, now with `destroy()` correctly clearing the singleton so
a dev HMR remount doesn't hand every scene a dead Lenis instance); **GSAP
`ScrollTrigger`** owns every pin/scrub, on every one of the 10 homepage
sections now (previously 6 had none); `motion` v13 keeps only discrete UI
state (hover springs) and no longer touches scroll.

`hooks/use-scroll-scene.ts` (~30 lines) is the standard entry point for any
scroll-linked component — wraps `gsap.context()` for auto-cleanup, added in
place of the heavier `@gsap/react` dependency (which would pull
`gsap`/`ScrollTrigger`/`SplitText` into the eager bundle instead of staying
lazy chunks).

Motion vocabulary (`components/motion/`), all writing to registered
`@property` CSS custom properties whose initial-value IS the at-rest
composition — so SSR/no-JS/reduced-motion/a blocked GSAP import all render
correctly with no second branch per component:

- `<ScrubReveal>` — reversible scroll-linked reveal (`--r`), the general
  replacement for `MotionSection`'s one-shot fade.
- `<RuleDraw>` — a rule drawing in from an edge (or, on CLOSE, outward from
  centre) as its own `ScrollTrigger` progresses.
- `<Stagger>` — scrubbed reveal across N children with per-child bands,
  one shared `ScrollTrigger` rather than N independent ones.
- `<RakingSurface>` — unifies `.light-pass`'s `--sweep` driver onto one
  source (each surface's own transit through the viewport) instead of the
  three independent sources (pointer/pin-progress/element-transit) that
  predated this pass.
- `<Magnetic>` (`components/motion/magnetic.tsx`) — reuses
  `rubberband()`/`SPRING_MOMENTUM` from `lib/motion.ts`; wraps CTAs and
  interactive buttons site-wide, homepage and inner pages alike.
- `<LineReveal>` (`components/motion/line-reveal.tsx`) — GSAP `SplitText`
  (`type:"lines", mask:"lines", autoSplit:true`) + a one-shot or `scrub`-mode
  `ScrollTrigger`, for section headlines site-wide. SSR ships the plain
  headline; `SplitText` mutates after paint. Its tween is now built inside
  `SplitText`'s `onSplit` callback (was outside it — a re-split from a
  font-load or resize could previously strand a heading mid-reveal).
- `<SplitReveal>` (`components/motion/split-reveal.tsx`) — the OPEN hero's
  "MaCo" wordmark only: GSAP `SplitText` (`type:"chars", mask:"chars"`)
  stagger-rises the characters on mount, then reverts to plain text and adds
  `.maco-shine` — a continuous `background-clip:text` gradient animated on
  `background-position`, at 115°, the same angle `.light-pass` uses
  everywhere else, so the hero ties into MaCo's one signature device instead
  of importing an unrelated shimmer.

`MotionSection` has exactly one remaining call site on the homepage
(`method-line.tsx`'s reduced-motion static branch, inert by construction) —
every other homepage call site migrated to the vocabulary above during the
2026-08-19 motion rebuild.

**Removed the same day, after live-browser verification** (were never
verified in a browser before this pass — see `AI_HANDOFF.md`): the raw-WebGL2
cursor-reactive hero field (`<FieldCanvas>`), the hover-distortion shader
(`<DistortSurface>`, PRODUCTS/EVIDENCE), the blend-difference cursor
companion (`<CursorRing>`), and text-scramble hovers (`<Scramble>`). All four
`components/webgl/*` files and `cursor-ring.tsx`/`motion/scramble.tsx` are
deleted, not just unmounted — grep for `FieldCanvas`/`DistortSurface`/
`CursorRing`/`Scramble` in `frontend/src` returns nothing. `data-cursor="…"`
attributes were removed alongside `<CursorRing>` since nothing reads them now.

`<ScrollRuntimeProvider>` is global chrome (site-wide, not homepage-only); the
pinned/scrubbed scenes (EVIDENCE/WORK/METHOD/PRODUCTS) stay homepage-only.
`<LineReveal>`/`<Magnetic>` are now used on every inner route too (`about`,
`clients`, `products.index`/`$slug`, `services.index`/`$slug`, `work.index`/
`$slug`, `contact`) — see `AI_HANDOFF.md` for the full per-route list.

### `system-field.tsx`

6×8-cell grid forming logo-derived geometry. Retired from the homepage in the reset but still imported by `/about` and `/products/$slug` — do not delete.

---

## 11. React Bits policy

Official catalogue: [https://reactbits.dev/](https://reactbits.dev/)

| Policy | Detail |
|--------|--------|
| Use | Take the *technique*, not the file — reimplement on the installed `motion` stack |
| Free vs Pro | Never copy Pro-locked preview code |
| Density | One major signature device reused at scale, not one-off decorations per section |

### Techniques adopted (concept only, reimplemented on `motion`/GSAP)

- `ScrollExpand` → EVIDENCE's clip-path expand
- `Split Text` → the OPEN hero wordmark's char-rise entrance (`<SplitReveal>`, GSAP `SplitText`)
- `Shiny Text` → the OPEN hero wordmark's idle rake (`.maco-shine`, `background-clip:text`)
- `Magnet` → `<Magnetic>`, now applied site-wide (CTAs, chrome)

### Rejected

- `ogl`-dependent components (`CircularGallery`, `FlyingPosters`, and — 2026-08-19 — GradientBlinds) — never installed; where the technique is worth keeping, it's reimplemented on `three` (already a dependency) instead, e.g. `<BlindsField>` below.
- DotGrid, Particles, Aurora, LetterGlitch, FaultyTerminal, all background-effect components — this is precisely the decorative language the reset removed.
- R3F (`@react-three/fiber`) — both `three` consumers (`<BlindsField>` on the homepage, `MaCoGlobe` on `/about`) use raw `three` directly.

### Adopted, then reverted the same day — WebGL field, cursor ring, text scramble (2026-08-18)

The Immersive Motion Rebuild (below) shipped a raw-WebGL2 cursor-reactive hero
field, a hover-distortion shader, a blend-difference cursor-ring companion,
and text-scramble hovers — reimplemented from React Bits/CodeGrid-style
techniques with **0KB dependency cost** (hand-written WebGL2, no `three`). All
four were still deleted the same day, once actually driven in a browser: the
combination read as a generic agency template
(user's reference: `evirexsoft.com`), not as MaCo. This was a design verdict,
not a technical failure — the code worked, `tsc`/`eslint`/`build` were clean,
the shaders rendered correctly. "Zero dependency cost" does not by itself
justify keeping a device; it still has to earn its place on the actual page.
Lenis and GSAP `ScrollTrigger`/`SplitText` were kept — those were judged to
still be working (the pins/scrubs/reveals), unlike the four decorative
devices layered on top of them.

### Adopted, third attempt — `<BlindsField>` on OPEN (2026-08-19, same day as the motion rebuild)

Unlike the 2026-08-18 revert above, this one shipped as `three`-backed (not
"0KB dependency cost" hand-written WebGL2 — the prior devices' zero-cost
framing didn't save them anyway, see the verdict above), scoped to one
section only, and live-verified via Playwright before being called done.
See the dedicated note under §4 and `AI_HANDOFF.md` for the full record.
The rule this section's verdict established — a device has to earn its
place on the actual page, dependency cost or not — still applies; this is
a different device on a different section, not a re-litigation of the
2026-08-18 verdict.

### Adopted after reconsideration — GSAP + Lenis (Immersive Motion Rebuild, 2026-08-18)

The homepage reset originally rejected GSAP/Lenis as new dependencies —
`useScroll`/`useTransform` covered the same ground for free. That held until
this pass, where the user explicitly chose the full immersive rebuild (Lenis
smooth scroll + GSAP `ScrollTrigger`/`SplitText` for every pinned/scrubbed
scene) after I recommended a lighter, dependency-free alternative instead.
Confirmed free for commercial use (GSAP 3.15 — ScrollTrigger + SplitText
included, no Club GSAP paywall; Lenis 1.3 — MIT). Also confirmed Lenis drives
real `window.scrollTo` rather than a transform-wrapper (unlike Locomotive
Scroll v4), so `position:sticky` and `motion`'s own hooks keep working — the
risk that blocked this option earlier was not real.

**Net new dependencies from the reset: `gsap`, `lenis`.** Measured cost from a
real `npm run build` (client, gzip), re-measured 2026-08-18 after the WebGL/
cursor/scramble revert: `lenis` 5.39 KB, `scroll-runtime` (the shared
singleton module) 5.39 KB, `gsap` core 27.42 KB, `ScrollTrigger` 17.54 KB,
`SplitText` 3.26 KB — all in dynamic chunks fetched after first paint (LCP
unaffected). The homepage's *eager* entry chunk is **141.96 KB gzip**
(452.03 KB raw) — down from the immersive-rebuild peak of 148.61 KB now that
`FieldCanvas`/`DistortSurface`/`CursorRing`/`Scramble` and their shader
strings are gone, but still above the pre-rebuild 106 KB, since Lenis/GSAP
glue code and the new hero/working-surface components remain.

**2026-08-19 addendum:** `<BlindsField>` (§4, §10) adds no new eager weight
either — the homepage entry chunk is still 141.93 KB gzip — but `three`
itself (561 KB / 141 KB gzip, previously `/about`-only via `MaCoGlobe`) is
now also fetched, as its own dynamic chunk, on the homepage's first paint
of OPEN. Not free; accepted as the cost of reusing an installed WebGL
runtime instead of adding `ogl` as a second one.

### `components/ui/` (46 shadcn files)

Dead code — not imported anywhere in the current homepage or other routes checked. Deliberately **not deleted**: purging them and their ~35 dependencies is an infrastructure project orthogonal to a homepage redesign. Logged as an explicit follow-up in the plan's risk register, not silently ignored.

---

## 12. Motion system

House style (from `apple-design` guidance, adopted as the project's motion rules):

| Use | Mechanism |
|---|---|
| Default UI | `motion` spring, `bounce: 0`, `duration: 0.4` (critically damped) — `SPRING_DEFAULT` in `lib/motion.ts` |
| Momentum (gesture carried velocity) | `motion` spring, `bounce: 0.2`, `duration: 0.4` — `SPRING_MOMENTUM`, used by `<Magnetic>` and the pointer-release moments it targets |
| Scroll position | **Lenis** — the single source of truth for scroll; nothing else smooths it a second time |
| Pins, scrubs, line reveals | **GSAP `ScrollTrigger`**, `scrub: 0.3` (a touch of ScrollTrigger's own internal easing — deliberately not `motion`'s `useSpring`, which is what caused the double-smoothing bug this pass fixed) |
| 2D pointer tracking (`<Magnetic>`, `usePointerField` tilt/watermarks) | Two **independent** critically-damped springs, one per axis — never a single spring on a 2D distance (apple-design rule) |

**Ownership is a hard split, not a layering**: Lenis owns scroll position, GSAP
`ScrollTrigger` (via `useScrollScene()`, §10) owns everything scroll-linked —
now all 10 homepage sections, not the 4 that had pins before 2026-08-19 —
`motion` v13 owns only discrete UI state (hover springs; IDENTITY's reel was
moved OFF `motion`/`setInterval` onto a scroll-driven `--t` custom property
this pass) and never touches scroll. See §10's "Scroll substrate & interaction
layer" for the concrete file list — there is no WebGL layer in the current
build (removed 2026-08-18, see §11). One motion-preference resolver now
governs both `getScrollRuntime()` and `useReducedMotion()`
(`resolveMotionPreference()` in `lib/motion.ts`, layering a
`?motion=full|reduced` override, persisted to `localStorage`, over
`prefers-reduced-motion`) — previously these ran two independent `matchMedia`
calls that could disagree. Rules unchanged: animate `transform`/`opacity`
only; no animated `filter: blur()` (a real violation — IDENTITY's old reel had
one — found and removed this pass); every animation starts from its live
presentation value, never a jump to target; nothing purely decorative.

---

## 13. Accessibility & reduced motion

- Skip link in root, `:focus-visible` outline (verified present via computed style on the active element)
- `useReducedMotion()` — 17+ consumers; every cinematic homepage moment (EVIDENCE, WORK's rail, IDENTITY's cycle, OPEN's tilt) branches on it with a **designed static fallback**, not just a disabled animation
- Mobile nav (`MobilePillNav`, `chrome.tsx`): real focus trap (Tab/Shift+Tab wrap), Escape, backdrop click-to-dismiss — verified via real keyboard-driven interaction
- IDENTITY's cross-fading word carries a correct BCP-47 `lang` attribute per script plus a `sr-only` full listing

---

## 14. How to run

### Frontend

```powershell
cd E:\Downloads\maco-website-v2\frontend
npm install
npm run dev
```

→ usually http://localhost:5173

### Backend

```powershell
cd E:\Downloads\maco-website-v2\backend
.\venv\Scripts\Activate.ps1
# ensure .env DATABASE_URL + DJANGO_SECRET_KEY
python manage.py migrate
python manage.py seed_content
python manage.py createsuperuser
python manage.py runserver 8000
```

→ Admin http://127.0.0.1:8000/admin/
→ API http://127.0.0.1:8000/api/v1/

Set `frontend/.env` (copy from `.env.example`) with `VITE_API_BASE_URL=http://localhost:8000` for the contact form to work locally.

### Vite note

Do **not** add a separate `TanStackRouterVite({ autoCodeSplitting: true })` alongside `tanstackStart()` — causes `TSRSplitComponent is not defined` 500s.

---

## 15. Environment variables

Backend — see `backend/.env.example`: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, `DEFAULT_FROM_EMAIL`, `LEAD_NOTIFICATION_EMAIL`.

Frontend — see `frontend/.env.example`: `VITE_API_BASE_URL`.

---

## 16. What must never be claimed falsely

Do not document as done unless verified:

- "Tested / responsive / accessible" → only if checks were actually run (see `AI_HANDOFF.md`'s "Tests / checks run" section for exactly what has and hasn't been verified)
- "Everything complete" → only if the roadmap phase is actually done, not just coded
- Any number or name on the homepage → must trace to `content/maco.ts`. This was the reset's second major finding: the pre-reset homepage shipped invented stats (`4 Products Deployed`, `2+ Years Engineering`) and a wrong client name (`HeadGreen Mobility`).

---

## 17. Related reading order for next AI

1. `HOMEPAGE_REDESIGN_PLAN.md` — the authoritative plan, if working on the homepage
2. `AI_HANDOFF.md` — live status, what was just verified vs. not
3. `PROJECT_STATUS.md`
4. `CONTEXT.md` (this file)
5. `ROADMAP.md`
6. `frontend/src/content/maco.ts`
7. `frontend/src/routes/index.tsx`, then `frontend/src/components/home/*`
8. `frontend/src/styles.css`
