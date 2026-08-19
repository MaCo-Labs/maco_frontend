import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getScrollRuntime } from "@/lib/scroll-runtime";
import type { SplitText } from "gsap/SplitText";

/**
 * The hero wordmark's entrance + idle animation — React Bits' "Split Text"
 * and "Shiny Text" concepts (MIT + Commons Clause; reimplemented on the
 * runtime's own GSAP SplitText rather than copied or added as a new
 * dependency — same precedent as `evidence-expand.tsx`'s ScrollExpand
 * note).
 *
 * On mount: GSAP SplitText splits the text into characters, each masked
 * and risen into place with a staggered `expo.out` tween — a one-shot
 * entrance, not scroll-linked, since this is the first thing on the page.
 * Once it settles, the split is reverted (plain text again — the DOM the
 * rest of the time is just the real heading, nothing left mid-split) and
 * a `.maco-shine` class is added: a continuous `background-clip: text`
 * gradient animated on `background-position` only, at 115° — the exact
 * angle `.light-pass` (styles.css) uses everywhere else on the page, so
 * this ties into MaCo's one signature device instead of importing an
 * unrelated shimmer.
 *
 * SSR / no-JS / reduced motion / no runtime: plain static text, never
 * split, never shining. The heading is real text in the initial HTML the
 * entire time — SplitText mutates after paint, exactly like `LineReveal`.
 */
export function SplitReveal({
  text,
  as: As = "h1",
  className = "",
  style,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let split: SplitText | null = null;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      split = new rt.SplitText(el, { type: "chars", mask: "chars", autoSplit: true });
      rt.gsap.from(split.chars, {
        yPercent: 115,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.045,
        delay: 0.1,
        onComplete: () => {
          split?.revert();
          split = null;
          if (!cancelled) el.classList.add("maco-shine");
        },
      });
    });

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [reduced]);

  return (
    <As ref={ref as never} className={className} style={style}>
      {text}
    </As>
  );
}
