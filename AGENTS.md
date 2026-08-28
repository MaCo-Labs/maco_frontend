AGENTS.md — MaCo Website AI Development Guide

Persistent operating instructions for AI coding agents working on the MaCo website.

Core workflow: AUDIT → PLAN → VALIDATE PLAN → IMPLEMENT → TEST → QA → DOCUMENT → HANDOFF.

Note (2026-08-21): this file was rewritten to match the current codebase. The
previous version specified a hero/SystemField architecture and a multilingual
identity section that were built, then replaced during the homepage reset —
if you find an older cached copy of this file, or a doc that still describes
that architecture, distrust it and read `CONTEXT.md` §10 instead.


1. PROJECT IDENTITY

Company: MaCo — a software / IT solutions company based in Kochi, Kerala, India.

Tagline: "Software and IT solutions for products that need to work."

The website is MaCo's company/portfolio site. Its goals:

- present MaCo professionally
- showcase real completed client projects
- showcase MaCo's own products
- explain services
- communicate technical credibility without fake claims
- create a distinctive brand experience
- generate project/contact enquiries

The website must feel like a real technology company, not an AI-generated template.

2. DESIGN NORTH STAR

The site must be: premium, technical, distinctive, confident, humble, editorial, modern, memorable, responsive, accessible, performant.

It must NOT feel like: AI boilerplate, generic SaaS, generic agency template, Lovable demo, Framer clone, React Bits showcase, animation gallery, excessive glassmorphism, excessive gradients/glows, "more effects = better design".

Fundamental rule: MaCo identity first. Effects second. Every effect/component must answer: does this make MaCo more recognizable, useful, premium, or memorable? If not, reject it.

3. SOURCE-OF-TRUTH ORDER

When sources conflict, in this order:

1. actual source code and runtime behavior
2. actual repository content/data (`frontend/src/content/maco.ts`)
3. `CONTEXT.md`
4. `PROJECT_STATUS.md` / `AI_HANDOFF.md`
5. `ROADMAP.md`
6. `DOCS.md` / `README.md`
7. this AGENTS.md
8. old AI conversation/history

Never trust a documented completion percentage without inspecting the code. If docs conflict with code: inspect, determine the real state, update docs. Docs on this project have drifted from the code before (see the 2026-08-21 cleanup in `CONTEXT.md` §11) — don't let it happen again.

4. REQUIRED FIRST READ

Before making changes, read `CONTEXT.md`, `PROJECT_STATUS.md`, `ROADMAP.md`, `AI_HANDOFF.md`.

Then inspect: `package.json`, current git status, current routes, `styles.css`, `content/maco.ts`, the theme system (`components/theme.tsx`), and the homepage sections (`components/home/*`).

Do not start coding until the existing implementation is understood.

5. PLAN-FIRST PROTOCOL — MANDATORY

For any substantial task:

Step 1 — AUDIT: what exists, what works, what's broken/partial, what must be preserved, what should change, dependencies, risks, performance/responsive/accessibility implications.

Step 2 — PLAN: for every phase — objective, files likely affected, implementation approach, dependencies, risks, validation, completion criteria.

Step 3 — CHALLENGE THE PLAN: can existing code be reused? Is this refactor necessary? Are we adding unnecessary dependencies? Are we duplicating the motion vocabulary (`components/motion/*`)? Will this hurt SSR/hydration, mobile, accessibility, performance? Does this strengthen MaCo identity?

Step 4 — IMPLEMENT one phase at a time.

Step 5 — TEST after meaningful phases (`bun run build`, `bun run lint`).

Step 6 — QA — runtime and visual, in a real browser.

Step 7 — DOCUMENT — update the project-state docs (§ Documentation checkpoints below).

6. CURRENT TECHNICAL DIRECTION

Frontend: React 19, TypeScript (strict), TanStack Start + TanStack Router, Vite 8, Tailwind CSS v4, GSAP (`ScrollTrigger`/`SplitText`) + Lenis for scroll, `motion` v13 for discrete UI state, raw `three` for WebGL. Full stack detail in `CONTEXT.md` §4.

Backend: Django 5 + Django REST Framework + Django Admin (the internal CMS) + PostgreSQL.

Do not migrate frameworks merely for preference. Preserve the current architecture unless there is a demonstrated problem.

Hosting: not yet decided — see `ROADMAP.md`. Don't pick or configure a host without discussing it; this isn't a "just choose one" decision.

7. REAL PROJECTS

Real completed MaCo projects — do not invent metrics, testimonials, or claims beyond what's in `content/maco.ts`:

- Ananta Nethralaya — eye clinic — https://www.anantanethralaya.org/
- Al Afzah — Qatar construction company — https://www.al-afzahgroup.com/
- Soorath Autos — used-car dealership — https://www.soorathautos.in/
- HeadGreen — EV fleet / corporate EV cab service, Kochi — https://headgreen.in/

8. REAL PRODUCTS

