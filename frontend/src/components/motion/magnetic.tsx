import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { rubberband, SPRING_MOMENTUM } from "@/lib/motion";

/** Max visual travel toward the pointer, in px, before rubber-banding takes
 * over — kept small so the button's visual position and its hit target
 * never disagree enough to cause a mis-click. */
const TRAVEL = 14;

/**
 * Wraps a button/link so it leans toward a fine pointer inside its bounds
 * and settles back with a little overshoot on release — the two Apple
 * Fluid Interfaces devices this calls for: rubber-banding (§9, reused
 * verbatim from `lib/motion.ts`, written for exactly this and otherwise
 * unused) for the follow, and `SPRING_MOMENTUM`'s slight bounce (§4) for
 * the release, since a pointer leaving IS the "gesture ended" moment.
 *
 * No-ops (renders children directly, no wrapper) on touch and under
 * reduced motion — magnetism has no coarse-pointer equivalent worth
 * faking, and reduced motion should mean no spring displacement at all.
 */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const capable = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_MOMENTUM);
  const springY = useSpring(y, SPRING_MOMENTUM);

  // Preserve `className` even when bailing out — callers rely on it for
  // real layout (e.g. a responsive `hidden lg:inline-flex`), not just the
  // magnetic effect, so dropping it here would silently break layout on
  // exactly the touch devices this bail-out targets.
  if (!capable || reduced) return <div className={className}>{children}</div>;

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    // rubberband() gives 1:1 following near centre and soft resistance
    // toward the edges, rather than a hard linear cap.
    x.set(rubberband(relX * 2, 1) * TRAVEL);
    y.set(rubberband(relY * 2, 1) * TRAVEL);
  }

  function onPointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
