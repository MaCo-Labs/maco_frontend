# Four homepage motion sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace WORK (`portfolio-grid.tsx`) with a Cuberto-style hover-reveal list, replace PRODUCTS (`product-story.tsx`) with an Attio-style expanding-window-into-showcase-reel, and add a new CLIENTS section (scroll-scrubbed logo scatter with magnetic hover) between them — while preserving every `GroundHandoff` cross-section continuity pairing.

**Architecture:** Three new, independent section components (`work-reveal.tsx`, `client-field.tsx`, `product-showcase.tsx`) each following this codebase's existing "one registered `@property` custom property written from a single `ScrollTrigger`, read by CSS `calc()` in a `@utility` class" device (already proven by `services-convergence.tsx`'s `ServicesStage` and `motion/raking-surface.tsx`). None of the three ever sets a literal ScrollTrigger `pin: true` — every "pin the section" requirement is implemented as `position: sticky`, which is what keeps each section eligible as the outgoing side of a `GroundHandoff` pair.

**Tech Stack:** React 19, TanStack Start/Router, Tailwind CSS v4, GSAP 3 + ScrollTrigger (via `lib/scroll-runtime.ts`'s lazy singleton and the `useScrollScene()` hook), Framer Motion (`motion/react`) for discrete hover/click state only.

**Spec:** `docs/superpowers/specs/2026-08-20-homepage-motion-sections-design.md`

## Global Constraints

- No literal ScrollTrigger `pin: true` in `work-reveal.tsx`, `client-field.tsx`, or `product-showcase.tsx` — every "pin" in the brief is `position: sticky` instead, so these sections stay safe as `GroundHandoff` outgoing sides.
- All scroll-driven motion goes through GSAP ScrollTrigger via `useScrollScene()` (`@/hooks/use-scroll-scene`). Framer Motion (`motion/react`) is used ONLY for discrete UI state (hover crossfade, magnetic pointer-follow) — never given `useScroll`/anything tied to scroll position.
- Never trigger a React re-render for a continuously-changing value (scroll progress, pointer position). Write scroll-scrubbed values via `element.style.setProperty("--x", ...)` on a registered `@property` custom property inside `ScrollTrigger.onUpdate` (matching `services-convergence.tsx`'s `ServicesStage`), or via `gsap.quickSetter` for raw pointer tracking (matching the brief's explicit instruction for Task 3).
- No fabricated media. Use only real assets already present via `content/maco.ts`'s `clients`, `products`, and `projects` exports (brand marks, `Bridge`'s poster+video, `Driver's Diary`'s poster). Task 1's placeholder is `products.find(p => p.slug === "bridge").media` (via the existing `getProduct("bridge")` helper) — not a fabricated file.
- This repo has no test suite. The verification gate for every task is `npm run build` and `npm run lint`, both run from `frontend/`.
- Every new/replacement section keeps its outer `<section>`'s `data-ground` and `aria-label` exactly as specified per task below — `GroundHandoff` depends on exact `aria-label` string matches (`ground-handoff.tsx`).

---

## Task 1: `styles.css` — registered custom properties and utility classes

**Files:**
- Modify: `frontend/src/styles.css:96` (immediately after the existing `--sweep` `@property` block, before the CAPABILITY `--c`/`--d`/`--reach` block that starts at line 98)
- Modify: `frontend/src/styles.css:648` (immediately after the `grid-column-drift` utility, before the `light-pass` utility comment at line 660)

**Interfaces:**
- Produces: `--scatter` (registered custom property, consumed by Task 3's `ClientField`), `--expand` and `--reel` (registered custom properties, consumed by Task 4's `ProductShowcase`), `.client-tile` / `.product-expand-media` / `.product-reel-media` (`@utility` classes, consumed by Tasks 3 and 4).

- [ ] **Step 1: Add the three new `@property` registrations**

Insert immediately after line 96 (the closing `}` of the existing `--sweep` block, before the `/* CAPABILITY's convergence` comment on line 98):

```css
@property --scatter {
  syntax: "<number>";
  inherits: true;
  /* 1, not 0: the scattered arrangement IS the section's rest state — the
     correct thing to paint for reduced motion, SSR, or a blocked GSAP
     import, same reasoning as --c below (services-convergence.tsx). The
     scroll scrub runs 0 (stacked) -> 1 (scattered) as a gsap.fromTo
     override once the runtime resolves. */
  initial-value: 1;
}
@property --expand {
  syntax: "<number>";
  inherits: true;
  /* 0 = small contained card (today's PRODUCTS resting composition). The
     fullscreen takeover only exists as a scroll-linked effect; a static
     fallback should look like a normal media card, not a permanently
     fullscreen video with no scroll context to explain it. */
  initial-value: 0;
}
@property --reel {
  syntax: "<number>";
  inherits: true;
  /* 0 = Bridge showing, Driver's Diary not yet crossfaded in — pairs with
     --expand's 0 above so the two properties agree on one coherent rest
     frame instead of each defaulting independently. */
  initial-value: 0;
}
```

- [ ] **Step 2: Add the three new `@utility` classes**

Insert immediately after line 658 (the closing `}` of `grid-column-drift`), before the `/* Light pass` comment on line 660:

```css
/* CLIENTS' scatter tiles — client-field.tsx. Each tile is positioned
   dead-centre (top/left 50%, translate -50%/-50%) then displaced by its
   own hand-authored --tx/--ty/--rot (set inline per tile, unitless
   numbers consumed as vw/vh/deg here) scaled by the inherited --scatter
   (0 = stacked centre, 1 = fully scattered — see the @property above).
   The ambient float tween (a plain gsap.to, no ScrollTrigger) targets a
   SEPARATE inner element, never this one — stacking two transform
   sources on one element is the bug portfolio-grid.tsx's GridCard doc
   comment already flagged and split around; the same split applies here. */
@utility client-tile {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0)
    translate3d(
      calc(var(--tx, 0) * 1vw * var(--scatter, 1)),
      calc(var(--ty, 0) * 1vh * var(--scatter, 1)),
      0
    )
    rotate(calc(var(--rot, 0) * 1deg * var(--scatter, 1)))
    scale(calc(0.72 + 0.28 * var(--scatter, 1)));
  opacity: clamp(0, calc(0.55 + 0.45 * var(--scatter, 1)), 1);
}

/* PRODUCTS' expanding window (Task 1 of the brief) — product-showcase.tsx.
   Sized via calc() off the inherited --expand (0 = small card, 1 =
   fullscreen — see the @property above), positioned by a --expand-radius
   custom property declared right here so <ProductVideo>'s own `radius`
   prop (a literal "var(--expand-radius)" string, never a per-render
   value) can clip the actual <video>/<img> element — an ancestor's
   border-radius doesn't reliably clip <video> in every engine, per
   media/product-video.tsx's own doc comment. --reel (0..1, driven by the
   same trigger, see the @property above) fades/tilts this panel OUT as
   the reel's second phase crossfades to product-reel-media below. */
@utility product-expand-media {
  position: absolute;
  inset: 0;
  margin: auto;
  overflow: hidden;
  width: calc(58% + var(--expand, 0) * 42%);
  height: calc(58% + var(--expand, 0) * 42%);
  --expand-radius: calc((1 - var(--expand, 0)) * 2rem);
  border-radius: var(--expand-radius);
  transform: scale(calc(1 - var(--reel, 0) * 0.08)) rotateY(calc(var(--reel, 0) * -10deg));
  opacity: clamp(0, calc(1 - var(--reel, 0) * 1.6), 1);
}

/* PRODUCTS' reel second phase (Task 4) — the same stage, crossfading in
   as --reel goes 0 -> 1 once product-expand-media above has fully
   expanded. Always full-bleed (no size scrub of its own) since it only
   becomes visible after the expand phase has already reached fullscreen. */
@utility product-reel-media {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 0;
  transform: translate3d(calc((1 - var(--reel, 0)) * 8%), 0, 0)
    rotateY(calc((1 - var(--reel, 0)) * 10deg));
  opacity: var(--reel, 0);
}
```

- [ ] **Step 3: Verify the build**

Run: `cd frontend && npm run build`
Expected: succeeds with no CSS/Tailwind errors (Tailwind v4's `@property`/`@utility` at-rules are unchanged in shape from the existing blocks directly above/below each insertion — this step only adds new blocks, doesn't touch existing ones).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/styles.css
git commit -m "Add --scatter/--expand/--reel custom properties and their utility classes"
```

---

## Task 2: `work-reveal.tsx` — WORK replacement (Cuberto-style hover reveal)

**Files:**
- Create: `frontend/src/components/home/work-reveal.tsx`

**Interfaces:**
- Consumes: `projects` and `Project` from `@/content/maco`; `Magnetic` from `@/components/motion/magnetic`; `ScrubReveal` from `@/components/motion/scrub-reveal`; `Stagger` from `@/components/motion/stagger`; `getScrollRuntime` from `@/lib/scroll-runtime`; `Link` from `@tanstack/react-router`; `motion`/`AnimatePresence` from `motion/react`. Existing CSS utilities `.index-row`, `.stagger-item`, `.label`, `.display-lg`, `.display-md`, `.shell`, `.rule-t`, `.btn-line` (all already in `styles.css`, no changes needed).
- Produces: `export function WorkReveal()` — outer `<section data-ground="paper" aria-label="Selected client work">`, rendered by Task 5 in place of `PortfolioGrid`.

- [ ] **Step 1: Write the component**

```tsx
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { projects, type Project } from "@/content/maco";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { getScrollRuntime } from "@/lib/scroll-runtime";

/**
 * WORK — Cuberto-style hover-reveal list. Replaces portfolio-grid.tsx's
 * two-column tilt grid. A typography list of the same 4 real client
 * projects; hovering (or focusing, for keyboard parity) a title swaps the
 * floating panel to that project's brand-mark-on-plate — the same
 * tokenized backdrop device the old grid used (ProjectPlate below), since
 * no project photography exists in the repo (see AGENTS.md's
 * no-fabricated-content rule).
 *
 * Pin-free — no ScrollTrigger pin anywhere in this file. Required to stay
 * eligible as the outgoing side of GroundHandoff's WORK -> CLIENTS pair.
 *
 * Which project is ACTIVE is real React state (a discrete change, ~4
 * times a visit) so Framer's <AnimatePresence> can key the crossfade —
 * that's the brief's carve-out for Framer on discrete UI state. The
 * panel's cursor-follow Y position is a CONTINUOUS pointer value, so it's
 * written via gsap.quickSetter on a raw pointermove handler, never React
 * state — the brief names this exact device for this exact case.
 */
export function WorkReveal() {
  return (
    <section data-ground="paper" className="rule-t" aria-label="Selected client work">
      <div className="shell py-24 md:py-32">
        <ScrubReveal hold>
          <p className="label">Work</p>
          <h2 className="display-lg mt-3 max-w-2xl" style={{ color: "var(--text)" }}>
            Four clients. Real software, in production.
          </h2>
        </ScrubReveal>

        <WorkList />

        <div className="mt-10 flex justify-end">
          <Magnetic>
            <Link to="/work" className="btn-line">
              All work <span aria-hidden="true">→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

function WorkList() {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const setPanelY = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    getScrollRuntime().then((rt) => {
      if (cancelled || !rt || !panelRef.current) return;
      setPanelY.current = rt.gsap.quickSetter(panelRef.current, "y", "px");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function onListPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const list = listRef.current;
    if (!list || !setPanelY.current) return;
    const rect = list.getBoundingClientRect();
    // Clamp to the list's own bounds and centre the panel (roughly half
    // its own height, 140px) on the pointer, so it never drifts past the
    // rows it's tracking.
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    setPanelY.current(y - 140);
  }

  const activeProject = active !== null ? (projects[active] ?? null) : null;

  return (
    <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div ref={listRef} onPointerMove={onListPointerMove} className="relative">
        <Stagger
          as="div"
          gap={0.12}
          band={0.4}
          className="divide-y divide-line border-t border-line"
        >
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              to="/work/$slug"
              params={{ slug: project.slug }}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onPointerLeave={() => setActive((cur) => (cur === i ? null : cur))}
              onBlur={() => setActive((cur) => (cur === i ? null : cur))}
              className="stagger-item index-row group flex items-center justify-between gap-4 py-8"
              style={{ "--i": i } as CSSProperties}
            >
              <span className="relative z-[1] flex items-baseline gap-4">
                <span className="label">{project.index}</span>
                <span className="display-md" style={{ color: "var(--text)" }}>
                  {project.title}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="label relative z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ color: "var(--muted)" }}
              >
                {project.sector}
              </span>
            </Link>
          ))}
        </Stagger>
      </div>

      {/* Desktop-only floating panel — mobile gets every project's plate
          inline below instead, since hover doesn't exist there. */}
      <div className="relative hidden lg:block">
        <div
          ref={panelRef}
          className="pointer-events-none absolute left-0 top-0 w-full max-w-sm"
          style={{ willChange: "transform" }}
        >
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject.slug}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <ProjectPlate project={activeProject} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:hidden">
        {projects.map((project) => (
          <ProjectPlate key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectPlate({ project }: { project: Project }) {
  return (
    <div
      data-ground="deep"
      className="relative aspect-[4/5] overflow-hidden rounded-2xl"
      style={{ background: "color-mix(in oklab, var(--accent) 30%, var(--surface))" }}
    >
      <div
        className="absolute inset-6 flex items-center justify-center rounded-xl border border-line md:inset-10"
        style={{ background: "var(--surface-2)" }}
      >
        {project.brand ? (
          <img
            src={project.brand.src}
            alt={project.brand.alt}
            width={project.brand.width}
            height={project.brand.height}
            loading="lazy"
            decoding="async"
            className="max-h-[45%] w-auto object-contain"
          />
        ) : (
          <span className="label" style={{ color: "var(--muted)" }}>
            {project.title}
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build and lint**

Run: `cd frontend && npm run build && npm run lint`
Expected: both succeed. This file isn't imported anywhere yet (Task 5 wires it up), so a clean build here means it's free of type/syntax errors in isolation.

- [ ] **Step 3: Manual visual check**

Run: `cd frontend && npm run dev`, then temporarily render `<WorkReveal />` in place of `<PortfolioGrid />` in `routes/index.tsx` to eyeball it in the browser (revert this temporary edit before committing — Task 5 does the real wiring). Confirm: hovering/focusing a title swaps the panel's project without a layout jump; the panel follows the cursor's Y position smoothly; keyboard Tab through the list also triggers the swap; below `lg` width, all 4 plates render inline with no hover needed.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/home/work-reveal.tsx
git commit -m "Add WorkReveal: Cuberto-style hover-reveal replacement for WORK"
```

---

## Task 3: `client-field.tsx` — CLIENTS (new section)

**Files:**
- Create: `frontend/src/components/home/client-field.tsx`

**Interfaces:**
- Consumes: `--scatter` and `.client-tile` from Task 1 (`styles.css`); `clients`/`Client` from `@/content/maco`; `Magnetic` from `@/components/motion/magnetic`; `ScrubReveal` from `@/components/motion/scrub-reveal`; `useScrollScene` from `@/hooks/use-scroll-scene`.
- Produces: `export function ClientField()` — outer `<section data-ground="paper" aria-label="Who we work with">`, rendered by Task 5 between `WorkReveal` and `ServicesConvergence`.

- [ ] **Step 1: Write the component**

```tsx
import { useRef, type CSSProperties } from "react";
import { clients, type Client } from "@/content/maco";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * Hand-authored scatter targets for the 4 real clients — asymmetric, not
 * randomly generated (nothing to gain from runtime randomization at n=4).
 * tx/ty are unitless numbers consumed as vw/vh by the .client-tile utility
 * (styles.css) so the scatter scales with viewport size; rot is degrees.
 */
const SCATTER: readonly { tx: number; ty: number; rot: number }[] = [
  { tx: -20, ty: -12, rot: -7 },
  { tx: 18, ty: -16, rot: 5 },
  { tx: -16, ty: 14, rot: 4 },
  { tx: 22, ty: 12, rot: -5 },
];

/**
 * CLIENTS — new section between WORK and CAPABILITY. Scroll-scrubbed (not
 * pinned) stack -> scatter of the same 4 client logos WORK's plates and
 * RECORD's wall already show — accepted repetition, not a defect (see the
 * design spec's content-reality section). Desktop-only past the
 * scatter/float/magnetic treatment; below `lg`, a static 2x2 grid mirrors
 * RECORD's own logo-wall layout, so nothing is gated behind an effect
 * that can't run everywhere.
 *
 * Pin-free by design: no ScrollTrigger `pin: true` anywhere in this file.
 * A pinned section can never be the outgoing side of a GroundHandoff pair
 * (see ground-handoff.tsx's doc comment) — staying pin-free keeps that
 * door open even though this spec doesn't give CLIENTS one yet.
 */
export function ClientField() {
  return (
    <section data-ground="paper" className="rule-t" aria-label="Who we work with">
      <div className="shell py-24 md:py-32">
        <ScrubReveal hold>
          <p className="label">Clients</p>
          <h2 className="display-lg mt-3 max-w-2xl" style={{ color: "var(--text)" }}>
            Four companies who trusted us with production software.
          </h2>
        </ScrubReveal>
      </div>

      <div className="lg:hidden">
        <ClientGrid />
      </div>
      <div className="hidden lg:block">
        <ClientScatter />
      </div>
    </section>
  );
}

function ClientGrid() {
  return (
    <div className="shell pb-24">
      <div className="grid grid-cols-2 gap-4">
        {clients.map((client) => (
          <ClientCard key={client.slug} client={client} />
        ))}
      </div>
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  return (
    <a
      href={client.website}
      target="_blank"
      rel="noopener noreferrer"
      className="flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-line p-5 transition-all hover:-translate-y-1 hover:border-text"
      style={{ background: "var(--surface-2)" }}
    >
      {client.brand ? (
        <img
          src={client.brand.src}
          alt={client.name}
          width={client.brand.width}
          height={client.brand.height}
          loading="lazy"
          decoding="async"
          className="h-12 w-auto max-w-full object-contain"
        />
      ) : (
        <span className="font-display text-lg" style={{ color: "var(--text)" }}>
          {client.name}
        </span>
      )}
      <span className="label text-center" style={{ color: "var(--muted)" }}>
        {client.industry}
      </span>
    </a>
  );
}

function ClientScatter() {
  const stageRef = useRef<HTMLDivElement>(null);
  const floatRefs = useRef<Array<HTMLDivElement | null>>([]);

  useScrollScene((rt) => {
    const stage = stageRef.current;
    if (!stage) return;

    rt.gsap.fromTo(
      stage,
      { "--scatter": 0 },
      {
        "--scatter": 1,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      },
    );

    // Ambient float — a separate tween on a separate element per tile
    // (see client-tile's own doc comment in styles.css for why): each
    // tile's own scroll-driven scatter transform lives on the OUTER
    // element (.client-tile, driven by the ScrollTrigger above); this
    // float targets the INNER element, so the two transforms compose
    // across nested elements instead of one clobbering the other.
    floatRefs.current.forEach((el, i) => {
      if (!el) return;
      rt.gsap.to(el, {
        y: "+=10",
        duration: 2.6 + (i % 3) * 0.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
    });
  }, []);

  return (
    <div ref={stageRef} className="relative mx-auto h-[60vh] max-w-5xl px-6">
      {clients.map((client, i) => (
        <div
          key={client.slug}
          className="client-tile"
          style={
            {
              "--tx": SCATTER[i]?.tx ?? 0,
              "--ty": SCATTER[i]?.ty ?? 0,
              "--rot": SCATTER[i]?.rot ?? 0,
            } as CSSProperties
          }
        >
          <div
            ref={(el) => {
              floatRefs.current[i] = el;
            }}
          >
            <Magnetic className="block">
              <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-xl border border-line p-4 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.3)] md:h-32 md:w-32"
                style={{ background: "var(--surface-2)" }}
              >
                {client.brand ? (
                  <img
                    src={client.brand.src}
                    alt={client.name}
                    width={client.brand.width}
                    height={client.brand.height}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-auto max-w-full object-contain"
                  />
                ) : (
                  <span className="label text-center" style={{ color: "var(--text)" }}>
                    {client.name}
                  </span>
                )}
              </a>
            </Magnetic>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify the build and lint**

Run: `cd frontend && npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 3: Manual visual check**

Run: `cd frontend && npm run dev`, temporarily render `<ClientField />` somewhere in `routes/index.tsx` to eyeball it (revert before committing — Task 5 does the real wiring). Confirm: scrolling through the section animates the 4 logos from stacked-centre to their scattered positions and back on scroll-up; once scattered, each logo gently drifts; hovering near (not just exactly over) a logo pulls it toward the cursor and it springs back cleanly on leave; below `lg` width, a plain 2x2 grid renders instead with no scatter/float.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/home/client-field.tsx
git commit -m "Add ClientField: new CLIENTS section with scroll-scrubbed logo scatter"
```

---

## Task 4: `product-showcase.tsx` — PRODUCTS replacement (expanding window into reel)

**Files:**
- Create: `frontend/src/components/home/product-showcase.tsx`

**Interfaces:**
- Consumes: `--expand`/`--reel` and `.product-expand-media`/`.product-reel-media` from Task 1 (`styles.css`); `getProduct`/`Product` from `@/content/maco`; `ProductVideo` from `@/components/media/product-video`; `SurfaceMedia` from `@/components/media/surface-media`; `Magnetic` from `@/components/motion/magnetic`; `ScrubReveal` from `@/components/motion/scrub-reveal`; `Stagger` from `@/components/motion/stagger`; `LineReveal` from `@/components/motion/line-reveal`; `useScrollScene` from `@/hooks/use-scroll-scene`; `clamp01` from `@/lib/motion`.
- Produces: `export function ProductShowcase()` — outer `<section data-ground="paper" aria-label="Products">` (unchanged from today's `product-story.tsx`), rendered by Task 5 in place of `ProductStory`.

- [ ] **Step 1: Write the component**

```tsx
import { useRef, type CSSProperties } from "react";
import { getProduct, type Product } from "@/content/maco";
import { SurfaceMedia } from "@/components/media/surface-media";
import { ProductVideo } from "@/components/media/product-video";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { LineReveal } from "@/components/motion/line-reveal";
import { useScrollScene } from "@/hooks/use-scroll-scene";
import { clamp01 } from "@/lib/motion";

const BRIDGE = getProduct("bridge");
const DRIVERS_DIARY = getProduct("drivers-diary");

/** Progress fraction at which phase 1 (expand) finishes and phase 2
 *  (reel crossfade) begins. */
const PHASE_SPLIT = 0.55;

/**
 * PRODUCTS — Attio-style expanding window (Task 1) resolving into a
 * showcase reel across the 2 real products (Task 4, reframed: the repo
 * has exactly 2 products with media, not a photo/video/GIF library, so
 * the "reel" scrubs Bridge -> Driver's Diary rather than through a
 * per-product gallery that doesn't exist — see the design spec).
 *
 * Desktop (lg+): one `position: sticky` stage inside a tall scroll
 * container. NOT a ScrollTrigger `pin: true` — sticky is what keeps this
 * section eligible as the outgoing side of GroundHandoff's sheet pair
 * into IDENTITY (ground-handoff.tsx's doc comment: a real pin would
 * silently break that transition). One ScrollTrigger drives both --expand
 * and --reel from one onUpdate — the same "one trigger, several
 * setProperty calls" device services-convergence.tsx's ServicesStage uses
 * for --c/--d.
 *
 * Mobile (<lg): plain stacked cards, no sticky, no scrub — mirrors the
 * previous product-story.tsx's own mobile behaviour.
 *
 * Full feature copy for both products renders below the stage regardless
 * of --expand/--reel — nothing textual is exclusive to the animated
 * stage, so its own rest state (see styles.css's --expand/--reel
 * @property comments) is a purely visual choice, not an accessibility one.
 */
export function ProductShowcase() {
  if (!BRIDGE || !DRIVERS_DIARY) return null;

  return (
    <section data-ground="paper" className="rule-t" aria-label="Products">
      <div className="shell py-24 md:py-32">
        <ScrubReveal hold>
          <p className="label">Products</p>
          <LineReveal
            as="h2"
            mode="scrub"
            className="display-lg mt-3 max-w-2xl"
            style={{ color: "var(--text)" }}
          >
            Two platforms we build and run ourselves.
          </LineReveal>
        </ScrubReveal>
      </div>

      <div className="hidden lg:block">
        <ProductStage bridge={BRIDGE} driversDiary={DRIVERS_DIARY} />
      </div>
      <div className="lg:hidden">
        <ProductStack products={[BRIDGE, DRIVERS_DIARY]} />
      </div>

      <div className="shell mt-16 grid gap-14 pb-24 md:pb-32 lg:grid-cols-2 lg:gap-16">
        <ProductDetails product={BRIDGE} />
        <ProductDetails product={DRIVERS_DIARY} />
      </div>
    </section>
  );
}

function ProductStage({ bridge, driversDiary }: { bridge: Product; driversDiary: Product }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useScrollScene((rt) => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    const trigger = rt.ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        stage.style.setProperty("--expand", String(clamp01(p / PHASE_SPLIT)));
        stage.style.setProperty("--reel", String(clamp01((p - PHASE_SPLIT) / (1 - PHASE_SPLIT))));
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[300vh]">
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: "var(--surface)" }}
      >
        <div className="product-expand-media" data-ground="deep">
          {bridge.media && (
            <ProductVideo
              media={bridge.media}
              priority="low"
              objectFit="cover"
              radius="var(--expand-radius)"
            />
          )}
        </div>
        <div className="product-reel-media" data-ground="deep">
          {driversDiary.media && (
            <ProductVideo media={driversDiary.media} priority="low" objectFit="cover" />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductStack({ products }: { products: Product[] }) {
  return (
    <div className="shell space-y-10 pb-4">
      {products.map((product) => (
        <div key={product.slug} data-ground="deep" className="overflow-hidden rounded-2xl">
          <SurfaceMedia
            label={`${product.title} — ${product.kind}`}
            aspect={product.media ? `${product.media.width}/${product.media.height}` : "4/3"}
          >
            {product.media && (
              <ProductVideo media={product.media} priority="low" objectFit="cover" />
            )}
          </SurfaceMedia>
        </div>
      ))}
    </div>
  );
}

function ProductDetails({ product }: { product: Product }) {
  return (
    <div>
      <p className="label">
        {product.owner === "MaCo" ? "MaCo owned" : `Built for ${product.owner}`}
      </p>
      <div className="mt-3 flex items-center gap-3">
        {product.brand && (
          <img
            src={product.brand.src}
            alt=""
            aria-hidden="true"
            width={product.brand.width}
            height={product.brand.height}
            loading="lazy"
            decoding="async"
            className="h-8 w-auto object-contain"
          />
        )}
        <h3 className="display-md" style={{ color: "var(--text)" }}>
          {product.title}
        </h3>
      </div>
      <p className="lead mt-4">{product.short_description}</p>
      <p className="mt-4" style={{ color: "var(--muted)" }}>
        {product.positioning}
      </p>
      <Stagger as="ul" className="mt-6 grid gap-3 sm:grid-cols-2" band={0.4} rise="1rem">
        {product.features.map((f, fi) => (
          <li
            key={f.title}
            className="stagger-item border-t border-line pt-3"
            style={{ "--i": fi } as CSSProperties}
          >
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {f.title}
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              {f.description}
            </p>
          </li>
        ))}
      </Stagger>
      <Magnetic>
        <a
          href={product.live_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-line mt-8"
        >
          Open {product.title} <span aria-hidden="true">↗</span>
        </a>
      </Magnetic>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build and lint**

Run: `cd frontend && npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 3: Manual visual check**

Run: `cd frontend && npm run dev`, temporarily render `<ProductShowcase />` in place of `<ProductStory />` in `routes/index.tsx` to eyeball it (revert before committing — Task 5 does the real wiring). Confirm: scrolling through the ~300vh stage scrubs Bridge's card from small-and-rounded to fullscreen-and-square, then crossfades/tilts into Driver's Diary; scrolling back up reverses cleanly; both products' full feature copy, brand mark, and CTA render below the stage; below `lg` width, both products render as plain stacked cards with no sticky/scrub.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/home/product-showcase.tsx
git commit -m "Add ProductShowcase: expanding-window-into-reel replacement for PRODUCTS"
```

---

## Task 5: Wire up routes, update GroundHandoff, delete old sections

**Files:**
- Modify: `frontend/src/routes/index.tsx`
- Modify: `frontend/src/components/home/ground-handoff.tsx:3-51`
- Delete: `frontend/src/components/home/portfolio-grid.tsx`
- Delete: `frontend/src/components/home/product-story.tsx`

**Interfaces:**
- Consumes: `WorkReveal` (Task 2), `ClientField` (Task 3), `ProductShowcase` (Task 4).

- [ ] **Step 1: Update `routes/index.tsx`**

Replace the imports block:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { OpenLogo } from "@/components/home/open-logo";
import { WorkingSurface } from "@/components/home/working-surface";
import { EvidenceExpand } from "@/components/home/evidence-expand";
import { PortfolioGrid } from "@/components/home/portfolio-grid";
import { ServicesConvergence } from "@/components/home/services-convergence";
import { ProductStory } from "@/components/home/product-story";
import { Identity } from "@/components/home/identity";
import { MethodLine } from "@/components/home/method-line";
import { Record } from "@/components/home/record";
import { CloseIntake } from "@/components/home/close-intake";
import { GroundHandoff } from "@/components/home/ground-handoff";
```

with:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { OpenLogo } from "@/components/home/open-logo";
import { WorkingSurface } from "@/components/home/working-surface";
import { EvidenceExpand } from "@/components/home/evidence-expand";
import { WorkReveal } from "@/components/home/work-reveal";
import { ClientField } from "@/components/home/client-field";
import { ServicesConvergence } from "@/components/home/services-convergence";
import { ProductShowcase } from "@/components/home/product-showcase";
import { Identity } from "@/components/home/identity";
import { MethodLine } from "@/components/home/method-line";
import { Record } from "@/components/home/record";
import { CloseIntake } from "@/components/home/close-intake";
import { GroundHandoff } from "@/components/home/ground-handoff";
```

Replace the `Home()` body:

```tsx
function Home() {
  return (
    <>
      {/* OPEN — the brand alone: mark + "MaCo" */}
      <OpenLogo />

      {/* SURFACE — the promise, the proof row, Bridge in motion (merges the old hero + CLAIM) */}
      <WorkingSurface />

      {/* EVIDENCE — cinematic scroll-expand, Bridge in motion */}
      <EvidenceExpand />

      {/* WORK — four real client projects, as a two-column grid */}
      <PortfolioGrid />

      {/* CAPABILITY — services convergence */}
      <ServicesConvergence />

      {/* PRODUCTS — Bridge + Driver's Diary */}
      <ProductStory />

      {/* IDENTITY — one name, many scripts */}
      <Identity />

      {/* METHOD — A→B→C→D, launch is not the finish line */}
      <MethodLine />

      {/* RECORD — clients + company, deliberate rest */}
      <Record />

      {/* CLOSE — intake + final statement */}
      <CloseIntake />

      {/* Cross-section continuity — renders nothing itself */}
      <GroundHandoff />
    </>
  );
}
```

with:

```tsx
function Home() {
  return (
    <>
      {/* OPEN — the brand alone: mark + "MaCo" */}
      <OpenLogo />

      {/* SURFACE — the promise, the proof row, Bridge in motion (merges the old hero + CLAIM) */}
      <WorkingSurface />

      {/* EVIDENCE — cinematic scroll-expand, Bridge in motion */}
      <EvidenceExpand />

      {/* WORK — four real client projects, Cuberto-style hover-reveal list */}
      <WorkReveal />

      {/* CLIENTS — the same 4 clients, scroll-scrubbed scatter + magnetic hover */}
      <ClientField />

      {/* CAPABILITY — services convergence */}
      <ServicesConvergence />

      {/* PRODUCTS — Bridge + Driver's Diary, expanding window into a showcase reel */}
      <ProductShowcase />

      {/* IDENTITY — one name, many scripts */}
      <Identity />

      {/* METHOD — A→B→C→D, launch is not the finish line */}
      <MethodLine />

      {/* RECORD — clients + company, deliberate rest */}
      <Record />

      {/* CLOSE — intake + final statement */}
      <CloseIntake />

      {/* Cross-section continuity — renders nothing itself */}
      <GroundHandoff />
    </>
  );
}
```

- [ ] **Step 2: Update `ground-handoff.tsx`'s doc comment and `PAIRS`**

Replace the file's opening doc comment (lines 3-45) and `PAIRS` (lines 46-51):

```tsx
/**
 * Cross-section continuity: as the page moves from one section to the
 * next, the OUTGOING section recedes (scale down, dim, drift up) during
 * the natural crossing window instead of just scrolling off — the
 * incoming section then reads as physically overtaking it, rather than
 * merely following it. Mounted once in routes/index.tsx.
 *
 * Deliberately a hand-picked list of pairs, NOT a generic loop over every
 * `[data-ground]` boundary: a `transform` on an ancestor of a
 * `position: fixed` element repositions that fixed element relative to
 * the TRANSFORMED ancestor instead of the viewport — applying this to a
 * section that HOSTS a pin would silently break it. Four of the ten
 * homepage sections host one (directly or, on a `gsap.matchMedia`-gated
 * desktop-only descendant): EVIDENCE, CAPABILITY, IDENTITY, METHOD. WORK
 * (`work-reveal.tsx`) and PRODUCTS (`product-showcase.tsx`) are pin-free —
 * PRODUCTS uses `position: sticky` for its expand/reel stage, never a
 * literal ScrollTrigger `pin: true`, specifically so it stays eligible as
 * the outgoing side below. CLIENTS (`client-field.tsx`, between WORK and
 * CAPABILITY) is pin-free too, but has no pair here — nothing currently
 * calls for one at that boundary. Only the OUTGOING section is ever
 * transformed here (the incoming section is just the ScrollTrigger's
 * reference point, never itself touched) — so a pair is safe whenever the
 * OUTGOING side is pin-free, regardless of what the incoming side hosts.
 *
 * Two of the four pairs (marked `sheet: true` in PAIRS) also get a
 * curved-corner reveal on the INCOMING side: `clip-path: inset(...
 * round ...)` scrubbed from a rounded rect down to square, on the same
 * scrollTrigger window as the recede above, so the two motions read as
 * one gesture. Only applied where the boundary is also a ground change
 * (PRODUCTS -> IDENTITY, RECORD -> CLOSE) — the other two pairs keep a
 * plain recede since their ground doesn't change either side. Unlike the
 * plain recede, this DOES touch the incoming section — so the "outgoing
 * side pin-free" rule above isn't sufficient for a `sheet: true` pair; the
 * INCOMING side matters too. `clip-path` on an element clips its entire
 * painted subtree, including `position: fixed` descendants, so a
 * `sheet: true` incoming section is only safe if it either pins ITSELF
 * (IDENTITY does — `identity.tsx`) or doesn't pin at all (CLOSE doesn't).
 * It must never pin via a descendant: CAPABILITY's `ServicesStage`
 * (`services-convergence.tsx`) pins `stage`, a child of the `<section>`,
 * not the section itself — so CAPABILITY must never get `sheet: true` as
 * an incoming section, or clipping the outer section would clip its own
 * pinned stage mid-pin.
 */
const PAIRS: readonly [outgoing: string, incoming: string, sheet?: boolean][] = [
  ["What MaCo does", "Bridge in motion"],
  ["Selected client work", "Who we work with"],
  ["Products", "MaCo, in one name and many scripts", true],
  ["Clients and company", "Start a project", true],
];
```

- [ ] **Step 3: Delete the replaced files**

```bash
git rm frontend/src/components/home/portfolio-grid.tsx
git rm frontend/src/components/home/product-story.tsx
```

- [ ] **Step 4: Verify the build and lint**

Run: `cd frontend && npm run build && npm run lint`
Expected: both succeed — this is the first point where all three new components are actually imported/rendered together, so it's the real integration check.

- [ ] **Step 5: Manual visual check — the full homepage**

Run: `cd frontend && npm run dev`, load `/`, and scroll the full page top to bottom at both themes (the theme toggle in `chrome.tsx`/`theme.tsx`). Confirm:
- Section order reads OPEN → SURFACE → EVIDENCE → WORK → CLIENTS → CAPABILITY → PRODUCTS → IDENTITY → METHOD → RECORD → CLOSE.
- WORK → CLIENTS carries the same recede cue the old WORK → CAPABILITY pair used to have.
- PRODUCTS → IDENTITY still shows the curved-sheet reveal (this is the pairing most at risk if `ProductShowcase` accidentally used a real pin instead of sticky).
- No section is visually broken, misaligned, or double-scrolling.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/routes/index.tsx frontend/src/components/home/ground-handoff.tsx
git commit -m "Wire WorkReveal/ClientField/ProductShowcase into the homepage, retire old WORK/PRODUCTS"
```
