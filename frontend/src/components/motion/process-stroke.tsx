import { useRef } from "react";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * Traces the grid's own 1px divider (the "+" of gap already sitting
 * between the 4 step cards, `background: var(--line)` on the parent) in
 * accent colour, drawn in as the section scrolls into view — highlighting
 * the existing seam rather than a new line cutting across card copy.
 * Percentage-space coordinates (viewBox 0 0 100 100, preserveAspectRatio
 * "none") sit exactly on that seam regardless of pixel size, since a
 * 2-col equal grid's centre lines are always at 50%/50% — no rect
 * measurement, no resize listener.
 *
 * Desktop (sm+) only: a single-column mobile stack has no "+" seam to
 * trace (just stacked horizontal dividers), so it's hidden below `sm` —
 * the stacked cards' own `rule-t` borders already carry the sequence there.
 */
export function ProcessStroke() {
  const svgRef = useRef<SVGSVGElement>(null);
  const verticalRef = useRef<SVGPathElement>(null);
  const horizontalRef = useRef<SVGPathElement>(null);

  useScrollScene((rt) => {
    const svg = svgRef.current;
    const vertical = verticalRef.current;
    const horizontal = horizontalRef.current;
    if (!svg || !vertical || !horizontal) return;

    vertical.style.strokeDashoffset = "100";
    horizontal.style.strokeDashoffset = "100";
    rt.ScrollTrigger.create({
      trigger: svg,
      start: "top 80%",
      end: "bottom 65%",
      scrub: true,
      onUpdate: (self) => {
        const offset = String(100 - self.progress * 100);
        vertical.style.strokeDashoffset = offset;
        horizontal.style.strokeDashoffset = offset;
      },
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full sm:block"
    >
      <path
        ref={verticalRef}
        d="M 50 0 L 50 100"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.35"
        pathLength={100}
        strokeDasharray="100"
      />
      <path
        ref={horizontalRef}
        d="M 0 50 L 100 50"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.35"
        pathLength={100}
        strokeDasharray="100"
      />
    </svg>
  );
}
