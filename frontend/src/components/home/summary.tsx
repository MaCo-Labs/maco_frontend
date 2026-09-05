import type { CSSProperties, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { projects, products, type Brand, type Media } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { Magnetic } from "@/components/motion/magnetic";
import { ProductVideo } from "@/components/media/product-video";
import { MorphSlider } from "@/components/media/morph-slider";
import { PhoneMockup } from "@/components/media/phone-mockup";

/**
 * SUMMARY — `section.cb-summary`, the shape Cuberto's homepage uses twice
 * (`#featured` on inverted ground, `#clients` on light). Their measured
 * `div.cb-summary-cards` is `450px 450px` with a 90px gap, each card a
 * portrait media plate with its title and caption beneath.
 *
 * One component, two call sites — `<FeaturedWork>` (client platforms) and
 * `<ProductSummary>` (MaCo's own products), both `paper` since the
 * 2026-08-28 dark-first pass folded slots 3-8 into one uninterrupted
 * paper middle act between a dark open and a dark close (`CONTEXT.md`
 * §10) — Cuberto's own `#featured`/`#clients` alternate ground, but
 * MaCo's ground sequence answers to the three-act shape, not to matching
 * Cuberto section-for-section.
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
/** Exported for reuse on `/work/$slug` (item 7b's "no imagery anywhere"
 *  gap) — same fallback chain, same data shape, no duplicated logic.
 *  `aspect` defaults to the card grid's own landscape ratio (matches the
 *  real screenshots' native 21:10-ish crop) so every existing call site
 *  is unaffected; the case-study page passes its own wide ratio, since a
 *  full-shell-width hero needs a different one entirely. */
export function CardMedia({
  media,
  brand,
  gallery,
  screen,
  title,
  aspect = "2.1 / 1",
  className = "",
}: {
  media?: Media | undefined;
  brand?: Brand | undefined;
  gallery?: string[] | undefined;
  /** A looping screen recording for a phone-only product — rendered inside
   *  a phone-frame mockup instead of every other media type's flat card
   *  box, since a device screenshot doesn't read as "this is a phone app"
   *  boxed into a landscape panel. Takes priority over `gallery`/`media`. */
  screen?: Media | undefined;
  title: string;
  aspect?: string;
  className?: string;
}) {
  // Phone mockup bypasses the flat card box entirely — no fixed
  // aspect-ratio panel, no surface fill, no clip radius. The device is its
  // own shape; boxing it in a landscape card panel (like the other media
  // types below) just added dead grey space above and below it.
  if (screen) {
    return <PhoneMockup screen={screen} className={className} />;
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspect,
        borderRadius: "var(--radius-card)",
        background: "var(--surface-2)",
      }}
    >
      {gallery && gallery.length > 1 ? (
        // Radius 0: the CardMedia wrapper above already clips + rounds this
        // box (var(--radius-card)); a second radius here would just double
        // up at the same corners, so the slider fills it edge-to-edge.
        <MorphSlider items={gallery.map((src) => ({ image: src }))} radius={0} autoplay loop />
      ) : media ? (
        <ProductVideo
          media={media}
          objectFit={media.note ? "contain" : "cover"}
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
  gallery,
  screen,
  title,
  caption,
  meta,
  cursorLabel,
}: {
  i: number;
  to: string;
  params: { slug: string };
  media?: Media | undefined;
  brand?: Brand | undefined;
  gallery?: string[] | undefined;
  screen?: Media | undefined;
  title: string;
  caption: string;
  meta: string;
  cursorLabel: string;
}) {
  return (
    <article className="stagger-item" style={{ "--i": i } as CSSProperties}>
      {/* Magnetic leans the whole card toward the pointer (14px rubber-
          banded travel); the card's own translate-y lift composes on top
          of it since they're different elements — wrapper leans, card
          lifts. No-ops to a plain div on touch/reduced motion. */}
      <Magnetic>
        <Link
          to={to}
          params={params}
          data-cursor="media"
          data-cursor-label={cursorLabel}
          className="group block transition-transform duration-300 hover:-translate-y-1.5"
        >
          <CardMedia media={media} brand={brand} gallery={gallery} screen={screen} title={title} />
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {brand && (
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-line p-1.5"
                  style={{ background: "var(--surface-2)", borderRadius: "var(--radius-chip)" }}
                >
                  <img
                    src={brand.src}
                    alt=""
                    width={brand.width}
                    height={brand.height}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <h3 className="display-md" style={{ color: "var(--text)" }}>
                {title}
              </h3>
            </div>
            <span className="label shrink-0">{meta}</span>
          </div>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {caption}
          </p>
        </Link>
      </Magnetic>
    </article>
  );
}

export function FeaturedWork() {
  return (
    <Summary
      ground="paper"
      ariaLabel="Selected client work"
      label="Work"
      heading="Platforms carrying real operational weight."
      cta={
        <Magnetic>
          <Link to="/work" className="btn-line">
            All work <span aria-hidden="true">→</span>
          </Link>
        </Magnetic>
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
            gallery={p.gallery}
            title={p.title}
            caption={p.short_description}
            meta={p.index}
            cursorLabel="View →"
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
        <Magnetic>
          <Link to="/products" className="btn-line">
            All products <span aria-hidden="true">→</span>
          </Link>
        </Magnetic>
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
            screen={p.screen}
            title={p.title}
            caption={p.short_description}
            meta={p.kind}
            cursorLabel="Explore"
          />
        ))}
      </Stagger>
    </Summary>
  );
}
