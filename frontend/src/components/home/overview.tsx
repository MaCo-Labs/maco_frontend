import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { services, projects, products, clients } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { Magnetic } from "@/components/motion/magnetic";

/** Counted from the content model rather than typed as literals, so the
 *  numbers can never drift out of step with what the page below shows. */
const FIGURES = [
  { value: String(services.length), label: "Service lines" },
  { value: String(clients.length), label: "Clients" },
  { value: String(projects.length), label: "Client platforms" },
  { value: String(products.length), label: "Own products" },
] as const;

/**
 * OVERVIEW — `section#about.cb-overview`. Cuberto's `cb-overview-grid` is
 * a two-column flex row: the statement carries the left column, the
 * supporting detail the right. It is the first section after the
 * showreel, and it is where the page stops moving and states what the
 * company is.
 *
 * MaCo's version puts the positioning line left and a counted figure
 * block plus the route onward right. The figures are derived from
 * `content/maco.ts`, so they are claims the rest of the page can actually
 * back — no invented metrics, per AGENTS.md.
 *
 * The h2 uses `LineReveal`'s `mode="words"` (2026-08-29) — a blur-in
 * word stagger, not the line-mask rise every other headline on the page
 * uses. Deliberately placed exactly here: this is the first thing after
 * the dark, cinematic hero, the moment the page settles into calm
 * editorial reading — a different settle deserves a visibly different
 * device, once, not scattered across every heading.
 */
export function Overview() {
  return (
    <section data-ground="paper" aria-label="What MaCo does">
      <div className="shell cb-section">
        <div className="grid gap-12 md:grid-cols-2 md:gap-[5.625rem]">
          <div>
            <ScrubReveal hold>
              <p className="label">About</p>
            </ScrubReveal>
            <LineReveal
              as="h2"
              mode="words"
              className="display-lg mt-4"
              style={{ color: "var(--text)" }}
            >
              We build the systems a business actually runs on.
            </LineReveal>
          </div>

          <div className="md:pt-16">
            <ScrubReveal as="p" hold className="lead">
              Two service lines, two products of our own, and client platforms that have to keep
              working long after launch. Everything we ship is handed over with an admin a
              non-technical team can operate, documentation, and a named support route.
            </ScrubReveal>

            <Stagger
              as="dl"
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8"
              gap={0.12}
              band={0.4}
            >
              {FIGURES.map((f, i) => (
                <div key={f.label} className="stagger-item" style={{ "--i": i } as CSSProperties}>
                  <dt className="display-md" style={{ color: "var(--text)" }}>
                    {f.value}
                  </dt>
                  <dd className="label mt-1">{f.label}</dd>
                </div>
              ))}
            </Stagger>

            <Magnetic className="mt-10">
              <Link to="/about" className="btn-line">
                About MaCo <span aria-hidden="true">→</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
