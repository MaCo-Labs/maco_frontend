import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { services, getProject, getProduct } from "@/content/maco";
import { MotionSection } from "@/components/motion-section";

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
        <MotionSection>
          <p className="label">Capability</p>
        </MotionSection>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div role="tablist" aria-label="Services" className="flex flex-col border-t border-line">
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
            <ul className="mt-8 space-y-5 border-t border-line pt-8">
              {service.capabilities.map((c) => (
                <li key={c.title}>
                  <p className="font-display text-lg" style={{ color: "var(--text)" }}>
                    {c.title}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                    {c.description}
                  </p>
                </li>
              ))}
            </ul>
            {service.evidence.length > 0 && (
              <div className="mt-8 border-t border-line pt-6">
                <p className="label mb-3">Evidence</p>
                <div className="flex flex-wrap gap-2">
                  {service.evidence.map((slug) => {
                    const project = getProject(slug);
                    const product = getProduct(slug);
                    const title = project?.title ?? product?.title;
                    if (!title) return null;
                    return (
                      <Link
                        key={slug}
                        to={project ? "/work/$slug" : "/products/$slug"}
                        params={{ slug }}
                        className="link-draw label border border-line px-3 py-1.5"
                        style={{ color: "var(--text)" }}
                      >
                        {title}
                      </Link>
                    );
                  })}
                </div>
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
