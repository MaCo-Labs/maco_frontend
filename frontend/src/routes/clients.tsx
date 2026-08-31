import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { clients, getProject } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Clients — Organisations MaCo works with" },
      {
        name: "description",
        content:
          "Ananta Nethralaya, Al Afzah Group WLL, Soorath Autos and HeadGreen — the organisations behind MaCo's delivered work.",
      },
      { property: "og:title", content: "Clients — MaCo" },
      {
        property: "og:description",
        content: "The organisations MaCo builds and maintains software for.",
      },
    ],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell grid gap-8 py-16 lg:grid-cols-12 lg:py-24">
          <p className="label lg:col-span-3">Index / Clients</p>
          <div className="lg:col-span-9">
            <LineReveal as="h1" className="display-lg max-w-3xl">
              Who we build for.
            </LineReveal>
            <ScrubReveal as="p" hold className="mt-8 max-w-xl text-muted">
              No borrowed logos, no unnamed "global brands". Each organisation below is attached to
              work that is live and publicly verifiable.
            </ScrubReveal>
          </div>
        </div>
      </section>

      <section data-ground="paper" aria-label="Client roster">
        <div className="shell py-10 lg:py-16">
          <Stagger as="div" gap={0.05} band={0.3}>
            {clients.map((c, i) => (
              <article
                key={c.slug}
                className="stagger-item rule-t grid gap-6 py-10 lg:grid-cols-12 lg:gap-10"
                style={{ "--i": i } as CSSProperties}
              >
                <span className="label lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <div className="lg:col-span-5">
                  <h2 className="display-md">{c.name}</h2>
                  <p className="mt-3 label">{c.industry}</p>
                </div>
                <div className="lg:col-span-6">
                  <p className="label">Delivered</p>
                  <ul className="mt-3 space-y-2">
                    {c.work.map((w) => {
                      const proj = getProject(w);
                      if (!proj) return null;
                      return (
                        <li key={w}>
                          <Link to="/work/$slug" params={{ slug: w }} className="link-draw text-lg">
                            {proj.title}
                          </Link>
                          <span className="ml-3 text-sm text-muted">{proj.short_description}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-draw mt-5 inline-block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted hover:text-text"
                  >
                    {c.website.replace("https://", "").replace(/\/$/, "")} ↗
                  </a>
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
