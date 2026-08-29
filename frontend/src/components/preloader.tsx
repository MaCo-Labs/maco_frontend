import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getProduct } from "@/content/maco";
import { Mark } from "@/components/mark";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getLiveScrollRuntime, getScrollRuntime } from "@/lib/scroll-runtime";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const EASE_EMPHASIS = [0.16, 1, 0.3, 1] as const;

/**
 * First-paint loader: a percentage ring around MaCo's mark, on `deep`
 * ground (the page opens dark — CONTEXT.md's three-act ground sequence),
 * ring progress on `--focus` rather than `--accent` — `--accent` resolves
 * near-white on deep ground in both themes (the ninth-pass `display-glow`
 * lesson), which would erase the difference between them here too.
 *
 * Renders in the SSR HTML so it genuinely covers first paint. The
 * pre-paint script in __root.tsx (same one that reads the stored theme)
 * stamps `data-preload="skip"` on <html> before hydration when reduced
 * motion or a same-session repeat visit is detected — CSS alone hides it
 * in that case (`html[data-preload="skip"] .maco-preloader`), so there is
 * no hydration flash either way. `done` below is this component's own
 * mount-time confirmation of the same check (`useReducedMotion` resolves
 * through URL-param overrides the pre-paint script doesn't know about) —
 * it exists to unmount cleanly and skip the scroll lock, not to hide
 * anything the CSS rule hasn't already hidden.
 *
 * Progress is a proxy tween, not byte-accounted.
 * ponytail: time-based illusion, swap for real resource tracking only if
 * it visibly misreports. It runs toward 100 over ~1.6s; once the real
 * readiness signal resolves (web fonts + the hero's poster image
 * decoded), whatever distance remains snaps shut in 0.25s instead of
 * waiting out the full illusion — a fast connection finishes fast, a slow
 * one still shows real progress instead of stalling at a fixed number.
 *
 * The ring's `stroke-dashoffset` is written directly via ref on every
 * tick (ref.textContent for the numeral, same no-re-render pattern
 * identity.tsx uses for --t) rather than through a registered CSS custom
 * property — SSR already renders the ring at its correct at-rest state
 * (0%, `strokeDashoffset={CIRCUMFERENCE}`), which is the same "correct
 * static composition with zero JS" guarantee the site's @property
 * convention exists for, just achieved as a plain SVG attribute here
 * since nothing else needs to read the value.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const numeralRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (document.documentElement.dataset["preload"] === "skip" || reduced) {
      setDone(true);
      return;
    }

    try {
      window.sessionStorage.setItem("maco-preloaded", "1");
    } catch {
      /* storage unavailable — the pre-paint script will just re-check next load */
    }

    const rt0 = getLiveScrollRuntime();
    rt0?.lenis.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let cancelled = false;
    const write = (v: number) => {
      const clamped = Math.min(100, Math.max(0, v));
      circleRef.current?.style.setProperty(
        "stroke-dashoffset",
        String(CIRCUMFERENCE * (1 - clamped / 100)),
      );
      if (numeralRef.current) numeralRef.current.textContent = String(Math.round(clamped));
      containerRef.current?.setAttribute("aria-valuenow", String(Math.round(clamped)));
    };

    const finish = () => {
      if (cancelled) return;
      write(100);
      setDone(true);
    };

    getScrollRuntime().then((rt) => {
      if (cancelled) return;
      if (!rt) {
        // Blocked dynamic import (offline, extension, CSP) — finish rather
        // than leave the page stuck behind a loader that can never animate.
        finish();
        return;
      }
      rt.lenis.stop();

      const proxy = { v: 0 };
      const bridgePoster = getProduct("bridge")?.media?.poster;
      const ready = Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        bridgePoster
          ? new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = bridgePoster;
            })
          : Promise.resolve(),
      ]);

      // Caps below 100, not at it: a tween that reaches v:100 on its own
      // schedule (a real risk once assets take longer than ~1.6s to load —
      // caught live, where it left the ring frozen at a false "100%" for a
      // visible extra second-plus before the real snap) removes the
      // "remainder" the ready-signal handler below depends on to ever
      // animate anything. Capping at 92 guarantees there's always a real
      // gap left for the snap to close, so the ring can never look
      // finished before the page actually is.
      const CEILING = 92;
      const mainTween = rt.gsap.to(proxy, {
        v: CEILING,
        duration: 1.6,
        ease: "power1.inOut",
        onUpdate: () => write(proxy.v),
      });

      ready.then(() => {
        if (cancelled) return;
        mainTween.kill();
        rt.gsap.to(proxy, {
          v: 100,
          duration: 0.25,
          ease: "power2.out",
          onUpdate: () => write(proxy.v),
          onComplete: finish,
        });
      });
    });

    return () => {
      cancelled = true;
      getLiveScrollRuntime()?.lenis.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          ref={containerRef}
          data-ground="deep"
          role="progressbar"
          aria-label="Loading"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          className="maco-preloader fixed inset-0 z-[110] flex items-center justify-center"
          style={{ background: "var(--surface-inverted)", color: "var(--text-inverted)" }}
          exit={{
            opacity: 0,
            transition: reduced ? { duration: 0 } : { duration: 0.5, ease: EASE_EMPHASIS },
          }}
        >
          <div className="relative flex items-center justify-center">
            <svg width={128} height={128} viewBox="0 0 128 128" className="-rotate-90">
              <circle
                cx={64}
                cy={64}
                r={RADIUS}
                fill="none"
                stroke="var(--line-inverted)"
                strokeWidth={2}
              />
              <circle
                ref={circleRef}
                cx={64}
                cy={64}
                r={RADIUS}
                fill="none"
                stroke="var(--focus)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE}
              />
            </svg>
            <Mark size={32} className="absolute" />
            <span
              ref={numeralRef}
              className="label absolute -bottom-9"
              style={{ color: "var(--muted-inverted)" }}
              aria-hidden="true"
            >
              0
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
