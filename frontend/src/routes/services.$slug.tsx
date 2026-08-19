import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getService, getProject, getProduct, services, type Service } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { MotionSection } from "@/components/motion-section";

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
      <section className="rule-b">
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
            <p className="mt-8 max-w-2xl text-lg leading-snug">{service.description}</p>
          </div>
        </div>
      </section>

      <section className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Capabilities</p>
          <div className="lg:col-span-9">
            {service.capabilities.map((c, i) => (
              <MotionSection
                key={c.title}
                delay={i * 70}
                className="rule-t grid gap-2 py-6 md:grid-cols-12 md:gap-6"
              >
                <span className="label md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-display text-xl tracking-[-0.03em] md:col-span-4">{c.title}</h2>
                <p className="max-w-xl text-sm text-muted md:col-span-7">{c.description}</p>
              </MotionSection>
            ))}
            <div className="rule-t" />
          </div>
        </div>
      </section>

      <section className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Evidence</p>
          <div
            className="grid gap-px lg:col-span-9 lg:grid-cols-2"
            style={{ background: "var(--line)" }}
          >
            {service.evidence.map((slug) => {
              const project = getProject(slug);
              const product = getProduct(slug);
              if (project) {
                return (
                  <Link
                    key={slug}
                    to="/work/$slug"
                    params={{ slug }}
                    className="group p-7 transition-colors"
                    style={{ background: "var(--bg)" }}
                  >
                    <span className="label">Project</span>
                    <p className="mt-3 font-display text-2xl tracking-[-0.03em] group-hover:opacity-70">
                      {project.title}
                    </p>
                    <p className="mt-2 text-sm text-muted">{project.short_description}</p>
                  </Link>
                );
              }
              if (product) {
                return (
                  <Link
                    key={slug}
                    to="/products/$slug"
                    params={{ slug }}
                    className="group p-7"
                    style={{ background: "var(--bg)" }}
                  >
                    <span className="label">Product</span>
                    <p className="mt-3 font-display text-2xl tracking-[-0.03em] group-hover:opacity-70">
                      {product.title}
                    </p>
                    <p className="mt-2 text-sm text-muted">{product.short_description}</p>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      </section>

      <section>
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
