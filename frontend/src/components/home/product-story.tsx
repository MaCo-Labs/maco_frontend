import { useEffect, useRef } from "react";
import { products, type Product } from "@/content/maco";
import { SurfaceMedia } from "@/components/media/surface-media";
import { ProductVideo } from "@/components/media/product-video";
import { MotionSection } from "@/components/motion-section";
import { Magnetic } from "@/components/motion/magnetic";
import { getScrollRuntime } from "@/lib/scroll-runtime";

/**
 * PRODUCTS — Bridge (MaCo-owned) and Driver's Diary (built for HeadGreen).
 * Real feature copy only, no invented "PRODUCTION LIVE" telemetry, no
 * "VERIFIED" badges, no "HeadGreen Mobility" (the real client name is
 * HeadGreen).
 */
export function ProductStory() {
  return (
    <section data-ground="deep" className="rule-t" aria-label="Products">
      <div className="shell py-24 md:py-32">
        <MotionSection>
          <p className="label">Products</p>
          <h2 className="display-lg mt-3 max-w-2xl" style={{ color: "var(--text)" }}>
            Two platforms we build and run ourselves.
          </h2>
        </MotionSection>

        <div className="mt-16 space-y-20">
          {products.map((product, i) => (
            <MotionSection key={product.slug} delay={i * 100}>
              <article className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
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
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {product.features.map((f) => (
                      <li key={f.title} className="border-t border-line pt-3">
                        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                          {f.title}
                        </p>
                        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                          {f.description}
                        </p>
                      </li>
                    ))}
                  </ul>
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
              </article>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Drives the light-pass sweep from this card's own transit through the
 * viewport — the "product stage" scale of the plan's one signature
 * device, distinct from EVIDENCE's expand-linked one. `--sweep` is a
 * GSAP ScrollTrigger scrub writing the custom property directly onto the
 * element in `onUpdate`, never through React state.
 */
function ProductMedia({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let trigger: { kill: () => void } | null = null;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      trigger = rt.ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.3,
        onUpdate: (self) => el.style.setProperty("--sweep", String(self.progress)),
      });
      rt.scheduleRefresh();
    });

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, []);

  return (
    <div ref={ref}>
      <SurfaceMedia label={`${product.title} — ${product.kind}`} aspect="4/3">
        {product.media && <ProductVideo media={product.media} priority="low" objectFit="cover" />}
      </SurfaceMedia>
    </div>
  );
}
