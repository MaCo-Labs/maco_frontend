# MaCo Website — CONTEXT

Complete project context for developers and AI agents.
Last updated: 2026-08-30 (eleventh pass — `/about` SSR fix, semantic per-state cursor + footer torch, layout modes 2/3 rebuilt to match their references; see §4's adopt/reject log, the layout-modes subsection under §10, and `AI_HANDOFF.md`'s eleventh-pass entry). §11 below still documents the 2026-08-21 cleanup pass.

---

## 1. What this project is

**MaCo** is a software / IT solutions company based in **Kochi, Kerala, India**.

This repository is the **company website** (marketing + editorial surface) with:

- A **React 19 / TanStack Start** frontend
- A **Django REST + Admin** backend / CMS (content is read from `content/maco.ts` on the frontend, not fetched live — see §8)
- Two brand themes: **Obsidian** and **Cobalt**

The site must feel: premium, technical, distinctive, confident, humble, editorial, modern, memorable — while still reading as a real software company.

It must **not** feel like: generic AI SaaS, React Bits demo, Lovable template, Framer template, or WebGL showcase.

---

## 2. Non-negotiable principles

1. **Make MaCo look like MaCo** — React Bits (and any reference library) is a technique source, not the identity; take concepts, reimplement on the installed stack, don't copy files.
2. **Do not invent** projects, products, clients, testimonials, metrics, awards, or claims. Every number/name on the page must trace to `content/maco.ts`.
3. **Keep `SystemField`** (`components/system-field.tsx`) — retired from the homepage, but still imported by `/products/$slug`. Don't delete the file.
4. **Two themes must be genuinely different**, not a recolor — enforced via a full separate font set per theme (§9), not just accent-color swaps.
5. **Prefer restraint** — motion should serve reveal, hierarchy, continuity, feedback, or storytelling. Nothing purely decorative.
6. **Performance matters** — avoid unthrottled scroll/pointer listeners driving React state; prefer CSS custom-property writes and `gsap.quickSetter`.
7. **Accessibility** — honor `prefers-reduced-motion`; every cinematic moment needs a designed static fallback, not just a disabled animation.

---

## 3. Repository layout

```
maco-website-v2/
├── CONTEXT.md                   # This file — authoritative current-state reference
├── PROJECT_STATUS.md            # Done / not-done matrix
├── ROADMAP.md                   # What's left, in order
├── AI_HANDOFF.md                # Live status for the next AI session
├── HOMEPAGE_REDESIGN_PLAN.md    # Historical: the Aug 2026 plan that produced the current homepage
├── DOCS.md                      # Index of these docs
├── README.md                    # Setup instructions
├── AGENTS.md                    # AI agent operating instructions
├── docs/superpowers/            # Historical implementation plans/specs (dated, self-marked superseded/done)
├── frontend/                    # React app (TanStack Start)
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/              # the 11 homepage sections (see §10)
│   │   │   ├── media/              # SurfaceMedia, ProductVideo — media slots
│   │   │   ├── motion/              # ScrubReveal, Stagger, RuleDraw, Magnetic, LineReveal, SplitReveal, RakingSurface
│   │   │   ├── hero/MaCoGlobe.tsx   # react-globe.gl globe, /about only, lazy-loaded
│   │   │   ├── chrome.tsx           # header (fixed), footer, mobile pill nav
│   │   │   ├── scroll-runtime-provider.tsx  # Lenis/GSAP lifecycle owner (see §10)
│   │   │   ├── mark.tsx             # real logo mark (CSS mask + currentColor)
│   │   │   ├── system-field.tsx     # kept for /products/$slug only (§2 rule 3)
│   │   │   ├── globe-section.tsx    # lazy wrapper around MaCoGlobe, /about only
│   │   │   ├── motion-section.tsx   # legacy one-shot fade, used by inner routes
│   │   │   └── theme.tsx            # ThemeProvider / useTheme, radial clip-path theme wipe
│   │   ├── content/maco.ts        # sole content source of truth
│   │   ├── hooks/                 # use-scroll-scene, use-reduced-motion, use-pointer-field, use-media-query, use-script-fonts
│   │   ├── lib/                   # motion.ts (springs/easing), scroll-runtime.ts (Lenis+GSAP singleton), error handling, skip-to-main
│   │   ├── routes/                # file-based TanStack routes (see routes/README.md)
│   │   ├── styles.css             # design tokens + utilities, single CSS file
│   │   └── router.tsx / server.ts / start.ts
│   ├── public/                    # logo-mark.png, maco-mark-hero.png, favicon, geo data, media/
│   ├── scripts/build-media.mjs    # npm run media — regenerates public/media/ from raw source
│   ├── package.json
│   └── vite.config.ts
└── backend/                      # Django
    ├── maco/                      # settings, urls, wsgi
    ├── content/                   # models, API, admin, seed_content
    ├── manage.py
    ├── requirements.txt
    ├── .env.example
    └── venv/                      # local virtualenv (gitignored)
```

