# MaCo Website — CONTEXT

Complete project context for developers and AI agents.
Last updated: 2026-08-14

---

## 1. What this project is

**MaCo** is a software / IT solutions company based in **Kochi, Kerala, India**.

This repository is the **company website** (marketing + editorial surface) with:

- A **React / TanStack Start** frontend
- A **Django REST + Admin** backend / CMS
- Two brand themes: **Obsidian** and **Cobalt**

The site must feel: premium, technical, distinctive, confident, humble, editorial, modern, memorable — while still reading as a real software company.

It must **not** feel like: generic AI SaaS, React Bits demo, Lovable template, Framer template, or WebGL showcase.

---

## 2. Non-negotiable principles

1. **Make MaCo look like MaCo** — React Bits is a tool, not the identity.
2. **Do not invent** projects, products, clients, testimonials, metrics, awards, or claims.
3. **Evolve, don’t rebuild** — preserve the editorial foundation.
4. **Keep SystemField** — it is original MaCo geometry; evolve it, don’t delete it.
5. **Two themes** — Obsidian and Cobalt must feel like different modes of the same brand, not a recolor.
6. **Prefer restraint** — motion hierarchy; stillness is allowed.
7. **Performance matters** — max one major animated background per major viewport section.
8. **Accessibility** — honor `prefers-reduced-motion`; keep keyboard / focus / semantics.

---

## 3. Repository layout

```
maco-website-v2/
├── AI_HANDOFF.md          # Agent handoff (live status)
├── CONTEXT.md             # This file
├── PROJECT_STATUS.md
├── ROADMAP.md
├── DOCS.md
├── README.md
├── AGENTS.md              # Lovable-connected note (history safety)
├── frontend/              # React app
│   ├── src/
│   │   ├── components/    # chrome, hero, system-field, theme, UI
│   │   ├── content/maco.ts
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── routes/        # file-based TanStack routes
│   │   ├── styles.css     # design tokens + utilities
│   │   ├── router.tsx
│   │   ├── server.ts
│   │   └── start.ts
│   ├── public/brand/      # lockup PNGs
│   ├── package.json
│   └── vite.config.ts
└── backend/               # Django
    ├── maco/              # settings, urls, wsgi
    ├── content/           # models, API, admin, seed_content
    ├── manage.py
    ├── requirements.txt
    ├── .env.example
    └── venv/              # local virtualenv (gitignored)
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
| UI primitives | Radix / shadcn-style under `components/ui` |
| Data (client) | TanStack Query (wired in root) |
| Motion | `motion` package installed; hero/system field currently use CSS vars + scroll hooks |
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

### Not installed (by design unless needed later)

- GSAP
- Lenis
- Official React Bits npm mega-bundle
- Multiple simultaneous WebGL backgrounds

---

## 5. Brand & messaging

| Field | Value |
|-------|--------|
| Name | MaCo |
| Category | Software / IT solutions |
| Tagline | Software and IT solutions for products that need to work. |
| Statement | MaCo builds and maintains software that carries real operational weight — client platforms, internal tooling and the systems people log into every working day. |
| Email | hello@maco.dev |
| Location | Kochi, Kerala, India |

Tone: factual, simple, confident. Avoid “passionate team revolutionizing digital transformation.”

---

## 6. Confirmed content catalog

Source: `frontend/src/content/maco.ts` (mirrors planned DRF schema).

### Services (5)

1. **Web Development** — `web-development`
2. **App Development** — `app-development`
3. **Technical Support** — `technical-support`
4. **Software Support** — `software-support`
5. **Social Media Managing** — `social-media-managing`

### Projects / selected work (4)

1. **Ananta Nethralaya** — eye clinic website — `ananta-nethralaya`
2. **Al Afzah** — Qatar construction company website — `al-afzah`
3. **Soorath Autos** — used-car dealership website — `soorath-autos`
4. **HeadGreen** — EV fleet/cab service (Kochi) website — `headgreen`

### Products (2)

1. **Driver’s Diary** — PWA/platform for HeadGreen ops (attendance, rides, payroll, docs, reporting) — `drivers-diary`
2. **Bridge** — MaCo’s own SaaS/PWA + desktop task/project platform — `bridge`  
   → Bridge should receive the strongest product treatment.

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
| `/` | `routes/index.tsx` | Home (hero, capability, work, products, multilingual, services, clients, process, CTA) |
| `/services` | `services.index.tsx` | Services index |
| `/services/$slug` | `services.$slug.tsx` | Service detail |
| `/work` | `work.index.tsx` | Work index |
| `/work/$slug` | `work.$slug.tsx` | Case study |
| `/products` | `products.index.tsx` | Products index |
| `/products/$slug` | `products.$slug.tsx` | Product detail |
| `/clients` | `clients.tsx` | Clients |
| `/about` | `about.tsx` | About |
| `/contact` | `contact.tsx` | Contact / lead |
| `__root.tsx` | Shell, theme, header/footer, SEO head links |

Nav labels: Services, Work, Products, Clients, About, Contact.

---

## 8. Backend API (target)

Documented in `backend/README.md`. Typical base: `/api/v1/`

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
| POST | `/api/v1/contact/` | Lead capture (throttled, honeypot) |

Writes (except contact) via Django Admin only.

Frontend contact should eventually use `VITE_API_BASE_URL=http://localhost:8000`.

