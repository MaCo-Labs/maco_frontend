import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { rubberband, SPRING_MOMENTUM } from "@/lib/motion";

/** Max rotation, in degrees, before rubber-banding takes over — small
 *  enough to read as depth, not a gimmick. */
const MAX_TILT = 6;

/**
 * Presses a card's media plate in under the pointer: the point under the
 * cursor sinks away, rather than rising to meet it. Also writes `--press`,
 * `--press-x/y` and `--press-angle` for the shadow and edge light the card's
 * own CSS draws (`.work-project-image`, work.css).
 *
 * Stays inert on touch and under reduced motion. Always the same element, so a
 * late media-query result can't remount the images inside it.
 */
export function CardTilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const capable = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const scale = useMotionValue(1);
  const springRx = useSpring(rx, SPRING_MOMENTUM);
  const springRy = useSpring(ry, SPRING_MOMENTUM);
  const springScale = useSpring(scale, SPRING_MOMENTUM);

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !capable || reduced) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    // rubberband() gives 1:1 tilt near centre and soft resistance toward
    // the edges, same falloff `<Magnetic>` uses for its own travel.
    ry.set(rubberband(relX * 2, 1) * MAX_TILT);
    rx.set(rubberband(relY * 2, 1) * -MAX_TILT);
    scale.set(0.985);
    el.style.setProperty("--press", "1");
    el.style.setProperty("--press-x", `${(relX + 0.5) * 100}%`);
    el.style.setProperty("--press-y", `${(relY + 0.5) * 100}%`);
    // Light lands on the edge opposite the press.
    el.style.setProperty("--press-angle", `${(Math.atan2(-relX, relY) * 180) / Math.PI}deg`);
  }

  function onPointerLeave() {
    rx.set(0);
    ry.set(0);
    scale.set(1);
    ref.current?.style.setProperty("--press", "0");
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        rotateX: springRx,
        rotateY: springRy,
        scale: springScale,
        transformPerspective: 900,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
