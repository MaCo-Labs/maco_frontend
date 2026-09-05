import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { clients, getProject } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { usePointerField } from "@/hooks/use-pointer-field";
import { useSectionHandoff } from "@/hooks/use-section-handoff";
import { PageOutro } from "@/components/inner/page-outro";

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

const HANDOFF_PAIRS = [["Client roster", "Start a project", "sheet"]] as const;

function ClientRow({ c, i }: { c: (typeof clients)[number]; i: number }) {
  const spotlightRef = usePointerField<HTMLDivElement>();

  return (
    <article className="stagger-item index-row" style={{ "--i": i } as CSSProperties}>
      <div className="relative z-[1] grid gap-6 py-10 lg:grid-cols-12 lg:gap-10">
        <span className="label lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
        <div className="flex items-center gap-4 lg:col-span-5">
          {c.brand && (
            <div
              ref={spotlightRef}
              className="evidence-spotlight flex h-14 w-14 shrink-0 items-center justify-center border border-line p-2"
              style={{ background: "var(--surface-2)", borderRadius: "var(--radius-chip)" }}
            >
              <img
                src={c.brand.src}
                alt=""
                width={c.brand.width}
                height={c.brand.height}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>
          )}
          <div>
            <h2 className="display-md">{c.name}</h2>
            <p className="mt-3 label">{c.industry}</p>
          </div>
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
                </li>
              );
            })}
          </ul>
          {c.website && (
            <a
              href={c.website}
              target="_blank"
              rel="noreferrer noopener"
              className="link-draw mt-5 inline-block font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted hover:text-text"
            >
              {c.website.replace("https://", "").replace(/\/$/, "")} ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ClientsPage() {
  useSectionHandoff(HANDOFF_PAIRS);

  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell grid gap-8 page-intro lg:grid-cols-12">
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
              <ClientRow key={c.slug} c={c} i={i} />
            ))}
          </Stagger>
        </div>
      </section>

      <PageOutro
        ariaLabel="Start a project"
        heading="Every logo here answers a phone call."
        body="No case study on this site is anonymised or invented. Ask any client above what it was like to work with us."
        cta={{ label: "See the case studies", to: "/work" }}
      />
    </>
  );
}
