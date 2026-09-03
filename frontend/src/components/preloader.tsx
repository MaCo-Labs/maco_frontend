import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getProduct } from "@/content/maco";
import { Mark } from "@/components/mark";
import { Magnetic } from "@/components/motion/magnetic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getLiveScrollRuntime, getScrollRuntime } from "@/lib/scroll-runtime";
import { DUR, EASE_EMPHASIS } from "@/lib/motion";

const RADIUS = 86;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// 2026-09-01: how long the counter takes to visibly tick through numbers
// on a fast connection, where the old 1.6s ceiling read as "very fast"
// with most integers skipped. See the tween below for how this interacts
// with the 92 ceiling and the real readiness signal.
const MIN_DURATION_MS = 2600;

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
 * Two states past the skip check, not one: `ready` (the counter reached
 * 100) and `done` (the visitor clicked through). Motion/nav pass §35 —
 * the loader used to call both at once (auto-transitioning the instant
 * progress finished), which reads as the page yanking the visitor in
 * rather than inviting them. `ready` reveals a real "Enter" action instead
 * and holds there; only that click sets `done`, which is what actually
 * unmounts the overlay and releases the scroll lock. The skip branch
 * (reduced motion / same-session repeat) still sets `done` directly — an
 * Enter click has nothing to add for a visitor who's already told the
 * site they don't want the ceremony, or has already sat through it once
 * this session.
 *
 * Progress is a proxy tween, not byte-accounted.
 * ponytail: time-based illusion, swap for real resource tracking only if
 * it visibly misreports. It runs toward 92 over MIN_DURATION_MS (2.6s,
 * linear — a constant tick rate is what makes the counter visibly pass
 * through nearly every integer instead of skipping) and only starts its
 * snap to 100 once BOTH that duration and the real readiness signal (web
 * fonts + the hero's poster image decoded) have resolved — 2026-09-01,
 * previously gated on readiness alone at a faster ~1.6s pace, which read
 * as rushed on a fast connection. A slow connection still shows real
 * progress past 92 instead of stalling at a fixed number; a fast one
 * still gets the full deliberate ~2.6s+0.45s beat rather than finishing
 * the instant assets resolve.
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
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const numeralRef = useRef<HTMLSpanElement>(null);
  // Captured once at lock time, read back by `enterSite` on click — the
  // effect's own cleanup (below) only ever fires on unmount/dep-change,
  // never as a result of that click, so the unlock can't live there.
  const prevOverflowRef = useRef("");

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
    prevOverflowRef.current = document.body.style.overflow;
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

    const showEnter = () => {
      if (cancelled) return;
      write(100);
      setReady(true);
    };

    getScrollRuntime().then((rt) => {
      if (cancelled) return;
      if (!rt) {
        // Blocked dynamic import (offline, extension, CSP) — still gate on
        // a click rather than leave the page stuck, just skip straight to
        // the ring's finished state.
        showEnter();
        return;
      }
      rt.lenis.stop();

      const proxy = { v: 0 };
      const bridgePoster = getProduct("bridge")?.media?.poster;
      const assetsReady = Promise.all([
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
      // Gates the close on the LONGER of real readiness and a minimum
      // elapsed time — without this, a fast connection resolved
      // `assetsReady` almost immediately and the loader read as rushed
      // even at the retimed pace below, since the 92->100 snap could fire
      // a few hundred ms in. `Promise.all` on a fixed-delay promise
      // enforces the floor without touching the readiness logic itself.
      const minElapsed = new Promise<void>((resolve) => setTimeout(resolve, MIN_DURATION_MS));
      const ready = Promise.all([assetsReady, minElapsed]);

      // Caps below 100, not at it: a tween that reaches v:100 on its own
      // schedule (a real risk once real assets take longer than the main
      // tween's own duration — caught live, where it left the ring frozen
      // at a false "100%" for a visible extra second-plus before the real
      // snap) removes the "remainder" the ready-signal handler below
      // depends on to ever animate anything. Capping at 92 guarantees
      // there's always a real gap left for the snap to close, so the ring
      // can never look finished before the page actually is. `ease: "none"`
      // (was power1.inOut) plus the longer duration is what makes the
      // counter visibly tick through nearly every integer instead of
      // skipping — a constant ~35 units/sec is roughly one number every
      // 28ms, well under a 60fps frame budget.
      const CEILING = 92;
      const mainTween = rt.gsap.to(proxy, {
        v: CEILING,
        duration: MIN_DURATION_MS / 1000,
        ease: "none",
        onUpdate: () => write(proxy.v),
      });

      ready.then(() => {
        if (cancelled) return;
        mainTween.kill();
        rt.gsap.to(proxy, {
          v: 100,
          duration: 0.45,
          ease: "power2.out",
          onUpdate: () => write(proxy.v),
          onComplete: showEnter,
        });
      });
    });

    return () => {
      cancelled = true;
      getLiveScrollRuntime()?.lenis.start();
      document.body.style.overflow = prevOverflowRef.current;
    };
  }, [reduced]);

  const enterSite = () => {
    getLiveScrollRuntime()?.lenis.start();
    document.body.style.overflow = prevOverflowRef.current;
    setDone(true);
  };

  const enterButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // The preloader is the only interactive surface on screen while it's
    // up (scroll is locked) — move focus to the one action that exists
    // the moment it appears, rather than leaving a keyboard visitor to
    // hunt for it.
    if (ready) enterButtonRef.current?.focus();
  }, [ready]);

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
            scale: reduced ? 1 : 1.06,
            transition: reduced ? { duration: 0 } : { duration: 0.7, ease: EASE_EMPHASIS },
          }}
        >
          <div className="flex flex-col items-center gap-10">
            <div className="relative flex items-center justify-center">
              <svg width={200} height={200} viewBox="0 0 200 200" className="-rotate-90">
                <circle
                  cx={100}
                  cy={100}
                  r={RADIUS}
                  fill="none"
                  stroke="var(--line-inverted)"
                  strokeWidth={2.5}
                />
                <circle
                  ref={circleRef}
                  cx={100}
                  cy={100}
                  r={RADIUS}
                  fill="none"
                  stroke="var(--focus)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE}
                />
              </svg>
              <Mark size={64} className="absolute" />
              {/* Was -bottom-12 (outside the ring's own box, in the gap
                  between it and the Enter button below) — the numeral had
                  zero height contribution to the flex column (absolute
                  positioning), so its box bottom edge landed 8px past the
                  button's top edge the instant both hit "100"/`ready`
                  together. Pulled inside the ring's own box instead — can
                  no longer collide with anything below it, at any value. */}
              <span
                ref={numeralRef}
                className="label absolute bottom-8"
                style={{ color: "var(--muted-inverted)" }}
                aria-hidden="true"
              >
                0
              </span>
            </div>

            {/* §35 — a deliberate "Enter" beat rather than auto-transitioning
                the moment loading finishes. `.btn-solid` resolves through
                this container's own `data-ground="deep"` remap (styles.css),
                same as every other themed control on the site — no override
                needed for it to read correctly against `--surface-inverted`.
                Always mounted (was gated behind its own `AnimatePresence`,
                unmounted until `ready`) so the column's height is constant
                from first paint — nothing shifts, and there's no longer a
                moment where the numeral and button can occupy the same
                geometry. `min-h` reserves the button's own rendered height
                so the slot doesn't collapse to 0 before `ready`. */}
            <div className="flex min-h-[3.25rem] items-center justify-center">
              <motion.div
                initial={false}
                animate={{
                  opacity: ready ? 1 : 0,
                  y: ready ? 0 : 16,
                  transition: reduced ? { duration: 0 } : { duration: DUR.ui, ease: EASE_EMPHASIS },
                }}
              >
                <Magnetic>
                  <button
                    ref={enterButtonRef}
                    type="button"
                    onClick={enterSite}
                    disabled={!ready}
                    className="btn-solid"
                  >
                    Enter <span aria-hidden="true">→</span>
                  </button>
                </Magnetic>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
