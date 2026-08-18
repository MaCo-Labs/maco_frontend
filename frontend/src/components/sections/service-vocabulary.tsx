import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { products, projects, services } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const projectSlugs = new Set(projects.map((p) => p.slug));
const productSlugs = new Set(products.map((p) => p.slug));

/** Verified capability vocabulary per service */
const VOCABULARY_MAP: Record<string, string[]> = {
  "web-development": ["WEBSITES", "WEB APPS", "PLATFORMS", "DASHBOARDS", "SYSTEMS"],
  "app-development": ["MOBILE", "PWA", "PRODUCTS", "INTERFACES"],
  "technical-support": ["DIAGNOSE", "MONITOR", "RESPOND", "MAINTAIN"],
  "software-support": ["SYSTEMS", "FIXES", "UPDATES", "OPERATIONS"],
  "social-media-managing": ["CONTENT", "PUBLISHING", "CAMPAIGNS", "MANAGEMENT"],
};

/**
 * ServiceVocabulary — FULL-BLEED INVERTED CAPABILITY CONSOLE.
 *
 * Dark inverted background breaks the light-canvas monotony. Immersive
 * interactive service selector with animated vocabulary cycling, capability
 * matrix, and real production evidence links. Feels like a live terminal.
 */
export function ServiceVocabulary() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [vocabIndex, setVocabIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // Scroll-reveal trigger
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const select = useCallback((i: number) => {
    setActive(i);
    setVocabIndex(0);
  }, []);

  const current = services[active];
  const vocabList = VOCABULARY_MAP[current.slug] || ["CAPABILITY", "SYSTEMS"];

  // Cycle vocabulary words
  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setVocabIndex((prev) => (prev + 1) % vocabList.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [vocabList.length, reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "var(--surface-inverted-2, oklch(0.14 0 0))" }}
      aria-label="Services"
    >
      {/* Fine grid overlay on dark */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.98 0 0 / 4%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.98 0 0 / 4%) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* Edge datum lines */}
      <div
        className="h-px w-full"
        style={{ background: "var(--line-inverted)" }}
        aria-hidden="true"
      />

      <div className="shell relative z-10 py-20 lg:py-28">
        {/* Section header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b pb-8"
          style={{ borderColor: "var(--line-inverted)" }}
        >
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(2rem)",
              transition: reduced
                ? "none"
                : "opacity 0.7s var(--ease-emphasis), transform 0.7s var(--ease-emphasis)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  background: "var(--accent-inverted)",
                  animation: reduced ? "none" : "pulse 2s infinite",
                }}
              />
              <span
                className="font-mono text-[0.625rem] tracking-[0.22em] uppercase font-bold"
                style={{ color: "var(--accent-inverted)" }}
              >
                04 — Services & Capabilities
              </span>
            </div>
            <h2
              className="font-display font-bold tracking-[-0.04em] mt-4"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                color: "var(--text-inverted)",
              }}
            >
              Five capabilities.
              <br />
              <span style={{ color: "var(--muted-inverted)" }}>Nothing invented.</span>
            </h2>
          </div>
          <Link
            to="/services"
            className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase shrink-0"
            style={{ color: "var(--muted-inverted)", borderBottom: "1px solid var(--line-inverted)", paddingBottom: "2px" }}
          >
            All services overview →
          </Link>
        </div>

        {/* Services layout */}
        <div
          className="mt-12 lg:grid lg:grid-cols-12 lg:gap-12 items-start"
          style={{
            opacity: visible ? 1 : 0,
            transition: reduced
              ? "none"
              : "opacity 0.8s var(--ease-emphasis) 0.2s",
          }}
        >
          {/* Services List */}
          <ul
            className="lg:col-span-4 flex flex-col"
            role="tablist"
            aria-label="Services selection"
          >
            {services.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.slug}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`svc-panel-${s.slug}`}
                    id={`svc-tab-${s.slug}`}
                    onClick={() => select(i)}
                    className="flex w-full items-center justify-between py-5 px-4 text-left transition-all duration-300 border-b"
                    style={{
                      borderColor: "var(--line-inverted)",
                      background: isActive
                        ? "oklch(0.98 0 0 / 5%)"
                        : "transparent",
                      borderLeft: isActive
                        ? "2px solid var(--accent-inverted)"
                        : "2px solid transparent",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{
                          color: isActive
                            ? "var(--accent-inverted)"
                            : "var(--muted-inverted)",
                        }}
                      >
                        {s.index}
                      </span>
                      <span
                        className="font-display font-bold tracking-[-0.02em]"
                        style={{
                          fontSize: "clamp(1rem, 2vw, 1.375rem)",
                          color: isActive
                            ? "var(--text-inverted)"
                            : "var(--muted-inverted)",
                        }}
                      >
                        {s.title}
                      </span>
                    </div>
                    <span
                      className="font-mono text-xs"
                      style={{ color: "var(--muted-inverted)" }}
                    >
                      {isActive ? "→" : "+"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Active Service Console Panel */}
          <div className="lg:col-span-8 mt-8 lg:mt-0">
            <div
              id={`svc-panel-${current.slug}`}
              role="tabpanel"
              aria-labelledby={`svc-tab-${current.slug}`}
              className="relative border p-8 lg:p-12 transition-all duration-500"
              style={{
                borderColor: "var(--line-inverted)",
                background: "oklch(0.98 0 0 / 3%)",
              }}
            >
              {/* Corner crosshairs */}
              {[
                "top-2 left-2",
                "top-2 right-2",
                "bottom-2 left-2",
                "bottom-2 right-2",
              ].map((pos) => (
                <span
                  key={pos}
                  className={`pointer-events-none absolute ${pos} font-mono text-[0.625rem]`}
                  style={{ color: "var(--muted-inverted)", opacity: 0.4 }}
                >
                  +
                </span>
              ))}

              {/* Vocabulary ribbon */}
              <div
                className="flex flex-wrap items-center justify-between gap-4 border-b pb-6"
                style={{ borderColor: "var(--line-inverted)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-[0.625rem] font-bold tracking-[0.2em] uppercase"
                    style={{ color: "var(--accent-inverted)" }}
                  >
                    CAPABILITY VOCABULARY //
                  </span>
                  <div className="relative h-6 overflow-hidden min-w-[8rem]">
                    <span
                      key={`${current.slug}-${vocabIndex}`}
                      className="inline-block font-mono text-xs font-bold tracking-[0.2em]"
                      style={{
                        color: "var(--accent-inverted)",
                        animation: reduced
                          ? "none"
                          : "maco-rise 0.35s var(--ease-emphasis) both",
                      }}
                    >
                      {vocabList[vocabIndex]}
                    </span>
                  </div>
                </div>
                <span
                  className="font-mono text-[0.625rem] tracking-widest uppercase"
                  style={{ color: "var(--muted-inverted)" }}
                >
                  DISCIPLINE {current.index}/05
                </span>
              </div>

              {/* Description */}
              <div className="py-6">
                <h3
                  key={current.slug}
                  className="font-display font-bold tracking-[-0.035em]"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    color: "var(--text-inverted)",
                    animation: reduced
                      ? "none"
                      : "maco-rise 0.45s var(--ease-emphasis) both",
                  }}
                >
                  {current.title}
                </h3>
                <p
                  className="mt-4 text-base leading-relaxed"
                  style={{ color: "var(--muted-inverted)" }}
                >
                  {current.description}
                </p>
              </div>

              {/* Capabilities Grid */}
              <div className="mt-4">
                <p
                  className="font-mono text-[0.625rem] tracking-[0.2em] uppercase font-bold mb-4"
                  style={{ color: "var(--muted-inverted)" }}
                >
                  Core Delivery Capabilities
                </p>
                <ul className="grid gap-2 sm:grid-cols-3">
                  {current.capabilities.map((c, i) => (
                    <li
                      key={c.title}
                      className="border p-4 transition-colors duration-300"
                      style={{
                        borderColor: "var(--line-inverted)",
                        background: "oklch(0.98 0 0 / 2%)",
                      }}
                    >
                      <span
                        className="font-mono text-[0.5625rem] font-bold"
                        style={{ color: "var(--accent-inverted)" }}
                      >
                        0{i + 1}
                      </span>
                      <p
                        className="font-display text-sm font-semibold mt-1"
                        style={{ color: "var(--text-inverted)" }}
                      >
                        {c.title}
                      </p>
                      <p
                        className="text-xs mt-1 leading-snug"
                        style={{ color: "var(--muted-inverted)" }}
                      >
                        {c.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evidence Pills */}
              {current.evidence.length > 0 && (
                <div
                  className="mt-8 border-t pt-6"
                  style={{ borderColor: "var(--line-inverted)" }}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="font-mono text-[0.625rem] tracking-[0.18em] uppercase"
                      style={{ color: "var(--muted-inverted)" }}
                    >
                      Carried by real production work:
                    </p>
                    <span
                      className="font-mono text-[0.625rem] uppercase"
                      style={{ color: "var(--muted-inverted)" }}
                    >
                      VERIFIED
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {current.evidence.map((slug) => {
                      const isProject = projectSlugs.has(slug);
                      const isProduct = productSlugs.has(slug);
                      const targetPath = isProject
                        ? "/work/$slug"
                        : isProduct
                          ? "/products/$slug"
                          : "/work";
                      return (
                        <Link
                          key={slug}
                          to={targetPath}
                          params={{ slug }}
                          className="border px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-all duration-200"
                          style={{
                            borderColor: "var(--line-inverted)",
                            color: "var(--text-inverted)",
                            background: "oklch(0.98 0 0 / 4%)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor =
                              "var(--accent-inverted)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor =
                              "var(--line-inverted)";
                          }}
                        >
                          {slug.replace(/-/g, " ")} →
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom edge datum */}
      <div
        className="h-px w-full"
        style={{ background: "var(--line-inverted)" }}
        aria-hidden="true"
      />
    </section>
  );
}
