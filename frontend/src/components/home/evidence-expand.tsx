import { useRef } from "react";
import { getProduct } from "@/content/maco";
import { SurfaceMedia } from "@/components/media/surface-media";
import { ProductVideo } from "@/components/media/product-video";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollScene } from "@/hooks/use-scroll-scene";
import { usePointerField } from "@/hooks/use-pointer-field";
import { lerp, smootherstep, clamp01 } from "@/lib/motion";

/**
 * EVIDENCE — the homepage's one cinematic set-piece. A contained media
 * frame rises out of the ground and opens until it dominates the room,
 * then names itself: the only real footage on the site (a screen
 * recording of Bridge in daily use, 1024x576) gets the page's most
 * expensive moment.
 *
 * The frame stays LOCKED to the video's own 16:9 aspect throughout —
 * computed in pixels (width/height), not a uniform inset(). A uniform
 * inset() on a 900px-tall viewport produces a box matching the
 * VIEWPORT's aspect ratio, not the video's; with `objectFit: "cover"`
 * that crops real content off the sides, and the previous inset(14%)-to-
 * inset(6%) range grew the frame only ~22% linearly (0.21px of growth
 * per pixel scrolled) — a full 1080px of pinned scroll for a change that
 * barely reads. Locked to 16:9, the frame here grows from a small panel
 * to ~88vw and the upscale stays capped at 1.24x of the source (still
 * sharp), because the growth is real width, not a shape distortion.
 *
 * Pin + scrub come from GSAP ScrollTrigger — it computes its own
 * pin-spacing, and `scrub` reads directly off Lenis-smoothed native
 * scroll. Progress is written straight to the frame's inline style in
 * `onUpdate`, never through React state.
 */
export function EvidenceExpand() {
  const bridge = getProduct("bridge");
  // Dual-purposed like work-sequence.tsx's railRef: the pin's own trigger
  // target AND the pointer field the vignette's centre reads from —
  // usePointerField already bails under a coarse pointer and resets to
  // 0.5/0.5 on leave, so there is no separate touch branch to maintain.
  const sectionRef = usePointerField<HTMLDivElement>();
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const captionInRef = useRef<HTMLParagraphElement>(null);
  const captionOutRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useScrollScene((rt) => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    const scrim = scrimRef.current;
    const vignette = vignetteRef.current;
    const captionIn = captionInRef.current;
    const captionOut = captionOutRef.current;
    if (!section || !frame) return;

    rt.ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=160%",
      pin: true,
      anticipatePin: 1,
      scrub: 0.3,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const e = smootherstep(p);
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // Aspect-locked: w/h always stay 16:9, so clip-path insets are
        // never uniform (x and y differ) except by coincidence of the
        // viewport's own ratio.
        const wStart = Math.min(vw * 0.56, vh * 0.5 * (16 / 9));
        const wMax = Math.min(vw * 0.88, vh * 0.94 * (16 / 9), 1280);
        const w = lerp(wStart, wMax, e);
        const h = w * (9 / 16);
        const insetX = ((vw - w) / 2 / vw) * 100;
        const insetY = ((vh - h) / 2 / vh) * 100;
        const radius = lerp(32, 6, e);
        frame.style.clipPath = `inset(${insetY}% ${insetX}% round ${radius}px)`;
        frame.style.setProperty("--sweep", String(p));
        if (media) media.style.transform = `scale(${lerp(1.1, 1, e)})`;
        if (scrim) scrim.style.opacity = String(lerp(0.62, 0.1, e));
        // Above ~1600px viewport width, wMax caps out (the 1024px source
        // can only grow so far before it stops looking sharp) — hand the
        // remaining progress to the scrim/vignette instead, so the ROOM
        // keeps closing in even once the frame itself stops growing.
        if (vignette) {
          const wide = vw > 1600 ? clamp01((p - 0.72) / 0.28) : 0;
          vignette.style.opacity = String(lerp(0, 0.45, e) + wide * 0.25);
        }
        // Two acts, so no stretch of the pin is dead: the entry caption
        // leaves first, then the real description arrives under the
        // now-open frame — never both at once, never a silent gap.
        if (captionIn) captionIn.style.opacity = String(1 - clamp01(p / 0.18));
        if (captionOut) {
          const out = clamp01((p - 0.72) / 0.23);
          captionOut.style.opacity = String(out);
          captionOut.style.transform = `translate3d(0, ${(1 - out) * 1.5}rem, 0)`;
        }
      },
    });
  }, []);

  const caption = bridge
    ? `${bridge.title} — ${bridge.short_description}`
    : "Bridge — MaCo's own product";

  if (reduced) {
    return (
      <section data-ground="deep" aria-label="Bridge in motion" className="shell cb-section">
        {bridge?.media ? (
          <div
            className="relative overflow-hidden rounded-2xl border border-line"
            style={{ aspectRatio: "16/9" }}
          >
            <ProductVideo media={bridge.media} priority="low" objectFit="cover" />
          </div>
        ) : (
          <SurfaceMedia label={caption} aspect="16/9" />
        )}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-ground="deep"
      aria-label="Bridge in motion"
      // z-[41]: see the matching comment in open-logo.tsx — keeps the pinned
      // frame above the sticky header instead of behind it.
      className="relative z-[41] h-screen overflow-hidden"
    >
      <p
        ref={captionInRef}
        className="label shell absolute left-0 right-0 top-10 z-10 text-center"
        style={{ color: "var(--muted)" }}
      >
        Bridge, in daily use
      </p>
      {/* opacity:0 is safe here, unlike method-line's earlier bug: this
          caption is a big enhanced restatement of text SurfaceMedia
          already renders unconditionally (its own small `label`, always
          visible, clip-path notwithstanding) — a blocked import loses the
          enhancement, not the content. */}
      <p
        ref={captionOutRef}
        className="lead shell absolute bottom-14 left-0 right-0 z-10 text-center"
        style={{ color: "var(--text)", opacity: 0 }}
      >
        {caption}
      </p>

      <div
        ref={frameRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(22% 32% round 32px)" }}
      >
        <div ref={mediaRef} className="absolute inset-0">
          <SurfaceMedia
            label={caption}
            aspect="auto"
            className="h-full w-full rounded-none"
            style={{ aspectRatio: "auto", border: "none" }}
          >
            {bridge?.media && (
              <ProductVideo media={bridge.media} priority="low" objectFit="cover" />
            )}
          </SurfaceMedia>
        </div>
        <div
          ref={scrimRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "black", opacity: 0.62 }}
        />
      </div>
      <div
        ref={vignetteRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          // Centre follows --px/--py (inherited from sectionRef's pointer
          // field) instead of sitting fixed at 50% 50% — a still frame
          // while pinned otherwise has nothing left to respond to input.
          background:
            "radial-gradient(circle at calc(var(--px, 0.5) * 100%) calc(var(--py, 0.5) * 100%), transparent 40%, black 100%)",
          opacity: 0,
        }}
      />
    </section>
  );
}
