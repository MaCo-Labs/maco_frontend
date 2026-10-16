import { createFileRoute } from "@tanstack/react-router";
import { LineReveal } from "@/components/motion/line-reveal";
import { ServiceExplorer } from "@/components/services/service-explorer";
import { PageOutro } from "@/components/inner/page-outro";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

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

function ServicesIndex() {
  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell grid gap-8 page-intro lg:grid-cols-12">
          <p className="label lg:col-span-3">Index / Services</p>
          <div className="lg:col-span-9">
            <LineReveal as="h1" className="display-lg max-w-3xl">
              Made to be seen.
              <br />
              <span style={{ color: "var(--muted)" }}>Built to be used.</span>
            </LineReveal>
            <p className="mt-8 max-w-xl text-muted">
              Your public presence and your everyday operations. Two connected sides of what we do,
              with the work to show for it.
            </p>
          </div>
        </div>
      </section>
      <section data-ground="paper" aria-label="Service list">
        <div className="shell cb-section">
          <p className="label">Choose a service line</p>
          <ServiceExplorer />
        </div>
      </section>
      <PageOutro
        ariaLabel="Start a project"
        heading="What needs to work better?"
        body="A website, a workflow, or an entire platform. Start with the problem you need to solve."
        cta={{ label: "Start a project", to: "/contact" }}
      />
    </>
  );
}
