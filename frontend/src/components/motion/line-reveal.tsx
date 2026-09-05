import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { getScrollRuntime } from "@/lib/scroll-runtime";
import type { SplitText } from "gsap/SplitText";

type Tag = "h1" | "h2" | "h3" | "p";

/**
 * Section-headline reveal: SSR/no-JS/reduced-motion ships the plain
 * heading (nothing here ever hides it by default). Once the shared
 * Lenis+GSAP runtime resolves, splits it into lines with GSAP SplitText
 * and reveals them as the heading enters.
 *
 * `mode="once"` (default): a one-shot entrance the first time the heading
 * enters — right for a heading that shouldn't un-reveal on scroll-back.
 * `mode="scrub"`: reversible, scrubbed across the heading's own transit
 * through `[start, end]` — a full line-height rise behind the line mask
 * (`yPercent 108 -> 0`), the largest single reveal available, reserved for
 * the page's biggest statements.
 * `mode="words"` (2026-08-29): splits on WORDS instead of lines — a
 * blur-in + small rise, staggered per word rather than per line, for
 * copy that should settle into focus rather than rise into place. One
 * device, applied once (Overview's opening statement) rather than
 * scattered across every heading — AGENTS.md's "not an animation
 * gallery" caution applies to the site's own devices too, not just
 * imported ones.
 *
 * The tween is created INSIDE `onSplit`, not chained after `new
 * SplitText(...)` returns. SplitText re-splits on font load or viewport
 * resize — both guaranteed here: six Google fonts load with
 * `display: swap`, and `ScrollRuntimeProvider` explicitly refreshes on
 * `document.fonts.ready`. A tween built outside `onSplit` holds refs to
 * the FIRST split's line elements; once SplitText discards and recreates
 * them, the heading can strand mid-reveal. `onSplit` is GSAP's own
 * mechanism for SplitText to own and dispose the animation together with
 * the split it belongs to.
 */
export function LineReveal({
  as: As = "h2",
  className,
  style,
  children,
  mode = "once",
  start = "top 85%",
  end = "top 55%",
}: {
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  mode?: "once" | "scrub" | "words";
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let split: SplitText | null = null;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      if (mode === "words") {
        // No `mask: "words"` here, unlike the line modes below — masking
        // wraps each word in its own overflow:hidden box sized to the
        // word, which would clip a blur filter's soft edges right at
        // that boundary (a mask is right for a yPercent RISE, where
        // clipping the next line from peeking through is the point; it
        // fights a BLUR reveal, where the point is a soft edge). The
        // modest 25% rise below doesn't need a mask to read cleanly.
        split = new rt.SplitText(el, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            rt.gsap.from(self.words, {
              opacity: 0,
              filter: "blur(8px)",
              yPercent: 25,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.035,
              scrollTrigger: { trigger: el, start, once: true },
            }),
        });
        return;
      }
      split = new rt.SplitText(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          if (mode === "scrub") {
            return rt.gsap.fromTo(
              self.lines,
              { yPercent: 108, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                ease: "none",
                stagger: { each: 0.12, from: "start" },
                scrollTrigger: { trigger: el, start, end, scrub: 0.6, invalidateOnRefresh: true },
              },
            );
          }
          return rt.gsap.from(self.lines, {
            yPercent: 110,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start, once: true },
          });
        },
      });
    });

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [mode, start, end]);

  return (
    <As ref={ref as never} className={className} style={style}>
      {children}
    </As>
  );
}
