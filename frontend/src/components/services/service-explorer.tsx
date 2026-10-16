import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { services } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getLiveScrollRuntime } from "@/lib/scroll-runtime";
import "./services.css";

const evidence = [
  {
    image: "/media/bridge/tour-board.webp",
    title: "Bridge",
    note: "Our connected workspace",
    to: "/products/$slug",
    slug: "bridge",
  },
  {
    image: "/media/work/ananta-nethralaya/1.webp",
    title: "Ananta Nethralaya",
    note: "A digital home for an eye clinic",
    to: "/work/$slug",
    slug: "ananta-nethralaya",
  },
] as const;

/** Two real service lines, with an explicit selection and related shipped work. */
export function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const reduced = useReducedMotion();
  const service = services[active]!;
  const proof = evidence[active]!;
  useEffect(() => {
    getLiveScrollRuntime()?.scheduleRefresh();
  }, [active]);
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = 1 - index;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }
  return (
    <div className="service-explorer">
      <div
        className="service-explorer-tabs"
        ref={tabsRef}
        role="tablist"
        aria-label="Explore MaCo services"
      >
        {services.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            id={uid + "-tab-" + i}
            aria-selected={active === i}
            aria-controls={uid + "-panel"}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(event) => keyboard(event, i)}
          >
            <span className="service-tab-index">{item.index}</span>
            <span>{item.title}</span>
            <span className="service-tab-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>
      <div
        id={uid + "-panel"}
        role="tabpanel"
        aria-labelledby={uid + "-tab-" + active}
        tabIndex={0}
      >
        <motion.div
          key={service.slug}
          className="service-explorer-panel"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="service-explorer-copy">
            <h2 className="service-explorer-statement">
              {active === 0
                ? "Make the working day work better."
                : "Give your business a presence of its own."}
            </h2>
            <p className="service-explorer-description">{service.short_description}</p>
            <ul className="service-explorer-capabilities">
              {service.capabilities.map((capability) => (
                <li key={capability.title}>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </li>
              ))}
            </ul>
            <Link to="/services/$slug" params={{ slug: service.slug }} className="btn-line">
              Explore {service.title} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="service-explorer-evidence">
            <div className="service-evidence-meta">
              <span>From our work</span>
              <span>{service.index} / 02</span>
            </div>
            <Link to={proof.to} params={{ slug: proof.slug }} className="service-evidence-link">
              <div className="service-evidence-image">
                <img
                  src={proof.image}
                  alt={
                    active === 0
                      ? "Bridge project board with fictional demo tasks"
                      : "The Ananta Nethralaya website designed by MaCo"
                  }
                  width={1440}
                  height={960}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="service-evidence-caption">
                <div>
                  <strong>{proof.title}</strong>
                  <p>{proof.note}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </div>
            </Link>
            <p className="service-evidence-foot">Designed, developed and supported by MaCo.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
