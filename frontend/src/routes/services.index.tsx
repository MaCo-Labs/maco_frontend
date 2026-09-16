import { useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { services } from "@/content/maco";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { LineReveal } from "@/components/motion/line-reveal";
import { Stagger } from "@/components/motion/stagger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Business software & digital solutions | MaCo" },
      {
        name: "description",
        content:
          "MaCo's two services: business software (task management, CRM, custom software) and digital solutions (websites, e-commerce, branding and design, social media management).",
      },
      { property: "og:title", content: "Services — MaCo" },
      {
        property: "og:description",
        content: "Two services, each backed by delivered client work and owned products.",
      },
      { property: "og:url", content: absoluteUrl("/services") },
      {
        "script:ld+json": breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]),
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/services") }],
  }),
  component: ServicesIndex,
});

/** The one thing worth taking from Vengeance UI's Highlight Grid: a single
 *  shared highlight that glides between rows on hover, instead of
 *  `.index-row`'s existing per-row `::before` (styles.css) popping in and
 *  out independently on each one. `layoutId` is what does the gliding —
 *  Framer projects the highlight from its last row's bounds to the newly
 *  hovered row's, no manual position math. Cleared only on the whole
 *  list's `onMouseLeave`, not per-row: clearing on a row's own leave fires
 *  a frame before the next row's enter, which would drop the highlight to
 *  nothing between two adjacent rows instead of reading as one glide. */
function ServiceList() {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <div onMouseLeave={() => setHovered(null)}>
      <Stagger as="div" gap={0.06} band={0.3}>
        {services.map((s, i) => (
          <article key={s.slug} className="stagger-item" style={{ "--i": i } as CSSProperties}>
            <Link
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="index-row group relative block py-10"
              onMouseEnter={() => setHovered(s.slug)}
              onFocus={() => setHovered(s.slug)}
            >
              {hovered === s.slug && (
                <motion.div
                  layoutId="services-highlight"
                  className="absolute inset-0 z-[1]"
                  style={{ background: "var(--surface-2)" }}
                  transition={
                    reduced ? { duration: 0 } : { type: "spring", bounce: 0.15, duration: 0.35 }
                  }
                />
              )}
              <div className="relative z-10 grid gap-4 transition-[padding] duration-500 group-hover:px-4 lg:grid-cols-12 lg:gap-8">
                <span className="label lg:col-span-1">{s.index}</span>
                <h2 className="display-md lg:col-span-4">{s.title}</h2>
                <p className="max-w-xl text-muted lg:col-span-6">{s.short_description}</p>
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted lg:col-span-1 lg:text-right">
                  →
                </span>
              </div>
            </Link>
          </article>
        ))}
      </Stagger>
    </div>
  );
}

function ServicesIndex() {
  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell grid gap-8 py-16 lg:grid-cols-12 lg:py-24">
          <p className="label lg:col-span-3">Index / Services</p>
          <div className="lg:col-span-9">
            <LineReveal as="h1" className="display-lg max-w-3xl">
              What we sell,{" "}
              <span style={{ color: "var(--muted)" }}>and the evidence behind each one.</span>
            </LineReveal>
          </div>
        </div>
      </section>

      <section data-ground="paper" aria-label="Service list">
        <div className="shell py-10 lg:py-16">
          <ServiceList />
          <div className="rule-t" />
        </div>
      </section>
    </>
  );
}