---

## 4. Tech stack

### Frontend (`frontend/package.json` — pruned 2026-08-21, see §11)

| Piece | Choice |
|-------|--------|
| Runtime | React 19.2 + React DOM 19.2 |
| Framework | TanStack Start 1.168 + TanStack Router 1.170, file-based routing |
| Server entry | `src/server.ts`, wired via `tanstackStart({ server: { entry: "./src/server.ts" } })` in `vite.config.ts` |
| SSR host | Nitro (devDependency) |
| Bundler | Vite 8.2 + `@vitejs/plugin-react` |
| Language | TypeScript 5.8, strict, `@/*` → `src/*` (Vite's built-in `resolve.tsconfigPaths`, not the `vite-tsconfig-paths` package) |
| Styling | Tailwind CSS v4 — CSS-first, no `tailwind.config.*`; all tokens/utilities live in the single `src/styles.css` via `@theme inline` / `@utility` / registered `@property` |
| Data (client) | TanStack Query (wired in root; no live queries — content is static from `content/maco.ts`) |
| Scroll substrate | **Lenis** — sole owner of scroll position (`src/lib/scroll-runtime.ts`, lazy singleton) |
| Scroll animation | **GSAP** `ScrollTrigger` + `SplitText`, entry point `hooks/use-scroll-scene.ts` |
| Discrete UI motion | **`motion` v13** (`motion/react`) — hover springs, `AnimatePresence` only, never scroll |
| 3D / WebGL | **`three`** (raw, no React-Three-Fiber) — `react-globe.gl` (`/about` only, lazy). OPEN's hero no longer uses WebGL (see §10) |
| Fonts | One combined Google Fonts CSS2 request in `__root.tsx`: Unbounded, Jost, Agdasima, Michroma, Tenor Sans, Krona One (split per theme, §9) — plus a lazy per-script font loader (`hooks/use-script-fonts.ts`) for multilingual glyphs |
| Media pipeline | `scripts/build-media.mjs` (`npm run media`), `ffmpeg-static` |
| Lint/format | ESLint 9 flat config + `typescript-eslint` + `eslint-plugin-react-hooks` + Prettier via `eslint-plugin-prettier` |
| Package manager | **`bun`** is canonical (`bunfig.toml`, `bun.lock` is the only lockfile tracked). `npm`/`bun` scripts are interchangeable for `dev`/`build`/`lint`. |
| Tests | **None.** No test runner, no test files. `bun run build` + `bun run lint` are the only gates. |
| Deployment config | **None in the repo.** No CI workflow, no `vercel.json`/`netlify.toml`/`amplify.yml`/`Dockerfile`. Deploy target is not yet decided. |

### Backend (`backend/`)

| Piece | Choice |
|-------|--------|
| Framework | Django 5.1 |
| API | Django REST Framework, base path `/api/v1/` |
| CORS | django-cors-headers |
| DB | PostgreSQL via `DATABASE_URL` |
| CMS | Django Admin |
| Seed | `python manage.py seed_content` |

Frontend and backend are only linked through the contact form (`VITE_API_BASE_URL` → `POST /api/v1/contact/`). All other content is compiled into the frontend bundle from `content/maco.ts`, not fetched from the API.

### Not installed (by design)

- Official React Bits npm bundle — concepts reimplemented on `motion`/GSAP/`three`, never copied verbatim
- `ogl` — the WebGL hero uses raw `three` (already a dependency for the globe) instead
- React-Three-Fiber — both `three` consumers use the raw API directly
- `zod`, `react-hook-form`, any Radix/shadcn primitive — removed 2026-08-21, see §11

### React Bits concept adopt/reject log

Per AGENTS.md §29 — recorded here, not scattered across other docs.

**2026-08-29, dark-first pass:**

- **Adopted — "Masked Heading" (video-in-text via SVG clipPath).**
  Reimplemented as `components/motion/masked-heading.tsx`: GSAP through
  `useScrollScene`, real content (`content/maco.ts`'s `heroLines`), real
  media (Bridge's own capture). No dependency added — SVG `<clipPath>` +
  `<text>` is a standard technique, not a library. Grades the video to
  `grayscale(1)` — the source footage contains a real amber UI badge
  (Bridge's "On Hold" status), a direct palette violation no filter math
  could safely avoid; only luminance/shape/motion crosses over. Backs
  onto the plain `display-glow` `<h1>` for SSR, first paint, and reduced
  motion — never the masked version in any of those three cases.
- **Adopted — custom cursor**, narrow scope per `AI_HANDOFF.md` #8's
  standing caution (custom cursor/WebGL work needs its own live go/no-go,
  given two earlier WebGL hero attempts were built and reverted for
  reading like a generic template). One ring, fine-pointer-only, off
  entirely under reduced motion, `mix-blend-mode: difference` against a
  plain white fill for ground/theme-agnostic contrast with zero
  per-section rules (`components/motion/cursor.tsx`).
- **Adopted, minimal — word-stagger text reveal.** Not a new component:
  a third `mode="words"` on the existing `LineReveal` (blur + short rise,
  GSAP SplitText on `type: "words"` instead of `"lines"`). Applied once
  — Overview's opening statement, the first thing after the hero — not
  scattered across headings; AGENTS.md's "not an animation gallery"
  caution applies to MaCo's own devices, not just imported ones.
- **Rejected — contextual/content-preview cursor** (Cuberto's own
  `cb-cursor` swaps in a media/text preview per hovered element).
  `docs/references/cuberto/NOTES.md` already flags the FULL contextual-
  cursor system as out of scope; this pass's cursor stays a plain ring.

**2026-08-30, eleventh pass:**

- **Adopted — semantic per-state cursor hooks**, generalizing the ninth
  pass's single-ring cursor per ROADMAP item 6 / `PHASE-2-MOTION-PLAN.md`
  item 2d, this pass's `AI_HANDOFF.md` #8 go/no-go. Studied from
  `docs/references/minhpham/NOTES.md`'s finding that a semantic
  class/attribute hook (one controller reads `.js-cursor-contract`/
  `-extend` off whatever's hovered) is "the most maintainable of the three
  cursor approaches" captured across the four reference sites. Implemented
  as a `data-cursor` attribute + resolved `data-state`
  (link/action/media/torch) in `components/motion/cursor.tsx`, painted
  from `var(--text)` (theme/ground-aware via the existing `[data-ground]`
  remap) instead of the old fixed `mix-blend-mode: difference`. **Ships
  behind `?v2=cursor` — not yet flipped to default.**
- **Adopted, narrow — footer torch.** `data-cursor="torch"` on the footer
  wordmark turns the cursor into the light source over that one zone — a
  radial gradient from `--sweep-light` (the existing signature light-pass
  token) in a `screen` blend, OS pointer hidden only inside the zone.
  Studied from iventions.com's footer wordmark treatment (the earlier
  cursor-following gradient trace was that study's first pass; this is
  the second, making the light source visibly the cursor itself, not just
  a moving highlight on the text). **Ships behind `?v2=torch`.**
- **Adopted — leading beam on layout mode 2's wipe**, studied from
  Iventions' own diagonal-wipe hamburger reveal (`docs/references/
  iventions/NOTES.md`). A skewed `--sweep-light` gradient band leads the
  existing clip-path wipe; Motion-variant staggered link entrance follows
  it. **Ships behind `?v2=nav2`.**
- **Adopted — layout mode 3 rebuilt as split edge rails**, correcting a
  prior build that used the same hamburger-overlay pattern as mode 2 —
  the opposite of by-kin.com / Minh Pham's actual "minor decorative
  elements at the screen edges instead of a full nav row." **Ships behind
  `?v2=nav3`**, desktop-only; falls back to mode 1's chrome below `lg`.

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

Source: `frontend/src/content/maco.ts` (mirrors the DRF schema). This is the only place copy facts may come from — see §2 rule 2.

### Services (2)

1. **Business Software** — `business-software` — Task Management, CRM, Custom Software
2. **Digital Solutions** — `digital-solutions` — Websites, E-commerce, Branding and Design, Social Media Management

### Projects / selected work (4)

1. **Ananta Nethralaya** — eye clinic website — `ananta-nethralaya`
2. **Al Afzah** — Qatar construction company website — `al-afzah`
3. **Soorath Autos** — used-car dealership website — `soorath-autos`
4. **HeadGreen** — EV fleet/cab service (Kochi) website — `headgreen`

### Products (2)

1. **Driver's Diary** — PWA/platform for HeadGreen ops (attendance, rides, payroll, docs, reporting) — `drivers-diary`
2. **Bridge** — MaCo's own SaaS/PWA + desktop task/project platform — `bridge` — gets the strongest treatment (EVIDENCE section + first PRODUCTS card, the only real video footage on the site)

### Clients (4 — names only)

Ananta Nethralaya (Healthcare) · Al Afzah Group WLL (Construction) · Soorath Autos (Automotive retail) · HeadGreen (EV mobility)

### Process steps

A Scope → B Model → C Build → D Hand over

---

## 7. Routes (frontend)

| Path | File | Purpose |
|------|------|---------|
| `/` | `routes/index.tsx` | Home — the 11-section homepage (§10) |
| `/services` | `services.index.tsx` | Services index |
| `/services/$slug` | `services.$slug.tsx` | Service detail |
| `/work` | `work.index.tsx` | Work index |
| `/work/$slug` | `work.$slug.tsx` | Case study |
| `/products` | `products.index.tsx` | Products index |
| `/products/$slug` | `products.$slug.tsx` | Product detail (uses `SystemField`) |
| `/clients` | `clients.tsx` | Clients |
| `/about` | `about.tsx` | About (uses `MaCoGlobe`/`GlobeSection`) |
| `/contact` | `contact.tsx` | Contact / lead — real POST, see §8 |
| `__root.tsx` | Shell, theme, pre-hydration theme script, fixed header/footer, SEO head links |

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

Writes (except contact) via Django Admin only. `frontend/.env.example` documents `VITE_API_BASE_URL=http://localhost:8000` — without it, the contact form errors loudly rather than silently discarding the submission.

---

## 9. Design system

### Themes

Stored in `localStorage` key `maco-theme`. Applied as `data-theme` on `<html>`, set pre-hydration by an inline script in `__root.tsx` so a returning Cobalt user never sees an Obsidian flash. Switching themes triggers a GSAP `clipPath: circle()` radial wipe from the click origin (`theme.tsx`).

Both themes share the same two-ground model (`data-ground="paper" | "deep"` on each section) — the difference between themes is the color mapping under each ground and, critically, a **completely different font set**.

### Typography

| Role | Obsidian | Cobalt |
|---|---|---|
| Display (`--maco-font-display`) | Unbounded | Michroma |
| Body (`--maco-font-body`) | Jost | Tenor Sans |
| Label (`--maco-font-label`) | Agdasima | Krona One |

Loaded via one combined Google Fonts request in `__root.tsx`. Michroma, Tenor Sans, and Krona One are single-static-weight families — don't request weight axes that don't exist for them.

### Structural utilities

`shell`, `rule-t` / `rule-b`, `label`, `display-hero|lg|md`, `lead`, `btn-solid`, `btn-line`, `link-draw`, `index-row`, `light-pass` (the signature raking-light device, driven by a `--sweep` custom property 0–1 — see §10).

### Brand assets (`frontend/public/`)

- `logo-mark.png` — the real mark, used by `Mark` via CSS `mask-image` everywhere in chrome (header/footer/nav)
- `maco-mark-hero.png` — the OPEN hero's larger mark, rendered via the same CSS-mask technique
- `favicon.png`
- `geo/countries-110m.geojson` — globe geometry, `/about` only
- `media/brand/*.webp` — client logos (6), referenced from `content/maco.ts`
- `media/bridge/*` — Bridge product video + poster, referenced from `content/maco.ts`

---

## 10. The homepage — 11 sections, Cuberto-parity structure

Composed in `routes/index.tsx`, built under `components/home/`, plus `<GroundHandoff>` (renders nothing — cross-section continuity, see below).

Rebuilt 2026-08-28 (plan "Cuberto-parity homepage rebuild") at the owner's explicit direction: a full structural clone of cuberto.com's homepage — section inventory, order, spacing/grid rhythm, hero shape and component layouts — wearing MaCo's Obsidian/Cobalt tokens, MaCo's six typefaces, and `content/maco.ts`'s real copy. Cuberto's own colour values, typefaces and copy were never used, not even temporarily — see the "CUBERTO-PARITY STRUCTURE" block at the top of `styles.css` and `docs/references/cuberto/skillui/`. This overrides the "don't rebuild the homepage" / "reference sites are technique-only" rules that stood in `AGENTS.md`, `ROADMAP.md` and every `docs/references/*/NOTES.md` before this date — see the dated entry in `AI_HANDOFF.md` for the full reasoning and what still doesn't override.

The eleven `aria-label`s are unchanged from the previous (pre-2026-08-28) architecture — same labels, new order, new component behind each one. `scripts/shoot.mjs`'s `SECTIONS` list reflects the new order.

| # | Section | Cuberto source | Ground | File | `aria-label` | Pin? |
|---|---|---|---|---|---|---|
| 1 | TOPHEAD | `cb-tophead` | deep | `top-head.tsx` | Introduction | no |
| 2 | PREVIEW | `cb-preview` | deep | `evidence-expand.tsx` | Bridge in motion | yes |
| 3 | OVERVIEW | `cb-overview` | paper | `overview.tsx` | What MaCo does | no |
| 4 | FEATURE | `cb-feature` | paper | `feature-accordion.tsx` | Capabilities | no |
| 5 | LOGOREEL | `cb-logoreel` | paper | `logo-reel.tsx` | Who we work with | no |
| 6 | SUMMARY (inverse) | `cb-summary.-inverse` | paper | `summary.tsx` (`FeaturedWork`) | Selected client work | no |
| 7 | SUMMARY | `cb-summary` | paper | `summary.tsx` (`ProductSummary`) | Products | no |
| 8 | OVERVIEW (2nd) | `cb-overview` | paper | `identity.tsx` | MaCo, in one name and many scripts | yes |
| 9 | SUMMARY (inverse) | `cb-summary.-inverse` | deep | `record.tsx` | About MaCo | no |
| 10 | FAQ (inverse) | `cb-faq.-inverse` | deep | `faq.tsx` | How MaCo works | no |
| 11 | OUTRO | `cb-outro` | deep | `outro.tsx` | Start a project | no |

Ground sequence: **deep deep · paper × 6 · deep deep deep**, footer also
deep — a three-act shape (dark open, paper middle, dark close), not
Cuberto's own alternation. Owner-directed 2026-08-28 (dark-first pass):
the page had opened on paper before this and closed on deep, which meant
Outro → Footer (both deep) had nothing marking the boundary while
TopHead → PREVIEW (paper → deep, the very first thing a visitor sees)
did. Only two `data-ground` values actually moved to get here — TOPHEAD
(paper → deep) and SUMMARY-inverse/`FeaturedWork` (deep → paper); every
other section was already on its target ground. Down from six ground
flips to two, both of which now land exactly on the page's two
pinned-outgoing boundaries (see `ground-handoff.tsx`'s `"sheet-only"`
mode, added the same pass to give a pinned-outgoing flip a sheet reveal
without the transform-on-a-pin hazard a recede would hit there).

Only two sections pin: PREVIEW (`evidence-expand.tsx`, pins its own `<section>`) and the 2nd OVERVIEW / IDENTITY (`identity.tsx`, same). Everything else is pin-free — a deliberate drop from the previous architecture's four pins (the retired `ServicesConvergence`, `ProductShowcase`-as-sticky-but-effectively-staged, and `MethodLine` are gone), which is also why the page is roughly one pinned viewport shorter than before.

Cuberto's measured rhythm, adopted as the `cb-*` utilities in `styles.css`: **108px (6.75rem)** section padding unit (`@utility cb-section`), **180px (11.25rem)** hero-only lead-in (`@utility cb-tophead`), radius scale `7.2px` / `1.6rem` / `2rem` / `1000px` (`--radius-chip/card/plate/pill`), and the accordion open/close transition taken verbatim off their stylesheet (`grid-template-rows .3s ease-out, opacity .4s ease-out` — `@utility cb-panel`).

### What each section does

- **TOPHEAD** (`top-head.tsx`) — Cuberto's actual opening shape: brand row (`<SplitReveal>` wordmark entrance), one large left-aligned `<h1>` (`site.tagline`), short subtext (`site.statement`) and the entry CTA, under `<RakingSurface>`. Replaces the previous full-viewport centred-logo OPEN section — the page now starts reading immediately instead of resolving to a brand lockup first.
- **PREVIEW** (`evidence-expand.tsx`, unchanged) — the page's one pinned cinematic set-piece: a clip-path frame locked to the video's real 16:9, grows to ~88vw on `ScrollTrigger` pin+scrub.
- **OVERVIEW** (`overview.tsx`) — Cuberto's `cb-overview` 2-col flex: positioning statement left, a counted `<dl>` of real figures (service/client/project/product counts, derived from `content/maco.ts` — never invented) plus a route to `/about` right.
- **FEATURE** (`feature-accordion.tsx`) — every capability across both service lines, flattened into one `<Accordion>` (`components/home/accordion.tsx`, shared with FAQ below), numbered rows, first row open, one open at a time. Replaces the previous two-card `ServicesConvergence` pin — Cuberto's homepage states its full capability range as one list, not two headline cards.
- **LOGOREEL** (`logo-reel.tsx`) — continuous CSS-only horizontal drift of client logo cards (`@utility cb-reel`, radius `--radius-chip`, edge-masked), the track duplicated and translated -50% for a seamless loop, `aria-hidden` on the duplicate half. Replaces the previous scroll-scrubbed scatter field (`client-field.tsx`) — a reel reads correctly at every viewport width with no separate mobile branch.
- **SUMMARY / FeaturedWork** (`summary.tsx`) — client platforms as a `cb-cards` grid (Cuberto's measured `450×608`-ish portrait plates), on deep ground. One `<Summary>` component, two call sites (here and PRODUCTS below) — matching Cuberto's own reuse of `cb-summary` twice.
- **SUMMARY / ProductSummary** (`summary.tsx`) — MaCo's own two products, same card shape, paper ground.
- **IDENTITY** (`identity.tsx`) — "One name. Many scripts." — a pinned, fully scroll-driven script dial, glyph position is pure CSS `calc(--i - --t)`, zero re-renders, correct `lang` per script. Ground flipped `deep` → `paper` in this pass to match Cuberto's own alternation. Script list curated from 13 to 10 in the 2026-08-29 tenth pass (English, Malayalam, Tamil, Telugu, Kannada, Hindi, Japanese, Korean, Arabic, Hebrew) and moved to `content/maco.ts` as `nameScripts` — the footer's compact strip (`chrome.tsx`) reads the same array, so the two can no longer drift apart the way the footer's old hand-written 7-item copy (which included Cyrillic, matching no client market) had.
- **RECORD** (`record.tsx`) — the page's one rest beat, About-only since 2026-08-28 (its client logo wall was consolidated into LOGOREEL, the single client display). Ground flipped `paper` → `deep` in this pass.
- **FAQ** (`faq.tsx`) — the same four-step process (A→D) as before, now through the shared `<Accordion>` on inverted ground, matching Cuberto's `cb-faq.-inverse`. Replaces the previous pinned `MethodLine` progress-spine.
- **OUTRO** (`outro.tsx`) — Cuberto's `cb-outro` 2-col grid: closing statement left, contact route right. Carries over the previous CLOSE section's `light-pass` sweep and centre-drawn `<RuleDraw>` — the one thing worth keeping from the section it replaces.

### Cross-section continuity — `GroundHandoff`

`components/home/ground-handoff.tsx`, mounted once after OUTRO, renders nothing. On 8 hand-picked boundary pairs, matched by `aria-label`, the outgoing section scales down/dims/lifts as the incoming section arrives; 3 of the 8 (each at a real ground flip) additionally get a curved-corner "sheet" reveal on the incoming side. Only pairs whose outgoing side is pin-free are eligible — a `transform` on the ancestor of a `position:fixed` pinned element repositions it relative to that ancestor instead of the viewport, so PREVIEW and IDENTITY (the only two sections that pin) can never be an outgoing side. See the file's own doc comment for the full derivation.

### `SurfaceMedia` (`components/media/surface-media.tsx`)

Three-tier media slot: tier 1 (video), tier 2 (image), tier 3 (designed fallback — a material gradient + `light-pass` + an honest caption naming what's missing).

### The light-pass device (`@utility light-pass`, `styles.css`)

One raking-light gradient (`::after`, `mix-blend-mode: overlay`) reused at multiple scales instead of a different decorative device per section. Position read from a `--sweep` CSS custom property (0–1).

### Scroll substrate & interaction layer

Ownership is split, not layered (see §12). **Lenis** owns raw scroll position (`src/lib/scroll-runtime.ts`, a lazy module-level singleton booted by `<ScrollRuntimeProvider>` in `__root.tsx`, `null` on the server or under reduced motion). **GSAP `ScrollTrigger`** owns every pin/scrub, on all 11 sections. `motion` v13 keeps only discrete UI state (hover springs) and never touches scroll.

`hooks/use-scroll-scene.ts` is the standard entry point for any scroll-linked component — wraps `gsap.context()` for auto-cleanup.

Motion vocabulary (`components/motion/`), all writing to registered `@property` CSS custom properties whose initial value IS the at-rest composition:

- `<ScrubReveal>` — reversible scroll-linked reveal, the general replacement for `MotionSection`'s one-shot fade
- `<RuleDraw>` — a rule drawing in from an edge (or, on CLOSE, outward from centre)
- `<Stagger>` — scrubbed reveal across N children, one shared `ScrollTrigger`
- `<RakingSurface>` — unifies `.light-pass`'s `--sweep` driver onto one source
- `<Magnetic>` — pointer-lean wrapper for buttons/links, `rubberband()`/`SPRING_MOMENTUM`
- `<LineReveal>` — GSAP `SplitText` line-mask headline reveal, for section headlines site-wide
- `<SplitReveal>` — the OPEN hero wordmark only, char-rise on mount then `.maco-shine`

`MotionSection` has no homepage call site as of the 2026-08-28 Cuberto-parity rebuild (its one prior use, `method-line.tsx`'s reduced-motion branch, was retired with that file); it's still used across the 7 inner routes.

### First-paint preloader & layout modes (`components/preloader.tsx`, `components/layout-mode.tsx` — 2026-08-29, tenth pass)

Both mount in `__root.tsx`, both site-wide (not homepage-specific), both follow theme.tsx's anti-FOUC shape: a pre-paint `<script>` in `RootShell` stamps the relevant `data-*` attribute on `<html>` before hydration, so there's no flash either way.

**Preloader** — a percentage ring around `<Mark>`, `data-ground="deep"` always (the page opens dark), progress on `--focus` rather than `--accent` (near-white on deep ground in both themes — same reasoning as the hero utilities in §10). A GSAP proxy tween runs toward a 92 ceiling (not 100 — see `preloader.tsx`'s own comment for why a tween that reaches 100 on its own schedule breaks the illusion once real loading outruns it) over ~1.6s; once web fonts and the hero's poster image actually resolve, the remainder snaps to 100 in 0.25s. Skips itself (via the pre-paint script's `data-preload="skip"`) under reduced motion or once already shown this session (`sessionStorage`).

**Layout modes** — a `data-layout="1"|"2"|"3"` switcher (`LayoutProvider`/`useLayout`, small numbered control in `chrome.tsx`'s header), persisted via `localStorage["maco-layout"]`, with a non-persisting `?layout=` URL override for previews. Mode 1 is the site as built above. Both modes 2 and 3 replace the header's desktop link row and CTA with a hamburger → full-screen overlay (`FullScreenNav`'s trigger/panel split in `chrome.tsx`, `[data-layout]`-scoped CSS in `styles.css`) — chrome-wide. The overlay panel must render as a `<header>` sibling, never a descendant — nesting it inside `<header>` was tried first and inherited the header's own `.chrome-adaptive[data-over]` ground-remap, inverting each theme's accent colour.

Mode 2 (Iventions' hamburger + diagonal wipe) and mode 3 (Minh Pham / by-kin.com) were both rebuilt 2026-08-30 (eleventh pass) — see `AI_HANDOFF.md`'s eleventh-pass entry and `docs/references/{iventions,minhpham}/NOTES.md`:

- **Mode 2** gains a leading light beam (`--sweep-light`, skewed, `Motion`'s own `skewX` style value — a raw CSS `transform` string is silently dropped once Motion is also animating `x` on the same element) and staggered link entrance, on top of the diagonal clip-path wipe that already worked. **Behind `?v2=nav2`.**
- **Mode 3** was rebuilt from scratch — it previously used the same hamburger-overlay pattern as mode 2, the opposite of its own reference. Now splits nav content to both screen edges (`.header-nav-row` as a left rail, `.header-control-cluster` as a right rail — two stable classNames added to the header's JSX for this, not `:first-child`/`:last-child`) with `TopHead` centred between, desktop (`lg+`) only. Below `lg` it falls back to mode 1's own chrome (wordmark + the existing bottom pill nav) rather than a hamburger, since two vertical rails don't fit a 390px phone. **Behind `?v2=nav3`.**

Both remain behind the `?v2=` preview flag (same non-persisting URL-override shape as `?layout=`/`?motion=`, added to the same pre-paint script in `__root.tsx`) as of this writing — not yet flipped to default. Mode 1 and the un-rebuilt structure of modes 2/3 (hamburger + overlay, minus the beam/rails) are unaffected by the flag either way.

**Cursor** (`components/motion/cursor.tsx`) also gained a semantic per-state system this same pass — see §4's adopt/reject log above for the full writeup. Ships behind `?v2=cursor`/`?v2=torch`.

### `system-field.tsx`

6×8-cell grid forming logo-derived geometry. Retired from the homepage, still imported by `/products/$slug` only (§2 rule 3).

---

## 11. Cleanup pass (2026-08-21)

The codebase and docs had drifted apart over several redesign passes — components got replaced (`BlindsField`→`PrismField`, `PortfolioGrid`/`ProductStory`→`WorkReveal`/`ProductShowcase`, `ScrollThread` built-then-reverted) without doc updates, and a full shadcn/Radix scaffold was installed early on and never wired in. This pass:

**Deleted (dead code, ~52% of source files):**
- `components/ui/` — 47-file shadcn/Radix scaffold, zero imports from any route or app component
- `hooks/use-mobile.tsx`, `lib/utils.ts` — only consumed by the dead `ui/` tree
- `components/theme-atmosphere.tsx`, `lib/read-css-color.ts` — orphaned by earlier component swaps
- `components.json`, `maco-21st-theme.css` — shadcn/21st.dev config for the now-deleted `ui/` tree
- `scripts/shrink-hero-mark.cjs` — one-off script, output already committed
- Dead exports in `lib/motion.ts` (`clamp`, `project`, `SPRING_DEFAULT`, `SPRING_REEL`, `EASE_STANDARD`, `EASE_EMPHASIS`) and `hooks/use-script-fonts.ts` (`useScriptFonts`)
- 10 unused raw client-logo PNGs/JPGs in `public/` (superseded by `public/media/brand/*.webp`) + 1 byte-identical duplicate

**Pruned:** 45 of 52 `package.json` dependencies (everything that only the dead `ui/` tree used — all Radix packages, `zod`, `react-hook-form`, `recharts`, `cmdk`, `vaul`, `sonner`, `date-fns`, etc.)

**Untracked from git (kept on disk where needed as build input):** `.playwright-cli/` verification dumps (both root and `frontend/`), `frontend/package-lock.json` (duplicate of `bun.lock`), `frontend/src/assets/Bridge Demo.mp4` (36MB raw video, ffmpeg input for `scripts/build-media.mjs` — its 780KB output in `public/media/` is what ships)

**Verified:** `bun run build`, `bun run lint`, and `tsc --noEmit` all pass after every deletion (one pre-existing `tsc` error in `MaCoGlobe.tsx` unrelated to this pass, left alone).

---

## 12. Motion system

House style: critically-damped by default, momentum only when a gesture carried velocity, transform/opacity only.

| Use | Mechanism |
|---|---|
| Default UI | `motion` spring, `bounce: 0`, `duration: 0.4` |
| Momentum (gesture carried velocity) | `motion` spring, `bounce: 0.2`, `duration: 0.4` — `SPRING_MOMENTUM` in `lib/motion.ts`, used by `<Magnetic>` |
| Scroll position | **Lenis** — the single source of truth; nothing else smooths it a second time |
| Pins, scrubs, line reveals | **GSAP `ScrollTrigger`**, `scrub: 0.3` |
| 2D pointer tracking | Two independent critically-damped springs, one per axis — never a single spring on a 2D distance |

**Ownership is a hard split, not a layering**: Lenis owns scroll position, GSAP `ScrollTrigger` (via `useScrollScene()`) owns everything scroll-linked, `motion` owns only discrete UI state and never touches scroll. One motion-preference resolver governs both `getScrollRuntime()` and `useReducedMotion()` (`resolveMotionPreference()` in `lib/motion.ts`, layering an optional `?motion=full|reduced` override, persisted to `localStorage`, over `prefers-reduced-motion`). Rules: animate `transform`/`opacity` only; no animated `filter: blur()`; every animation starts from its live presentation value, never a jump to target; nothing purely decorative.

---

## 13. Accessibility & reduced motion

- Skip link in root, `:focus-visible` outline
- `useReducedMotion()` — every cinematic homepage moment branches on it with a designed static fallback, not just a disabled animation
- Mobile nav (`MobilePillNav`, `chrome.tsx`): real focus trap (Tab/Shift+Tab wrap), Escape, backdrop click-to-dismiss
- IDENTITY's cross-fading word carries a correct BCP-47 `lang` attribute per script plus a `sr-only` full listing

---

## 14. How to run

### Frontend

```powershell
cd E:\Downloads\maco-website-v2\frontend
bun install
bun run dev
```

→ http://localhost:5173

### Backend

```powershell
cd E:\Downloads\maco-website-v2\backend
.\venv\Scripts\Activate.ps1
# ensure .env has DATABASE_URL + DJANGO_SECRET_KEY
python manage.py migrate
python manage.py seed_content
python manage.py createsuperuser
python manage.py runserver 8000
```

→ Admin http://127.0.0.1:8000/admin/
→ API http://127.0.0.1:8000/api/v1/

Set `frontend/.env` (copy from `.env.example`) with `VITE_API_BASE_URL=http://localhost:8000` for the contact form to work locally.

### Vite note

Do **not** add a separate `TanStackRouterVite({ autoCodeSplitting: true })` alongside `tanstackStart()` — the router plugin is already bundled in; adding it separately causes `TSRSplitComponent is not defined` 500s.

---

## 15. Environment variables

Backend — see `backend/.env.example`: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, `DEFAULT_FROM_EMAIL`, `LEAD_NOTIFICATION_EMAIL`.

Frontend — see `frontend/.env.example`: `VITE_API_BASE_URL`.

---

## 16. What must never be claimed falsely

Do not document as done unless verified:

- "Tested / responsive / accessible" → only if checks were actually run
- "Everything complete" → only if actually done, not just coded
- Any number or name on the homepage → must trace to `content/maco.ts`. The pre-reset homepage once shipped invented stats and a wrong client name — never repeat that.

---

## 17. Related reading order for next AI

1. `CONTEXT.md` (this file) — current state
2. `PROJECT_STATUS.md` — what's done vs. not
3. `ROADMAP.md` — what's left
4. `AI_HANDOFF.md` — latest session notes
5. `frontend/src/content/maco.ts`
6. `frontend/src/routes/index.tsx`, then `frontend/src/components/home/*`
7. `frontend/src/styles.css`
