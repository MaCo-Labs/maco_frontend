import { createFileRoute } from "@tanstack/react-router";
import { LineReveal } from "@/components/motion/line-reveal";
import { WorkCollection } from "@/components/work/work-collection";
import { PageOutro } from "@/components/inner/page-outro";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Work — Client projects delivered by MaCo" },
      {
        name: "description",
        content:
          "Case studies from MaCo: Ananta Nethralaya, Al Afzah Group, Soorath Autos, HeadGreen and Ozone Fitout & Contracting.",
      },
      { property: "og:title", content: "Work — MaCo" },
      {
        property: "og:description",
        content:
          "Real client work across healthcare, construction, automotive retail, EV mobility and interior fit-out.",
      },
      { property: "og:url", content: absoluteUrl("/work") },
      {
        "script:ld+json": breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ]),
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/work") }],
  }),
  component: WorkIndex,
});

function WorkIndex() {
  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell grid gap-8 page-intro lg:grid-cols-12">
          <p className="label lg:col-span-3">Index / Client work</p>
          <div className="lg:col-span-9">
            <LineReveal as="h1" className="display-lg max-w-3xl">
              Five clients.
              <br />
              <span style={{ color: "var(--muted)" }}>Five different problems.</span>
            </LineReveal>
            <p className="mt-8 max-w-xl text-muted">
              Websites, operational platforms and a corporate brochure. A closer look at the work we
              have delivered for real businesses.
            </p>
          </div>
        </div>
      </section>
      <section data-ground="paper" aria-label="Projects">
        <div className="shell cb-section">
          <WorkCollection headingLevel={2} />
        </div>
      </section>
      <PageOutro
        ariaLabel="Start a project"
        heading="Your problem could be next."
        body="Tell us what your business needs to do. We will work out what to build together."
        cta={{ label: "Start a project", to: "/contact" }}
      />
    </>
  );
}
