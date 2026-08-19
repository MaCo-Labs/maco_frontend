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
      setPanelY.current = rt.gsap.quickSetter(panelRef.current, "y", "px") as (v: number) => void;
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
