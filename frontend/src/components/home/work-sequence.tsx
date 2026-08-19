import { useRef, type CSSProperties } from "react";
import { projects, type Project } from "@/content/maco";
import { Link } from "@tanstack/react-router";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { RuleDraw } from "@/components/motion/rule-draw";
import { Stagger } from "@/components/motion/stagger";
import { usePointerField } from "@/hooks/use-pointer-field";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * WORK — the four real client projects.
 *
 * Mobile: a plain vertical index list — touch-native, no pinning, matches
 * the plan's rule against a broken horizontal rail on touch devices.
 *
 * Desktop (lg+): a pinned horizontal sequence — vertical scroll drives
 * horizontal progress through one full-viewport panel per project, via
 * GSAP ScrollTrigger. Progress is written straight to a CSS custom
 * property (`--p`) on the rail, never through React state — a
 * `ScrollTrigger.onUpdate` fires every scroll frame, and routing that
 * through `setState` meant a full React re-render per frame. All four
 * panels exist in the DOM the whole time, so keyboard and screen-reader
 * order is unaffected by the pin.
 *
 * BOTH `<WorkList>` and `<WorkRail>` are always mounted, split by CSS
 * breakpoint (`lg:hidden` / `hidden lg:block`), not by a `useMediaQuery`
 * state flip. That flip used to gate which one rendered AT ALL — and
 * `useMediaQuery`'s SSR-safe default is `false`, so on first client
 * render `<WorkRail>` didn't exist yet; it mounted a render-cycle later,
 * once the media-query effect corrected the state. Every OTHER pinned
 * section on the page schedules its trigger measurement via
 * `scheduleRefresh()`, and by the time that measurement actually ran,
 * WORK's pin-spacer (thousands of pixels) sometimes didn't exist yet —
 * confirmed live: IDENTITY's ScrollTrigger start/end were measured
 * ~4300px short of the document's real layout, landing INSIDE WORK's own
 * still-forming pin range. `<WorkRail>` now mounts unconditionally and
 * gates the PIN itself with `gsap.matchMedia()` (below) — created only
 * once the element is actually laid out at its real desktop width, and
 * automatically reverted if the viewport crosses the breakpoint.
 */
export function WorkSequence() {
  return (
    <section data-ground="deep" className="rule-t" aria-label="Selected client work">
      <div className="lg:hidden">
        <WorkList />
      </div>
      <div className="hidden lg:block">
        <WorkRail />
      </div>
    </section>
  );
}

function WorkList() {
  return (
    <div className="shell py-24 md:py-32">
      <ScrubReveal hold>
        <p className="label">Work</p>
        <h2 className="display-lg mt-3 max-w-2xl" style={{ color: "var(--text)" }}>
          Four clients. Real software, in production.
        </h2>
      </ScrubReveal>

      <div className="relative mt-14">
        <RuleDraw className="absolute bottom-0 left-0 h-px w-full" />
        <Stagger as="div" gap={0.1} band={0.4}>
          {projects.map((project, i) => (
            <div key={project.slug} className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <WorkRow project={project} />
            </div>
          ))}
        </Stagger>
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

  useScrollScene(
    (rt) => {
      const section = sectionRef.current;
      const rail = railRef.current;
      const header = headerRef.current;
      if (!section || !rail) return;

      // The single source of truth for how far the rail travels — read by
      // BOTH `end` (how long the pin lasts) and the transform below (how
      // far the rail moves), so the two can never disagree. Previously
      // `end` was measured in pixels against the viewport while the
      // transform moved the rail by a fixed PERCENT of the rail's own
      // (much wider) width — the rail reached its final position after
      // only ~1/4 of the pinned scroll distance, leaving the remaining ~3
      // viewport-widths of scroll pinned on an already-finished panel.
      const distance = () => Math.max(1, rail.scrollWidth - rail.clientWidth);

      // Gated by matchMedia rather than the conditional mount this
      // replaced (see the WorkSequence doc comment) — <WorkRail> is now
      // ALWAYS mounted, CSS-hidden below `lg`, so this only creates the
      // pin once the element is actually laid out at its real desktop
      // width, and gsap.matchMedia reverts/recreates it automatically on
      // a breakpoint crossing (a window resize past 1024px), which a
      // plain `if (isDesktop)` check made at effect-setup time would not.
      const mm = rt.gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const setX = rt.gsap.quickSetter(rail, "x", "px");
        const trigger = rt.ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          anticipatePin: 1,
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setX(-self.progress * distance());
            if (header) header.style.opacity = String(1 - Math.min(1, self.progress / 0.08));
            rail.style.setProperty("--p", String(self.progress));
          },
        });
        return () => trigger.kill();
      });
    },
    [railRef],
  );

  return (
    <div
      ref={sectionRef}
      // data-ground repeated here, not just on the outer <section>: once
      // GSAP pins this div (position:fixed), it paints independently of
      // its parent — `background` doesn't inherit in CSS, so without its
      // own data-ground this element is background-transparent while
      // pinned, and the z-40 header shows through it (confirmed live:
      // elementFromPoint found this div on top as expected, but the
      // header was still what actually painted at that pixel). EVIDENCE,
      // METHOD and OPEN don't have this bug because their pinned element
      // IS the data-ground element, not a child of one.
      data-ground="deep"
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
  // CSS abs() shipped in Chrome 133 (Feb 2025) — on anything older,
  // `calc(1 - abs(...))` is invalid at computed-value time and the whole
  // --opacity declaration falls back to `initial` (1), silently
  // reintroducing the straddling bug this expression exists to fix.
  // max(x, -x) is the same absolute value, supported since Chrome 79.
  const absD = `max(${d}, calc(-1 * (${d})))`;
  const opacityExpr =
    total === 1
      ? "1"
      : isFirst
        ? `clamp(0.15, calc(1 - max(0, ${d})), 1)`
        : isLast
          ? `clamp(0.15, calc(1 + min(0, ${d})), 1)`
          : `clamp(0.15, calc(1 - ${absD}), 1)`;

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
