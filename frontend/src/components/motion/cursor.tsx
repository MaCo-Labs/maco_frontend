import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getScrollRuntime } from "@/lib/scroll-runtime";

/** Same rough set `Magnetic` wraps — the cursor should notice exactly the
 *  things a visitor can act on, nothing more. */
const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, select";

/**
 * A restrained custom cursor — one ring, no trailing dot, no cursor-hiding
 * of the OS pointer (it sits alongside the real cursor, not instead of
 * it). `AI_HANDOFF.md` #8 flags custom-cursor work as previously-reverted
 * and needing its own live go/no-go before shipping; this one is scoped
 * deliberately small to survive that bar:
 *
 * - Fine pointer only (`(pointer: fine)`, the same query `Magnetic` gates
 *   on) — never rendered at all on touch, not just hidden by CSS.
 * - Fully disabled under reduced motion — no element, no listener, no
 *   ticker entry. A cursor that follows the pointer is exactly the kind
 *   of motion that setting exists to turn off.
 * - `mix-blend-mode: difference` against a plain white fill is what makes
 *   ONE ring correct on every ground and both themes with zero
 *   per-section logic — difference-against-white is always visible
 *   regardless of what's underneath, the same reason it's a standard
 *   technique rather than a MaCo invention. white here is the same
 *   token-free mix target `.maco-shine` (styles.css) already uses, not a
 *   new colour value.
 * - Scales up over interactive elements via event DELEGATION
 *   (`pointerover`/`pointerout` on `document`, checking `.closest()`),
 *   not per-element listeners — this component mounts once in
 *   `__root.tsx` for the app's lifetime and never remounts on a route
 *   change, so a fixed list of targets captured at mount would go stale
 *   the moment a visitor navigates. Delegation stays correct for
 *   whatever's in the DOM at the moment the pointer crosses it.
 * - Position is written with `gsap.quickSetter` inside a lerp on
 *   `gsap.ticker` (the same rAF loop Lenis itself runs on —
 *   `scroll-runtime.ts`) rather than a per-`pointermove` GSAP tween or
 *   React state — a quickSetter is a plain function call, the cheapest
 *   way GSAP has to write a value every frame, and a trailing lerp
 *   (rather than 1:1 tracking) is what makes it read as a physical ring
 *   with a little give, not a pixel glued to the OS pointer.
 * - Doesn't fight `Magnetic`: that component moves the BUTTON toward the
 *   pointer with its own spring; this one only ever moves itself. Same
 *   pointer, two independent reactions, never the same element.
 */
export function Cursor() {
  const capable = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const active = capable && !reduced;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;

      const setX = rt.gsap.quickSetter(el, "x", "px");
      const setY = rt.gsap.quickSetter(el, "y", "px");
      let px = window.innerWidth / 2;
      let py = window.innerHeight / 2;
      let tx = px;
      let ty = py;
      let shown = false;

      const onMove = (e: PointerEvent) => {
        tx = e.clientX;
        ty = e.clientY;
        if (!shown) {
          shown = true;
          px = tx;
          py = ty;
          el.style.opacity = "1";
        }
      };
      const tick = () => {
        px += (tx - px) * 0.25;
        py += (ty - py) * 0.25;
        setX(px);
        setY(py);
      };
      const isInteractive = (target: EventTarget | null) =>
        target instanceof Element && target.closest(INTERACTIVE_SELECTOR);
      const onOver = (e: PointerEvent) => {
        if (isInteractive(e.target)) el.classList.add("is-active");
      };
      const onOut = (e: PointerEvent) => {
        if (isInteractive(e.target)) el.classList.remove("is-active");
      };
      const onLeaveWindow = () => {
        el.style.opacity = "0";
        shown = false;
      };

      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);
      document.addEventListener("pointerleave", onLeaveWindow);
      rt.gsap.ticker.add(tick);

      cleanup = () => {
        rt.gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
        document.removeEventListener("pointerleave", onLeaveWindow);
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [active]);

  if (!active) return null;

  return <div ref={ref} aria-hidden="true" className="maco-cursor" style={{ opacity: 0 }} />;
}
