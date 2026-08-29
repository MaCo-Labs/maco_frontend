import { forwardRef, type CSSProperties } from "react";
import { site } from "@/content/maco";

/**
 * MaCo mark — the real lockup glyph (public/logo-mark.png), applied as a
 * CSS mask so it inherits `currentColor`. One source asset, correct in
 * both themes and on any ground, instead of a separate light/dark export.
 */

export function Mark({
  size = 28,
  className = "",
  src = "/logo-mark.png",
  style,
}: {
  size?: number;
  className?: string;
  /** Defaults to the small square lockup used everywhere in chrome.
   *  The hero passes `/maco-mark-hero.png` — same monogram, a wider
   *  source crop, downsampled from `public/white-logo.png` (see
   *  `scripts/shrink-hero-mark.cjs`). Both are alpha-only masks, so
   *  either recolors correctly with `currentColor` on any ground. */
  src?: string;
  style?: CSSProperties;
} = {}) {
  return (
    <span
      aria-hidden="true"
      className={`maco-mark inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        ...style,
      }}
    />
  );
}

export const Wordmark = forwardRef<
  HTMLSpanElement,
  { size?: number; className?: string; style?: CSSProperties }
>(function Wordmark({ size = 36, className = "", style }, ref) {
  return (
    <span
      ref={ref}
      className={`inline-flex items-center gap-2.5 font-display text-xl font-semibold tracking-[-0.04em] md:text-2xl ${className}`}
      style={{ color: "var(--text)", ...style }}
      aria-label={`MaCo — ${site.tagline}`}
    >
      <Mark size={size} className="shrink-0" />
      <span>MaCo</span>
    </span>
  );
});

export { MaCoSystemField, SystemField } from "@/components/system-field";
