import type { CSSProperties } from "react";
import { site } from "@/content/maco";

/**
 * MaCo mark — the real lockup glyph (public/logo-mark.png), applied as a
 * CSS mask so it inherits `currentColor`. One source asset, correct in
 * both themes and on any ground, instead of a separate light/dark export.
 *
 * 2026-09-02: `logo-mark.png` used to be a 2481×2481 canvas with the glyph
 * occupying only ~26% of its width and ~15% of its height (measured via
 * ffmpeg's raw RGBA decode + a per-pixel alpha scan) — `mask-size: contain`
 * fits the whole padded canvas into the box, so at `size={28}` the visible
 * glyph rendered at roughly 7×4px. Raising `size` couldn't fix it: the
 * padding scales with the glyph, so a 28px-wide mark needed `size≈110`,
 * which blew out every call site's layout. Re-exported the same asset
 * cropped to its measured alpha bbox (670×375, ~4px margin preserved for
 * the rounded corners' own anti-aliasing) — no content change, just the
 * dead padding gone. (A hand-authored inline SVG was the first plan here —
 * abandoned after the pixel measurement showed the glyph's corner joints
 * don't reduce to plain rounded rects at every seam; shipping a traced
 * approximation risked a subtly-wrong glyph, where the cropped source PNG
 * is pixel-identical to the original art.)
 *
 * `ASPECT` is the cropped source's real height/width (375/670) — `size`
 * now means WIDTH, height derives from it, so the box is a tight wrap
 * around the visible glyph instead of a square with `contain`-letterboxed
 * empty space top and bottom. Tied to the one canonical asset on purpose:
 * a caller passing a different `src` would get this aspect applied to it
 * too, which is only correct as long as every mark asset shares this
 * glyph's proportions.
 */
const ASPECT = 375 / 670;

export function Mark({
  size = 28,
  className = "",
  src = "/logo-mark.png",
  style,
}: {
  /** Rendered WIDTH — height derives from `ASPECT` so the box tightly
   *  wraps the glyph. (Before this pass, `size` was a square box; every
   *  call site's number carries over unchanged, but now renders as an
   *  actually-visible glyph instead of a mostly-empty square.) */
  size?: number;
  className?: string;
  /** Defaults to the one canonical mark used everywhere it appears —
   *  chrome, footer, preloader, TOPHEAD — via `mask-size: contain`, so a
   *  caller only needs `size` to scale it, not a different source asset. */
  src?: string;
  style?: CSSProperties;
} = {}) {
  return (
    <span
      aria-hidden="true"
      className={`maco-mark inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size * ASPECT,
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

export function Wordmark({ size = 42, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display text-2xl font-semibold tracking-[-0.04em] md:text-3xl ${className}`}
      style={{ color: "var(--text)" }}
      aria-label={`MaCo — ${site.tagline}`}
    >
      <Mark size={size} className="shrink-0" />
      {/* Classed (not a bare span) so layout 3's mobile brand chip
          (styles.css) can hide the text and keep only the mark — the top
          nav row there also carries the fixed layout/theme control
          cluster, and a 390px viewport can't fit both a full "MaCo" chip
          centered and that cluster in a corner without overlap. */}
      <span className="maco-wordmark-text">MaCo</span>
    </span>
  );
}

export { MaCoSystemField, SystemField } from "@/components/system-field";
