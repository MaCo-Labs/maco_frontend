import type { CSSProperties, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { projects, products, type Brand, type Media } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { ProductVideo } from "@/components/media/product-video";

/**
 * SUMMARY — `section.cb-summary`, the shape Cuberto's homepage uses twice
 * (`#featured` on inverted ground, `#clients` on light). Their measured
 * `div.cb-summary-cards` is `450px 450px` with a 90px gap, each card a
 * portrait media plate with its title and caption beneath.
 *
 * One component, two call sites — `<FeaturedWork>` (client platforms, on
 * `deep` ground) and `<ProductSummary>` (MaCo's own products, on `paper`)
 * — which is exactly how Cuberto uses it, and why the alternation reads
 * as rhythm rather than as two unrelated sections that happen to look
 * alike.
 *
 * Replaces `work-reveal.tsx` (a hover-reveal list with a floating panel)
 * and `product-showcase.tsx` (a sticky expand-to-reel stage). The
 * hover-reveal list is Cuberto's *projects page* device, not their
 * homepage one; on the homepage the work is a card grid, and a card grid
 * also works on touch, where a hover-reveal has nothing to reveal.
 */
function Summary({
  ground,
  ariaLabel,
  label,
  heading,
  cta,
  children,
}: {
  ground: "paper" | "deep";
  ariaLabel: string;
  label: string;
  heading: string;
  cta: ReactNode;
  children: ReactNode;
}) {
  return (
    <section data-ground={ground} aria-label={ariaLabel}>
      <div className="shell cb-section">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <ScrubReveal hold>
              <p className="label">{label}</p>
            </ScrubReveal>
            <LineReveal
              as="h2"
              mode="scrub"
              className="display-lg mt-3 max-w-2xl"
              style={{ color: "var(--text)" }}
            >
              {heading}
            </LineReveal>
          </div>
          {cta}
        </div>

        <div className="cb-cards mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}

/** A card's visual: real footage when it exists, the brand mark on a
 *  plate when it doesn't. Never a generic placeholder image — per
 *  AGENTS.md, a stand-in must not read as the real thing, which is why
 *  the brand-plate fallback looks deliberately unlike a screenshot. */
function CardMedia({
  media,
  brand,
  title,
}: {
  media?: Media | undefined;
  brand?: Brand | undefined;
  title: string;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: "450 / 608",
        borderRadius: "var(--radius-card)",
        background: "var(--surface-2)",
      }}
    >
      {media ? (
        <ProductVideo
          media={media}
          objectFit="contain"
          radius="var(--radius-card)"
          priority="low"
        />
      ) : brand ? (
        <div className="absolute inset-0 grid place-items-center p-12">
          <img
            src={brand.src}
            alt=""
            width={brand.width}
            height={brand.height}
            loading="lazy"
            decoding="async"
            className="max-h-32 w-auto max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center p-12">
          <span className="display-md text-center" style={{ color: "var(--muted)" }}>
            {title}
          </span>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  i,
  to,
  params,
  media,
  brand,
  title,
  caption,
  meta,
}: {
  i: number;
  to: string;
  params: { slug: string };
  media?: Media | undefined;
  brand?: Brand | undefined;
  title: string;
  caption: string;
  meta: string;
}) {
  return (
    <article className="stagger-item" style={{ "--i": i } as CSSProperties}>
      <Link
        to={to}
        params={params}
        className="group block transition-transform duration-500 hover:-translate-y-1.5"
      >
        <CardMedia media={media} brand={brand} title={title} />
        <div className="mt-6 flex items-baseline justify-between gap-4">
          <h3 className="display-md" style={{ color: "var(--text)" }}>
            {title}
          </h3>
          <span className="label shrink-0">{meta}</span>
        </div>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          {caption}
        </p>
      </Link>
    </article>
  );
}

export function FeaturedWork() {
  return (
    <Summary
      ground="deep"
      ariaLabel="Selected client work"
      label="Work"
      heading="Platforms carrying real operational weight."
      cta={
        <Link to="/work" className="btn-line">
          All work <span aria-hidden="true">→</span>
        </Link>
      }
    >
      <Stagger as="div" className="contents" gap={0.14} band={0.45}>
        {projects.map((p, i) => (
          <SummaryCard
            key={p.slug}
            i={i}
            to="/work/$slug"
            params={{ slug: p.slug }}
            media={p.media}
            brand={p.brand}
            title={p.title}
            caption={p.short_description}
            meta={p.index}
          />
        ))}
      </Stagger>
    </Summary>
  );
}

export function ProductSummary() {
  return (
    <Summary
      ground="paper"
      ariaLabel="Products"
      label="Products"
      heading="Two products of our own, in daily use."
      cta={
        <Link to="/products" className="btn-line">
          All products <span aria-hidden="true">→</span>
        </Link>
      }
    >
      <Stagger as="div" className="contents" gap={0.16} band={0.5}>
        {products.map((p, i) => (
          <SummaryCard
            key={p.slug}
            i={i}
            to="/products/$slug"
            params={{ slug: p.slug }}
            media={p.media}
            brand={p.brand}
            title={p.title}
            caption={p.short_description}
            meta={p.kind}
          />
        ))}
      </Stagger>
    </Summary>
  );
}