---

## 9. Design system

### Themes

Stored in `localStorage` key `maco-theme`. Applied as `data-theme` on `<html>`.

#### Obsidian

- **White canvas** + black ink system
- Architectural, monochrome, precise, editorial
- Display: **Bricolage Grotesque**; alt: **Syne**; body: **Instrument Sans**; technical: **IBM Plex Sans**; accent: **Anybody**

#### Cobalt

- **White canvas** + MaCo blue ink system
- Kinetic, confident, modern, expressive
- Display: **Anybody**; alt: **Bricolage**; body: Instrument Sans; technical: **IBM Plex Sans**; accent: **Syne**

Both themes share a light foundation. Theme switch changes ink, accent, borders, atmosphere, and interaction — not page background to dark/blue fills.

Tokens live in `frontend/src/styles.css` (`--bg`, `--surface`, `--text`, `--muted`, `--line`, `--accent`, font tokens).

### Typography tokens

| Token | Role |
|-------|------|
| `--font-display` / `--maco-font-display` | Large headlines (MA/CO) |
| `--font-display-alt` | Secondary display (e.g. CO line) |
| `--font-body` | Body copy |
| `--font-ui` | UI chrome |
| `--font-technical` | Labels / mono-like UI (`label`, buttons) |
| `--font-accent` | Experimental accent |
| `--font-script-fallback` | Multilingual scripts (Noto families) |

Fonts loaded via Google Fonts link in `__root.tsx` head.

### Structural utilities

`shell`, `rule-t` / `rule-b`, `label`, `display-xl|lg|md`, `grid-field`, `link-draw`, `index-row`, `btn-solid`, `btn-line`, `reveal`, `reveal-clip`.

### Brand assets

- `/brand/maco-lockup-white.png`
- `/brand/maco-lockup-black.png`
- `/favicon.png`

---

## 10. Signature components

### Hero (`components/hero.tsx`, `components/hero/hero-monument.tsx`)

- **THE MONUMENT** (Phase 17 v3) — a single centered cinematic stage: the *exact* `white-logo.png` mark rendered as one sculptural object. No grid, no beams, no glow pile.
- Chrome row (`MA.CO` + category) → centered monument → short editorial caption (tagline, statement, CTAs).
- **Monument layers** — room (restrained backdrop) → core (the real mark resolves out of a blur) → material + one light-pass sweep, both **masked to the mark** via `mask-image: url("/white-logo.png")` so light never escapes the silhouette → hairline datum → faint plinth pool.
- **Entrance is CSS-timed (plays on first paint):** chrome → room → core -> sweep → datum → caption (~0–2.4s).
- **Pointer** (desktop, pointer-fine only): subtle figure parallax via `--monument-px/py`.
- **Scroll choreography** — scroll gently recedes the whole scene (`--hero-recede` 1→~0): lifts and slightly condenses; copy floor ~0.68, never a global fade-to-zero.
- **Reduced motion** — resolved state: mark crisp, datum drawn, plinth visible, no film.
- **React Bits Beams removed** in this reset. MaCoGlobe lives on About.

