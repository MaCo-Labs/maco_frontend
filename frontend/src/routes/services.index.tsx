import { createFileRoute, Link } from "@tanstack/react-router";
import { services } from "@/content/maco";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Web, app, technical & software support | MaCo" },
      {
        name: "description",
        content:
          "MaCo's five launch services: web development, app development, technical support, software support and social media managing.",
      },
      { property: "og:title", content: "Services — MaCo" },
      {
        property: "og:description",
        content:
          "Five confirmed services, each backed by delivered client work and owned products.",
      },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <>
      <section className="rule-b">
        <div className="shell grid gap-8 py-16 lg:grid-cols-12 lg:py-24">
          <p className="label lg:col-span-3">Index / Services</p>
          <div className="lg:col-span-9">
            <h1 className="display-lg max-w-3xl">
              What we sell,{" "}
              <span style={{ color: "var(--muted)" }}>and the evidence behind each one.</span>
            </h1>
          </div>
        </div>
      </section>

      <section>
        <div className="shell py-10 lg:py-16">
          {services.map((s) => (
            <article key={s.slug} className="index-row group">
              <Link to="/services/$slug" params={{ slug: s.slug }} className="block py-10">
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
          <div className="rule-t" />
        </div>
      </section>
    </>
  );
}
