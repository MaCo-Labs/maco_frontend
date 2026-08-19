import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { getProduct, services, projects, products, site } from "@/content/maco";
import { SurfaceMedia } from "@/components/media/surface-media";
import { ProductVideo } from "@/components/media/product-video";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { MotionSection } from "@/components/motion-section";
import { usePointerField } from "@/hooks/use-pointer-field";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * SURFACE — merges the previous OPEN hero's content (statement, CTAs,
 * proof row, and the Bridge recording) with the previous standalone
 * CLAIM section into one stronger second movement, directly under the
 * new brand-only hero (`open-logo.tsx`). Two changes from before:
 *  - the claim/proof content and the product video now share one
 *    section instead of two back-to-back sections with near-identical
 *    rhythm;
 *  - the video fills its frame edge-to-edge at its native 16:9 instead
 *    of sitting in a small inset window nested inside a taller/squarer
 *    panel — the previous nesting (a 16:9 window inset 6% inside a 4:3,
 *    lg:square panel) read as a small screen floating in an otherwise
 *    empty slab. A single 16:9 panel matching the source recording's
 *    real aspect ratio means zero crop, and at a typical ~640px column
 *    width it's a ~0.63x downscale of the 1024px source — sharper, not
 *    softer, than the previous framing.
 *
 * Proof row uses real array lengths only (services/projects/products) —
 * never invented stats.
 */
export function WorkingSurface() {
  const reduced = useReducedMotion();
  const fieldRef = usePointerField<HTMLDivElement>();
  const bridge = getProduct("bridge");

  return (
    <section data-ground="paper" className="rule-t" aria-label="What MaCo does">
      <div className="shell grid items-center gap-10 py-24 lg:grid-cols-2 lg:gap-16 lg:py-32">
        <div>
          <LineReveal as="h2" className="display-lg max-w-xl" style={{ color: "var(--text)" }}>
            Software that has work to do.
          </LineReveal>
          <p className="lead mt-6 max-w-md">{site.statement}</p>

          <div className="mt-9 flex flex-wrap gap-3">
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
          </div>

          <MotionSection delay={120}>
            <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-line pt-8 sm:grid-cols-4">
              <div>
                <dt className="label">Services</dt>
                <dd className="display-md mt-2" style={{ color: "var(--text)" }}>
                  {services.length}
                </dd>
              </div>
              <div>
                <dt className="label">Client work</dt>
                <dd className="display-md mt-2" style={{ color: "var(--text)" }}>
                  {projects.length}
                </dd>
              </div>
              <div>
                <dt className="label">Products</dt>
                <dd className="display-md mt-2" style={{ color: "var(--text)" }}>
                  {products.length}
                </dd>
              </div>
              <div>
                <dt className="label">Based in</dt>
                <dd className="display-md mt-2" style={{ color: "var(--text)" }}>
                  Kochi
                </dd>
              </div>
            </dl>
          </MotionSection>
        </div>

        <div
          ref={fieldRef}
          className="relative"
          style={{ perspective: reduced ? undefined : "1400px" }}
        >
          <SurfaceMedia
            label="Bridge — MaCo's own product, in daily use"
            aspect="16/9"
            style={
              reduced
                ? undefined
                : ({
                    transform:
                      "rotateY(calc((var(--px, 0.5) - 0.5) * 6deg)) rotateX(calc((var(--py, 0.5) - 0.5) * -6deg))",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.4s var(--ease-standard)",
                    // The raking light follows the same pointer field as the
                    // tilt — one input, two coordinated reads of the material.
                    "--sweep": "var(--px, 0.5)",
                  } as CSSProperties)
            }
          >
            {bridge?.media && (
              <ProductVideo media={bridge.media} priority="auto" objectFit="cover" />
            )}
          </SurfaceMedia>
        </div>
      </div>
    </section>
  );
}
