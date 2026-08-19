import type { CSSProperties, ReactNode } from "react";

type Props = {
  /** What this slot is standing in for — shown as a quiet caption, never hidden. */
  label: string;
  aspect?: string;
  className?: string;
  style?: CSSProperties | undefined;
  children?: ReactNode;
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
export function SurfaceMedia({ label, aspect = "16/10", className = "", style, children }: Props) {
  return (
    <div
      className={`light-pass relative overflow-hidden rounded-2xl ${className}`}
      style={{
        aspectRatio: aspect,
        background:
          "linear-gradient(155deg, color-mix(in oklab, var(--text) 10%, var(--surface)) 0%, var(--surface) 45%, color-mix(in oklab, var(--text) 4%, var(--surface)) 100%)",
        border: "1px solid var(--line)",
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
