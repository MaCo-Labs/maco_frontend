import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mark } from "@/components/mark";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getLiveScrollRuntime, getScrollRuntime } from "@/lib/scroll-runtime";

/** A bounded first-visit introduction. Dismissal cancels pending work
 * before it can acquire a late scroll lock. */
export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const dismissed = useRef(false);
  const previousOverflow = useRef<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
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
    window.dispatchEvent(new CustomEvent("maco:entered"));
    setDone(true);
  }, [releaseScroll]);

  useEffect(() => {
    if (done) return;
    if (reduced || document.documentElement.dataset["preload"] === "skip") {
      dismiss();
      return;
    }
    const panel = panelRef.current;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delay = (ms: number) =>
      new Promise<void>((resolve) => timers.push(setTimeout(resolve, ms)));
    try {
      sessionStorage.setItem("maco-preloaded", "1");
    } catch {
      // Storage is optional.
    }
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLiveScrollRuntime()?.lenis.stop();
    skipRef.current?.focus({ preventScroll: true });
    getScrollRuntime().then((runtime) => {
      if (!cancelled && !dismissed.current) runtime?.lenis.stop();
    });
    // A slow font service must never turn this introduction into a gate.
    Promise.race([
      Promise.all([document.fonts?.ready ?? Promise.resolve(), delay(650)]),
      delay(1600),
    ]).then(() => {
      if (!cancelled) dismiss();
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      const ownedFocus = panel?.contains(document.activeElement);
      releaseScroll();
      if (ownedFocus) document.getElementById("main")?.focus({ preventScroll: true });
    };
  }, [dismiss, done, reduced, releaseScroll]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          ref={panelRef}
          data-ground="deep"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to MaCo"
          className="maco-preloader fixed inset-0 z-[110] grid place-items-center"
          style={{ background: "var(--surface-inverted)", color: "var(--text-inverted)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
          onKeyDown={(event) => {
            if (event.key === "Escape") dismiss();
            if (event.key === "Tab") {
              event.preventDefault();
              skipRef.current?.focus();
            }
          }}
        >
          <div className="flex flex-col items-center gap-8">
            <Mark size={72} />
            <p className="text-sm text-muted">Made to keep moving.</p>
            <button ref={skipRef} type="button" onClick={dismiss} className="btn-line">
              Enter site <span aria-hidden="true">→</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
