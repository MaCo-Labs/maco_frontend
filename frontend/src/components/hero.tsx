import { Link } from "@tanstack/react-router";
import { useRef, type CSSProperties } from "react";
import { site } from "@/content/maco";
import { HeroMonument } from "@/components/hero/hero-monument";
import { HeroScrollIndicator } from "@/components/hero/hero-scroll-indicator";
import { useElementScrollProgress } from "@/hooks/use-scroll-progress";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/**
 * Signature hero — THE MONUMENT.
 * One centered stage: the exact MaCo mark rendered as a single sculptural
 * object standing in empty darkness, founded on a hairline datum.
 * Entrance is CSS-timed (plays on first paint). Scroll only recedes the
 * whole scene gently (never a global fade-to-zero). Reduced motion renders
 * the resolved state with the monument fully material.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useElementScrollProgress(sectionRef);
  const reduced = useReducedMotion();

  // Gentle recede on scroll — the composition lifts and compresses slightly.
  // Kept small so MA/CO identity and CTAs never go dull.
  const recede = reduced ? 0 : smootherstep(clamp01((progress - 0.3) / 0.6));

  const recedeLift = recede * -2.75;
  const recedeScale = 1 - recede * 0.012;
  const recedeOpacity = Math.max(0.68, 1 - recede * 0.28);

  return (
    <section
      ref={sectionRef}
      className="hero-canvas rule-b relative overflow-hidden min-h-[min(100svh,58rem)]"
      style={{ "--hero-recede": String(recede) } as CSSProperties}
      aria-label="MaCo hero"
    >
      <div
        className="shell relative z-10 flex min-h-[min(100svh,58rem)] flex-col pt-[calc(4rem+1rem)] pb-24 lg:pt-[calc(5rem+1.5rem)] lg:pb-28"
        style={{
          opacity: recedeOpacity,
          transform: reduced
            ? undefined
            : `translate3d(0, ${recedeLift}rem, 0) scale(${recedeScale})`,
          transformOrigin: "50% 22%",
          transition: reduced
            ? "none"
            : "transform 0.9s var(--ease-emphasis), opacity 0.9s var(--ease-emphasis)",
        }}
      >
        {/* Editorial chrome — MA.CO + category */}
        <div className="hero-top hero-in flex items-baseline justify-between gap-6">
          <p className="hero-wordmark">MA.CO</p>
          <p className="hero-top-muted label">{site.category}</p>
        </div>

        {/* The monument — the exact MaCo mark as one sculptural object */}
        <div className="hero-formation relative flex flex-1 min-h-0 flex-col items-center justify-center py-6 lg:py-8">
          <HeroMonument />
        </div>

        {/* Editorial caption — supports the monument, never competes */}
        <div className="hero-copy hero-in">
          <h1 className="sr-only">
            MaCo — {site.category}. {site.tagline}
          </h1>
          <p className="hero-lead">{site.tagline}</p>
          <p className="hero-statement">{site.statement}</p>
          <div className="hero-cta-row">
            <Link to="/contact" className="btn-solid hero-cta">
              Start a project
            </Link>
            <Link to="/work" className="btn-line hero-cta">
              Selected work
              <span className="hero-cta-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <HeroScrollIndicator />

      {/* Clean hand-off into the next (light) section — a soft horizon, not a hard cut */}
      <div
        className="hero-foot-fade pointer-events-none absolute inset-x-0 bottom-0 z-[2]"
        aria-hidden="true"
        style={{
          opacity: 1,
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--hero-bg) 42%, transparent) 72%, var(--hero-bg) 100%)",
        }}
      />
    </section>
  );
}
