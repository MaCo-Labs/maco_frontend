import type { CSSProperties } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject, getService, projects, type Project } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { CardMedia } from "@/components/home/summary";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    if (!getProject(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const p = getProject(params.slug);
    if (!p) {
      return {
        meta: [{ title: "Case study not found — MaCo" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: p.seo_title },
        { name: "description", content: p.seo_description },
        { property: "og:title", content: p.seo_title },
        { property: "og:description", content: p.seo_description },
      ],
    };
  },
  component: WorkDetail,
});

function WorkDetail() {
  const { slug } = Route.useParams();
  const p = getProject(slug) as Project;
  const next = projects[
    (projects.findIndex((x) => x.slug === slug) + 1) % projects.length
  ] as Project;

  const blocks = [
    ["Challenge", p.challenge],
    ["Solution", p.solution],
    ["Outcome", p.results],
  ] as const;

  return (
    <>
      <section data-ground="paper" aria-label="Case study introduction" className="rule-b">
        <div className="shell py-16 lg:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="label">Case study / {p.index}</p>
            <Link to="/work" className="link-draw text-sm text-muted hover:text-text">
              ← All work
            </Link>
          </div>
          <LineReveal as="h1" className="display-hero mt-8 -ml-[0.04em]">
            {p.title}
          </LineReveal>
          <CardMedia
            media={p.media}
            brand={p.brand}
            title={p.title}
            aspect="16 / 9"
            className="mt-10"
          />
          <Stagger
            as="dl"
            className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-4"
            style={{ background: "var(--line)" }}
            gap={0.1}
            band={0.35}
          >
            {[
              ["Client", p.client],
              ["Sector", p.sector],
              ["Type", "Client project"],
              p.external_url ? ["Live", "Public"] : ["Delivered", "Print / brand piece"],
            ].map(([k, v], i) => (
              <div
                key={k}
                className="stagger-item px-5 py-5"
                style={{ background: "var(--bg)", "--i": i } as CSSProperties}
              >
                <dt className="label">{k}</dt>
                <dd className="mt-2 text-sm">{v}</dd>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section data-ground="paper" aria-label="Summary" className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Summary</p>
          <p className="display-md max-w-3xl lg:col-span-9">{p.short_description}</p>
        </div>
      </section>

      {blocks.map(([title, body], i) => (
        <section key={title} data-ground="paper" aria-label={title} className="rule-b">
          <ScrubReveal
            hold
            as="div"
            className="shell grid gap-6 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16"
          >
            <p className="label lg:col-span-3">
              {String(i + 1).padStart(2, "0")} — {title}
            </p>
            <p className="max-w-2xl text-lg leading-snug text-muted lg:col-span-8">{body}</p>
          </ScrubReveal>
        </section>
      ))}

      <section data-ground="paper" aria-label="Services applied" className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Services applied</p>
          <div className="lg:col-span-9">
            <div className="flex flex-wrap gap-3">
              {p.services.map((s) => {
                const svc = getService(s);
                if (!svc) return null;
                return (
                  <Link key={s} to="/services/$slug" params={{ slug: s }} className="btn-line">
                    {svc.title}
                  </Link>
                );
              })}
            </div>
            {p.external_url && (
              <Magnetic className="mt-8 inline-block">
                <a
                  href={p.external_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-solid"
                >
                  Visit {p.title} ↗
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      </section>

      <section data-ground="paper" aria-label="Next case study">
        <div className="shell py-14 lg:py-20">
          <p className="label">Next case study</p>
          <Link
            to="/work/$slug"
            params={{ slug: next.slug }}
            className="display-lg link-draw mt-4 inline-block"
          >
            {next.title}
          </Link>
        </div>
      </section>
    </>
  );
}
