import { useRef, type CSSProperties, type ReactNode } from "react";
import { useScrollScene } from "@/hooks/use-scroll-scene";

type Tag = "div" | "section" | "article" | "p" | "li";

interface ScrubRevealProps {
  children: ReactNode;
  as?: Tag | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  /** Travel distance at --r=0. Default "1.75rem". */
  rise?: string | undefined;
  /** One-shot instead of reversible — for long body copy that shouldn't
   *  un-reveal on scroll-back. Default false. */
  hold?: boolean | undefined;
  start?: string | undefined;
  end?: string | undefined;
}

/**
 * The default replacement for `MotionSection`: scrubbed and reversible by
 * default — scrolling back up un-reveals, which is the whole point of a
 * scroll-linked page over a checklist of one-shot fades. Writes progress
 * to the registered `--r` custom property (styles.css), which resolves to
 * its `initial-value: 1` (fully revealed) on any element nothing ever
 * animates — SSR, no-JS, reduced motion, a blocked dynamic import — so
 * every one of those cases renders the correct at-rest composition
 * without a second render branch.
 */
export function ScrubReveal({
  children,
  as: Tag = "div",
  className,
  style,
  rise = "1.75rem",
  hold = false,
  start = "top 88%",
  end = "top 55%",
}: ScrubRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useScrollScene(
    (rt) => {
      const el = ref.current;
      if (!el) return;
      if (hold) {
        rt.gsap.fromTo(
          el,
          { "--r": 0 },
          {
            "--r": 1,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
      } else {
        rt.gsap.fromTo(
          el,
          { "--r": 0 },
          {
            "--r": 1,
            ease: "none",
            scrollTrigger: { trigger: el, start, end, scrub: 0.35, invalidateOnRefresh: true },
          },
        );
      }
    },
    [hold, start, end],
  );

  return (
    <Tag
      ref={ref as never}
      className={`scrub-reveal ${className ?? ""}`.trim()}
      style={{ ...style, "--reveal-rise": rise } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
