import type { CSSProperties, ReactNode } from "react";

/**
 * "notch" — one corner cut at 45°, sized off percentages so it holds its
 * angle at any aspect ratio (no per-shape viewBox/scale math to maintain,
 * and no `<clipPath id>` to collide if the same shape is ever rendered
 * more than once on a page — a CSS `polygon()` needs neither).
 */
const CLIP_SHAPES = {
  rect: undefined,
  notch: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
} as const;

type Props = {
  /** What this slot is standing in for — shown as a quiet caption, never hidden. */
  label: string;
  aspect?: string;
  className?: string;
  style?: CSSProperties | undefined;
  children?: ReactNode;
  /** Geometric cut applied to the surface. Default "rect" (plain rounded corners). */
  shape?: keyof typeof CLIP_SHAPES;
};

/**
 * The repo currently has zero product photography, screenshots or video
 * (confirmed by audit — no image/cover/thumbnail field exists on any
 * project, product or client). Rather than fake evidence with stock or
 * AI imagery, every media slot on the homepage renders this: a designed
 * material surface with the site's one signature device (the raking
 * light pass) and an honest caption.
 *
 * This is tier 3 of the three-tier resolution in the plan. Tiers 1
 * (video) and 2 (image) are added per-slot later by extending
 * content/maco.ts with an optional `media` field and swapping the
 * relevant <SurfaceMedia> for a real <video>/<picture> — nothing here
 * needs to change shape for that upgrade to be a one-file addition.
 */
export function SurfaceMedia({
  label,
  aspect = "16/10",
  className = "",
  style,
  children,
  shape = "rect",
}: Props) {
  const clipPath = CLIP_SHAPES[shape];
  return (
    <div
      className={`light-pass relative overflow-hidden ${clipPath ? "" : "rounded-2xl"} ${className}`}
      style={{
        aspectRatio: aspect,
        background:
          "linear-gradient(155deg, color-mix(in oklab, var(--text) 10%, var(--surface)) 0%, var(--surface) 45%, color-mix(in oklab, var(--text) 4%, var(--surface)) 100%)",
        border: clipPath ? "none" : "1px solid var(--line)",
        clipPath,
        ...style,
      }}
    >
      {children}
      <span className="label absolute bottom-4 left-4 right-4" style={{ color: "var(--muted)" }}>
        {label}
      </span>
    </div>
  );
}
