import { useCallback, useEffect, useId, useMemo, useRef } from "react";
import { useScrollScene } from "@/hooks/use-scroll-scene";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface MaskedHeadingProps {
  /** Current line. Swapping this re-measures and re-clips — see the
   *  word-position effect below — so a parent can cycle taglines just by
   *  changing this prop; this component has no cycling logic of its own. */
  text: string;
  as?: "h1" | "h2";
  className?: string | undefined;
  videoWebm: string;
  videoMp4: string;
  poster: string;
}

/**
 * Heading text as a clip-path, with a video playing inside the
 * letterforms — reimplemented on this project's own stack (GSAP through
 * `useScrollScene`, `useReducedMotion`, real tokens) from the *technique*
 * a React Bits component demonstrates, per `AGENTS.md`'s "take the
 * concept, reimplement on the installed stack, never copy files" rule.
 * No new dependency: SVG `<clipPath>` + `<text>` is a standard technique,
 * not a library.
 *
 * The clip shape has to match real wrapped text, so each WORD gets its
 * own `<text>` glyph positioned off a hidden measuring span (`--measure`,
 * visible to assistive tech — `color: transparent` doesn't remove it from
 * the accessibility tree, so the heading always has its real accessible
 * name with no `aria-live` needed). That measuring pass re-runs on
 * mount, on resize, once web fonts finish loading, and whenever `text`
 * changes — a tagline swap is layout work, not just a repaint, since the
 * new line can wrap differently.
 *
 * Reduced motion / SSR / a blocked `getScrollRuntime()` import all render
 * the SAME settled state deliberately: full clip open, no idle drift, no
 * wipe. There's no separate "plain text" fallback here because there's
 * nothing text-only about this component to fall back to — `top-head.tsx`
 * itself is what decides whether to render `<MaskedHeading>` at all versus
 * the plain `display-glow` `<h1>`.
 */
export function MaskedHeading({
  text,
  as: Tag = "h1",
  className,
  videoWebm,
  videoMp4,
  poster,
}: MaskedHeadingProps) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const revealRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);

  const rawId = useId();
  const clipId = `mh-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const sync = useCallback(() => {
    const measure = measureRef.current;
    if (!measure) return;
    const cs = window.getComputedStyle(measure);
    for (let i = 0; i < wordRefs.current.length; i++) {
      const box = wordRefs.current[i];
      const base = baseRefs.current[i];
      const glyph = glyphRefs.current[i];
      if (!box || !base || !glyph) continue;
      glyph.setAttribute("x", String(box.offsetLeft));
      glyph.setAttribute("y", String(base.offsetTop));
      glyph.style.fontFamily = cs.fontFamily;
      glyph.style.fontSize = cs.fontSize;
      glyph.style.fontWeight = cs.fontWeight;
      glyph.style.letterSpacing = cs.letterSpacing;
    }
  }, []);

  useEffect(() => {
    sync();
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    document.fonts?.ready.then(sync).catch(() => {});
    return () => ro.disconnect();
    // `words` isn't read inside the effect body, but a tagline swap
    // changes how many <span>/<text> refs exist below — re-sync against
    // the new set.
  }, [sync, words]);

  // Wipe: the clip-path <span> (revealRef) scrubs from closed to open on
  // mount, and again — quickly, closed then open — every time `words`
  // changes, so a tagline swap reuses the exact same gesture as the
  // entrance rather than a different transition for "arriving" vs.
  // "changing". Skipped entirely under reduced motion: the ref stays at
  // its JSX inline style default (clip-path: inset(0), fully open), the
  // settled, designed end-state.
  useScrollScene(
    (rt) => {
      if (reduced) return;
      const reveal = revealRef.current;
      if (!reveal) return;
      rt.gsap.fromTo(
        reveal,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" },
      );
    },
    [words, reduced],
  );

  return (
    // `relative isolate` — defensive: keeps this component's own video
    // layer out of any ANCESTOR's blend-mode compositing (a `light-pass`
    // wrapper, for instance). Confirmed live that isolation alone does
    // NOT block a blend already reaching in from OUTSIDE an ancestor's
    // own isolated stacking context — TopHead actually dropped its
    // light-pass sweep entirely over this exact interaction (see
    // top-head.tsx's comment) rather than fight it further here. Left in
    // regardless: harmless, standards-correct, and real protection for
    // any future call site that ISN'T nested inside something already
    // isolating a blend above it.
    <Tag
      ref={rootRef as never}
      className={`relative isolate ${className ?? ""}`}
      style={{ isolation: "isolate" }}
    >
      <span ref={measureRef} aria-hidden="false" style={{ color: "transparent" }}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
            <i
              ref={(el) => {
                baseRefs.current[i] = el;
              }}
              style={{ display: "inline-block", width: 0, height: 0 }}
            />
          </span>
        ))}
      </span>

      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {words.map((word, i) => (
              <text
                key={`${word}-${i}`}
                ref={(el) => {
                  glyphRefs.current[i] = el;
                }}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {word}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span
        ref={revealRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: "inset(0 0% 0 0)" }}
      >
        <span
          className="hero-mask-media pointer-events-none absolute inset-0 block"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <video
            className="hero-mask-video h-full w-full object-cover"
            src={videoMp4}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoWebm} type="video/webm" />
          </video>
        </span>
      </span>
    </Tag>
  );
}