- Driver's Diary — PWA for HeadGreen operational management (attendance, rides, payroll, docs, reports)
- Bridge — MaCo's own SaaS/PWA/desktop platform for task/project management, team collaboration, analysis. Deserves the strongest presentation because it's MaCo's own product — it's the site's only real video footage (EVIDENCE section, PRODUCTS' first card).

Do not invent undocumented functionality or deployment URLs — verify current ones against `content/maco.ts` before citing them.

9. SERVICES

Current services (2 — collapsed from an earlier 5 on 2026-08-18):

- Business Software — Task Management, CRM, Custom Software
- Digital Solutions — Websites, E-commerce, Branding and Design, Social Media Management

Do not invent additional services or fake capabilities.

10. NO FABRICATED CONTENT

Never invent: clients, testimonials, awards, certifications, revenue, employee counts, customer counts, years of experience, partnerships, performance metrics, case-study results, rankings, "industry leader" claims.

Use actual project/product information from `content/maco.ts`. If information is missing: use neutral copy, prepare a CMS field, or flag it.

11. SITE INFORMATION ARCHITECTURE

Primary areas: Home, Services, Work, Products, Clients, About, Contact. Primary CTA: "Start a project". Desktop nav stays concise/editorial; mobile uses the floating pill nav (`chrome.tsx`).

12. TWO-THEME SYSTEM

Two official themes, `data-theme="obsidian" | "cobalt"` — see `CONTEXT.md` §9 for the exact font mapping.

**Obsidian** — architectural, monochrome, technical, quiet, editorial, precise. Near black / white / neutral gray, subtle borders, restrained grid. Avoid: purple AI glow, excessive neon, generic glass effects, noisy backgrounds.

**Cobalt** — kinetic, energetic, technical, confident, modern, expressive. Deep cobalt / white / controlled blue accents. Do not implement Cobalt as "Obsidian with a blue background" — the differentiator is a genuinely separate font set (§13), not just accent-color swaps.

Both themes must still clearly be MaCo.

13. TYPOGRAPHY

Actual current fonts — split per theme, not shared:

| Role | Obsidian | Cobalt |
|---|---|---|
| Display | Unbounded | Michroma |
| Body | Jost | Tenor Sans |
| Label | Agdasima | Krona One |

Loaded via one combined Google Fonts request in `routes/__root.tsx`. Don't add new families without checking they're actually available at the weights you need (Michroma/Tenor Sans/Krona One are single-static-weight — no weight axis).

14. REACT BITS

Reference catalogue: https://reactbits.dev/ — a technique source, not the MaCo design system, and not an npm dependency in this project. Take the *concept*, reimplement on the installed stack (`motion`/GSAP/`three`) — never copy files, never add `ogl` or another WebGL runtime alongside `three`.

Before adopting any technique: check accessibility, mobile behavior, performance, and MaCo fit. One strong effect beats five competing ones. Document significant adopt/reject decisions in `CONTEXT.md` (it already records the current adopted set and the historical reverts).

15. WORK / PRODUCT / SERVICE PRESENTATION

Work: the 4 real projects (§7), presented via `summary.tsx`'s `FeaturedWork` card grid on the homepage (Cuberto-parity rebuild, `CONTEXT.md` §10) and a full case-study route (`/work/$slug`).

Products: Driver's Diary + Bridge (§8), Bridge gets the stronger visual treatment.

Services: the 2 current services (§9), presented clearly and restrained — no invented capability metrics.

Do not invent features, screenshots, or UI previews that don't exist.

16. BACKEND / CMS DIRECTION

Django Admin is the internal CMS/control surface. Backend supports: projects, products, services, clients, images, descriptions, external links, ordering, featured status, contact submissions. Don't over-engineer fields before the frontend/content requirements justify them.

When changing Django: inspect models, serializers, views, URLs, admin, migrations first. Never create destructive migrations blindly.

17. FRONTEND/BACKEND SEPARATION

Frontend: presentation, theme, animation, responsive behavior, interaction. Backend: data, content, persistence, admin, APIs. Don't put business logic inside presentation components. Note: the frontend currently reads content from `frontend/src/content/maco.ts`, not live API calls — only the contact form hits the backend (`CONTEXT.md` §8).

18. PERFORMANCE

Prefer CSS, SVG, transforms, opacity, CSS custom properties. Use Canvas/WebGL only when justified (the OPEN hero shader is the one current example). Avoid: per-frame React state, unnecessary DOM measurements, multiple animation libraries doing the same job, huge particle fields, offscreen animations running continuously. Lazy-load heavy effects (see `globe-section.tsx` for the pattern). One major atmospheric effect per major viewport.

19. DEPENDENCY DISCIPLINE

Before adding a dependency: check whether existing tooling already solves it, assess bundle cost, compatibility, maintenance. The stack already includes GSAP, Lenis, `motion`, and `three` for animation/scroll/3D — don't add a second library covering the same ground. A 2026-08-21 cleanup pass removed 45 unused dependencies (a full shadcn/Radix scaffold that was installed and never wired in) — don't let that happen again: install a primitive when you actually use it, not speculatively.

