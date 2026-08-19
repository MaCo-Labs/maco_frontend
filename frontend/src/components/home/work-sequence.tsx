import { useEffect, useRef, type CSSProperties } from "react";
import { projects, type Project } from "@/content/maco";
import { Link } from "@tanstack/react-router";
import { MotionSection } from "@/components/motion-section";
import { Magnetic } from "@/components/motion/magnetic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePointerField } from "@/hooks/use-pointer-field";
import { getScrollRuntime } from "@/lib/scroll-runtime";

/**
 * WORK — the four real client projects.
 *
 * Mobile and reduced-motion: a plain vertical index list — touch-native,
 * no pinning, matches the plan's rule against a broken horizontal rail
 * on touch devices.
 *
 * Desktop (lg+): a pinned horizontal sequence — vertical scroll drives
 * horizontal progress through one full-viewport panel per project, via
 * GSAP ScrollTrigger. Progress is written straight to a CSS custom
 * property (`--p`) on the rail, never through React state — a
 * `ScrollTrigger.onUpdate` fires every scroll frame, and routing that
 * through `setState` meant a full React re-render per frame. All four
 * panels exist in the DOM the whole time, so keyboard and screen-reader
 * order is unaffected by the pin.
 */
export function WorkSequence() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <section data-ground="paper" className="rule-t" aria-label="Selected client work">
      {isDesktop && !reduced ? <WorkRail /> : <WorkList />}
    </section>
  );
}

