/**
 * Theme atmosphere — CSS-only (no WebGL).
 * Light-canvas system: subtle depth on white, never full-screen dark/blue fills.
 * Obsidian: restrained graphite thread lines.
 * Cobalt: soft blue radial depth.
 */
import { useTheme } from "@/components/theme";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ThemeAtmosphere({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 ${className}`}
        aria-hidden="true"
        style={{
          background:
            theme === "cobalt"
              ? "radial-gradient(ellipse 80% 50% at 70% 20%, color-mix(in oklab, var(--accent) 10%, transparent), transparent)"
              : "radial-gradient(ellipse 70% 45% at 30% 15%, color-mix(in oklab, var(--text) 4%, transparent), transparent)",
        }}
      />
    );
  }

  if (theme === "cobalt") {
    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <div className="maco-aurora maco-aurora-a" />
        <div className="maco-aurora maco-aurora-b" />
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.35]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="maco-thread" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--text)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--text)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--text)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            className="maco-thread"
            style={{ animationDelay: `${i * 0.8}s` }}
            d={`M ${-10 + i * 8} 110 Q ${30 + i * 12} ${40 + i * 8}, ${70 + i * 6} ${20 + i * 10} T 120 ${-5 + i * 5}`}
            fill="none"
            stroke="url(#maco-thread)"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
