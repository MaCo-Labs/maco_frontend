import { useEffect, useState } from "react";
import { resolveMotionPreference, MOTION_CHANGE_EVENT } from "@/lib/motion";

/**
 * Client-only motion preference — reduced when the OS says so, OR a
 * `?motion=reduced` override is stored; full when a `?motion=full`
 * override is stored even under an OS reduce setting. Reads the exact
 * same resolver as `getScrollRuntime()` (`lib/motion.ts`) so a component
 * branching on this and a scene bailing out of `getScrollRuntime()` can
 * never disagree. SSR-safe default: false.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(resolveMotionPreference() === "reduced");
    update();
    mq.addEventListener("change", update);
    window.addEventListener(MOTION_CHANGE_EVENT, update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener(MOTION_CHANGE_EVENT, update);
    };
  }, []);

  return reduced;
}
