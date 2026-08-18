import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { projects, type Project } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Per-project visual accent — gives each case a distinct identity */
const PROJECT_ACCENTS: Record<string, { hue: string; label: string }> = {
  "ananta-nethralaya": { hue: "oklch(0.55 0.12 160)", label: "Healthcare" },
  "al-afzah":          { hue: "oklch(0.5 0.14 50)",  label: "Construction" },
  "soorath-autos":     { hue: "oklch(0.52 0.14 30)",  label: "Automotive" },
  headgreen:           { hue: "oklch(0.5 0.14 140)",  label: "EV / Mobility" },
};

/**
 * WorkStrip — FLAGSHIP CINEMA RAIL.
 *
 * Desktop: Sticky 100vh pinned stage. Horizontal glide driven by
 * vertical scroll. Each project card has a unique accent color,
 * film-frame corner markers, pointer illumination, and a dedicated
 * visual language. Feels like a contact sheet from a professional shoot.
 *
 * Tablet / Mobile: Vertical cinematic card stream.
 * Reduced motion: Static editorial archive.
 */
export function WorkStrip() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [travel, setTravel] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [canPin, setCanPin] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (reduced) return;

    const checkPin = () => {
      setCanPin(window.matchMedia("(min-width: 1024px)").matches);
    };
    checkPin();

    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const totalWidth = track.scrollWidth;
      const viewWidth = window.innerWidth;
      setTravel(Math.max(0, totalWidth - viewWidth + 120));
    };

    measure();
    const handleResize = () => {
      checkPin();
      measure();
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [reduced]);

  const { scrollYProgress } = useScroll(
    mounted && canPin && !reduced && sectionRef.current
      ? {
          target: sectionRef,
          offset: ["start start", "end end"],
        }
      : {}
  );

  const rawX = useTransform(scrollYProgress || 0, [0, 1], [0, -travel]);
  const smoothX = useSpring(rawX, { stiffness: 90, damping: 24, mass: 0.8 });

  useEffect(() => {
    if (!scrollYProgress || reduced || !canPin) return;
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(projects.length - 1, Math.floor(v * projects.length * 0.99));
      setActiveIdx(idx);
    });
  }, [scrollYProgress, reduced, canPin]);

  if (reduced) return <MobileWorkList />;
  if (!canPin) return <MobileWorkList />;

  const total = projects.length;
  const activeProject = projects[activeIdx];
  const activeAccent = activeProject
    ? PROJECT_ACCENTS[activeProject.slug]?.hue ?? "var(--accent)"
    : "var(--accent)";

  return (
    <section
      ref={sectionRef}
      className="work-strip relative"
      style={{ height: `${total * 110}vh` }}
      aria-label="Selected work"
    >
      <div
        className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {/* Cinematic stage header */}
        <header
          className="z-20 flex items-center justify-between border-b px-6 py-4 lg:px-12"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.22em] uppercase font-bold text-text">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  background: activeAccent,
                  boxShadow: `0 0 6px ${activeAccent}`,
                  transition: "background 0.7s, box-shadow 0.7s",
                }}
              />
              02 — Selected Work
            </span>
            <span
              className="hidden sm:inline-block font-mono text-[0.5625rem] tracking-[0.22em] text-muted uppercase"
            >
              [{String(activeIdx + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}] ·{" "}
              {activeProject?.sector}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Progress pips */}
            <div className="hidden md:flex items-center gap-1.5">
              {projects.map((p, i) => {
                const acc = PROJECT_ACCENTS[p.slug]?.hue ?? "var(--line)";
                return (
                  <div
                    key={p.slug}
                    className="h-[3px] rounded-full transition-all duration-500"
                    style={{
                      width: i === activeIdx ? "2.5rem" : "0.375rem",
                      background: i === activeIdx ? acc : "var(--line)",
                    }}
                  />
                );
              })}
            </div>

            <Link
              to="/work"
              className="link-draw font-mono text-[0.5625rem] tracking-[0.2em] uppercase text-muted hover:text-text"
            >
              Full archive →
            </Link>
          </div>
        </header>

        {/* Ambient spatial background — subtle, not noisy */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
            backgroundSize: "6rem 6rem",
            opacity: 0.04,
          }}
        />

        {/* The cinema rail */}
        <div className="relative flex flex-1 items-center overflow-hidden">
          <motion.div
            ref={trackRef}
            className="flex items-center gap-[3.5vw] pl-[6vw] pr-[22vw]"
            style={{ x: smoothX, willChange: "transform" }}
          >
            {projects.map((project, i) => (
              <WorkCinemaCard
                key={project.slug}
                project={project}
                position={i + 1}
                total={total}
                isActive={i === activeIdx}
              />
            ))}
          </motion.div>
        </div>

        {/* Stage footer — telemetry */}
        <footer
          className="z-20 flex items-center justify-between border-t px-6 py-3 lg:px-12"
          style={{ borderColor: "var(--line)" }}
        >
          <span className="font-mono text-[0.5625rem] tracking-[0.2em] uppercase text-muted">
            Scroll to glide the sequence
          </span>
          <span
            className="font-mono text-[0.5625rem] tracking-[0.2em] uppercase transition-colors duration-700"
            style={{ color: activeAccent }}
          >
            {activeProject?.title}
          </span>
          <span className="font-mono text-[0.5625rem] tracking-[0.2em] uppercase text-muted">
            MaCo Engineering
          </span>
        </footer>
      </div>
    </section>
  );
}

