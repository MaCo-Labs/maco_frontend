import { useRef, type CSSProperties, type ReactNode } from "react";
import { useScrollScene } from "@/hooks/use-scroll-scene";

type Tag = "div" | "section" | "ul" | "ol" | "dl";

interface StaggerProps {
  children: ReactNode;
  as?: Tag | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  /** Per-child threshold offset, as a fraction of `band`. Default 0.08. */
  gap?: number | undefined;
  /** Width of each child's own reveal window. Default 0.3. */
  band?: number | undefined;
  /** Travel distance at reveal=0. Default "1.5rem". */
  rise?: string | undefined;
  start?: string | undefined;
  end?: string | undefined;
}

/**
 * Scrubbed, reversible stagger across a list. Generalises the per-child
 * band math MethodLine already hand-wrote (threshold = i * gap, reveal =
 * clamp01((progress - threshold) / band)) into CSS, driven by one
 * ScrollTrigger on the wrapper instead of one per child.
 *
 * Each DIRECT CHILD must carry the `stagger-item` class and its own 0-based
 * `--i` (styles.css reads both — see the `[data-stagger-item]`-free
 * `.stagger-item` rule). This is deliberately manual rather than
 * auto-cloning children: several call sites are `dl > div` / `ul > li`
 * where the existing element already needs no wrapper, just an extra
 * inline style — cloning to inject that is more machinery for the same
 * result.
 *
 * `--sr` (this component's own progress) is intentionally NOT registered
 * via `@property` in styles.css, unlike `--r`/`--sweep`/etc — those are
 * self-targeting (GSAP reads and writes the same element) and registered
 * `inherits: false` on purpose; `--sr` needs to INHERIT down to the
 * children reading it, so it stays a plain custom property with a
 * `var(--sr, 1)` fallback doing the same "unset = fully revealed" job.
 *
 * Recommended up to ~8 children — beyond that, the fallback's flat "1"
 * doesn't reach every later item's revealed threshold at rest.
 */
export function Stagger({
  children,
  as: Tag = "div",
  className,
  style,
  gap = 0.08,
  band = 0.3,
  rise = "1.5rem",
  start = "top 86%",
  end = "top 58%",
}: StaggerProps) {
  const ref = useRef<HTMLElement | null>(null);

  useScrollScene(
    (rt) => {
      const el = ref.current;
      if (!el) return;
      rt.gsap.fromTo(
        el,
        { "--sr": 0 },
        {
          "--sr": 1,
          ease: "none",
          scrollTrigger: { trigger: el, start, end, scrub: 0.6, invalidateOnRefresh: true },
        },
      );
    },
    [start, end],
  );

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={
        {
          ...style,
          "--stagger-gap": String(gap),
          "--stagger-band": String(band),
          "--stagger-rise": rise,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
