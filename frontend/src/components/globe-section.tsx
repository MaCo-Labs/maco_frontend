import { lazy, Suspense, useEffect, useState } from "react";
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
 *
 * Mounted behind a `mounted` gate, not just `React.lazy`+`Suspense` alone:
 * `react-globe.gl` -> `globe.gl` -> `three-globe` is a fully static import
 * chain, and `three-globe`'s own modules read `window.THREE` at MODULE
 * SCOPE. During streaming SSR, React still runs a lazy factory's dynamic
 * `import()` on the server to resolve the Suspense boundary, so that
 * `window` read throws server-side regardless — this is React error #419
 * ("switched to client rendering"), already noted in `AI_HANDOFF.md`. The
 * `mounted` gate (same pattern as `top-head.tsx`'s masked-heading swap)
 * keeps the dynamic import from ever being reached on the server: SSR and
 * first client paint both render the plain shell, and only the next paint
 * swaps in the real `<Suspense>` tree.
 */
export function GlobeSection({
  label = "Network / Conceptual",
  description = "A visual map of connected systems — abstract, not a claim about offices or reach.",
  className = "",
}: Props) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shell = (
    <div
      className="maco-globe-shell maco-globe-shell--section"
      aria-hidden="true"
      style={{ minHeight: "12rem" }}
    />
  );

  return (
    <div className={`relative ${className}`.trim()}>
      <p className="label mb-4">{label}</p>
      {mounted ? (
        <Suspense fallback={shell}>
          <MaCoGlobe theme={theme} reducedMotion={reduced} variant="section" />
        </Suspense>
      ) : (
        shell
      )}
      {description ? <p className="mt-6 max-w-sm text-sm text-muted">{description}</p> : null}
    </div>
  );
}
