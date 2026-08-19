import { useRef, type CSSProperties, type ReactNode } from "react";
import { useScrollScene } from "@/hooks/use-scroll-scene";

interface RakingSurfaceProps {
  children: ReactNode;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  /** [start, end] the sweep travels across its own transit through the
   *  viewport, overshooting past [0, 1] so the band fully enters and
   *  fully clears rather than parking mid-surface. Default [-0.15, 1.15]. */
  range?: readonly [number, number] | undefined;
}

/**
 * The one signature device (`.light-pass`, styles.css) unified onto ONE
 * light source: every surface reads `--sweep` from its OWN transit through
 * the viewport (top of screen to bottom, bottom to top), not from pointer
 * position or an unrelated section's scroll progress — those were three
 * different mechanisms wearing the same CSS. With every surface lit by a
 * band at the same screen height at the same moment, the page reads as one
 * light crossing it, which is the entire point of having a signature
 * device instead of a decoration repeated per-section.
 *
 * EVIDENCE is the deliberate exception — its frame doesn't transit, it
 * expands in place, so its `--sweep` stays driven by its own pin progress.
 */
export function RakingSurface({
  children,
  className,
  style,
  range = [-0.15, 1.15],
}: RakingSurfaceProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [from, to] = range;

  useScrollScene(
    (rt) => {
      const el = ref.current;
      if (!el) return;
      // Scoped will-change (see the .is-lit rule in styles.css): a page
      // with a dozen light-pass surfaces otherwise promotes every one to
      // its own compositor layer for the whole page lifetime. Left on an
      // unmounted node this is harmless — the node itself is gone.
      el.classList.add("is-lit");
      rt.gsap.fromTo(
        el,
        { "--sweep": from },
        {
          "--sweep": to,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.25,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    [from, to],
  );

  return (
    <div ref={ref} className={`light-pass ${className ?? ""}`.trim()} style={style}>
      {children}
    </div>
  );
}
