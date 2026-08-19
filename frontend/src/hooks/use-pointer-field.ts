import { useEffect, useRef, type RefObject } from "react";

/**
 * Pointer tracking that never touches React state. Writes normalized
 * position (0..1) straight onto the element as --px / --py CSS custom
 * properties, so consuming CSS/inline-style reads them with zero
 * re-renders — the old homepage re-rendered 48 grid cells or 20 script
 * glyphs per pointermove; this replaces that pattern entirely.
 *
 * Desktop only: bails out under a coarse (touch) pointer, matching the
 * plan's rule that pointer parallax is never translated to touch.
 */
export function usePointerField<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0.5;
      const y = rect.height > 0 ? (e.clientY - rect.top) / rect.height : 0.5;
      el.style.setProperty("--px", String(x));
      el.style.setProperty("--py", String(y));
    };

    const onLeave = () => {
      el.style.setProperty("--px", "0.5");
      el.style.setProperty("--py", "0.5");
    };

    el.style.setProperty("--px", "0.5");
    el.style.setProperty("--py", "0.5");
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}
