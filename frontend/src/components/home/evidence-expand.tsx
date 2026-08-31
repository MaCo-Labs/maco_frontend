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
 * The frame is a real sized box (`width`/`height` written in `onUpdate`,
 * not a clip-path inset) locked to the video's own 16:9 aspect throughout,
 * with `mediaRef` gone — `SurfaceMedia`/`ProductVideo` mount directly
 * inside the frame, so `objectFit: "cover"` is a 1:1 fit and never crops.
 * `wMax` caps at 1024px — the source recording's own resolution, so the
 * frame never upscales past what's actually sharp.
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
  const scrimRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const captionInRef = useRef<HTMLParagraphElement>(null);
  const captionOutRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useScrollScene((rt) => {
    const section = sectionRef.current;
    const frame = frameRef.current;
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
        const wMax = Math.min(vw * 0.88, vh * 0.94 * (16 / 9), 1024);
        const w = lerp(wStart, wMax, e);
        const h = w * (9 / 16);
        const radius = lerp(32, 6, e);
        frame.style.width = `${w}px`;
        frame.style.height = `${h}px`;
        frame.style.borderRadius = `${radius}px`;
        frame.style.setProperty("--sweep", String(p));
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
      // z-[41]: one below the header's z-[42] (chrome.tsx) — the fixed
      // header stays on top of this pinned frame throughout the scrub.
      className="relative z-[41] h-screen overflow-hidden"
    >
      <p
        ref={captionInRef}
        className="label shell absolute left-0 right-0 top-10 z-10 text-center"
        style={{ color: "var(--muted)" }}
      >
        Bridge, in daily use
      </p>
      {/* opacity:0 is safe here: this caption is a big enhanced restatement
          of text SurfaceMedia already renders unconditionally (its own
          small `label`, always visible) — a blocked import loses the
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
        data-cursor="media"
        data-cursor-label="View"
        className="absolute left-1/2 top-1/2 overflow-hidden"
        style={{
          width: "36vw",
          height: "20.25vw",
          borderRadius: 32,
          transform: "translate(-50%, -50%)",
        }}
      >
        <SurfaceMedia
          label={caption}
          aspect="auto"
          className="h-full w-full rounded-none"
          style={{ aspectRatio: "auto", border: "none" }}
        >
          {bridge?.media && <ProductVideo media={bridge.media} priority="low" objectFit="cover" />}
        </SurfaceMedia>
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
