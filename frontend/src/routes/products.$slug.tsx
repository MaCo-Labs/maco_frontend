import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProduct, products, type Product } from "@/content/maco";
import { MaCoSystemField } from "@/components/system-field";
import { MotionSection } from "@/components/motion-section";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    if (!getProduct(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) {
      return {
        meta: [{ title: "Product not found — MaCo" }, { name: "robots", content: "noindex" }],
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
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const p = getProduct(slug) as Product;
  const other = products.find((x) => x.slug !== slug) as Product;
  const isBridge = p.slug === "bridge";

  return (
    <>
      <section className={`rule-b ${isBridge ? "" : "grid-field"} relative overflow-hidden`}>
        {isBridge && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 opacity-40 lg:block"
            aria-hidden="true"
          >
            <MaCoSystemField className="h-full border-l border-line" scrollProgress={0.45} />
          </div>
        )}
        <div className="shell relative z-10 py-16 lg:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="label">
              Product / {p.index}
              {isBridge ? " · MaCo system" : ""}
            </p>
            <Link to="/products" className="link-draw text-sm text-muted hover:text-text">
              ← All products
            </Link>
          </div>
          {isBridge && <p className="mt-6 max-w-xl text-sm text-muted">{p.positioning}</p>}
          <LineReveal as="h1" className="display-hero mt-8 -ml-[0.04em]">
            {p.title}
          </LineReveal>
          <p className="mt-8 max-w-2xl text-lg leading-snug">{p.short_description}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a href={p.live_url} target="_blank" rel="noreferrer noopener" className="btn-solid">
                Open {p.title} ↗
              </a>
            </Magnetic>
            <Magnetic>
              <Link to="/contact" className="btn-line">
                Request a walkthrough
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <section className="rule-b">
        <div
          className="shell grid gap-px py-0 sm:grid-cols-2 lg:grid-cols-4"
          style={{ background: "var(--line)" }}
        >
          {[
            ["Owner", p.owner === "MaCo" ? "MaCo-owned" : `Built for ${p.owner}`],
            ["Type", p.kind],
            ["Users", p.target_users],
            ["Stack", p.technologies.join(" · ")],
          ].map(([k, v]) => (
            <div key={k} className="px-5 py-6" style={{ background: "var(--bg)" }}>
              <p className="label">{k}</p>
              <p className="mt-2 text-sm">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <MotionSection as="section" className="rule-b">
        <div className="shell grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-6">
            <p className="label">01 — Problem</p>
            <p className="mt-5 text-lg leading-snug text-muted">{p.problem}</p>
          </div>
          <div className="lg:col-span-6">
            <p className="label">02 — Solution</p>
            <p className="mt-5 text-lg leading-snug">{p.solution}</p>
          </div>
        </div>
      </MotionSection>

      <MotionSection as="section" className="rule-b" delay={40}>
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">03 — Capabilities</p>
          <div
            className={`lg:col-span-9 ${isBridge ? "grid gap-px sm:grid-cols-2" : ""}`}
            style={isBridge ? { background: "var(--line)" } : undefined}
          >
            {isBridge
              ? p.features.map((f, i) => (
                  <div key={f.title} className="p-5 md:p-6" style={{ background: "var(--bg)" }}>
                    <span className="label">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="mt-3 font-display text-xl tracking-[-0.03em]">{f.title}</h2>
                    <p className="mt-2 text-sm text-muted">{f.description}</p>
                  </div>
                ))
              : p.features.map((f, i) => (
                  <div key={f.title} className="rule-t grid gap-2 py-6 md:grid-cols-12 md:gap-6">
                    <span className="label md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="font-display text-xl tracking-[-0.03em] md:col-span-4">
                      {f.title}
                    </h2>
                    <p className="max-w-xl text-sm text-muted md:col-span-7">{f.description}</p>
                  </div>
                ))}
            {!isBridge && <div className="rule-t" />}
          </div>
        </div>
      </MotionSection>

      {isBridge && (
        <MotionSection as="section" className="rule-b" delay={60}>
          <div className="shell py-14 lg:grid lg:grid-cols-12 lg:gap-10 lg:py-20">
            <div className="lg:col-span-4">
              <p className="label">04 — System</p>
              <h2 className="display-md mt-4">
                Built from delivery problems we hit on client work.
              </h2>
            </div>
            <div className="mt-8 lg:col-span-8 lg:mt-0">
              <p className="max-w-2xl text-muted">
                Bridge is MaCo&apos;s own product — project implementation, assignment,
                administration and analysis as one workflow, available as a PWA and on the desktop.
                It is not a board with memory left to the team.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-solid"
                  >
                    Open Bridge ↗
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link to="/contact" className="btn-line">
                    Talk to us about Bridge
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </MotionSection>
      )}

      <section>
        <div className="shell py-14 lg:py-20">
          <p className="label">Other product</p>
          <Link
            to="/products/$slug"
            params={{ slug: other.slug }}
            className="display-lg link-draw mt-4 inline-block"
          >
            {other.title}
          </Link>
        </div>
      </section>
    </>
  );
}