### MaCoGlobe (`components/hero/MaCoGlobe.tsx`)

- `react-globe.gl` with transparent renderer background
- Natural Earth country polygons (`/geo/countries-110m.geojson`)
- 12 network nodes, 24 arcs; Obsidian/Cobalt theme differentiation
- Client-only mount; reduced-motion disables rotation/arc animation
- Relocated to About page (`/about`, "Where we are")

### Homepage motion sections (`components/sections/`, original MaCo, Phase 18)

Motion hierarchy reserved for signature moments; all implemented with the installed `motion` library + CSS transforms (no Pro React Bits):

- **WorkStrip** (`work-strip.tsx`) — pinned horizontal "cinema" rail; desktop stage = N×100vh, cards glide laterally with scroll; mobile/reduced = editorial list.
- **ProcessSticky** (`process-sticky.tsx`) — pinned A→B→C→D; giant step letter + progress rail, scroll-walked; reduced = static list.
- **ClientsTicker** (`clients-ticker.tsx`) — restrained scroll-velocity marquee of the four real client names; reduced = static grid.
- **ServiceVocabulary** (`service-vocabulary.tsx`) — interactive capability vocabulary: the five real services selectable, opening their capabilities + real work evidence; keyboard-accessible.
- **ProductsSection** (`products-section.tsx`) — Bridge flagship gets a scroll-linked contained→resolved expand plus SpotlightCard; Driver's Diary quieter depth card.
- **SpotlightCard** (`ui/spotlight-card.tsx`) — original CSS-var radial pointer spotlight.
- **CTABanner** (`cta-banner.tsx`) — large directional closing type, gentle scroll drift.

### MaCo System Field (`components/system-field.tsx`)

- 6×6 grid; active cells form logo-derived geometry
- Pointer proximity (desktop)
- Scroll intensity
- Theme-aware fill / soft cobalt glow
- Respects reduced motion
- Re-exported from `mark.tsx` as `SystemField`
- **Only in Signature section** — not in Hero

### Theme atmosphere (`components/theme-atmosphere.tsx`)

- Obsidian: CSS/SVG thread lines (Threads-inspired, no WebGL)
- Cobalt: soft aurora blurs (Aurora-inspired, no WebGL)
- Reduced motion: static wash only

### Multilingual Identity (`components/multilingual-identity.tsx`)

- Placement: after Products, before Services on Home
- Label: `Global identity / 01`
- Headline: One name. Many scripts.
- **20 distinct scripts** in oval hive around center; Latin **MaCo** only at center (not repeated in orbit)
- **Center language cycle** — viewport-gated via `use-center-language-cycle.ts`; defaults/resets to **MaCo**
- Transition: `CenterScriptTransition` (blur resolve, ~620ms)
- Scroll choreography: appear → travel → converge → resolve (surrounding scripts)
- Desktop pointer proximity; reduced motion: static MaCo
- Footer echo line in `chrome.tsx` Footer

Supporting files: `components/multilingual/use-center-language-cycle.ts`, `components/multilingual/center-script-transition.tsx`

Scripts: Indian (Malayalam, Tamil, Telugu, Kannada, Hindi, + Gujarati, Punjabi, Bengali, Odia) + Arabic, Persian, Hebrew, Cyrillic, Greek, Armenian, Georgian, Thai, CJK. Latin languages use **MaCo** at center only.

### Chrome (`components/chrome.tsx`)

- Desktop: editorial sticky header + theme switch + Start a project
- Mobile: floating bottom **pill** menu (custom MaCo pill; React Bits Pill Nav evaluated as candidate to refine later)

### Theme (`components/theme.tsx`)

- `ThemeProvider`, `useTheme`, themes `obsidian` | `cobalt`

---

## 11. React Bits policy

