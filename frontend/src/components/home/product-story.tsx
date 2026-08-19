import { useRef, type CSSProperties } from "react";
import { products, type Product } from "@/content/maco";
import { SurfaceMedia } from "@/components/media/surface-media";
import { ProductVideo } from "@/components/media/product-video";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { LineReveal } from "@/components/motion/line-reveal";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * PRODUCTS — Bridge (MaCo-owned) and Driver's Diary (built for HeadGreen).
 * Real feature copy only, no invented "PRODUCTION LIVE" telemetry, no
 * "VERIFIED" badges, no "HeadGreen Mobility" (the real client name is
 * HeadGreen).
 *
 * Paper ground (Phase 4 rhythm swap, was deep): each product's media
 * panel is a deep-ground tile SITTING on a paper page — that's a
 * stronger material read than dark-on-dark. Since the Phase 5 ground
 * regroup, PRODUCTS continues the same paper run WORK and CAPABILITY
 * already started rather than releasing out of a preceding dark
 * passage — EVIDENCE (deep) is now the only dark section directly
 * before this chapter.
 */
export function ProductStory() {
  return (
    <section data-ground="paper" className="rule-t" aria-label="Products">
      <div className="shell py-24 md:py-32">
        <ScrubReveal hold>
          <p className="label">Products</p>
          <LineReveal
            as="h2"
            mode="scrub"
            className="display-lg mt-3 max-w-2xl"
            style={{ color: "var(--text)" }}
          >
            Two platforms we build and run ourselves.
          </LineReveal>
        </ScrubReveal>

        {/* Sticky overlap stack on desktop: each product is position:sticky
            with an ascending z-index and an opaque background, so the
            SECOND card physically rises and covers the first rather than
            the two simply appearing one after another — "two platforms",
            not "a list of two". Below lg, cards flow normally (a sticky
            stack with only ~1 viewport of headroom per card just looks
            like two overlapping fixed panels on a short screen). */}
        <div className="mt-16 space-y-20 lg:space-y-0">
          {products.map((product, i) => (
            <div key={product.slug} className={i === 0 ? undefined : "lg:pt-24"}>
              <ScrubReveal
                as="article"
                rise="2.5rem"
                className="grid gap-8 lg:sticky lg:grid-cols-2 lg:items-center lg:gap-14 lg:rounded-2xl lg:border lg:border-line lg:p-10 lg:shadow-[0_-12px_40px_rgba(0,0,0,0.12)]"
                style={
                  {
                    top: `calc(6rem + ${i * 2}rem)`,
                    zIndex: i + 1,
                    background: "var(--bg)",
                  } as CSSProperties
                }
              >
                <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                  <ProductMedia product={product} />
                </div>
                <div>
                  <p className="label">
                    {product.owner === "MaCo" ? "MaCo owned" : `Built for ${product.owner}`}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    {product.brand && (
                      <img
                        src={product.brand.src}
                        alt=""
                        aria-hidden="true"
                        width={product.brand.width}
                        height={product.brand.height}
                        loading="lazy"
                        decoding="async"
                        className="h-8 w-auto object-contain"
                      />
                    )}
                    <h3 className="display-md" style={{ color: "var(--text)" }}>
                      {product.title}
                    </h3>
                  </div>
                  <p className="lead mt-4">{product.short_description}</p>
                  <p className="mt-4" style={{ color: "var(--muted)" }}>
                    {product.positioning}
                  </p>
                  <Stagger
                    as="ul"
                    className="mt-6 grid gap-3 sm:grid-cols-2"
                    band={0.4}
                    rise="1rem"
                  >
                    {product.features.map((f, fi) => (
                      <li
                        key={f.title}
                        className="stagger-item border-t border-line pt-3"
                        style={{ "--i": fi } as CSSProperties}
                      >
                        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                          {f.title}
                        </p>
                        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                          {f.description}
                        </p>
                      </li>
                    ))}
                  </Stagger>
                  <Magnetic>
                    <a
                      href={product.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-line mt-8"
                    >
                      Open {product.title} <span aria-hidden="true">↗</span>
                    </a>
                  </Magnetic>
                </div>
              </ScrubReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Drives the light-pass sweep from this card's own transit through the
 * viewport — the "product stage" scale of the plan's one signature
 * device, distinct from EVIDENCE's expand-linked one. Range overshoots
 * [-0.15, 1.15] like RakingSurface, for the same reason (the band fully
 * enters and fully clears instead of parking mid-surface) — not wrapped
 * in `<RakingSurface>` itself because SurfaceMedia already applies its
 * own `.light-pass` class; nesting would double the sweep.
 *
 * `--sweep` is set on THIS wrapper div, not on SurfaceMedia's own inner
 * element — inheritance (styles.css's `--sweep` registration) carries it
 * down to SurfaceMedia's `.light-pass::after` regardless of the extra
 * div between them.
 *
 * data-ground="deep" makes each panel a genuinely dark tile sitting on
 * the section's paper ground (Phase 4) — a deep-on-paper plate reads as
 * more material than dark-on-dark would.
 *
 * aspect is derived from the real asset dimensions, not hardcoded: Bridge
 * is 1024x576 (16:9, has video); Driver's Diary is 900x1203 — portrait
 * 3:4 — and the previous hardcoded aspect="4/3" cropped roughly the
 * middle 44% of its height off with objectFit:"cover".
 */
function ProductMedia({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollScene((rt) => {
    const el = ref.current;
    if (!el) return;
    rt.gsap.fromTo(
      el,
      { "--sweep": -0.15 },
      {
        "--sweep": 1.15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.25 },
      },
    );
  }, []);

  const aspect = product.media ? `${product.media.width}/${product.media.height}` : "4/3";

  return (
    <div
      ref={ref}
      data-ground="deep"
      // Hover-only lift, CSS transform + shadow — no JS, no new state.
      // `--sweep` (the light-pass raking highlight) is already scrubbed by
      // scroll above; this just makes the panel itself feel liftable, the
      // same affordance a physical card would give.
      className="rounded-2xl transition-transform duration-500 hover:-translate-y-1"
    >
      <SurfaceMedia
        label={`${product.title} — ${product.kind}`}
        aspect={aspect}
        className="transition-shadow duration-500 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
      >
        {product.media && <ProductVideo media={product.media} priority="low" objectFit="cover" />}
      </SurfaceMedia>
    </div>
  );
}
