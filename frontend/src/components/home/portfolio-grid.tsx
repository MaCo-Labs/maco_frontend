import { type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { projects, type Project } from "@/content/maco";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { usePointerField } from "@/hooks/use-pointer-field";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * WORK — the four real client projects, as a two-column asynchronous grid
 * rather than the previous pinned horizontal rail. Replaces
 * work-sequence.tsx's `WorkRail` entirely: keeping both would put the same
 * four projects on screen twice, and dropping the rail's pin takes the
 * page from five pinned sections back to four (see the updated comment in
 * ground-handoff.tsx for why that matters — this section is now the
 * OUTGOING side of a `GroundHandoff` pair, which requires it to be
 * pin-free).
 *
 * There is no project photography or device mockups anywhere in the repo
 * — only each client's real brand mark (`public/media/brand/*.webp`).
 * Bridge's poster and Driver's Diary's portrait belong to the PRODUCTS
 * section, not to these four client projects, so neither is reused here;
 * doing so would present one product's evidence as another project's
 * (AGENTS.md's fabricated-content rule). Each cell is a tokenized backdrop
 * plate carrying the real brand mark — when real screenshots exist, they
 * drop into the same plate with no structural change.
 *
 * Two columns at `lg`, split into a `Stagger` each so cards reveal on
 * entry; each column also carries its own scroll-linked drift via the
 * `grid-column-drift` utility (styles.css), driven by one shared `--p`
 * write on the grid wrapper — the two columns pass each other at slightly
 * different speeds rather than moving in lockstep. Below `lg` the trigger
 * that writes `--p` never exists, so `--p` sits at its registered
 * `initial-value: 0` and `grid-column-drift` composes to a zero
 * translate — no separate mobile branch needed.
 *
 * 3D tilt reads `--px`/`--py` from `usePointerField`, attached to the same
 * grid wrapper that measures scroll progress (mirrors `WorkRail`'s
 * `railRef`, dual-purposed the same way). The hook already bails under
 * `(pointer: coarse)`, so touch devices get the drift but never the tilt.
 */
export function PortfolioGrid() {
  const withIndex = projects.map((project, i) => ({ project, i }));
  const left = withIndex.filter((_, i) => i % 2 === 0);
  const right = withIndex.filter((_, i) => i % 2 === 1);

  return (
    <section data-ground="paper" className="rule-t" aria-label="Selected client work">
      <div className="shell py-24 md:py-32">
        <ScrubReveal hold>
          <p className="label">Work</p>
          <h2 className="display-lg mt-3 max-w-2xl" style={{ color: "var(--text)" }}>
            Four clients. Real software, in production.
          </h2>
        </ScrubReveal>

        <Grid left={left} right={right} />

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

type IndexedProject = { project: Project; i: number };

function Grid({ left, right }: { left: IndexedProject[]; right: IndexedProject[] }) {
  const gridRef = usePointerField<HTMLDivElement>();

  useScrollScene(
    (rt) => {
      const grid = gridRef.current;
      if (!grid) return;
      const mm = rt.gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const trigger = rt.ScrollTrigger.create({
          trigger: grid,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.35,
          invalidateOnRefresh: true,
          onUpdate: (self) => grid.style.setProperty("--p", String(self.progress)),
        });
        return () => trigger.kill();
      });
    },
    [gridRef],
  );

  return (
    <div
      ref={gridRef}
      className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8"
      style={{ perspective: "1200px" }}
    >
      <Column projects={left} colShift="-3rem" />
      <Column projects={right} colShift="-7.5rem" />
    </div>
  );
}

function Column({ projects: items, colShift }: { projects: IndexedProject[]; colShift: string }) {
  return (
    <Stagger
      as="div"
      className="grid-column-drift space-y-6"
      gap={0.15}
      band={0.4}
      style={{ "--col-shift": colShift } as CSSProperties}
    >
      {items.map(({ project, i }, si) => (
        <div key={project.slug} className="stagger-item" style={{ "--i": si } as CSSProperties}>
          <GridCard project={project} tintIndex={i} />
        </div>
      ))}
    </Stagger>
  );
}

/**
 * The tilt transform lives on THIS element, not on the `.stagger-item`
 * wrapper one level up — `.stagger-item` already sets its own `transform`
 * (the reveal-rise translate3d) via CSS, and an inline `transform` here
 * would silently override a class-based one at the SAME element. Splitting
 * the two onto separate elements lets both run without either clobbering
 * the other, the same way `ProductMedia` in product-story.tsx keeps its
 * `--sweep` wrapper separate from `SurfaceMedia`'s own inner element.
 */
function GridCard({ project, tintIndex }: { project: Project; tintIndex: number }) {
  const aspect = tintIndex % 2 === 0 ? "4/5" : "1/1";
  // 20 -> 55%: on Cobalt (a chromatic --accent) this reads as an
  // increasingly saturated blue block. On Obsidian, where --accent is
  // achromatic by design (two genuinely different themes, not a recolor
  // — see styles.css), the same formula degrades gracefully to a
  // deliberate light/dark value block instead of a color one, which is
  // what data-ground="deep" below is actually doing the work for.
  const tint = 20 + tintIndex * 12;

  return (
    <article
      className="overflow-hidden border border-line"
      style={{
        background: "var(--surface)",
        boxShadow: "0 30px 80px -24px color-mix(in oklab, var(--text) 38%, transparent)",
        transform:
          "rotateX(calc((var(--py, 0.5) - 0.5) * -5deg)) rotateY(calc((var(--px, 0.5) - 0.5) * 7deg))",
        transition: "transform 0.5s var(--ease-standard)",
      }}
    >
      {/* The "vibrant backdrop card" the reference asks for, adapted to
          this design system's actual palette: WORK's section ground is
          paper (light) since the Phase 5 ground regroup, so flipping
          just this image plate to `data-ground="deep"` reads as a dark
          tile sitting on a light frame — real value contrast in both
          themes, and on Cobalt the deep ground's OWN accent is still
          chromatic, so the color-mix below still lands as a genuine blue
          tint on top of that darkness. Same ground-swap device
          product-story.tsx's `ProductMedia` already uses, same direction
          this time (deep tile on a paper card, both places). */}
      <div
        data-ground="deep"
        className="relative"
        style={{
          aspectRatio: aspect,
          background: `color-mix(in oklab, var(--accent) ${tint}%, var(--surface))`,
        }}
      >
        <div
          className="absolute inset-6 flex items-center justify-center rounded-xl border border-line md:inset-10"
          // --surface-2 rather than bare --bg: same fix record.tsx's logo
          // wall already made (see its doc comment) — two of the four real
          // client marks are dark-on-dark and lose contrast against a flat
          // --bg on this deep-ground plate, so a step-off-background tile
          // lifts every mark's contrast without per-logo special-casing.
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

      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="label">{project.index}</span>
          <span className="label" style={{ color: "var(--muted)" }}>
            {project.sector}
          </span>
        </div>
        <h3 className="display-md mt-2" style={{ color: "var(--text)" }}>
          {project.title}
        </h3>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          {project.short_description}
        </p>
        <div className="mt-5 flex items-center gap-5">
          <Link
            to="/work/$slug"
            params={{ slug: project.slug }}
            className="link-draw label"
            style={{ color: "var(--text)" }}
          >
            Case study
          </Link>
          <a
            href={project.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw label inline-flex items-center gap-2"
            style={{ color: "var(--text)" }}
          >
            Visit site <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
