import { useEffect, useState, type RefObject } from "react";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Scroll progress of an element through the viewport (0–1).
 *
 * 0 = section has not yet scrolled upward past its rest position (including on
 *     initial load when the hero sits below the header).
 * 1 = section has largely exited upward through the viewport.
 *
 * Previous formula used `(view - rect.top) / total`, which reported ~0.4–0.5
 * on first paint while the hero was still at rest — causing Hero copy to fade
 * before the user scrolled.
 */
export function useElementScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const view = window.innerHeight || 1;

      // How far the section top has moved above the viewport top (0 at rest).
      const scrolled = Math.max(0, -rect.top);
      // Range until the section has substantially cleared the viewport.
      const scrollRange = Math.max(1, rect.height - view * 0.3);
      const p = clamp01(scrolled / scrollRange);

      setProgress(p);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return progress;
}
