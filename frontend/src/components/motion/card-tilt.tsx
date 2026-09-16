import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { rubberband, SPRING_MOMENTUM } from "@/lib/motion";

/** Max rotation, in degrees, before rubber-banding takes over — small
 *  enough to read as depth, not a gimmick. */
const MAX_TILT = 6;

/**
 * Wraps a card's media plate in a subtle pointer-driven 3D tilt — the one
 * added depth cue for the WORK/PRODUCTS grid cards (`home/summary.tsx`'s
 * `SummaryCard`), independent of that card's existing lean (`<Magnetic>`,
 * the whole link) and lift (`hover:-translate-y-1.5`, the link itself).
 * Three different elements, three different transforms — same "wrapper
 * leans, card lifts" split `SummaryCard` already relies on, so this
 * composes instead of fighting either one.
 *
 * Same bail-out contract as `<Magnetic>`: renders children directly (no
 * wrapper) on touch and under reduced motion.
 */
export function CardTilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const capable = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, SPRING_MOMENTUM);
  const springRy = useSpring(ry, SPRING_MOMENTUM);

  if (!capable || reduced) return <div className={className}>{children}</div>;

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    // rubberband() gives 1:1 tilt near centre and soft resistance toward
    // the edges, same falloff `<Magnetic>` uses for its own travel.
    ry.set(rubberband(relX * 2, 1) * MAX_TILT);
    rx.set(rubberband(relY * 2, 1) * -MAX_TILT);
  }

  function onPointerLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX: springRx, rotateY: springRy, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