function WorkCinemaCard({
  project,
  position,
  total,
  isActive,
}: {
  project: Project;
  position: number;
  total: number;
  isActive: boolean;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [spotlight, setSpotlight] = useState<{ x: number; y: number; opacity: number }>({
    x: 50, y: 50, opacity: 0,
  });

  const accent = PROJECT_ACCENTS[project.slug];
  const accentHue = accent?.hue ?? "var(--text)";

  const handlePointerMove = (e: ReactPointerEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, opacity: 1 });
  };

  const handlePointerLeave = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group relative flex h-[72vh] w-[min(88vw,48rem)] shrink-0 flex-col justify-between border transition-all duration-700"
      style={{
        background: "var(--surface)",
        borderColor: isActive ? accentHue : "var(--line)",
        boxShadow: isActive
          ? `0 32px 64px -12px oklch(0 0 0 / 12%), 0 0 0 1px ${accentHue}22`
          : "none",
        opacity: isActive ? 1 : 0.78,
        transform: isActive ? "scale(1)" : "scale(0.97)",
        willChange: "transform",
      }}
    >
      {/* Film-frame corner markers — more precise than "+" glyphs */}
      {(["tl", "tr", "bl", "br"] as const).map((corner) => {
        const isTop = corner.startsWith("t");
        const isLeft = corner.endsWith("l");
        return (
          <span
            key={corner}
            className="pointer-events-none absolute"
            style={{
              [isTop ? "top" : "bottom"]: "-1px",
              [isLeft ? "left" : "right"]: "-1px",
              width: "1.2rem",
              height: "1.2rem",
              borderTop: isTop ? `1.5px solid ${accentHue}` : "none",
              borderBottom: !isTop ? `1.5px solid ${accentHue}` : "none",
              borderLeft: isLeft ? `1.5px solid ${accentHue}` : "none",
              borderRight: !isLeft ? `1.5px solid ${accentHue}` : "none",
              opacity: isActive ? 0.9 : 0.3,
              transition: "opacity 0.6s, border-color 0.6s",
            }}
          />
        );
      })}

      {/* Pointer illumination with project accent */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-400"
        aria-hidden="true"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(380px circle at ${spotlight.x}% ${spotlight.y}%, ${accentHue}18, transparent 65%)`,
        }}
      />

      {/* Card header */}
      <div
        className="relative z-10 flex items-start justify-between border-b p-7 lg:p-10 pb-5 lg:pb-6"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[0.5625rem] font-bold tracking-[0.2em] uppercase"
            style={{ color: accentHue }}
          >
            CASE {String(position).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
          <span
            className="h-3 w-px"
            style={{ background: "var(--line)" }}
          />
          <span className="font-mono text-[0.5625rem] tracking-[0.16em] uppercase text-muted">
            {project.sector}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: accentHue,
              opacity: isActive ? 1 : 0,
              transition: "opacity 0.5s",
            }}
          />
          <span className="font-mono text-[0.5625rem] tracking-[0.16em] uppercase text-muted">
            DELIVERED · {project.year}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-7 py-6 lg:px-10">
        <h3
          className="font-display font-bold tracking-[-0.04em] leading-[1.04] transition-transform duration-500 group-hover:translate-x-1"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3.25rem)" }}
        >
          {project.title}
        </h3>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
          {project.short_description}
        </p>

        {/* Accent bar — solution quote */}
        <div
          className="mt-6 py-3 pl-4"
          style={{ borderLeft: `2px solid ${accentHue}50` }}
        >
          <p className="text-sm italic text-muted leading-relaxed">
            &ldquo;{project.solution}&rdquo;
          </p>
        </div>
      </div>

      {/* Card footer */}
      <div
        className="relative z-10 flex flex-wrap items-end justify-between gap-5 border-t p-7 lg:p-10 pt-5 lg:pt-6"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((t) => (
            <span
              key={t}
              className="border px-2.5 py-1 font-mono text-[0.5625rem] tracking-[0.14em] uppercase text-muted transition-colors duration-300 group-hover:border-text/30"
              style={{ borderColor: "var(--line)", background: "var(--surface-2)" }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/work/$slug"
            params={{ slug: project.slug }}
            className="border px-4 py-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase font-bold transition-all duration-300"
            style={{
              borderColor: accentHue,
              color: accentHue,
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = accentHue + "18";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Case study →
          </Link>
          {project.external_url && (
            <a
              href={project.external_url}
              target="_blank"
              rel="noreferrer noopener"
              className="border px-3 py-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-muted transition-all duration-300 hover:text-text hover:border-text/40"
              style={{ borderColor: "var(--line)" }}
              aria-label={`Open ${project.title} live website`}
            >
              ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/** Mobile / tablet — vertical cinematic stream */
function MobileWorkList() {
  return (
    <section className="work-strip rule-b" aria-label="Selected work">
      <div className="shell py-16 lg:py-24">
        <div
          className="flex items-end justify-between gap-6 border-b pb-6"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <p className="font-mono text-[0.625rem] tracking-[0.22em] uppercase text-accent font-bold">
              02 — Selected Work
            </p>
            <h2
              className="font-display font-bold tracking-[-0.04em] mt-3"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
            >
              Engineered & Delivered
            </h2>
          </div>
          <Link
            to="/work"
            className="link-draw font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-muted hover:text-text"
          >
            Archive →
          </Link>
        </div>

        <div className="mt-10 grid gap-6">
          {projects.map((p, i) => {
            const accent = PROJECT_ACCENTS[p.slug];
            const accentHue = accent?.hue ?? "var(--text)";
            return (
              <article
                key={p.slug}
                className="relative border bg-surface p-6 sm:p-8 transition-all duration-300 hover:shadow-lg"
                style={{ borderColor: "var(--line)" }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-[3px]"
                  style={{ background: accentHue }}
                />

                <div
                  className="flex items-center justify-between border-b pb-4"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span
                    className="font-mono text-[0.5625rem] font-bold tracking-[0.2em] uppercase"
                    style={{ color: accentHue }}
                  >
                    CASE {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[0.5625rem] tracking-[0.16em] uppercase text-muted">
                    {p.sector} · {p.year}
                  </span>
                </div>

                <div className="py-5">
                  <h3
                    className="font-display font-bold tracking-[-0.03em]"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {p.short_description}
                  </p>
                </div>

                <div
                  className="flex flex-wrap items-center justify-between gap-4 border-t pt-4"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="border px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-wider text-muted"
                        style={{ borderColor: "var(--line)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/work/$slug"
                    params={{ slug: p.slug }}
                    className="border px-4 py-2 font-mono text-[0.5625rem] tracking-[0.16em] uppercase font-bold"
                    style={{ borderColor: accentHue, color: accentHue }}
                  >
                    Case study →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
