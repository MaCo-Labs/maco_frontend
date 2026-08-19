import { useRef, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { getProduct, services, projects, products, site } from "@/content/maco";
import { SurfaceMedia } from "@/components/media/surface-media";
import { ProductVideo } from "@/components/media/product-video";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { Magnetic } from "@/components/motion/magnetic";
import { usePointerField } from "@/hooks/use-pointer-field";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * SURFACE — merges the previous OPEN hero's content (statement, CTAs,
 * proof row, and the Bridge recording) with the previous standalone
 * CLAIM section into one stronger second movement, directly under the
 * new brand-only hero (`open-logo.tsx`).
 *
 * The media panel "lays flat" as it enters — `--lay` (0 at first sight,
 * 1 once settled, registered in styles.css with initial-value 1 so the
 * JSX default IS the flat/settled rest state) drives a scrubbed rotateX
 * from a 14° edge-on tilt down to 0, composed with the EXISTING pointer
 * tilt (rotateY/rotateX from --px/--py) rather than replacing it — two
 * independent inputs, one 3D surface. `--sweep` moved OFF the pointer
 * and onto the panel's own scroll transit (matching RakingSurface's
 * mechanism, though not literally that component — see the equivalent
 * note in product-story.tsx about not double-wrapping a `.light-pass`
 * surface): the pointer's job here is tilt only.
 *
 * Proof row uses real array lengths only (services/projects/products) —
 * never invented stats.
 */
export function WorkingSurface() {
  const reduced = useReducedMotion();
  const fieldRef = usePointerField<HTMLDivElement>();
  const panelRef = useRef<HTMLDivElement>(null);
  const bridge = getProduct("bridge");

  useScrollScene((rt) => {
    const panel = panelRef.current;
    if (!panel) return;
    rt.gsap.fromTo(
      panel,
      { "--lay": 0, "--sweep": -0.15 },
      {
        "--lay": 1,
        "--sweep": 1.15,
        ease: "none",
        scrollTrigger: { trigger: panel, start: "top 95%", end: "top 45%", scrub: 0.3 },
      },
    );
  }, []);

  return (
    <section data-ground="paper" className="rule-t" aria-label="What MaCo does">
      <div className="shell grid items-center gap-10 py-24 lg:grid-cols-2 lg:gap-16 lg:py-32">
        <div>
          <LineReveal
            as="h2"
            mode="scrub"
            className="display-lg max-w-xl"
            style={{ color: "var(--text)" }}
          >
            Software that has work to do.
          </LineReveal>
          <ScrubReveal as="p" hold className="lead mt-6 max-w-md">
            {site.statement}
          </ScrubReveal>

          <ScrubReveal className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <Link to="/contact" className="btn-solid">
                Start a project <span aria-hidden="true">→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/work" className="btn-line">
                See the work
              </Link>
            </Magnetic>
          </ScrubReveal>

          <Stagger
            as="dl"
            className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-8 sm:grid-cols-4"
            gap={0.12}
            band={0.4}
          >
            {[
              { label: "Services", value: services.length },
              { label: "Client work", value: projects.length },
              { label: "Products", value: products.length },
              { label: "Based in", value: "Kochi" },
            ].map((stat, i) => (
              <div key={stat.label} className="stagger-item" style={{ "--i": i } as CSSProperties}>
                <dt className="label">{stat.label}</dt>
                <dd className="display-md mt-2" style={{ color: "var(--text)" }}>
                  {stat.value}
                </dd>
              </div>
            ))}
          </Stagger>
        </div>

        <div
          ref={fieldRef}
          className="relative"
          style={{ perspective: reduced ? undefined : "1400px" }}
        >
          <div ref={panelRef} data-bridge-panel="">
            <SurfaceMedia
              label="Bridge — MaCo's own product, in daily use"
              aspect="16/9"
              style={
                reduced
                  ? undefined
                  : ({
                      transform:
                        "rotateX(calc((1 - var(--lay, 1)) * 14deg)) rotateY(calc((var(--px, 0.5) - 0.5) * 6deg)) rotateX(calc((var(--py, 0.5) - 0.5) * -6deg)) translateY(calc((1 - var(--lay, 1)) * 4vh))",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.4s var(--ease-standard)",
                    } as CSSProperties)
              }
            >
              {bridge?.media && (
                <ProductVideo media={bridge.media} priority="auto" objectFit="cover" />
              )}
            </SurfaceMedia>
          </div>
        </div>
      </div>
    </section>
  );
}
