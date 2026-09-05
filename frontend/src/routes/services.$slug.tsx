import type { CSSProperties } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getService, getProject, getProduct, services, type Service } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { usePointerField } from "@/hooks/use-pointer-field";

/** One Evidence cell — project or product, same chrome either way. Carries
 *  its own `usePointerField` so `.evidence-spotlight`'s --px/--py glow is
 *  local to this card, not the whole grid (each card's pointer math is
 *  independent, matching a real per-card spotlight rather than one field
 *  shared across the grid). */
function EvidenceCard({
  to,
  slug,
  kind,
  title,
  description,
  index,
}: {
  to: "/work/$slug" | "/products/$slug";
  slug: string;
  kind: "Project" | "Product";
  title: string;
  description: string;
  index: number;
}) {
  const ref = usePointerField<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      to={to}
      params={{ slug }}
      className="evidence-spotlight stagger-item group p-7 transition-colors"
      style={{ background: "var(--bg)", "--i": index } as CSSProperties}
    >
      <span className="label">{kind}</span>
      <p className="mt-3 font-display text-2xl tracking-[-0.03em] group-hover:opacity-70">
        {title}
      </p>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </Link>
  );
}

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service not found — MaCo" }, { name: "robots", content: "noindex" }],
      };
    }
    const s = loaderData.service;
    return {
      meta: [
        { title: s.seo_title },
        { name: "description", content: s.seo_description },
        { property: "og:title", content: s.seo_title },
        { property: "og:description", content: s.seo_description },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const service = getService(slug) as Service;
  const next = services[
    (services.findIndex((s) => s.slug === slug) + 1) % services.length
  ] as Service;

  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell grid gap-8 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-3">
            <p className="label">Service / {service.index}</p>
            <Link
              to="/services"
              className="link-draw mt-4 inline-block text-sm text-muted hover:text-text"
            >
              ← All services
            </Link>
          </div>
          <div className="lg:col-span-9">
            <LineReveal as="h1" className="display-lg">
              {service.title}
            </LineReveal>
            <ScrubReveal as="p" hold className="mt-8 max-w-2xl text-lg leading-snug">
              {service.description}
            </ScrubReveal>
          </div>
        </div>
      </section>

      <section data-ground="paper" aria-label="Capabilities" className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Capabilities</p>
          <div className="lg:col-span-9">
            <Stagger as="div" gap={0.1} band={0.35}>
              {service.capabilities.map((c, i) => (
                <div
                  key={c.title}
                  className="stagger-item group rule-t grid gap-2 py-6 md:grid-cols-12 md:gap-6"
                  style={{ "--i": i } as CSSProperties}
                >
                  <span className="label md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="font-display text-xl tracking-[-0.03em] transition-transform duration-300 ease-[var(--ease-emphasis)] group-hover:translate-x-1 md:col-span-4">
                    {c.title}
                  </h2>
                  <p className="max-w-xl text-sm text-muted transition-[color,transform] duration-300 ease-[var(--ease-emphasis)] group-hover:translate-x-1 group-hover:text-[var(--text)] md:col-span-7">
                    {c.description}
                  </p>
                </div>
              ))}
            </Stagger>
            <div className="rule-t" />
          </div>
        </div>
      </section>

      <section data-ground="paper" aria-label="Evidence" className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Evidence</p>
          <Stagger
            as="div"
            className="grid gap-px lg:col-span-9 lg:grid-cols-2"
            style={{ background: "var(--line)" }}
            gap={0.08}
            band={0.3}
          >
            {service.evidence.map((slug, i) => {
              const project = getProject(slug);
              if (project) {
                return (
                  <EvidenceCard
                    key={slug}
                    to="/work/$slug"
                    slug={slug}
                    kind="Project"
                    title={project.title}
                    description={project.short_description}
                    index={i}
                  />
                );
              }
              const product = getProduct(slug);
              if (product) {
                return (
                  <EvidenceCard
                    key={slug}
                    to="/products/$slug"
                    slug={slug}
                    kind="Product"
                    title={product.title}
                    description={product.short_description}
                    index={i}
                  />
                );
              }
              return null;
            })}
          </Stagger>
        </div>
      </section>

      <section data-ground="paper" aria-label="Next service">
        <div className="shell flex flex-col gap-4 py-14 sm:flex-row sm:items-end sm:justify-between lg:py-20">
          <div>
            <p className="label">Next service</p>
            <Link
              to="/services/$slug"
              params={{ slug: next.slug }}
              className="display-md link-draw mt-3 inline-block"
            >
              {next.title}
            </Link>
          </div>
          <Magnetic className="self-start sm:self-auto">
            <Link to="/contact" className="btn-solid">
              Enquire about {service.title.toLowerCase()}
            </Link>
          </Magnetic>
        </div>
      </section>
    </>
  );
}
