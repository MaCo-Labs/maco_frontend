import { useRef } from "react";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * One continuous vector thread connecting WORK, CAPABILITY and PRODUCTS —
 * a single line drawing itself across three sections via `stroke-dashoffset`,
 * not a per-section doodle. Mounted once, as a direct child of the
 * `<div className="relative">` wrapper `routes/index.tsx` puts around
 * those three sections; that wrapper carries no `transform` of its own, so
 * it's safe as an ancestor of CAPABILITY's pin (a `transform` on a pin's
 * ancestor breaks `position: fixed` — see ground-handoff.tsx's doc
 * comment for the same constraint applied elsewhere).
 *
 * `viewBox="0 0 100 1000"` + `preserveAspectRatio="none"` lets one fixed
 * coordinate space stretch to whatever height the three sections total,
 * however tall that turns out to be at any width or content length.
 * `vector-effect: non-scaling-stroke` (in the `maco-scroll-thread`
 * utility) is what stops that non-uniform stretch from smearing the
 * hairline's width along with its length.
 *
 * `z-[42]` — one above every pinned section's `z-[41]` and the header's
 * `z-40` — so the thread stays visible while a pinned section is fixed
 * beneath it; `pointer-events-none` keeps it from ever intercepting a
 * click. `hidden md:block`: under 768px a full-height vector spanning
 * roughly four screens reads as noise rather than a thread.
 *
 * Supersedes `.maco-thread` (styles.css) for this run of the page. That
 * utility is left in place rather than deleted — `theme-atmosphere.tsx`
 * still references it, and removing dormant code is a separate purge.
 */
export function ScrollThread() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useScrollScene((rt) => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const wrap = svg?.parentElement;
    if (!svg || !path || !wrap) return;

    const applyLen = () => {
      path.style.setProperty("--thread-len", String(path.getTotalLength()));
    };

    // Measured on refresh, not once at setup: ScrollRuntimeProvider
    // refreshes ScrollTrigger on document.fonts.ready and on the
    // maco:media-ready event, so applyLen re-runs once the fonts that
    // decide section heights (and therefore the path's rendered length)
    // have actually loaded, and again on every resize via
    // invalidateOnRefresh below.
    const trigger = rt.ScrollTrigger.create({
      trigger: wrap,
      start: "top 75%",
      end: "bottom 25%",
      scrub: 0.4,
      invalidateOnRefresh: true,
      onRefresh: applyLen,
      onUpdate: (self) => svg.style.setProperty("--thread", String(self.progress)),
    });
    applyLen();

    return () => trigger.kill();
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
      viewBox="0 0 100 1000"
      className="pointer-events-none absolute inset-0 z-[42] hidden h-full w-full md:block"
    >
      <path
        ref={pathRef}
        className="maco-scroll-thread"
        d="M 8 0 C 34 160, 6 300, 30 470 S 82 700, 60 1000"
      />
    </svg>
  );
}
