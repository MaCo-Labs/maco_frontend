import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const MARK_SRC = "/white-logo.png";

type Props = {
  className?: string;
};

/**
 * HeroMonument — THE MONUMENT.
 * The exact MaCo mark presented as a single sculptural object: a crisp
 * luminous core (the mark, masked by /white-logo.png so light never escapes
 * the brand silhouette), a subtle material gradient, a hairline datum it sits
 * on, and one restrained light-pass that "materializes" the mark.
 *
 * Layers (finest → coarsest):
 *   core     — the mark itself, white-in-obscurity, crisp
 *   material — faint vertical gradient only visible inside the mark (mask)
 *   sweep    — one diagonal light pass that resolves the material on load
 *   datum    — the hairline rule the mark is founded on (draws in after)
 *   plinth   — faint contact light beneath the monument (grounds it)
 *
 * The mark geometry is not invented: the real PNG is used as the true
 * silhouette via mask-image, so geometry stays exact by construction.
 */
export function HeroMonument({ className = "" }: Props) {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: ReactPointerEvent) => {
    if (reduced) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const r = frameRef.current?.getBoundingClientRect();
    if (!r) return;
    setPointer({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  const onLeave = () => setPointer(null);

  const px = pointer?.x ?? 0;
  const py = pointer?.y ?? 0;

  const style = {
    "--monument-px": String(px),
    "--monument-py": String(py),
  } as CSSProperties;

  return (
    <figure
      ref={frameRef}
      className={`hero-monument ${className}`.trim()}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden="true"
    >
      {/* Restrained architectural room behind the monument */}
      <div className="hero-monument-room" />

      {/* The monument itself — the mark, filled with quiet material */}
      <div className="hero-monument-figure">
        <img
          className="hero-monument-core"
          src={MARK_SRC}
          alt=""
          width={1672}
          height={941}
          decoding="async"
          fetchPriority="high"
        />
        <div className="hero-monument-material" />
        <div className="hero-monument-sweep" />
      </div>

      {/* Precision datum the monument is founded on */}
      <span className="hero-monument-datum" />

      {/* Contact light — a faint pool grounds the object */}
      <div className="hero-monument-plinth" />
    </figure>
  );
}