Official catalogue: [https://reactbits.dev/](https://reactbits.dev/)

| Policy | Detail |
|--------|--------|
| Use | Only if it strengthens MaCo identity |
| Free vs Pro | Free/open only unless licensed; never copy locked Pro preview code |
| Integration style | Prefer MaCo wrappers / CSS-native adaptations over dumping demos |
| Density | 1 major BG + 1 major text motion + 1 cursor interaction per area max |

### Used (as of 2026-08-14)

- **Blur Text** (free pattern) → Hero tagline
- **Scroll Reveal** (free pattern) → Home services list
- **CenterScriptTransition** (custom, blur-resolve) → Multilingual center cycle
- **Inspired adaptations:** Threads → Obsidian threads SVG; Aurora → Cobalt aurora CSS; Pill Nav → custom mobile pill

> **Important (2026-08-14 Phase 18):** Scroll Expand, Scroll Stack, Flying
> Posters, Scroll Velocity, Variable Proximity and Spotlight Card are now
> **React Bits Pro (paid-license) components**. AGENTS §22 forbids copying
> locked Pro code without a license. The homepage motion choreography
> therefore ships as **original MaCo components** built on the installed
> `motion` library + existing scroll hooks:
>
> - `components/sections/work-strip.tsx` — pinned horizontal "cinema" rail
> - `components/sections/process-sticky.tsx` — pinned A→B→C→D progression
> - `components/sections/clients-ticker.tsx` — scroll-velocity marquee
> - `components/sections/service-vocabulary.tsx` — interactive capability vocabulary
> - `components/sections/products-section.tsx` — Bridge flagship scroll-expand + spotlight
> - `components/ui/spotlight-card.tsx` — original CSS-var pointer spotlight
> - `components/sections/cta-banner.tsx` — large directional closing type
>
> `Beams` (three/R3F) was removed from Hero in the Phase 17 v3 reset.

### Rejected / deferred

- Stacked WebGL backgrounds
- Glitch/scramble text
- Magic Bento everywhere
- Gooey / Card Nav replacing desktop editorial nav
- Heavy cursor trails
- Multiple simultaneous WebGL backgrounds
- **Pro-only React Bits (Scroll Expand, Scroll Stack, Flying Posters, Scroll Velocity, Variable Proximity, Spotlight Card)** — replaced with original MaCo equivalents (no license).

---

## 12. Motion hierarchy

| Level | Use |
|-------|-----|
| L1 | Simple reveal (`reveal`, `reveal-clip`) |
| L2 | Section movement / scroll progress |
| L3 | Signature — Hero + Multilingual (+ SystemField) only |

Easing: `--ease-standard`, `--ease-emphasis`.

Hooks: `useReducedMotion`, `useElementScrollProgress`.

---

## 13. Accessibility & reduced motion

- Semantic landmarks, skip link in root
- Focus-visible outline via `--focus`
- Theme switch has aria-label
- Mobile menu: `aria-expanded` / `aria-controls`
- Reduced motion: disable aurora/thread/scan/reveal animations; SystemField skips pointer lift; hero scroll transforms zeroed when reduced

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
# create DB maco in Postgres if needed
python manage.py migrate
python manage.py seed_content
python manage.py createsuperuser
python manage.py runserver 8000
```

→ Admin http://127.0.0.1:8000/admin/  
→ API http://127.0.0.1:8000/api/v1/

### Vite note

Do **not** add a separate `TanStackRouterVite({ autoCodeSplitting: true })` alongside `tanstackStart()` — causes `TSRSplitComponent is not defined` 500s.

---

## 15. Environment variables (backend)

See `backend/.env.example`:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DATABASE_URL` (default postgres://postgres:postgres@localhost:5432/maco)
- `CORS_ALLOWED_ORIGINS`
- `DEFAULT_FROM_EMAIL`
- `LEAD_NOTIFICATION_EMAIL`

---

## 16. What must never be claimed falsely

Do not document as done unless verified:

- “React Bits integrated” → only if components exist in repo
- “tested / responsive / accessible” → only if checks were run
- “everything complete” → only if roadmap done

---

## 17. Related reading order for next AI

1. `AI_HANDOFF.md`
2. `PROJECT_STATUS.md`
3. `CONTEXT.md` (this file)
4. `ROADMAP.md`
5. `frontend/package.json`
6. `frontend/src/styles.css`
7. `frontend/src/content/maco.ts`
8. `frontend/src/components/hero.tsx`, `system-field.tsx`, `multilingual-identity.tsx`, `chrome.tsx`
