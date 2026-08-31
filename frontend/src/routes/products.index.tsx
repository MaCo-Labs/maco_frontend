import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";

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
          "Driver's Diary and Bridge — software MaCo owns and productises, not client one-offs.",
      },
    ],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell grid gap-8 py-16 lg:grid-cols-12 lg:py-24">
          <p className="label lg:col-span-3">Index / Products</p>
          <div className="lg:col-span-9">
            <LineReveal as="h1" className="display-lg max-w-3xl">
              Software we own,{" "}
              <span style={{ color: "var(--muted)" }}>run and keep improving.</span>
            </LineReveal>
            <ScrubReveal as="p" hold className="mt-8 max-w-xl text-muted">
              A product is not a client project. These are platforms with roadmaps, releases and
              users who depend on them during a working day.
            </ScrubReveal>
          </div>
        </div>
      </section>

      {products.map((pr, i) => (
        <section
          key={pr.slug}
          data-ground="paper"
          aria-label={pr.title}
          className={i % 2 === 0 ? "rule-b" : "rule-b grid-field"}
        >
          <ScrubReveal as="div" hold className="shell grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-5">
              <p className="label">
                {pr.index} / {pr.kind}
              </p>
              <h2 className="display-lg mt-5">
                <Link to="/products/$slug" params={{ slug: pr.slug }} className="link-draw">
                  {pr.title}
                </Link>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-snug">{pr.short_description}</p>
              <p className="mt-4 max-w-md text-sm text-muted">{pr.positioning}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <Link to="/products/$slug" params={{ slug: pr.slug }} className="btn-solid">
                    Product overview
                  </Link>
                </Magnetic>
                <Magnetic>
                  <a
                    href={pr.live_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-line"
                  >
                    Open live ↗
                  </a>
                </Magnetic>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Stagger
                as="div"
                className="grid gap-px"
                style={{ background: "var(--line)" }}
                gap={0.1}
              >
                {pr.features.map((f, fi) => (
                  <div
                    key={f.title}
                    className="stagger-item flex gap-5 p-5"
                    style={{ background: "var(--bg)", "--i": fi } as CSSProperties}
                  >
                    <span className="label pt-1">{String(fi + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-display text-lg tracking-[-0.02em]">{f.title}</p>
                      <p className="mt-1 text-sm text-muted">{f.description}</p>
                    </div>
                  </div>
                ))}
              </Stagger>
            </div>
          </ScrubReveal>
        </section>
      ))}
    </>
  );
}
