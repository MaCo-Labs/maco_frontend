import { useRef, type CSSProperties } from "react";
import { getProduct, type Product } from "@/content/maco";
import { SurfaceMedia } from "@/components/media/surface-media";
import { ProductVideo } from "@/components/media/product-video";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { LineReveal } from "@/components/motion/line-reveal";
import { useScrollScene } from "@/hooks/use-scroll-scene";
import { clamp01 } from "@/lib/motion";

const BRIDGE = getProduct("bridge");
const DRIVERS_DIARY = getProduct("drivers-diary");

/** Progress fraction at which phase 1 (expand) finishes and phase 2
 *  (reel crossfade) begins. */
const PHASE_SPLIT = 0.55;

/**
 * PRODUCTS — Attio-style expanding window (Task 1) resolving into a
 * showcase reel across the 2 real products (Task 4, reframed: the repo
 * has exactly 2 products with media, not a photo/video/GIF library, so
 * the "reel" scrubs Bridge -> Driver's Diary rather than through a
 * per-product gallery that doesn't exist — see the design spec).
 *
 * Desktop (lg+): one `position: sticky` stage inside a tall scroll
 * container. NOT a ScrollTrigger `pin: true` — sticky is what keeps this
 * section eligible as the outgoing side of GroundHandoff's sheet pair
 * into IDENTITY (ground-handoff.tsx's doc comment: a real pin would
 * silently break that transition). One ScrollTrigger drives both --expand
 * and --reel from one onUpdate — the same "one trigger, several
 * setProperty calls" device services-convergence.tsx's ServicesStage uses
 * for --c/--d.
 *
 * Mobile (<lg): plain stacked cards, no sticky, no scrub — mirrors the
 * previous product-story.tsx's own mobile behaviour.
 *
 * Full feature copy for both products renders below the stage regardless
 * of --expand/--reel — nothing textual is exclusive to the animated
 * stage, so its own rest state (see styles.css's --expand/--reel
 * @property comments) is a purely visual choice, not an accessibility one.
 */
export function ProductShowcase() {
  if (!BRIDGE || !DRIVERS_DIARY) return null;

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
      </div>

      <div className="hidden lg:block">
        <ProductStage bridge={BRIDGE} driversDiary={DRIVERS_DIARY} />
      </div>
      <div className="lg:hidden">
        <ProductStack products={[BRIDGE, DRIVERS_DIARY]} />
      </div>

      <div className="shell mt-16 grid gap-14 pb-24 md:pb-32 lg:grid-cols-2 lg:gap-16">
        <ProductDetails product={BRIDGE} />
        <ProductDetails product={DRIVERS_DIARY} />
      </div>
    </section>
  );
}

function ProductStage({ bridge, driversDiary }: { bridge: Product; driversDiary: Product }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useScrollScene((rt) => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    const trigger = rt.ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        stage.style.setProperty("--expand", String(clamp01(p / PHASE_SPLIT)));
        stage.style.setProperty("--reel", String(clamp01((p - PHASE_SPLIT) / (1 - PHASE_SPLIT))));
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[300vh]">
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: "var(--surface)" }}
      >
        <div className="product-expand-media" data-ground="deep">
          {bridge.media && (
            <ProductVideo
              media={bridge.media}
              priority="low"
              objectFit="cover"
              radius="var(--expand-radius)"
            />
          )}
        </div>
        <div className="product-reel-media" data-ground="deep">
          {driversDiary.media && (
            <ProductVideo media={driversDiary.media} priority="low" objectFit="cover" />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductStack({ products }: { products: Product[] }) {
  return (
    <div className="shell space-y-10 pb-4">
      {products.map((product) => (
        <div key={product.slug} data-ground="deep" className="overflow-hidden rounded-2xl">
          <SurfaceMedia
            label={`${product.title} — ${product.kind}`}
            aspect={product.media ? `${product.media.width}/${product.media.height}` : "4/3"}
          >
            {product.media && (
              <ProductVideo media={product.media} priority="low" objectFit="cover" />
            )}
          </SurfaceMedia>
        </div>
      ))}
    </div>
  );
}

function ProductDetails({ product }: { product: Product }) {
  return (
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
      <Stagger as="ul" className="mt-6 grid gap-3 sm:grid-cols-2" band={0.4} rise="1rem">
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
  );
}
