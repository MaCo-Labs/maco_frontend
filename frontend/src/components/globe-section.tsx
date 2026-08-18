import { lazy, Suspense } from "react";
import { useTheme } from "@/components/theme";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const MaCoGlobe = lazy(() =>
  import("@/components/hero/MaCoGlobe").then((m) => ({ default: m.MaCoGlobe })),
);

type Props = {
  /** Optional eyebrow label */
  label?: string;
  /** Supporting copy — must be factual; no invented global claims */
  description?: string;
  className?: string;
};

/**
 * Lazy-loaded globe section — supporting visual for connected systems context.
 * Decorative only; not a claim about offices or global presence.
 */
export function GlobeSection({
  label = "Network / Conceptual",
  description = "A visual map of connected systems — abstract, not a claim about offices or reach.",
  className = "",
}: Props) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();

  return (
    <div className={`relative ${className}`.trim()}>
      <p className="label mb-4">{label}</p>
      <Suspense
        fallback={
          <div
            className="maco-globe-shell maco-globe-shell--section"
            aria-hidden="true"
            style={{ minHeight: "12rem" }}
          />
        }
      >
        <MaCoGlobe theme={theme} reducedMotion={reduced} variant="section" />
      </Suspense>
      {description ? <p className="mt-6 max-w-sm text-sm text-muted">{description}</p> : null}
    </div>
  );
}
