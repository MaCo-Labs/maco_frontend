import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { getScrollRuntime } from "@/lib/scroll-runtime";
import type { SplitText } from "gsap/SplitText";

type Tag = "h1" | "h2" | "h3" | "p";

/**
 * Section-headline reveal: SSR/no-JS/reduced-motion ships the plain
 * heading (nothing here ever hides it by default). Once the shared
 * Lenis+GSAP runtime resolves, splits it into lines with GSAP SplitText
 * and reveals them with a one-shot ScrollTrigger as the heading enters.
 *
 * Deliberately not used for whole content blocks — `MotionSection`'s
 * IntersectionObserver reveal is cheaper and already correct there. This
 * is specifically the line-by-line display-type treatment.
 */
export function LineReveal({
  as: As = "h2",
  className,
  style,
  children,
}: {
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let split: SplitText | null = null;
    let killTrigger: (() => void) | null = null;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      split = new rt.SplitText(el, { type: "lines", mask: "lines", autoSplit: true });
      const tween = rt.gsap.from(split.lines, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
      killTrigger = () => tween.scrollTrigger?.kill();
    });

    return () => {
      cancelled = true;
      killTrigger?.();
      split?.revert();
    };
  }, []);

  return (
    <As ref={ref as never} className={className} style={style}>
      {children}
    </As>
  );
}
