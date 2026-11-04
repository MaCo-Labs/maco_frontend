import type { CSSProperties } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject, getService, projects, type Project } from "@/content/maco";
import { absoluteUrl, breadcrumbJsonLd, caseStudyJsonLd, socialImage } from "@/lib/seo";
import { NotFoundSection } from "@/components/inner/not-found-section";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { CaseStory } from "@/components/work/case-story";
import { Stagger } from "@/components/motion/stagger";
import { CardMedia } from "@/components/home/summary";
import { CaseGallery } from "@/components/work/case-gallery";
import { useLiveSite } from "@/hooks/use-live-site";
import { UPCOMING_SITES } from "@/lib/upcoming-sites";

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
    const path = `/work/${p.slug}`;
    return {
      meta: [
        { title: p.seo_title },
        { name: "description", content: p.seo_description },
        { property: "og:title", content: p.seo_title },
        { property: "og:description", content: p.seo_description },
        { property: "og:url", content: absoluteUrl(path) },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: p.seo_title },
        { name: "twitter:description", content: p.seo_description },
        ...socialImage(p.media?.poster),
        {
          "script:ld+json": caseStudyJsonLd({
            title: p.title,
            description: p.seo_description,
            path,
            image: p.media?.poster,
            sector: p.sector,
          }),
        },
        {
          "script:ld+json": breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: p.title, path },
          ]),
        },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(path) }],
    };
  },
  notFoundComponent: () => (
    <NotFoundSection label="Case study not found" backTo="/work" backLabel="Back to work" />
  ),
  component: WorkDetail,
});

function WorkDetail() {
  const { slug } = Route.useParams();
  const p = getProject(slug) as Project;
  const upcomingUrl = useLiveSite(p.slug);
  const siteUrl = p.external_url ?? upcomingUrl;
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
        <div className="shell page-intro">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="label">Case study / {p.index}</p>
            <Link to="/work" className="link-draw text-sm text-muted hover:text-text">
              ← All work
            </Link>
          </div>
          <LineReveal as="h1" className="display-hero mt-8 -ml-[0.04em]">
            {p.title}
          </LineReveal>
          {/* Real captures only (`p.gallery`, content/maco.ts) — never invented. */}
          {p.gallery && p.gallery.length > 1 ? (
            <CaseGallery images={p.gallery} title={p.title} slug={p.slug} className="mt-10" />
          ) : (
            <CardMedia
              media={p.media}
              brand={p.brand}
              title={p.title}
              aspect="16 / 9"
              className="mt-10"
            />
          )}
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
              siteUrl
                ? ["Live", "Public"]
                : UPCOMING_SITES[p.slug]
                  ? ["Website", "In final development"]
                  : ["Delivered", "Print / brand piece"],
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

      <CaseStory chapters={blocks} />

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
            {siteUrl && (
              <Magnetic className="mt-8 inline-block">
                <a href={siteUrl} target="_blank" rel="noreferrer noopener" className="btn-solid">
                  Visit {p.title} ↗
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      </section>

      <section data-ground="paper" aria-label="Next case study">
        <div className="shell dock-clearance-b py-14 lg:py-20">
          <p className="label">Next case study</p>
          <Link
            to="/work/$slug"
            params={{ slug: next.slug }}
            className="display-lg link-draw mt-4 inline-block"
            data-cursor={next.media?.poster ? "preview" : undefined}
            data-cursor-image={next.media?.poster}
            data-cursor-label={next.media?.poster ? "View" : undefined}
          >
            {next.title}
          </Link>
        </div>
      </section>
    </>
  );
}
