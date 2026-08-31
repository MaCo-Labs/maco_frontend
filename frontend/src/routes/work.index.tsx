import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { projects } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Work — Client projects delivered by MaCo" },
      {
        name: "description",
        content:
          "Case studies from MaCo: Ananta Nethralaya, Al Afzah Group, Soorath Autos and HeadGreen.",
      },
      { property: "og:title", content: "Work — MaCo" },
      {
        property: "og:description",
        content:
          "Real client work across healthcare, construction, automotive retail and EV mobility.",
      },
    ],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell grid gap-8 py-16 lg:grid-cols-12 lg:py-24">
          <p className="label lg:col-span-3">Index / Client work</p>
          <div className="lg:col-span-9">
            <LineReveal as="h1" className="display-lg max-w-3xl">
              Four clients. <span style={{ color: "var(--muted)" }}>Four different problems.</span>
            </LineReveal>
            <ScrubReveal as="p" hold className="mt-8 max-w-xl text-muted">
              Client work is kept separate from MaCo-owned products. Everything below was delivered
              for an organisation outside MaCo and is live in public.
            </ScrubReveal>
          </div>
        </div>
      </section>

      <section data-ground="paper" aria-label="Projects">
        <div className="shell py-10 lg:py-16">
          <Stagger as="div" gap={0.05} band={0.3}>
            {projects.map((p, i) => (
              <article
                key={p.slug}
                className="stagger-item rule-t grid gap-6 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16"
                style={{ "--i": i } as CSSProperties}
              >
                <div className="lg:col-span-4">
                  <p className="label">
                    {p.index} / {p.sector}
                  </p>
                  <h2 className="display-md mt-4">
                    <Link to="/work/$slug" params={{ slug: p.slug }} className="link-draw">
                      {p.title}
                    </Link>
                  </h2>
                </div>

                <div className={`lg:col-span-8 ${i % 2 === 1 ? "lg:pl-16" : ""}`}>
                  <p className="max-w-2xl text-lg leading-snug">{p.short_description}</p>
                  <p className="mt-5 max-w-2xl text-sm text-muted">{p.challenge}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.technologies.map((t) => (
                      <li
                        key={t}
                        className="border border-line px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Magnetic>
                      <Link to="/work/$slug" params={{ slug: p.slug }} className="btn-line">
                        Case study
                      </Link>
                    </Magnetic>
                    <Magnetic>
                      <a
                        href={p.external_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn-line"
                      >
                        Visit site ↗
                      </a>
                    </Magnetic>
                  </div>
                </div>
              </article>
            ))}
          </Stagger>
          <div className="rule-t" />
        </div>
      </section>
    </>
  );
}
