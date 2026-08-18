import {
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** When true, the spotlight works on any pointer (including coarse). */
  allowTouch?: boolean;
};

/**
 * SpotlightCard — original MaCo implementation (no React Bits Pro code).
 *
 * A restrained illumination that follows the pointer across the card,
 * implemented with two CSS variables and a masked radial gradient. The card
 * content shrugs away from the pointer very slightly. No mouse required:
 * the gradient is decorative; the card's own actions remain keyboard-usable
 * and the whole thing is inert under reduced motion.
 */
export function SpotlightCard({
  children,
  className = "",
  allowTouch = false,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const onMove = (e: ReactPointerEvent) => {
    if (reduced) return;
    if (
      !allowTouch &&
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    )
      return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spot-opacity", "0");
  };

  const onEnter = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spot-opacity", "1");
  };

  return (
    <div
      ref={ref}
      className={`spotlight-card relative overflow-hidden ${className}`}
      style={{ "--spot-x": "50%", "--spot-y": "50%", "--spot-opacity": "0" } as CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerEnter={onEnter}
    >
      <div
        className="spotlight-card-glow pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
