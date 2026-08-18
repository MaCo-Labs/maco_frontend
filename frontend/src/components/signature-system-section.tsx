import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { services } from "@/content/maco";
import { SystemField } from "@/components/system-field";
import { useElementScrollProgress } from "@/hooks/use-scroll-progress";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Short labels derived from real MaCo services — no invented categories. */
const PILLARS = [
  { key: "web", label: "Web", slug: "web-development" },
  { key: "app", label: "App", slug: "app-development" },
  { key: "support", label: "Support", slug: "technical-support" },
  { key: "software", label: "Software", slug: "software-support" },
  { key: "social", label: "Social", slug: "social-media-managing" },
] as const;

/**
 * SignatureSystemSection — THE INVERTED SYSTEM CORE.
 *
 * Combines the living MaCo SystemField (M-shaped geometry) with
 * the architectural statement "We engineer the parts that stay" and
 * the 5 real service pillars.
 */
export function SignatureSystemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useElementScrollProgress(sectionRef);
  const reduced = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="section-inverted relative overflow-hidden rule-b"
      aria-labelledby="maco-system-heading"
    >
      {/* Background Architectural Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--line-inverted) 1px, transparent 1px), linear-gradient(to bottom, var(--line-inverted) 1px, transparent 1px)",
          backgroundSize: "4.5rem 4.5rem",
        }}
      />

      <div className="shell relative py-20 lg:py-32">
        {/* Section Telemetry Badge */}
        <div className="flex items-center justify-between border-b border-line-inverted pb-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-accent-inverted animate-pulse" />
            <span className="label font-bold tracking-[0.24em] text-accent-inverted">
              SYSTEM ARCHITECTURE // INFRASTRUCTURE
            </span>
          </div>
          <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-muted-inverted">
            STABILITY MATRIX
          </span>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Statement & Living SystemField */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <p className="label text-muted-inverted">
                01 / The MaCo Philosophy
              </p>
              <h2 id="maco-system-heading" className="display-lg mt-4 max-w-xl text-text-inverted">
                We engineer the parts that stay.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-inverted">
                The schema, the admin, the deployment path and the person who answers when it breaks
                — engineered as one durable operational system, not a disposable launch-day demo.
              </p>
            </div>

            {/* Living SystemField Core */}
            <div className="mt-12 rounded-lg border border-line-inverted/60 bg-surface-inverted-2/40 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-line-inverted/40 pb-3 mb-5">
                <span className="font-mono text-[0.625rem] tracking-[0.2em] uppercase text-accent-inverted font-bold">
                  MACO SYSTEM FIELD [ACTIVE CORE]
                </span>
                <span className="font-mono text-[0.5625rem] tracking-widest uppercase text-muted-inverted">
                  SCROLL & POINTER REACTIVE
                </span>
              </div>
              <SystemField
                scrollProgress={scrollProgress}
                className="max-w-[20rem] mx-auto"
              />
            </div>
          </div>

          {/* Right Column: Service Pillars */}
          <div className="lg:col-span-6 lg:border-l lg:border-line-inverted/40 lg:pl-12">
            <div className="flex items-center justify-between border-b border-line-inverted pb-3">
              <p className="label font-bold text-accent-inverted">
                Service Pillars & Disciplines
              </p>
              <span className="font-mono text-[0.625rem] tracking-[0.2em] uppercase text-muted-inverted">
                05 DISCIPLINES
              </span>
            </div>

            <ul className="mt-6 divide-y divide-line-inverted">
              {PILLARS.map((pillar, i) => {
                const svc = services.find((s) => s.slug === pillar.slug);
                if (!svc) return null;
                return (
                  <li key={pillar.key} className="group py-5 transition-all">
                    <Link
                      to="/services/$slug"
                      params={{ slug: pillar.slug }}
                      className="grid gap-3 sm:grid-cols-[3.5rem_1fr_auto] sm:items-baseline"
                    >
                      <span className="font-mono text-[0.75rem] font-bold tracking-[0.2em] text-accent-inverted">
                        {svc.index}
                      </span>
                      <div>
                        <p className="font-display text-xl sm:text-2xl tracking-[-0.02em] text-text-inverted transition-transform duration-300 group-hover:translate-x-1.5">
                          {svc.title}
                        </p>
                        <p className="mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed text-muted-inverted">
                          {svc.short_description}
                        </p>
                      </div>
                      <span className="hidden sm:inline-block font-mono text-sm text-muted-inverted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-text-inverted">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
