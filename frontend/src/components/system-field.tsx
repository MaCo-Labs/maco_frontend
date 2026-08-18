import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useTheme, type Theme } from "@/components/theme";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  className?: string;
  scrollProgress?: number;
};

/**
 * SystemField — MaCo M-shaped logo geometry.
 *
 * The active grid cells reproduce the exact MaCo M mark silhouette.
 * The grid is the canvas; the M is the actual symbol.
 * Only cells corresponding to the MaCo M become visually active.
 *
 * Geometry (derived from the supplied MaCo logo reference):
 * - Two main lower vertical structures (the legs of the M)
 * - A small upper indication (the M peak)
 * - Distinctive central negative space (the gap between the legs)
 * - Compact, horizontally balanced shape
 * - Does NOT contain the circled/top portion from reference image 1
 * - Does NOT read as a generic alphabet M or a U
 */
const ACTIVE = new Set([
  // Row 1 (i=6..11): three cells forming the M peak and upper structure
  7, // row 1 col 1 (left leg start)
  8, // row 1 col 2 (inner upper block)
  10, // row 1 col 4 (right leg start)

  // Legs from row 2 to row 7: outer columns only
  // Row 2 (i=12..17): cols 1 and 4
  13,
  16,
  // Row 3 (i=18..23): cols 1 and 4
  19,
  22,
  // Row 4 (i=24..29): cols 1 and 4
  25,
  28,
  // Row 5 (i=30..35): cols 1 and 4
  31,
  34,
  // Row 6 (i=36..41): cols 1 and 4
  37,
  40,
  // Row 7 (i=42..47): cols 1 and 4 (bottom of the legs)
  43,
  46,
]);

const GRID_COLS = 6;
const GRID_ROWS = 8;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

/**
 * Creates the per-theme radius value for active cells.
 * Obsidian: subtle rounding; Cobalt: slightly more pronounced.
 */
const getThemeRadius = (theme: Theme) => (theme === "cobalt" ? 0.45 : 0.2);

/**
 * MaCo System Field — modular grid identity.
 * Pointer proximity + scroll intensity. Theme-differentiated. Not a particle system.
 */
export function MaCoSystemField({ className = "", scrollProgress = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [hovering, setHovering] = useState(false);

  const onMove = useCallback(
    (e: ReactPointerEvent) => {
      if (reduced || !ref.current) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;
      const r = ref.current.getBoundingClientRect();
      setPointer({
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      });
    },
    [reduced],
  );

  useEffect(() => {
    if (!ref.current) return;
    const intensity = reduced ? 0 : Math.min(1, Math.max(0, scrollProgress));
    ref.current.style.setProperty("--sf-scroll", String(intensity));
  }, [scrollProgress, reduced]);

  // Geometry clarity: the M resolves from faint to strong as scroll progresses
  const geometryClarity = reduced ? 0.3 : 0.2 + scrollProgress * 0.7;
  const cobalt = theme === "cobalt";

  // Active cells from the determined ACTIVE set
  const cells = useMemo(() => Array.from({ length: TOTAL_CELLS }), []);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => {
        setHovering(false);
        setPointer(null);
      }}
      style={{ "--sf-scroll": String(scrollProgress) } as CSSProperties}
    >
      <div className="grid grid-cols-6">
        {cells.map((_, i) => {
          const col = i % GRID_COLS;
          const row = Math.floor(i / GRID_COLS);
          const on = ACTIVE.has(i);
          const cx = (col + 0.5) / GRID_COLS;
          const cy = (row + 0.5) / GRID_ROWS;

          let proximity = 0;
          if (pointer && hovering && !reduced) {
            const dx = cx - pointer.x;
            const dy = cy - pointer.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            proximity = Math.max(0, 1 - d * 2.5);
          }
          const scrollBoost = reduced ? 0 : scrollProgress * (on ? 0.7 : 0.18);
          const lift = Math.min(1, proximity * 0.85 + scrollBoost);

          let background = "transparent";
          if (on) {
            // Base mix color depends on theme
            const base = cobalt ? 0.14 : 0.1;
            const strong = cobalt ? 0.16 + lift * 0.5 : 0.1 + lift * 0.34;
            const mix = (p: number) =>
              cobalt
                ? `color-mix(in oklab, var(--accent) ${p * 100}%, var(--surface-2))`
                : `color-mix(in oklab, var(--text) ${p * 100}%, var(--surface-2))`;
            background = lift > 0.12 ? mix(strong) : mix(base * geometryClarity);
          } else if (lift > 0.3) {
            background = cobalt
              ? `color-mix(in oklab, var(--accent) ${lift * 0.16 * 100}%, transparent)`
              : `color-mix(in oklab, var(--surface-2) ${(0.4 + lift * 0.3) * 100}%, transparent)`;
          }

          // Glow effect for cobalt theme on active cells — restrained on white canvas
          const glow =
            !reduced && on && lift > 0.4 && cobalt
              ? `0 0 ${6 + lift * 12}px color-mix(in oklab, var(--accent) 24%, transparent)`
              : !reduced && on && lift > 0.55 && !cobalt
                ? `inset 0 0 0 1px color-mix(in oklab, var(--text) 28%, transparent)`
                : undefined;

          // Per-theme radius for the active cells
          const radius = getThemeRadius(theme);

          return (
            <div
              key={i}
              className="aspect-square border-r border-b border-line transition-[background-color,box-shadow,transform] duration-300"
              style={{
                background,
                borderRadius: on ? `calc(${radius}rem * var(--sf-round, 1))` : "0",
                opacity: on ? 0.4 + geometryClarity * 0.6 : 0.55 + lift * 0.45,
                transform: reduced ? undefined : `scale(${1 + lift * (cobalt ? 0.08 : 0.055)})`,
                boxShadow: glow,
                willChange: on ? "background-color, transform" : undefined,
              }}
            />
          );
        })}
      </div>

      {/* Scan band — the "system is activating" sweep. Disabled under reduced motion. */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="maco-scanband absolute inset-x-0 h-full"
            style={{
              opacity: 0.18 + scrollProgress * 0.5,
              background: `linear-gradient(180deg, transparent 0%, ${
                cobalt
                  ? "color-mix(in oklab, var(--accent) 14%, transparent)"
                  : "color-mix(in oklab, var(--text) 12%, transparent)"
              } 47%, ${
                cobalt
                  ? "color-mix(in oklab, var(--accent) 45%, transparent)"
                  : "color-mix(in oklab, var(--text) 32%, transparent)"
              } 50%, ${
                cobalt
                  ? "color-mix(in oklab, var(--accent) 14%, transparent)"
                  : "color-mix(in oklab, var(--text) 12%, transparent)"
              } 53%, transparent 100%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

/** Alias for existing imports */
export function SystemField(props: Props) {
  return <MaCoSystemField {...props} />;
}
