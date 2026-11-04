import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getLiveScrollRuntime, getScrollRuntime } from "@/lib/scroll-runtime";

/** Hello in MaCo's markets, ending at home in Kochi. */
const GREETINGS = [
  { text: "Hello", lang: "en" },
  { text: "مرحبا", lang: "ar", dir: "rtl" },
  { text: "नमस्ते", lang: "hi" },
  { text: "வணக்கம்", lang: "ta" },
  { text: "ನಮಸ್ಕಾರ", lang: "kn" },
  { text: "నమస్కారం", lang: "te" },
  { text: "നമസ്കാരം", lang: "ml" },
] as const;

const FIRST_MS = 480;
const STEP_MS = 170;
const LAST_HOLD_MS = 560;
const WORDS_MS = FIRST_MS + (GREETINGS.length - 2) * STEP_MS + LAST_HOLD_MS;
const LIFT = { duration: 0.85, ease: [0.76, 0, 0.24, 1] } as const;

/**
 * A once-per-session greeting: the words flash past, the last one holds, then
 * the panel lifts away on a curved edge that flattens as it leaves. The words are
 * a CSS opacity sequence from first paint, so they stay smooth while the page is
 * still hydrating; JS only triggers the lift, once they've finished. Any click or
 * key skips it. Decorative, so hidden from assistive tech and from snippets. The
 * panel's colour contrasts with the page beneath it (styles.css). Dismissal
 * cancels pending work before it can acquire a late scroll lock.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const dismissed = useRef(false);
  const previousOverflow = useRef<string | null>(null);
  const releaseScroll = useCallback(() => {
    getLiveScrollRuntime()?.lenis.start();
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  }, []);
  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    releaseScroll();
    document.documentElement.dataset["entered"] = "1";
    window.dispatchEvent(new CustomEvent("maco:entered"));
    setDone(true);
  }, [releaseScroll]);

  useEffect(() => {
    if (done) return;
    if (reduced || document.documentElement.dataset["preload"] === "skip") {
      dismiss();
      return;
    }
    let cancelled = false;
    try {
      sessionStorage.setItem("maco-preloaded", "1");
    } catch {
      // Storage is optional.
    }
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLiveScrollRuntime()?.lenis.stop();
    getScrollRuntime().then((runtime) => {
      if (!cancelled && !dismissed.current) runtime?.lenis.stop();
    });

    // The sequence started at first paint, not at this effect.
    const painted = performance.getEntriesByName("first-paint")[0]?.startTime ?? 0;
    const timer = setTimeout(dismiss, Math.max(0, painted + WORDS_MS - performance.now()));
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      releaseScroll();
    };
  }, [dismiss, done, reduced, releaseScroll]);

  const lift = reduced ? { duration: 0 } : LIFT;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden="true"
          data-nosnippet
          className="maco-preloader"
          exit={{ y: "-100%" }}
          transition={lift}
        >
          <div className="maco-preloader-words">
            {GREETINGS.map((greeting, i) => (
              <p
                key={greeting.lang}
                lang={greeting.lang}
                dir={"dir" in greeting ? greeting.dir : undefined}
                className="maco-preloader-word"
                style={
                  {
                    "--start": i === 0 ? "0ms" : `${FIRST_MS + (i - 1) * STEP_MS}ms`,
                  } as CSSProperties
                }
              >
                {greeting.text}
              </p>
            ))}
          </div>
          <motion.span className="maco-preloader-curve" exit={{ scaleY: 0 }} transition={lift} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
