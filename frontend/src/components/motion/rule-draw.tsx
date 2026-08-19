import { useRef, type CSSProperties } from "react";
import { useScrollScene } from "@/hooks/use-scroll-scene";

interface RuleDrawProps {
  className?: string | undefined;
  style?: CSSProperties | undefined;
  /** Which edge the draw grows from. "left"/"top" for a directional read
   *  (most rules); "center" for a closing gesture (CLOSE's top rule).
   *  Default "left". */
  origin?: "left" | "center" | undefined;
  /** Which dimension draws. Default "x" (a horizontal rule, scaleX). */
  axis?: "x" | "y" | undefined;
  start?: string | undefined;
  end?: string | undefined;
}

/**
 * A rule that draws in as it enters — scaleX/scaleY 0 to 1, scrubbed and
 * reversible off the shared `--r` custom property (styles.css). The
 * page's most-reused primitive: every border that should feel drawn
 * rather than simply present. Render this AS the rule element itself
 * (sized by CSS — width/height plus a background or border — not a
 * wrapper around other content).
 */
export function RuleDraw({
  className,
  style,
  origin = "left",
  axis = "x",
  start = "top 96%",
  end = "top 78%",
}: RuleDrawProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useScrollScene(
    (rt) => {
      const el = ref.current;
      if (!el) return;
      rt.gsap.fromTo(
        el,
        { "--r": 0 },
        {
          "--r": 1,
          ease: "none",
          scrollTrigger: { trigger: el, start, end, scrub: 0.3, invalidateOnRefresh: true },
        },
      );
    },
    [start, end],
  );

  const transformOrigin = origin === "center" ? "50% 50%" : axis === "x" ? "0% 50%" : "50% 0%";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`${axis === "x" ? "rule-draw-x" : "rule-draw-y"} ${className ?? ""}`.trim()}
      style={{ ...style, transformOrigin }}
    />
  );
}
