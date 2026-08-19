import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { services, getProject, getProduct } from "@/content/maco";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { RuleDraw } from "@/components/motion/rule-draw";

/**
 * CAPABILITY — the services selector. A real ARIA tablist with arrow-key
 * navigation, fixing the previous homepage's tablist-in-name-only
 * (role="tablist" with no keyboard handling).
 */
export function CapabilitySelector() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const service = services[active];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (active + 1) % services.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (active - 1 + services.length) % services.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = services.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  if (!service) return null;

  return (
    <section data-ground="paper" className="rule-t" aria-label="Capabilities">
      <div className="shell py-24 md:py-32">
        <ScrubReveal hold>
          <p className="label">Capability</p>
        </ScrubReveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div role="tablist" aria-label="Services" className="relative flex flex-col">
            <RuleDraw className="absolute -top-px left-0 h-px w-full" />
            {services.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`${baseId}-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${i}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKeyDown}
                  className="border-b border-line py-5 text-left transition-colors"
                  style={{ color: selected ? "var(--text)" : "var(--muted)" }}
                >
                  <span className="label mr-4">{s.index}</span>
                  <span className="display-md align-middle">{s.title}</span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel-${active}`}
            aria-labelledby={`${baseId}-tab-${active}`}
            tabIndex={0}
          >
            <p className="lead">{service.short_description}</p>
            <p className="mt-4" style={{ color: "var(--muted)" }}>
              {service.description}
            </p>
            <div className="relative mt-8 pt-8">
              <RuleDraw className="absolute top-0 left-0 h-px w-full" />
              <Stagger as="ul" className="space-y-5" gap={0.15} band={0.4}>
                {service.capabilities.map((c, i) => (
                  <li key={c.title} className="stagger-item" style={{ "--i": i } as CSSProperties}>
                    <p className="font-display text-lg" style={{ color: "var(--text)" }}>
                      {c.title}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                      {c.description}
                    </p>
                  </li>
                ))}
              </Stagger>
            </div>
            {service.evidence.length > 0 && (
              <div className="relative mt-8 pt-6">
                <RuleDraw className="absolute top-0 left-0 h-px w-full" />
                <p className="label mb-3">Evidence</p>
                <Stagger
                  as="div"
                  className="flex flex-wrap gap-2"
                  gap={0.2}
                  band={0.5}
                  rise="0.5rem"
                >
                  {service.evidence.map((slug, i) => {
                    const project = getProject(slug);
                    const product = getProduct(slug);
                    const title = project?.title ?? product?.title;
                    if (!title) return null;
                    return (
                      <Link
                        key={slug}
                        to={project ? "/work/$slug" : "/products/$slug"}
                        params={{ slug }}
                        className="stagger-item link-draw label border border-line px-3 py-1.5"
                        style={{ color: "var(--text)", "--i": i } as CSSProperties}
                      >
                        {title}
                      </Link>
                    );
                  })}
                </Stagger>
              </div>
            )}
            <Link to="/services/$slug" params={{ slug: service.slug }} className="btn-line mt-8">
              More on {service.title} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