20. ACCESSIBILITY

Required: semantic headings, keyboard navigation, visible focus, accessible buttons/links/mobile menu/theme switch/CTA, meaningful labels, reduced-motion support. No interaction may require a mouse.

21. REDUCED MOTION

For `prefers-reduced-motion: reduce`: simplify/disable major scroll transforms, pointer effects, animated backgrounds, large typography motion, unnecessary transitions. Keep: content, navigation, CTA, hierarchy. Every cinematic homepage moment needs a designed static fallback (`useReducedMotion()`, 15+ consumers already) — not just a disabled animation.

22. RESPONSIVE QA

Test at minimum: 1440+, 1280, 1024, 768, 430, 390, 375. Check every homepage section, nav (desktop + mobile pill), buttons, footer. No horizontal overflow, clipped CTAs, overlapping animation, unreadable text.

23. SEO / PRODUCTION QUALITY

Preserve/improve where appropriate: page titles, meta descriptions, semantic HTML, alt text, Open Graph metadata, favicon/logo assets, clean URLs, performance. Never invent SEO claims.

24. CODE QUALITY

Prefer: strict TypeScript, focused components, reusable primitives only when useful, centralized theme tokens (`styles.css`), centralized content (`content/maco.ts`), clear names, minimal duplication.

Avoid: giant components, unnecessary abstraction, duplicated animation systems, duplicated theme logic, dead code, unused imports, speculative architecture. Do not suppress errors globally.

25. DO NOT REBUILD THE FOUNDATION

Do not repeatedly restructure the application. Do not migrate routing, frontend architecture, styling, animation architecture, or backend architecture unless there is a demonstrated problem. The objective is to finish the product.

26. GIT SAFETY

Before modifications: `git status`. Do not force push, reset user work, discard unrelated changes, rebase/amend/squash published history, or delete unrelated files. Keep the branch working.

27. TESTING

There is no test suite in this repo (see `PROJECT_STATUS.md`). Run: `bun run build`, `bun run lint`, and (`./node_modules/.bin/tsc --noEmit` on Windows, or `npx tsc --noEmit` elsewhere) for type errors. Never say "tested" unless the command actually ran. If a command is unavailable, document that.

28. MANUAL VISUAL QA

Inspect all routes (Home, Services, Work, Products, Clients, About, Contact, and the `$slug` detail routes) in both themes, at desktop/tablet/mobile widths. Do not rely only on build success — drive it in a real browser (or via the `agent-browser`/`playwright` MCP tools if available) before calling a visual change done.

29. DOCUMENTATION CHECKPOINTS

After meaningful phases, update `AI_HANDOFF.md` and `PROJECT_STATUS.md`; update `ROADMAP.md` when scope changes; update `CONTEXT.md` when stable architecture/design decisions change. Document significant React Bits adopt/reject decisions in `CONTEXT.md`, not scattered across other files.

30. TOKEN / CONTEXT LIMIT PROTOCOL

If context is getting low: do not rush, do not start another large feature, do not leave the project undocumented. Finish the smallest safe edit, save valid code, run `git status` / `git diff --stat`, update `AI_HANDOFF.md` with: current phase, completed work, unfinished work, current file, last successful action, exact next action, known errors, test status. Never trade documentation for one more feature.

31. NEXT-AI BOOTSTRAP

Read `CONTEXT.md` → `PROJECT_STATUS.md` → `ROADMAP.md` → `AI_HANDOFF.md`, then inspect `package.json`, git status, and the actual implementation. Do not restart or redo completed work. Continue from `ROADMAP.md`'s ordered list. If docs disagree with code: trust code, then update docs.

32. PRESERVE THESE DECISIONS

Unless explicitly requested otherwise, preserve: MaCo brand identity, Obsidian/Cobalt two-theme architecture, `SystemField` (kept for `/products/$slug`, §2 rule 3 in `CONTEXT.md`), mobile pill navigation, editorial desktop navigation, Bridge's stronger emphasis, real project information, existing routes, content architecture, the working Django backend, the existing Lenis/GSAP/`motion` split. Improve these; do not casually replace them.

33. FINAL QUALITY BAR

The user should not immediately think "AI website", "Lovable website", "generic agency template", "React Bits demo", or "generic SaaS". MaCo should have its own technology identity; Obsidian and Cobalt should feel like two modes of the same brand; React Bits-derived techniques should enhance the experience without becoming the identity.

34. FINAL OPERATING PRINCIPLE

Optimize for: quality × identity × usability × performance × maintainability.

Prefer: intentional design over effect quantity, correctness over speed, reuse over rewrites, measured motion over chaos, real content over invented content, documented state over undocumented progress, MaCo identity over library identity, production quality over demo quality.

When uncertain: inspect first, question assumptions, plan, then implement.
