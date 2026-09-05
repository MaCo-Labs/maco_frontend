# MaCo Website — CONTEXT

Complete project context for developers and AI agents.
Last updated: 2026-09-05, later pass (contact/client/fix pass — real contact
email `info@maco.codes` + three phone numbers wired into `/contact` and the
footer; a 5th client/project, **Ozone Fitout & Contracting W.L.L.**, added as
a brochure-only engagement with no live site, which made `Project.external_url`
and `Client.website` optional across the codebase — see §6; Soorath Autos's
upscaled logo re-keyed to remove a baked-in solid-black background via a
screen/un-premultiply pass; the `SystemField` grid mark removed from `/about`'s
intro (was never load-bearing content, just decoration); `.ambient-field`'s
Cobalt-only stronger blue glow override deleted so both themes render the same
restrained intensity; and every "the Gulf" reference in visible copy renamed
to "the Middle East"). See `AI_HANDOFF.md`'s matching entry for full detail.
Layered on the prior 2026-09-04/05 ambient motion pass — scrub timing retuned on
6 reveal primitives so reveals carry a beat past the wheel stop; a new
CSS-only `ambient-field` breathing layer on OVERVIEW/FEATURE/FAQ/IDENTITY;
`MorphSlider` moved off its own `requestAnimationFrame` onto the shared
`gsap.ticker`; a `--vel` scroll-velocity custom property; a new ogl-shader
`<AmbientCanvas>` FBM-noise layer on OVERVIEW/FAQ/IDENTITY — plus a small
layout-3 "Menu" hint pointing at EdgeNav's dot rail, and the native
scrollbar hidden site-wide). See `AI_HANDOFF.md`'s matching entry for full
detail. Layered on the prior 2026-09-04 premium motion & interaction pass
(`DepthCarousel`/`RakingSurface` deleted along with dead CSS/exports;
TOPHEAD lost its cycling taglines for one statement, its backlight now
tracks the pointer, and its masked-video wipe now waits for the preloader's
Enter click; GroundHandoff's fades lightened, its ground-flip sheet settles
earlier in the scroll range; CAPABILITY's inverted panel actually lights on
open now; IDENTITY's pinned dial scaled up as that pass's one signature
set-piece) and the same-day earlier real-media pass (every WORK card
crossfades real client-site screenshots via a WebGL `MorphSlider`, Driver's
Diary got a real on-device screen recording in a `PhoneMockup`, small
brand-logo chips on WORK/PRODUCTS cards and `/clients`, per-theme lazy font
loading). A further 2026-09-05 pass — **not the homepage** — elevated
`/services/$slug` (capability-row hover, an Evidence-grid mouse-tracked
spotlight) and `/about` (a new Origin narrative, an 8-person Team grid,
`MaCoGlobe` retargeted to 5 real operational hubs); see §4's adopt/reject
log and §6's content catalog for detail. **All four passes are
uncommitted** — see `git status`/`git diff`
for the exact file list; everything through `f3f83de` (2026-09-03, "Fix
body backdrop lag") is committed history. §11 below still documents the
2026-08-21 cleanup pass.

---

## 1. What this project is

**MaCo** is a software / IT solutions company based in **Kochi, Kerala, India**.

This repository is the **company website** (marketing + editorial surface) with:

- A **React 19 / TanStack Start** frontend — this repo is frontend-only for now
- A **Django REST + Admin** backend / CMS, moved to `../maco-backend` for future use (content is read from `content/maco.ts` on the frontend, not fetched live — see §4, §8)
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
│   │   │   ├── media/              # SurfaceMedia, ProductVideo, MorphSlider (lazy-mounted WebGL), PhoneMockup — media slots
│   │   │   ├── motion/              # ScrubReveal, Stagger, RuleDraw, Magnetic, LineReveal, Cursor
│   │   │   ├── nav/edge-nav.tsx     # EdgeNav — layout mode 3's dot wayfinding, mounted directly in __root.tsx (see §10)
│   │   │   ├── hero/MaCoGlobe.tsx   # react-globe.gl globe, /about only, lazy-loaded
│   │   │   ├── chrome.tsx           # header (fixed), footer, mobile pill nav, all three layout-mode overlays
│   │   │   ├── scroll-runtime-provider.tsx  # Lenis/GSAP lifecycle owner (see §10)
│   │   │   ├── mark.tsx             # real logo mark (CSS mask + currentColor), cropped-aspect-aware (§9)
│   │   │   ├── system-field.tsx     # kept for /products/$slug only (§2 rule 3)
│   │   │   ├── globe-section.tsx    # lazy wrapper around MaCoGlobe, /about only
│   │   │   ├── motion-section.tsx   # legacy one-shot fade, used by inner routes
│   │   │   └── theme.tsx            # ThemeProvider / useTheme, radial clip-path theme wipe
│   │   ├── content/maco.ts        # sole content source of truth
│   │   ├── hooks/                 # use-scroll-scene, use-reduced-motion, use-pointer-field, use-media-query, use-script-fonts
│   │   ├── lib/                   # motion.ts (springs/easing), scroll-runtime.ts (Lenis+GSAP singleton), ground.ts (shared groundAt/SECTION_SELECTOR resolver, see §10), fonts.ts (per-theme lazy Google Fonts loader, see §9), error handling, skip-to-main
│   │   ├── routes/                # file-based TanStack routes (see routes/README.md)
│   │   ├── styles.css             # design tokens + utilities, single CSS file
│   │   └── router.tsx / server.ts / start.ts
│   ├── public/                    # logo-mark.png (the one canonical mark, cropped 2026-09-02), favicon, geo data, media/
│   │   └── media/                 # brand/ (client + product logos), work/<slug>/N.webp (real site screenshots, 4 clients), products/drivers-diary/screen.{mp4,webm}+poster (real on-device recording), bridge/
│   ├── scripts/build-media.mjs    # npm run media — regenerates public/media/ from raw source
│   ├── scripts/convert-work-shots.mjs      # one-off: sharp-resizes raw WORK screenshots (src/assets/*.png) into public/media/work/<slug>/N.webp
│   ├── scripts/convert-product-video.mjs   # one-off: ffmpeg crop/scale/mux of Driver's Diary's raw screen capture into the PhoneMockup's webm+mp4
│   ├── package.json
│   └── vite.config.ts
```

Backend (Django) moved to `../maco-backend`, sibling folder outside this
repo — untracked here, kept for future use. This repo is frontend-only.

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
| 3D / WebGL | **`three`** (raw, no React-Three-Fiber) — `react-globe.gl` (`/about` only, lazy) — **plus `ogl`** (added 2026-09-04), a second, much lighter WebGL runtime used only by `MorphSlider`'s shader-morph card gallery (§10); `three` and `ogl` never render into the same canvas |
| Fonts | Two separate Google Fonts CSS2 requests, split by theme (2026-09-04 rewrite — see §9 "Font loading"): Obsidian's set (Unbounded/Jost/Agdasima) loads eagerly, statically, in `__root.tsx`'s `head()`; Cobalt's set (Michroma/Tenor Sans/Krona One) loads on demand via `lib/fonts.ts`'s `ensureCobaltFonts()`, never both for every visitor — plus a lazy per-script font loader (`hooks/use-script-fonts.ts`) for multilingual glyphs |
| Media pipeline | `scripts/build-media.mjs` (`npm run media`), `ffmpeg-static` — plus two 2026-09-04 one-off conversion scripts (`convert-work-shots.mjs` via `sharp`, `convert-product-video.mjs` via `ffmpeg-static`) that produced the real WORK screenshots and Driver's Diary screen recording now checked into `public/media/` |
| Lint/format | ESLint 9 flat config + `typescript-eslint` + `eslint-plugin-react-hooks` + Prettier via `eslint-plugin-prettier` |
| Package manager | **`bun`** is canonical (`bunfig.toml`, `bun.lock` is the only lockfile tracked). `npm`/`bun` scripts are interchangeable for `dev`/`build`/`lint`. |
| Tests | **None.** No test runner, no test files. `bun run build` + `bun run lint` are the only gates. |
| Deployment config | **None in the repo.** No CI workflow, no `vercel.json`/`netlify.toml`/`amplify.yml`/`Dockerfile`. Deploy target is not yet decided. |

### Backend — moved out (`../maco-backend`)

Django 5.1 + DRF (base path `/api/v1/`) + django-cors-headers + PostgreSQL
+ Django Admin CMS. Not part of this repo currently; moved to a sibling
folder for future use. When it existed, frontend and backend were only
linked through the contact form (`VITE_API_BASE_URL` → `POST /api/v1/contact/`).
All other content is compiled into the frontend bundle from `content/maco.ts`,
never fetched from an API. With `VITE_API_BASE_URL` unset, the contact form
shows a mailto fallback instead of posting (see §8, §14).

### Not installed (by design)

- Official React Bits npm bundle — concepts reimplemented on `motion`/GSAP/`three`/`ogl`, never copied verbatim
- React-Three-Fiber — every `three`/`ogl` consumer uses its raw API directly
- `zod`, `react-hook-form`, any Radix/shadcn primitive — removed 2026-08-21, see §11

`ogl` **is** now installed (2026-09-04) — see the 3D/WebGL row above. It is
intentionally a second WebGL runtime alongside `three`, not a replacement:
`three` stays for the globe (`/about`); `ogl` now backs two consumers,
`MorphSlider` (chosen originally because it's a far smaller runtime than
`three` for "render two textured quads and cross-fade them," and it's what
React Bits' own upstream `MorphSlider` already used) and, as of the
2026-09-04/05 ambient motion pass, `<AmbientCanvas>` (§10) — a single FBM
noise shader reused as OVERVIEW/FAQ/IDENTITY's at-rest ambient layer,
chosen for the same "already bundled, no new dependency" reasoning rather
than pulling in a shader library.

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

**2026-09-01, chrome/motion/reveal pass:**

- **Adopted — FEATURE's scroll-driven sequential reveal**
  (`components/home/feature-scroll.tsx`), studied from cuberto.com's own
  `cb-feature` (its raw per-row `-bg`/`-fill` layers, per
  `docs/references/cuberto/skillui/`, were not reproduced — only the
  reveal mechanism was: rows expand in sequence as they cross the top of
  the viewport, no click, and stay expanded as later rows take their
  turn). Reimplemented on this project's own stack — one `ScrollTrigger`
  through `useScrollScene`, `data-open` written on plain refs in
  `onUpdate` — reusing `Accordion`'s existing `cb-panel` CSS and
  `panel="inverted"` card markup rather than adding a new visual
  language. `Accordion` itself is untouched; FAQ's click/single-open
  behavior is unaffected. Reduced motion falls back to the existing click
  `<Accordion>` (`feature-accordion.tsx` branches on `useReducedMotion()`)
  — ships to everyone, no preview flag, since it degrades to an
  already-shipped component rather than a new untested one.

**2026-09-03:**

- **Reverted — FEATURE's scroll-driven sequential reveal.** The
  2026-09-01 `FeatureScroll` above lagged real scroll gestures (GSAP's
  `scrub` interpolates toward the scroll position rather than tracking it
  exactly, so a normal-speed scroll or trackpad flick could blow past
  several rows' open windows before they visually registered). Reverted to
  `Accordion`'s own `panel="inverted"` + `hoverToOpen` mode (already built
  for Capabilities in the 2026-08-29 dark-panel pass) — hover intent is a
  direct signal a scroll position never was, and reusing an
  already-shipped mode removes the whole bug class instead of re-tuning
  it. `feature-scroll.tsx` deleted; `FeatureAccordion` no longer branches
  on `useReducedMotion()` for this, since hover-to-open already degrades
  correctly (click-only) with no separate code path needed.

**2026-09-04, real-media pass:**

- **Adopted — `MorphSlider`** (`components/media/morph-slider.tsx`), React
  Bits' shader-morph card carousel, ported to TypeScript with the upstream
  GLSL/`ogl`/GSAP engine kept verbatim. Three changes from upstream: driven
  by this project's `useReducedMotion()` instead of a one-shot
  `matchMedia` read (reduced motion shortens transitions to ≤0.4s rather
  than disabling the carousel outright — the shader itself, gated by a
  `uReduce` uniform, also skips its per-transition-type displacement math
  and just crossfades); its chrome (arrows/dots/captions) reads this
  project's `--text`/`--surface-2`/etc. tokens instead of hardcoded dark
  `rgba()`, so it works on either ground; and a root click guard
  (`preventDefault`/`stopPropagation`) since every homepage call site nests
  it inside a `<Link>` card — a slide/drag/arrow/dot tap must browse the
  gallery, never trigger the card's own navigation. Wired into `CardMedia`
  (`components/home/summary.tsx`): a `Project.gallery: string[]` (new,
  optional) renders through `MorphSlider` when present and has 2+ entries;
  a single-image or gallery-less card still renders through the existing
  `ProductVideo`/brand-plate fallback chain unchanged. Used for all 4 WORK
  cards, now carrying real client-site screenshots (see "Real screenshots"
  below) instead of the brand-mark-on-plate placeholder they showed before
  real footage existed.
- **Adopted, alternate — `DepthCarousel`, deleted 2026-09-04 (later pass).**
  (`components/media/depth-carousel.tsx`), React Bits' stacked-depth
  card carousel, ported the same way (GSAP-only, already a dependency;
  `useReducedMotion()`; upstream's `wheel` handler dropped since it
  captured page scroll — the exact wheel-capture problem AGENTS.md/
  `docs/references/*` already flag as a recurring failure mode for
  scroll-adjacent widgets). Built as the first candidate for the WORK
  card gallery, superseded by `MorphSlider` (above) once that landed and
  read better against MaCo's flat, restrained visual language — kept on
  disk and imported nowhere (`summary.tsx` kept a commented-out import
  as the swap-back note) for one pass, then deleted outright in the
  2026-09-04 "premium motion" cleanup pass, per that pass's ruthless-
  dead-code-deletion rule — git history preserves it if the swap-back
  ever becomes real rather than hypothetical.
- **Adopted — `PhoneMockup`** (`components/media/phone-mockup.tsx`), a
  fixed graphite device chassis around a looping, always-on screen
  recording — for `Product.screen` (new, optional `Media`), used only by
  Driver's Diary (a PWA with no desktop surface, where a flat screenshot
  in a landscape card box doesn't read as "this is a phone app"). Not a
  React Bits port — a small original component. Deliberately a different
  autoplay policy from `ProductVideo`'s conservative poster+tap-to-play
  gate (`autoplayAllowed()`, pointer/viewport/save-data checked): the
  mockup's video is muted/looped/always-on, closer to a moving photograph
  than a video a visitor opts into, and simply doesn't mount under reduced
  motion (poster frame stands in as the static screen) rather than gating
  on network/pointer conditions the way a full-size demo video does.
  `CardMedia` renders it in place of the flat card box entirely (no fixed
  aspect-ratio panel, no surface fill) when `screen` is present — it takes
  priority over `gallery`/`media`.
- **Real screenshots replace the brand-mark placeholder on WORK cards.**
  All 4 projects (`content/maco.ts`) gained a `media.poster` (first real
  shot, landscape ~2.1:1 crop of the live site) and a `gallery: string[]`
  (3-5 shots each) under `public/media/work/<slug>/`, produced by
  `scripts/convert-work-shots.mjs` from raw captures in `src/assets/`.
  `CardMedia`'s default `aspect` changed from the old Cuberto-parity
  portrait `450 / 608` to landscape `2.1 / 1` to match these screenshots'
  native crop — every WORK/PRODUCTS card is now a landscape plate, not a
  portrait one (see §10's SUMMARY entries).
- **Driver's Diary gained a real on-device screen recording** — previously
  its only visual was `brand`-plate art marked `"Brand illustration — not
  product UI"`. `scripts/convert-product-video.mjs` crops the recorder
  app's own status-bar overlay off a raw Android capture
  (`src/assets/DD.mp4`), downscales to phone-mockup size, strips audio,
  and muxes a webm + mp4 pair into `public/media/products/drivers-diary/`.
  Referenced as the product's new `screen` field; the old brand-plate
  `media` entry is untouched as a fallback for anywhere `screen` isn't
  rendered. Driver's Diary also gained a `brand` field (previously
  missing — only its `media.poster` pointed at the same logo asset) so
  the new homepage logo chips (below) have something to render.
- **Small brand-logo chips added next to card titles and roster rows** —
  not a React Bits technique, a direct UI/UX request. `SummaryCard`
  (`components/home/summary.tsx`, shared by homepage WORK and PRODUCTS)
  now renders a 40×40px chip (reusing `LogoReel`'s existing
  `--radius-chip`/`--surface-2`/border visual language) before each card
  title when `brand` is present; `/clients` (`routes/clients.tsx`) renders
  a larger 56×56px version before each roster row's name. Both use
  `object-contain` so logos of any aspect ratio (square, or HeadGreen's
  tall 500×826) sit centered without distortion, and `alt=""` since the
  adjacent heading already carries the name as visible text — avoids a
  screen reader announcing it twice. Conditionally rendered
  (`{brand && (...)}`) — a card/row with no `brand` shows no chip, never a
  placeholder box.
- **CAPABILITY's first accordion row no longer force-opens.**
  `feature-accordion.tsx` dropped its `defaultOpen={ITEMS[0]?.id}` — a
  stray-looking reveal before any hover/click, now behaving like FAQ
  (nothing open until the visitor acts). `Accordion`'s `defaultOpen` prop
  is unchanged; both current call sites simply stopped passing it.
- **Client logo reel: fixed a hover-clipping bug, added sibling-dim on
  hover.** `LogoReel`'s track mask was `overflow-hidden`, which also
  clipped the vertical travel of each card's `hover:-translate-y-1` lift
  at the mask's own top/bottom edge — switched to `overflow-x-hidden` +
  `py-2` so the lift has room to render. Also added a `:has()`-based
  sibling-dim rule (`.cb-reel:has(li:hover) li:not(:hover)`) so hovering
  one client card dims the others, matching the same "focus the hovered
  one" language already used elsewhere (e.g. layout mode 2's nav links).
- **Font loading rewritten from "load every family for everyone" to
  per-theme lazy loading** — see §9 "Font loading" for the full mechanism
  (`lib/fonts.ts`, `__root.tsx`'s pre-paint script, `theme.tsx`). Not a
  React Bits item, a performance fix: the previous single combined Google
  Fonts request loaded all six typefaces (both themes' full sets)
  render-blocking for every visitor, when at most one theme's three
  faces are ever displayed at once.

**2026-09-05, Services + About elevation pass:**

- **Adopted — Evidence-grid mouse-tracked spotlight border**, studied from
  skiper-ui.com's card-glow pattern. Reimplemented as a CSS `evidence-
  spotlight` utility (`styles.css`) — the existing `padding` + `mask:
  ... mask-composite: exclude` gradient-ring trick, radial-positioned off
  the existing `usePointerField` hook's `--px`/`--py` writes, tinted from
  `--focus` (ground-invariant, same reasoning as the hero backlight). No
  new dependency, no new pointer-tracking mechanism — reused what
  `identity.tsx` and the hero already established.
- **Adopted — capability-row hover micro-interaction** (reactbits.dev-
  style list-row hover): a 4px translateX + gray→`--text` color shift on
  hover, applied to the row's child `h2`/`p` elements specifically, never
  the `.stagger-item` wrapper — that element's own `transform` is already
  GSAP-scrubbed by `Stagger`'s `--sr` custom property, and a hover
  transform on the same node would fight it rather than compose with it.
- **Adopted, minimal — a second `LineReveal mode="words"` use** for
  About's new Origin narrative. Not a new component — the same word-
  stagger mode adopted once already (Overview's opening statement,
  2026-08-29 entry above); AGENTS.md's "not an animation gallery" caution
  is about scattering novel devices, not reusing an already-shipped one.
- **Rejected — grayscale→color portrait hover.** The original brief
  proposed founder photos going from grayscale to full color on hover;
  the owner's explicit call was "stay monochrome" — this site's entire
  token system is achromatic (Obsidian) or blue-only (Cobalt), and a
  color reveal would be the one place on the whole site breaking that.
  Hover instead expresses via `contrast-125 brightness-105` on the image
  box plus a bio-text slide-up — motion and tone, no hue.
- **Rejected — inventing team member roles/bios.** The owner supplied 8
  real names and no further detail. Per §2 rule 2 (no invented claims)
  and the existing `Media.note` no-silent-placeholder convention, each
  card renders an explicit, visible "Role — pending" / "Bio — pending."
  rather than a plausible-sounding fabricated title — see AI_HANDOFF.md's
  matching entry for the full reasoning.

---

## 5. Brand & messaging

| Field | Value |
|-------|-------|
| Name | MaCo |
| Category | Software / IT solutions |
| Tagline | Software and IT solutions for products that need to work. |
| Statement | MaCo builds and maintains software that carries real operational weight — client platforms, internal tooling and the systems people log into every working day. |
| Email | info@maco.codes |
| Phones | Qatar +974 3126 6690 · Dubai +971 54 321 0907 · India +91 73067 94846 (`site.phones`, added 2026-09-05) |
| Location | Kochi, Kerala, India |

Tone: factual, simple, confident. Avoid "passionate team revolutionizing digital transformation."

---

## 6. Confirmed content catalog

Source: `frontend/src/content/maco.ts` (mirrors the DRF schema). This is the only place copy facts may come from — see §2 rule 2.

### Services (2)

1. **Business Software** — `business-software` — Task Management, CRM, Custom Software
2. **Digital Solutions** — `digital-solutions` — Websites, E-commerce, Branding and Design, Social Media Management

### Projects / selected work (5)

1. **Ananta Nethralaya** — eye clinic website — `ananta-nethralaya`
2. **Al Afzah** — Qatar construction company website — `al-afzah`
3. **Soorath Autos** — used-car dealership website — `soorath-autos`
4. **HeadGreen** — EV fleet/cab service (Kochi) website — `headgreen`
5. **Ozone Fitout & Contracting W.L.L.** — 16-page corporate brochure design (print, not a website) — `ozone` (added 2026-09-05)

The first four carry a real `media.poster` + `gallery: string[]` (3-5 real
screenshots of the live site each, `public/media/work/<slug>/`) — see §4's
2026-09-04 adopt/reject entry and §10's SUMMARY notes for how these render.
Ozone has neither (no live site to screenshot) and falls back to its `brand`
logo on a plate, same mechanism `CardMedia`/`work.index.tsx` already used for
Driver's Diary's no-media case.

**`Project.external_url` is optional** (added 2026-09-05, for Ozone) — it was
a required field until every project on the site was a live website. Every
render site now guards it (`work.index.tsx`'s "Visit site" button,
`work.$slug.tsx`'s "Visit {title}" button and its stats row, which shows
`["Delivered", "Print / brand piece"]` instead of `["Live", "Public"]` when
absent) rather than fabricating a URL — see §16.

### Products (2)

1. **Driver's Diary** — PWA/platform for HeadGreen ops (attendance, rides, payroll, docs, reporting) — `drivers-diary` — now has a real on-device screen recording (`screen` field, rendered in `PhoneMockup`) plus a `brand` logo, in addition to its existing brand-plate `media` fallback
2. **Bridge** — MaCo's own SaaS/PWA + desktop task/project platform — `bridge` — gets the strongest treatment (EVIDENCE section + first PRODUCTS card, the only real video footage on the site until Driver's Diary's screen recording, above)

### Clients (5 — names only)

Ananta Nethralaya (Healthcare) · Al Afzah Group WLL (Construction) · Soorath Autos (Automotive retail) · HeadGreen (EV mobility) · Ozone Fitout & Contracting W.L.L. (Interior fit-out & contracting, added 2026-09-05)

`Client.website` is optional for the same reason as `Project.external_url`
above — Ozone has no live site, `clients.tsx` guards the link. Soorath
Autos's logo (`public/media/brand/soorath.webp`) was replaced 2026-09-05
with a higher-resolution source; the new source had its transparency baked
out as a solid black square (`hasAlpha: false`), so it's re-keyed via a
screen/un-premultiply pass (`alpha = max(r,g,b)`, then unpremultiply each
channel) rather than shipped with a visible black background behind the
mark — see the 2026-09-05 AI_HANDOFF entry for the exact script.

### Process steps

A Scope → B Model → C Build → D Hand over

### Team (8) + Origin story (added 2026-09-05)

`content/maco.ts` gained `origin` (one-paragraph founding narrative) and
`team: TeamMember[]` (`slug`/`name`/`role`/`bio`/optional `portrait`),
rendered on `/about`. The owner supplied only the 8 real names — Syed
Mahroof, Muhammed Sheffin Khan P A, Alshid Mohammed, Minhaj V Shams, Sonu
Mirza A, Akshai N V, Sahal Siyad, Arfin Nassar — so `role`/`bio` render as
explicit "Role — pending" / "Bio — pending." per §2 rule 2, not invented
titles. No `portrait` images exist yet; each card falls back to a
typographic initials monogram.

### Operational hubs (globe)

`/about`'s `MaCoGlobe` labels 5 real operational hubs — Kochi, Bangalore,
Chennai, Qatar, Dubai (owner-confirmed 2026-09-05) — larger, brighter, and
named versus the globe's remaining ambient decoration points, which stay
unlabelled.

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

## 8. Backend API (not currently wired — see §4)

Backend moved to `../maco-backend`; documented in its own `README.md`.
Kept below for reference — this is what the contact form talks to when
`VITE_API_BASE_URL` is set. Base: `/api/v1/`

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

Michroma, Tenor Sans, and Krona One are single-static-weight families — don't request weight axes that don't exist for them.

### Font loading (rewritten 2026-09-04)

Previously one combined Google Fonts CSS2 request in `__root.tsx` loaded
all six typefaces (both themes' full sets) eagerly, render-blocking, for
every visitor — wasteful, since at most one theme's three faces are ever
displayed. Now split by theme:

- **Obsidian's set** (Unbounded/Jost/Agdasima) is the only one in
  `__root.tsx`'s static `head()` `<link rel="stylesheet">` — it's the
  default theme for a first-time visitor, so it's always needed and stays
  eager/render-blocking-acceptable.
- **Cobalt's set** (Michroma/Tenor Sans/Krona One) loads on demand via
  `lib/fonts.ts`'s `ensureCobaltFonts()` — injects a `<link>` (id
  `maco-cobalt-fonts`) only if not already present. Two call sites:
  - `theme.tsx`'s `ThemeProvider.setTheme()` calls it the instant an
    Obsidian → Cobalt switch is requested, well before the radial wipe
    (0.7s) finishes covering the viewport, so the new font is ready by
    the time it's revealed.
  - `__root.tsx`'s pre-paint bootstrap `<script>` (the same one that
    stamps `data-theme` before hydration to avoid a theme flash) carries
    a **hardcoded copy** of `lib/fonts.ts`'s href/id — an inline script
    can't `import` a module — and injects the same `<link>` immediately
    if `localStorage["maco-theme"]` is already `"cobalt"`, so a returning
    Cobalt visitor's font request starts before first paint instead of
    after hydration. **If `COBALT_FONTS_HREF` in `lib/fonts.ts` ever
    changes, this hardcoded copy in `__root.tsx` must change with it** —
    there is no single source of truth enforced by the type system here.

### Structural utilities

`shell`, `rule-t` / `rule-b`, `label`, `display-hero|lg|md`, `lead`, `btn-solid`, `btn-line`, `link-draw`, `index-row`, `light-pass` (the signature raking-light device, driven by a `--sweep` custom property 0–1 — see §10), `ambient-field` (the at-rest breathing radial-gradient layer, §10 — both themes render it at the same intensity as of 2026-09-05; Cobalt's own stronger `color-mix` override, which read as an over-strong blue haze against Obsidian's near-invisible version, was deleted for uniformity). As of 2026-09-04/05, `html`'s native scrollbar is hidden site-wide (`scrollbar-width: none` / `-ms-overflow-style: none` / `::-webkit-scrollbar { display: none }`) — Lenis already owns scroll feel and every on-page scroll readout, so the OS scrollbar chrome was pure visual noise; `overflow`/wheel/touch scrolling itself is unaffected.

### Brand assets (`frontend/public/`)

- `logo-mark.png` — the one canonical mark, used by `Mark` via CSS `mask-image` everywhere it appears (header, footer, preloader, TOPHEAD). Re-exported 2026-09-02, cropped to its measured alpha bbox (670×375) — the original 2481×2481 canvas had the glyph occupying only ~26%/~15% of its width/height, which `mask-size: contain` rendered as a tiny glyph in a mostly-empty box at any sane `size`. `Mark`'s `size` prop now means WIDTH; height derives from a fixed `ASPECT = 375/670` constant, so the box tightly wraps the glyph. `maco-mark-hero.png` (the old OPEN hero's separate larger asset) is deleted — dead since the 2026-08-28 Cuberto-parity rebuild replaced OPEN with TOPHEAD, which has used the same canonical mark (at a larger `size`) ever since
- `favicon.png`
- `geo/countries-110m.geojson` — globe geometry, `/about` only
- `media/brand/*.webp` — client + product logos (6), referenced from `content/maco.ts` as each `Client`/`Project`/`Product`'s `brand` field, rendered as the small logo chips on the homepage WORK/PRODUCTS cards (`summary.tsx`) and the `/clients` roster (`clients.tsx`), and as the larger cards in `LogoReel`
- `media/bridge/*` — Bridge product video + poster, referenced from `content/maco.ts`
- `media/work/<slug>/N.webp` (2026-09-04) — real screenshots of each live client site (4 slugs, 3-5 shots each), `Project.media.poster` (shot 1) + `Project.gallery` (all shots); produced by `scripts/convert-work-shots.mjs` from raw captures in `src/assets/`
- `media/products/drivers-diary/screen.{mp4,webm}` + `screen-poster.webp` (2026-09-04) — Driver's Diary's real on-device screen recording, `Product.screen`, rendered in `PhoneMockup`; produced by `scripts/convert-product-video.mjs` from a raw capture in `src/assets/DD.mp4`

---

## 10. The homepage — 10 sections, Cuberto-parity structure

Composed in `routes/index.tsx`, built under `components/home/`, plus `<GroundHandoff>` (renders nothing — cross-section continuity, see below).

Rebuilt 2026-08-28 (plan "Cuberto-parity homepage rebuild") at the owner's explicit direction: a full structural clone of cuberto.com's homepage — section inventory, order, spacing/grid rhythm, hero shape and component layouts — wearing MaCo's Obsidian/Cobalt tokens, MaCo's six typefaces, and `content/maco.ts`'s real copy. Cuberto's own colour values, typefaces and copy were never used, not even temporarily — see the "CUBERTO-PARITY STRUCTURE" block at the top of `styles.css` and `docs/references/cuberto/skillui/`. This overrides the "don't rebuild the homepage" / "reference sites are technique-only" rules that stood in `AGENTS.md`, `ROADMAP.md` and every `docs/references/*/NOTES.md` before this date — see the dated entry in `AI_HANDOFF.md` for the full reasoning and what still doesn't override.

The ten `aria-label`s are unchanged from the previous (pre-2026-08-28) architecture minus one — Record ("About MaCo") was merged into Overview 2026-09-03 (see "What each section does" below) and its label retired along with the file. `scripts/shoot.mjs`'s `SECTIONS` list reflects the current order/count.

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
| 9 | FAQ (inverse) | `cb-faq.-inverse` | deep | `faq.tsx` | How MaCo works | no |
| 10 | OUTRO | `cb-outro` | deep | `outro.tsx` | Start a project | no |

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

**2026-09-03: Record merged into Overview, homepage down to 10 sections.** Record (`aria-label="About MaCo"`, slot 9, `deep` ground) duplicated Overview's own "About" framing — Overview already opened with an "About" eyebrow, a headline, counted stats and an `/about` CTA; Record added nothing but `site.statement` restated (which ALSO already ran verbatim as `TopHead`'s hero subtext, so it was on the page three times over) plus one location line. `record.tsx` is deleted; Overview absorbed that one location line verbatim (`{site.category}, based in {site.location}. Working with clients across India and the Middle East.`, unchanged copy, just relocated) as a new paragraph after its CTA. The ground-flip pair that used to target Record (Identity → About MaCo, paper → deep) now targets Faq directly (Identity → How MaCo works) — same flip, one section earlier; the three-act ground shape (`deep deep · paper×6 · deep deep`, footer deep) is otherwise unchanged.

Cuberto's measured rhythm, adopted as the `cb-*` utilities in `styles.css`: **108px (6.75rem)** section padding unit (`@utility cb-section`), **180px (11.25rem)** hero-only lead-in (`@utility cb-tophead`), radius scale `7.2px` / `1.6rem` / `2rem` / `1000px` (`--radius-chip/card/plate/pill`), and the accordion open/close transition taken verbatim off their stylesheet (`grid-template-rows .3s ease-out, opacity .4s ease-out` — `@utility cb-panel`).

### What each section does

- **TOPHEAD** (`top-head.tsx`) — Cuberto's actual opening shape: brand row, one large left-aligned `<h1>` (`site.tagline`), short subtext (`site.statement`) and the entry CTA. Replaces the previous full-viewport centred-logo OPEN section — the page now starts reading immediately instead of resolving to a brand lockup first. No `<RakingSurface>` (removed 2026-08-29, the component itself deleted 2026-09-04's later pass — see §10's motion vocabulary list); as of that later pass the section's light instead comes from `.hero-backlight`'s radial tracking `--px`/`--py` (`usePointerField`, the same hook `identity.tsx` uses), no blend mode, so the Cobalt off-palette bug `RakingSurface`'s removal fixed can't recur. The brand row is the mark alone as of 2026-09-01 (`<Mark size={72} />` + `site.name` in `sr-only`, no spelled-out text) — the header's own `<Wordmark>` already spells "MaCo" out ~120px above this row, so a second instance directly under it doubled up for no reason. The headline itself masks in Bridge's real video (`<MaskedHeading>`) when conditions allow; the gate (`mediaOk`, via the same `autoplayAllowed()` policy `ProductVideo` uses — exported from `product-video.tsx` for this reuse) closes a gap where the video previously fetched (764KB) unconditionally even on touch/narrow/save-data devices that would never autoplay it; those visitors get the static `display-glow` heading instead. **2026-09-04, later pass:** the headline stopped cycling through `heroLines` (deleted from `content/maco.ts`) — one statement (`site.tagline`), one wipe. The wipe is also now gated on a `maco:entered` event `preloader.tsx` dispatches (from its skip branch and its Enter click alike) rather than firing on its own mount — previously it finished behind the preloader overlay before a visitor ever saw it. `<SplitReveal>` (the char-rise component this row used to render through) was deleted the same day, earlier pass — dead code with zero call sites since 2026-09-01. **2026-09-04/05, ambient motion pass:** TOPHEAD also carries `.hero-nav-hint` — a small "Menu" label + chevron pointing at `EdgeNav`'s dot rail, layout-3-only, `≥64rem`-only, `position: absolute` inside this section (not `fixed`, so it scrolls away with the hero) — added because the dot rail's own per-dot labels are hover-only and gave a first-time visitor no cue they're navigation. See §10's Layout modes / Mode 3 note below.
- **PREVIEW** (`evidence-expand.tsx`, unchanged) — the page's one pinned cinematic set-piece: a clip-path frame locked to the video's real 16:9, grows to ~88vw on `ScrollTrigger` pin+scrub.
- **OVERVIEW** (`overview.tsx`) — Cuberto's `cb-overview` 2-col flex: positioning statement left, a counted `<dl>` of real figures (service/client/project/product counts, derived from `content/maco.ts` — never invented) plus a route to `/about` right. **This is now the page's ONE About section** (2026-09-03) — it absorbed Record's location/category line (`{site.category}, based in {site.location}. Working with clients across India and the Middle East.`, verbatim, unreworded) as a paragraph after its CTA when `record.tsx` was deleted. Carries `className="ground-sheet"` (see GroundHandoff below) — it's the incoming side of the page's first ground flip. **2026-09-04/05:** also carries `.ambient-field` (a CSS-only breathing radial-gradient layer, always) plus `<AmbientCanvas>` (an ogl FBM-noise shader on top of it, full-motion only) — one of the four/three "flat rooms" that had no at-rest motion before this pass (§4's tech-stack `ogl` note, §12).
- **FEATURE** (`feature-accordion.tsx`) — every capability across both service lines, numbered rows. **2026-09-04/05:** also carries `.ambient-field` — CSS-only here, no `<AmbientCanvas>` (narrower final list than the other three flat rooms). Replaces the previous two-card `ServicesConvergence` pin — Cuberto's homepage states its full capability range as one list, not two headline cards. Rendered through the shared `<Accordion>` (`components/home/accordion.tsx`, also FAQ's mechanism below) in `panel="inverted"` mode with `hoverToOpen`: real mouse/fine-pointer hover opens a row (gated to `(hover: hover) and (pointer: fine)`), click always works, touch never depends on hover — one open at a time. **As of 2026-09-04, no row is open by default** (`feature-accordion.tsx` dropped `defaultOpen={ITEMS[0]?.id}`) — a forced-open first row read as a stray reveal before the visitor had hovered or clicked anything; it now starts closed, matching FAQ. (A 2026-09-01 scroll-driven variant, `FeatureScroll`, briefly replaced this for full-motion visitors — rows expanded in sequence as the section crossed the viewport, no click. Reverted 2026-09-03: `ScrollTrigger`'s `scrub` lags real scroll position enough that a normal scroll or trackpad flick could blow past a row's open window before it registered. See §4's adopt/reject log.) **2026-09-04, later pass:** the inverted panel's `light-pass is-lit` had nothing driving its `--sweep` (frozen at the registered `@property`'s 0 rest value since it was added) — fixed in CSS alone, `.cb-panel[data-open="true"] .light-pass { --sweep: 1 }` under `prefers-reduced-motion: no-preference`, transition on the unconditional base selector so closing eases the light back out too.
- **LOGOREEL** (`logo-reel.tsx`) — continuous CSS-only horizontal drift of client logo cards (`@utility cb-reel`, radius `--radius-chip`, edge-masked), the track duplicated and translated -50% for a seamless loop, `aria-hidden` on the duplicate half. Replaces the previous scroll-scrubbed scatter field (`client-field.tsx`) — a reel reads correctly at every viewport width with no separate mobile branch. **2026-09-04 fix:** the mask was `overflow-hidden`, which also clipped each card's `hover:-translate-y-1` lift at the mask's own top/bottom edge (the lift rendered, then got cut off) — switched to `overflow-x-hidden` + `py-2` so vertical hover motion has room. Also gained a `:has()` sibling-dim rule (hovering one card dims the rest) matching the same hover-focus language used elsewhere on the page.
- **SUMMARY / FeaturedWork** (`summary.tsx`) — client platforms as a `cb-cards` grid, deep ground. One `<Summary>` component, two call sites (here and PRODUCTS below) — matching Cuberto's own reuse of `cb-summary` twice. **2026-09-04 changes:** card media default `aspect` changed from Cuberto-parity's portrait `450 / 608` to landscape `2.1 / 1`, to match the real client-site screenshots now populating every card (see §4's adopt/reject log) — every WORK card is now a landscape plate, not portrait. Each card's `gallery` (2+ real screenshots) renders through the new WebGL `<MorphSlider>` instead of a single static shot; a card's `brand` (all 4 already had one) now also renders as a small 40×40px logo chip immediately before the card title, reusing `LogoReel`'s chip styling. Title row's flex alignment changed `items-baseline` → `items-center` to accommodate the chip.
- **SUMMARY / ProductSummary** (`summary.tsx`) — MaCo's own two products, same card shape/aspect, paper ground. Bridge renders through the existing `ProductVideo` path unchanged. **2026-09-04:** Driver's Diary now renders through the new `<PhoneMockup>` (its `screen` field — a real on-device recording, takes priority over `media`/`gallery` in `CardMedia`) instead of the static brand-plate illustration it showed before; both products' titles now carry the same 40×40px logo chip as WORK (Driver's Diary gained a `brand` field for this, reusing its existing logo asset — it previously had none). **2026-09-04, later pass:** both `SummaryCard`'s own `<Link>` and the two `"All work"`/`"All products"` `btn-line` CTAs now wrap in `<Magnetic>` (card hover-lift duration `500ms`→`300ms` so the two compose rather than fight); `MorphSlider`'s defaults retimed (`duration` `1.1`→`0.85`, `ease` `power2.inOut`→`power3.out`, `autoplayDelay` `4`→`5.5`) and, in `morph-slider.tsx` itself, its WebGL engine now lazy-mounts behind an `IntersectionObserver` (`rootMargin: "300px 0px"`, matching `product-video.tsx`) and gained `pause()`/`resume()` wired to the same observer — previously all 4 WORK cards ran a permanent GL context and `requestAnimationFrame` loop regardless of scroll position, outside Lenis's ticker; DPR cap `2`→`1.75`.
- **IDENTITY** (`identity.tsx`) — "One name. Many scripts." — also carries `.ambient-field` + `<AmbientCanvas>` as of 2026-09-04/05 (see OVERVIEW above) — a pinned, fully scroll-driven script dial, glyph position is pure CSS `calc(--i - --t)`, zero re-renders, correct `lang` per script. Ground flipped `deep` → `paper` in this pass to match Cuberto's own alternation. Script list curated from 13 to 10 in the 2026-08-29 tenth pass (English, Malayalam, Tamil, Telugu, Kannada, Hindi, Japanese, Korean, Arabic, Hebrew) and moved to `content/maco.ts` as `nameScripts` — the footer's compact strip (`chrome.tsx`) reads the same array, so the two can no longer drift apart the way the footer's old hand-written 7-item copy (which included Cyrillic, matching no client market) had. **2026-09-04, later pass — chosen as the homepage's one signature set-piece** (the only section about MaCo rather than a client, and the cheapest to add weight to since the dial was already pure CSS): pin runway lengthened (`+=110%`→`+=170%` desktop, `+=90%`→`+=130%` mobile), type scaled up (`--slot`/track height ~40% larger, font-size ceiling `5rem`→`8rem`), depth falloff increased (scale/opacity/pointer-nudge coefficients all raised) — `@utility identity-script` in `styles.css`. No new WebGL; live-verified at 1440px (hits its `clamp()` ceiling) and 390px (no overflow, RTL unclipped at the new scale).
- **FAQ** (`faq.tsx`) — also carries `.ambient-field` + `<AmbientCanvas>` as of 2026-09-04/05 (see OVERVIEW above) — the same four-step process (A→D) as before, now through the shared `<Accordion>` on inverted ground, matching Cuberto's `cb-faq.-inverse`. Replaces the previous pinned `MethodLine` progress-spine. Carries `className="ground-sheet"` — it's the incoming side of the page's second (and now last) ground flip, directly after IDENTITY, since Record (which used to sit between them) is deleted (2026-09-03; Record was the page's old rest beat, About-only since 2026-08-28 — see OVERVIEW above for where its content went).
- **OUTRO** (`outro.tsx`) — Cuberto's `cb-outro` 2-col grid: closing statement left, contact route right. Carries over the previous CLOSE section's `light-pass` sweep and centre-drawn `<RuleDraw>` — the one thing worth keeping from the section it replaces.

### Cross-section continuity — `GroundHandoff`

`components/home/ground-handoff.tsx`, mounted once after OUTRO, renders nothing. On 10 hand-picked boundary pairs (down from 11 — one dropped with Record's deletion, 2026-09-03), matched by `aria-label` (including the footer, via its own `aria-label="Site footer"`), the outgoing section fades as the incoming section arrives; 2 of the 10 (each at a real ground flip: Preview→Overview, Identity→Faq) additionally get a rounded-overlap "sheet" reveal on the incoming side instead of a fade (the outgoing side pins on both, so it's excluded from any animation there). The other 8 fading pairs aren't all the same intensity as of the 2026-09-01 pass — marked `"emphasis"` (the boundaries into/out of a set-piece or an act break) get a stronger fade than the `"interior"` (default) pairs, which cover the flat run of paper-ground card sections. See the file's own doc comment for the full derivation.

**2026-09-03 transition rebuild**, replacing the mechanism above (which used to scale/lift the outgoing section, and animate the sheet's clip-path AWAY from rounded toward square):

- **Same-ground boundaries are now a pure opacity fade — no transform.** The old `yPercent`/`scale` recede shrank the outgoing section from its own bottom edge, which could open a visible dip at the seam — reported as an "empty gap" scrolling Overview→Feature (both `paper`, so not a color mismatch — the shrink itself was the cue that drew the eye to a moment neither section's content had fully settled). Dropping the transform removes the mechanism, not just the symptom.
- **The two ground-flip boundaries are a real rounded overlap, not a flatten.** The incoming section (`overview.tsx`, `faq.tsx` — both now carry `className="ground-sheet"`, a new `styles.css` utility) has a PERMANENT CSS rest state: `margin-top: -3rem`, `border-radius: 3rem 3rem 0 0`, a drop shadow — it physically overlaps the section above it with rounded top corners at all times, JS or not. `ground-handoff.tsx` now only grows that radius FROM 0 INTO the 48px rest value as the section scrolls in (a real `border-radius` tween, not `clip-path` — clip-path also clips its own box-shadow, so the old mechanism could never have shown one). Reduced-motion/no-JS visitors see the settled rounded composition directly, with no separate branch needed, since `useScrollScene` already no-ops whenever `getScrollRuntime()` returns null.

`lib/ground.ts`'s `groundAt()` resolver — shared by the header/EdgeNav ticker and the cursor's own ground-tracking (§10 below) — is a related but separate fix from earlier the same day: it used to hard-default to `"paper"` whenever nothing covered the sampled y, flashing those two continuous consumers to the wrong tone for a few frames at a momentary gap between two `deep` sections (reported as a glitch at the old RECORD→FAQ seam). Fixed with a `fallback` parameter so continuous trackers pass their own last-resolved tone instead of the hard default.

**2026-09-04, later pass — weights and timing tightened**, same mechanism, no structural change: same-ground fade weights lightened (`interior` opacity target `0.7`→`0.88`, `emphasis` `0.55`→`0.74` — still heavier at the structural beats, but neither dips far enough to read as a gap), boundary `scrub` `0.4`→`0.28`, and the two ground-flip sheets get their own, later `end` (`top 55%`, was `top 25%`, shared with the fade trigger before this pass) so the rounded overlap settles while the two sections still visibly overlap rather than only rounding out as the incoming section nears the top.

### `SurfaceMedia` (`components/media/surface-media.tsx`)

Three-tier media slot: tier 1 (video), tier 2 (image), tier 3 (designed fallback — a material gradient + `light-pass` + an honest caption naming what's missing).

### The light-pass device (`@utility light-pass`, `styles.css`)

One raking-light gradient (`::after`, `mix-blend-mode: overlay`) reused at multiple scales instead of a different decorative device per section. Position read from a `--sweep` CSS custom property (0–1).

### Scroll substrate & interaction layer

Ownership is split, not layered (see §12). **Lenis** owns raw scroll position (`src/lib/scroll-runtime.ts`, a lazy module-level singleton booted by `<ScrollRuntimeProvider>` in `__root.tsx`, `null` on the server or under reduced motion). **GSAP `ScrollTrigger`** owns every pin/scrub, on all 10 sections. `motion` v13 keeps only discrete UI state (hover springs) and never touches scroll.

`hooks/use-scroll-scene.ts` is the standard entry point for any scroll-linked component — wraps `gsap.context()` for auto-cleanup.

Motion vocabulary (`components/motion/`), all writing to registered `@property` CSS custom properties whose initial value IS the at-rest composition:

- `<ScrubReveal>` — reversible scroll-linked reveal, the general replacement for `MotionSection`'s one-shot fade
- `<RuleDraw>` — a rule drawing in from an edge (or, on CLOSE, outward from centre)
- `<Stagger>` — scrubbed reveal across N children, one shared `ScrollTrigger`
- `<Magnetic>` — pointer-lean wrapper for buttons/links, `rubberband()`/`SPRING_MOMENTUM`
- `<LineReveal>` — GSAP `SplitText` line-mask headline reveal, for section headlines site-wide

`<SplitReveal>` (char-rise-on-mount then `.maco-shine`) is **deleted** as of 2026-09-04 — its one call site (TOPHEAD's brand row) was dropped 2026-09-01 in favor of a mark-only row (see §10's TOPHEAD entry), and it sat unused with zero imports until this pass removed the dead file. `<RakingSurface>` is **deleted** as of 2026-09-04's later "premium motion" pass — zero live call sites (it hadn't wrapped TOPHEAD since 2026-08-29, see that section's own comment for why), and TOPHEAD's new pointer-driven backlight (§10) replaces the light-source role it would have filled without reopening the `mix-blend-mode: overlay` bug that got it removed in the first place. `maco-shine`'s CSS (`@utility`/`@keyframes`) went with it in the same pass — same zero-references finding.

Media-slot components (`components/media/`, not `components/motion/`, but scroll-adjacent enough to note here — full detail in §4's 2026-09-04 adopt/reject entries): `<MorphSlider>` (WebGL shader-morph card gallery, `ogl`) and `<PhoneMockup>` (fixed device chassis + looping video) are both wired into `CardMedia`/`SummaryCard`; as of the later 2026-09-04 pass, `<MorphSlider>` also lazy-mounts its GL context via `IntersectionObserver` and pauses/resumes its render loop as a card crosses the viewport margin, rather than running unconditionally forever (§10's SUMMARY notes). As of the 2026-09-04/05 ambient motion pass, that render loop itself moved off a private `requestAnimationFrame` onto the shared `gsap.ticker` (same instance Lenis drives) — it was the last runtime on the page not on the shared ticker even while the IO pause/resume kept it from running off-screen. `<DepthCarousel>` (GSAP stacked-depth gallery), `MorphSlider`'s built alternate, is **deleted** as of the earlier same-day pass — see §4's adopt/reject log.

`<AmbientCanvas>` (`components/motion/ambient-canvas.tsx`, added 2026-09-04/05) — an `ogl` FBM (fractal Brownian motion) noise shader, ticking on `gsap.ticker`, IntersectionObserver-gated. Layered on top of the CSS-only `ambient-field` utility (`styles.css`, §10 below) in OVERVIEW, FAQ, and IDENTITY — the site's "flat rooms" with no media and, before this pass, no at-rest motion at all. `uColorA`/`uColorB` resample `--focus`/`--sweep-light` off a `MutationObserver` on `data-theme`/`data-ground-now` (never polled per frame); `uPointer` lerps toward the real pointer for a subtle warp. Fully unmounted under reduced motion — `.ambient-field` alone is the complete at-rest effect in that case.

`MotionSection` has no homepage call site as of the 2026-08-28 Cuberto-parity rebuild (its one prior use, `method-line.tsx`'s reduced-motion branch, was retired with that file); it's still used across the 7 inner routes.

### First-paint preloader & layout modes (`components/preloader.tsx`, `components/layout-mode.tsx` — introduced 2026-08-29, current shape as of the 2026-09-01 chrome/motion/reveal pass)

Both mount in `__root.tsx`, both site-wide (not homepage-specific), both follow theme.tsx's anti-FOUC shape: a pre-paint `<script>` in `RootShell` stamps the relevant `data-*` attribute on `<html>` before hydration, so there's no flash either way. Nothing in either system ships behind a preview flag — `?v2=` was removed entirely once the eleventh pass's items flipped to default; the only real URL overrides left are `?layout=` and `?motion=`.

**Preloader** — a 200px percentage ring (`RADIUS` 86) around a 64px `<Mark>`, `data-ground="deep"` always (the page opens dark), progress on `--focus` rather than `--accent` (near-white on deep ground in both themes — same reasoning as the hero utilities in §10). A GSAP proxy tween runs linearly toward a 92 ceiling (not 100 — see `preloader.tsx`'s own comment for why a tween that reaches 100 on its own schedule breaks the illusion once real loading outruns it) over 2.6s — a constant rate, retimed 2026-09-01 from an eased ~1.6s curve specifically so the visible counter ticks through nearly every integer instead of skipping. The close gates on `Promise.all([realReadiness, 2.6s-minimum])`, not readiness alone, so a fast connection still gets the full deliberate beat instead of snapping the instant assets resolve; once both are satisfied the remainder closes to 100 in 0.45s. A real "Enter" click gate (motion/nav pass, 2026-08-31) holds once the counter reaches 100 rather than auto-transitioning — only that click sets `done` and releases the scroll lock, which lives in the click handler itself since the effect cleanup only fires on unmount/dep-change. Skips itself entirely (via the pre-paint script's `data-preload="skip"`) under reduced motion or once already shown this session (`sessionStorage`).

**Layout modes** — a `data-layout="1"|"2"|"3"` switcher (`LayoutProvider`/`useLayout`, small numbered control in `chrome.tsx`'s header), persisted via `localStorage["maco-layout"]`, with a non-persisting `?layout=` URL override for previews. Mode 1 is the site as built above and needs no rules of its own.

- **Mode 2** (Iventions' hamburger + diagonal wipe): re-geometried 2026-09-01 to match the reference's actual silhouette — a hard diagonal edge from top-left to a point past centre, leaving a real uncovered bottom-left triangle that page content shows faintly through, rather than the earlier shape's near-full-bleed coverage. A persistent header row (CLOSE label / centred wordmark / "Start a project" CTA) stays visible above the wipe throughout — `.layout-nav-overlay-brand`/`-cta`, CSS-gated to mode 2 only, rendered inside the existing `[data-nav-trigger-overlay]` (a root-level `<header>` sibling at `z-[47]`, above the panel's `z-[46]`; the header's own brand link is hidden in this mode to avoid a duplicate). 2026-09-02: that row lost its shared backdrop bar in favor of per-element glass chips (MENU/wordmark each their own, closed-state only — open, the panel itself already provides contrast), and the panel's own tone stopped being fixed — `useLayoutNavState()` now samples whichever `[data-ground]` section sits at viewport centre the instant the panel opens and sets the panel to its *inverse* (sampled once, not tracked live, since the panel locks scroll while open so the section behind it can't change mid-open); the sampled tone is also written as `data-nav-ground` on `<html>` so the trigger row/overlay controls match it. A leading `--sweep-light` beam and staggered link entrance (eleventh pass) still lead the wipe; panel links dim every sibling to 0.45 opacity and bold the hovered one (`.layout-nav-link[data-active]`, moved off an inline `style` so CSS can win the hover state). On mobile (2026-09-02), the CTA drops off this row (the panel's own in-list CTA still reaches it) and LayoutSwitch/ThemeSwitch move to the same fixed bottom-left cluster mode 3 uses, since all five controls plus the wordmark can't share one 390px row.
- **Mode 3** (Minh Pham / by-kin.com's edge-dot wayfinding, `components/nav/edge-nav.tsx` — extracted out of `chrome.tsx` into its own module, mounted directly in `__root.tsx` as a `<Header>` sibling rather than rendered from inside `Header`): the header shows nothing but `EdgeNav`'s two dot columns at any scroll position on desktop. **2026-09-04/05:** since each dot's own label only reveals on hover/focus/active (`.edge-nav-dot-label { opacity: 0 }` at rest), a first-time visitor had no cue the two dot columns were navigation at all — flagged by the owner via a red-circled screenshot. Fixed with `.hero-nav-hint` (`top-head.tsx`/`styles.css`), a small "Menu" label + chevron confined to TOPHEAD only, pointing at each column, same `1.75rem` horizontal inset as `.edge-nav-col` and vertically aligned to it via `top: calc(50vh - 4rem); transform: translateY(-100%)` (`50vh`, not `50%` — the hero section is taller than one viewport, so a percentage would center on the section's own height rather than the viewport's, verified via `getBoundingClientRect()` against the real rail). — no wordmark, no MENU trigger, no CTA (both removed 2026-09-01; they were leftover from an earlier design where the dots were wayfinding-only, stale now that each dot is a real `<Link>` covering all six routes). `EdgeNav` itself is mode-3-only as of the 2026-09-01 pass (was modes 2 and 3) — mode 2's full-screen panel already covers every route, so running the dots alongside it doubled up two navigation systems with no reference backing that combination. Dot color tracks the section at viewport CENTRE (`lib/ground.ts`'s `groundAt`, sampled at `window.innerHeight / 2`), not the header's own `y=48` sample — the dots are vertically centred, so sharing the header's sample point picked whichever section happened to be at the TOP of the viewport, not behind the dots. `z-[43]` (was `z-40`) keeps the dots above PREVIEW/IDENTITY's own `z-[41]`. Below `lg`, `EdgeNav` swaps from its two side dot-columns (`.edge-nav-col`) to a single bottom bar (`.edge-nav-bar`) rather than falling back to mode 1's chrome outright. The utility cluster (layout switcher + theme toggle, `.header-control-cluster`, `position: fixed`) sits bottom-left on desktop but relocates to top-left below `64rem` (2026-09-02, clear of the new mobile dot bar) — with its own mobile hygiene: `ThemeSwitch`'s text label hides (`.theme-switch-text`) and the brand chip's "MaCo" text hides (`Wordmark`'s new `maco-wordmark-text` class, mark stays) so the cluster, the brand chip, and TOPHEAD's own centred stack (its `padding-top`/`padding-bottom` retuned the same pass) all fit a 390×844 viewport without collision.

The overlay panel (mode 2) must render as a `<header>` sibling, never a descendant — nesting it inside `<header>` was tried first and inherited the header's own `.chrome-adaptive[data-over]` ground-remap, inverting each theme's accent colour.

**Cursor** (`components/motion/cursor.tsx`) carries a semantic per-state system (`data-cursor` → resolved `data-state`) — see §4's adopt/reject log above for the original writeup. As of 2026-09-01 its ground-awareness is continuous rather than hover-only: `groundAt()` (`lib/ground.ts`, the same resolver EdgeNav's dots use) runs every frame as a fallback whenever nothing explicit is being hovered, so the ring no longer reverts to `:root`'s default ground the instant the pointer isn't over a hoverable element. As of 2026-09-03 that per-frame fallback passes the cursor's own last-resolved tone as `groundAt`'s `fallback` argument (not a hard `"paper"` default) — see the GroundHandoff subsection above for why a hard default flashed the wrong tone at certain section boundaries.

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
| Reveals (`ScrubReveal`/`Stagger`/`RuleDraw`/`LineReveal`/`GroundHandoff`/`Outro`) | **GSAP `ScrollTrigger`**, `scrub: 0.6` (retuned 2026-09-04/05 from `0.22-0.3` — carries motion a beat past the wheel stop instead of snapping to rest) |
| Pinned scenes (IDENTITY, PREVIEW) + header | **GSAP `ScrollTrigger`**, `scrub: 0.25-0.3` — deliberately NOT raised; a looser scrub here would desync pin geometry/IDENTITY's dial from real scroll position, and a laggy header reads as broken |
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

### Backend (moved out — `../maco-backend`, not run as part of this repo)

```powershell
cd E:\Downloads\maco-backend
.\venv\Scripts\Activate.ps1
# ensure .env has DATABASE_URL + DJANGO_SECRET_KEY
python manage.py migrate
python manage.py seed_content
python manage.py createsuperuser
python manage.py runserver 8000
```

→ Admin http://127.0.0.1:8000/admin/
→ API http://127.0.0.1:8000/api/v1/

If reconnecting it locally: set `frontend/.env` (copy from `.env.example`) with `VITE_API_BASE_URL=http://localhost:8000` for the contact form to post instead of showing its mailto fallback.

### Vite note

Do **not** add a separate `TanStackRouterVite({ autoCodeSplitting: true })` alongside `tanstackStart()` — the router plugin is already bundled in; adding it separately causes `TSRSplitComponent is not defined` 500s.

---

## 15. Environment variables

Frontend — see `frontend/.env.example`: `VITE_API_BASE_URL` (leave unset — no backend in this repo; contact form falls back to mailto).

Backend (`../maco-backend`, not part of this repo) — see its `.env.example`: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, `DEFAULT_FROM_EMAIL`, `LEAD_NOTIFICATION_EMAIL`.

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