function WorkList() {
  return (
    <div className="shell py-24 md:py-32">
      <MotionSection>
        <p className="label">Work</p>
        <h2 className="display-lg mt-3 max-w-2xl" style={{ color: "var(--text)" }}>
          Four clients. Real software, in production.
        </h2>
      </MotionSection>

      <div className="mt-14 border-b border-line">
        {projects.map((project, i) => (
          <MotionSection key={project.slug} delay={i * 80}>
            <WorkRow project={project} />
          </MotionSection>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <Link to="/work" className="btn-line">
          All work <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

function WorkRow({ project }: { project: Project }) {
  return (
    <article className="index-row group py-8 md:py-10">
      <div className="relative z-10 grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-baseline md:gap-8">
        <div className="flex items-center gap-4">
          <span className="label">{project.index}</span>
          {project.brand && (
            <img
              src={project.brand.src}
              alt=""
              aria-hidden="true"
              width={project.brand.width}
              height={project.brand.height}
              loading="lazy"
              decoding="async"
              className="h-6 w-auto shrink-0 object-contain"
            />
          )}
          <h3 className="display-md" style={{ color: "var(--text)" }}>
            {project.title}
          </h3>
        </div>
        <p className="row-meta text-sm md:text-base" style={{ color: "var(--muted)" }}>
          {project.short_description}{" "}
          <span className="label inline-block align-middle">{project.sector}</span>
        </p>
        <div className="row-index flex items-center gap-4 justify-self-start md:justify-self-end">
          <Link to="/work/$slug" params={{ slug: project.slug }} className="link-draw label">
            Case study
          </Link>
          <a
            href={project.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw label inline-flex items-center gap-2"
          >
            Visit site <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function WorkRail() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  // Doubles as the ScrollTrigger measurement target (scrollWidth) and the
  // pointer field for each panel's logo watermark — --px/--py, set
  // imperatively by usePointerField, cascade to every descendant panel.
  const railRef = usePointerField<HTMLDivElement>();

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    const header = headerRef.current;
    if (!section || !rail) return;
    let cancelled = false;
    let trigger: { kill: () => void } | null = null;

    // The single source of truth for how far the rail travels — read by
    // BOTH `end` (how long the pin lasts) and the transform below (how far
    // the rail moves), so the two can never disagree. Previously `end` was
    // measured in pixels against the viewport while the transform moved the
    // rail by a fixed PERCENT of the rail's own (much wider) width — the
    // rail reached its final position after only ~1/4 of the pinned scroll
    // distance, leaving the remaining ~3 viewport-widths of scroll pinned
    // on an already-finished panel.
    const distance = () => Math.max(1, rail.scrollWidth - rail.clientWidth);

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      const setX = rt.gsap.quickSetter(rail, "x", "px");
      trigger = rt.ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + distance(),
        pin: true,
        scrub: 0.3,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setX(-self.progress * distance());
          if (header) header.style.opacity = String(1 - Math.min(1, self.progress / 0.08));
          rail.style.setProperty("--p", String(self.progress));
        },
      });
      // Re-measure every trigger on the page once, after this one (and any
      // siblings created in the same pass — WORK vs. METHOD, in particular)
      // have registered, instead of trusting whichever mounted first.
      rt.scheduleRefresh();
    });

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [railRef]);

  return (
    <div
      ref={sectionRef}
      // z-[41]: see the matching comment in open-logo.tsx — keeps the
      // pinned rail above the sticky header instead of behind it.
      className="relative z-[41] h-screen overflow-hidden"
    >
      <div ref={headerRef} className="shell absolute left-0 right-0 top-14 z-10">
        <p className="label">Work</p>
        <h2 className="display-lg mt-3 max-w-2xl" style={{ color: "var(--text)" }}>
          Four clients. Real software, in production.
        </h2>
      </div>

      <div ref={railRef} className="flex h-full will-change-transform">
        {projects.map((project, i) => (
          <WorkPanel key={project.slug} project={project} index={i} total={projects.length} />
        ))}
      </div>

      <div className="shell absolute bottom-10 left-0 right-0 z-10 flex items-center justify-between">
        <span className="label">
          {projects.length} client{projects.length === 1 ? "" : "s"}
        </span>
        <Magnetic>
          <Link to="/work" className="btn-line">
            All work <span aria-hidden="true">→</span>
          </Link>
        </Magnetic>
      </div>
    </div>
  );
}

/**
 * Each panel fades to its neighbour's position rather than staying fully
 * opaque throughout — otherwise stopping mid-scroll (no snap point) leaves
 * two unrelated projects' content straddling the viewport at once, with a
 * numeral orphaned from its own title. Found by actually scrubbing the
 * built section, not assumed. Driven entirely by CSS `calc()` against the
 * rail's own `--p` custom property — no per-panel React state, no re-render
 * on scroll.
 */
function WorkPanel({ project, index, total }: { project: Project; index: number; total: number }) {
  const center = total > 1 ? index / (total - 1) : 0;
  const step = total > 1 ? 1 / (total - 1) : 1;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // d = (--p - center) / step, clamped per edge exactly as the old
  // per-frame JS did — reproduced in calc() so it runs on the compositor.
  const d = `((var(--p, 0) - ${center}) / ${step})`;
  const opacityExpr =
    total === 1
      ? "1"
      : isFirst
        ? `clamp(0.15, calc(1 - max(0, ${d})), 1)`
        : isLast
          ? `clamp(0.15, calc(1 + min(0, ${d})), 1)`
          : `clamp(0.15, calc(1 - abs(${d})), 1)`;

  return (
    <div
      className="relative flex h-full w-screen shrink-0 items-center overflow-hidden"
      style={{ "--opacity": opacityExpr } as CSSProperties}
    >
      {project.brand && (
        // A large, faint, pointer-parallaxed watermark — the client logo
        // as depth cue rather than a small credit mark. Reads var(--px)/
        // var(--py) inherited from the rail's own pointer field.
        <img
          src={project.brand.src}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute h-[46vh] w-auto max-w-none object-contain opacity-[0.05]"
          style={
            {
              right: "4%",
              top: "50%",
              transform:
                "translateY(-50%) translate3d(calc((var(--px, 0.5) - 0.5) * -24px), calc((var(--py, 0.5) - 0.5) * -24px), 0)",
              transition: "transform 0.5s var(--ease-standard)",
            } as CSSProperties
          }
        />
      )}
      <div
        className="shell grid gap-6 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-16"
        style={{
          opacity: "var(--opacity)",
          transform: "translate3d(0, calc((1 - var(--opacity)) * 1.5rem), 0)",
        }}
      >
        <span className="display-hero" style={{ color: "var(--line-strong)" }}>
          {project.index}
        </span>
        <div className="max-w-xl pb-2">
          <div className="flex items-center gap-3">
            <span className="label">{project.sector}</span>
            {project.brand && (
              <img
                src={project.brand.src}
                alt={project.brand.alt}
                width={project.brand.width}
                height={project.brand.height}
                loading="lazy"
                decoding="async"
                className="h-7 w-auto object-contain"
              />
            )}
          </div>
          <h3 className="display-lg mt-3" style={{ color: "var(--text)" }}>
            {project.title}
          </h3>
          <p className="lead mt-5">{project.short_description}</p>
          <div className="mt-8 flex items-center gap-6">
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
      </div>
    </div>
  );
}
