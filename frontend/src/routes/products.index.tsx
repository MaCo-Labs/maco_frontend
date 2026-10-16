import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/content/maco";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { LineReveal } from "@/components/motion/line-reveal";
import { BridgeTour } from "@/components/products/bridge-tour";
import { CardMedia } from "@/components/home/summary";
import { useSectionHandoff } from "@/hooks/use-section-handoff";
import { PageOutro } from "@/components/inner/page-outro";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — Driver's Diary & Bridge | MaCo" },
      {
        name: "description",
        content:
          "MaCo's product catalogue: Driver's Diary, a fleet operations PWA built for HeadGreen, and Bridge, MaCo's own project and task platform.",
      },
      { property: "og:title", content: "Products — MaCo" },
      {
        property: "og:description",
        content:
          "Bridge by MaCo and Driver's Diary for HeadGreen. Products built around everyday work.",
      },
      { property: "og:url", content: absoluteUrl("/products") },
      {
        "script:ld+json": breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ]),
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/products") }],
  }),
  component: ProductsIndex,
});

const HANDOFF_PAIRS = [
  [products.find((product) => product.slug === "drivers-diary")!.title, "Start a project", "sheet"],
] as const;

function ProductsIndex() {
  useSectionHandoff(HANDOFF_PAIRS);
  const ordered = [...products].sort(
    (a, b) => Number(b.slug === "bridge") - Number(a.slug === "bridge"),
  );
  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell page-intro">
          <p className="label">Products</p>
          <LineReveal as="h1" className="display-lg mt-6 max-w-4xl">
            Made for the working day.
          </LineReveal>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            Bridge brings teams together. Driver's Diary keeps HeadGreen's fleet records connected.
            Explore the software and the work behind it.
          </p>
        </div>
      </section>
      {ordered.map((pr) => (
        <section key={pr.slug} data-ground="paper" aria-label={pr.title} className="rule-b">
          <div className="shell cb-section">
            <div className="product-chapter">
              <div>
                <p className="product-ownership">
                  {pr.owner === "MaCo" ? "A product by MaCo" : `Built for ${pr.owner}`}
                </p>
                <h2 className="product-chapter-title">{pr.title}</h2>
                <p className="product-chapter-copy">{pr.short_description}</p>
                <div className="product-chapter-links">
                  <Link to="/products/$slug" params={{ slug: pr.slug }} className="btn-solid">
                    Explore {pr.title} <span aria-hidden="true">↗</span>
                  </Link>
                  <a
                    href={pr.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-line"
                  >
                    Open live
                  </a>
                </div>
              </div>
              {pr.slug === "bridge" ? (
                <BridgeTour />
              ) : (
                <div className="product-diary-visual">
                  <CardMedia
                    screen={pr.screen}
                    media={pr.media}
                    brand={pr.brand}
                    title={pr.title}
                  />
                </div>
              )}
            </div>
            <div className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {pr.features.slice(0, 4).map((feature) => (
                <div key={feature.title} className="border-t border-line pt-5">
                  <h3 className="text-xl leading-snug">{feature.title}</h3>
                  <p className="mt-3 max-w-xl text-muted">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
      <PageOutro
        ariaLabel="Start a project"
        heading="What should your software make possible?"
        body="Tell us how your team works. We will work out what to build together."
        cta={{ label: "Start a project", to: "/contact" }}
      />
    </>
  );
}
