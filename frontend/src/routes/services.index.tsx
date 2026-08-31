import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { services } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { Stagger } from "@/components/motion/stagger";

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
    ],
  }),
  component: ServicesIndex,
});

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
          <Stagger as="div" gap={0.06} band={0.3}>
            {services.map((s, i) => (
              <article key={s.slug} className="stagger-item" style={{ "--i": i } as CSSProperties}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="index-row group block py-10"
                >
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
          <div className="rule-t" />
        </div>
      </section>
    </>
  );
}
