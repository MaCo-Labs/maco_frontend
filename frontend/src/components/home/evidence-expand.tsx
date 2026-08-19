import { useEffect, useRef } from "react";
import { getProduct } from "@/content/maco";
import { SurfaceMedia } from "@/components/media/surface-media";
import { ProductVideo } from "@/components/media/product-video";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getScrollRuntime } from "@/lib/scroll-runtime";
import { lerp } from "@/lib/motion";

/**
 * EVIDENCE — the homepage's one cinematic set-piece. A contained media
 * frame expands toward full viewport as you scroll: clip-path insets
 * shrink, the media inside counter-scales so it never resamples, and a
 * scrim deepens. Concept verified against React Bits' ScrollExpand
 * (MIT + Commons Clause, zero dependencies) and reimplemented here.
 *
 * Pin + scrub come from GSAP ScrollTrigger — it computes its own
 * pin-spacing, and `scrub` reads directly off Lenis-smoothed native
 * scroll. Progress is written straight to the frame's inline style in
 * `onUpdate`, never through React state — a full re-render per scroll
 * frame was the previous approach and is not free.
 *
 * The source recording is 1024x576 — deliberately NOT expanded to a
 * literal inset(0) full-bleed, which would upscale it ~1.5x on a 1440px
 * viewport and read as soft. The frame stops at inset(6%) instead (a
 * ~1.2x upscale, still sharp) and the scrim carries a little more of
 * the "fills the screen" feeling than a full-bleed frame would need.
 */
export function EvidenceExpand() {
  const bridge = getProduct("bridge");
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    const scrim = scrimRef.current;
    const caption = captionRef.current;
    if (!section || !frame) return;
    let cancelled = false;
    let trigger: { kill: () => void } | null = null;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      trigger = rt.ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          const inset = lerp(14, 6, p);
          const radius = lerp(28, 10, p);
          const scale = lerp(1.06, 1, p);
          frame.style.clipPath = `inset(${inset}% round ${radius}px)`;
          frame.style.setProperty("--sweep", String(p));
          if (media) media.style.transform = `scale(${scale})`;
          if (scrim) scrim.style.opacity = String(lerp(0.5, 0.22, p));
          if (caption) caption.style.opacity = String(1 - Math.min(1, p / 0.25));
        },
      });
      rt.scheduleRefresh();
    });

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [reduced]);

  const caption = bridge
    ? `${bridge.title} — ${bridge.short_description}`
    : "Bridge — MaCo's own product";

  if (reduced) {
    return (
      <section data-ground="deep" aria-label="Bridge in motion" className="shell py-24">
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
      className="relative h-screen overflow-hidden"
    >
      <p
        ref={captionRef}
        className="label shell absolute left-0 right-0 top-10 z-10 text-center"
        style={{ color: "var(--muted)" }}
      >
        Bridge, in daily use
      </p>

      <div
        ref={frameRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(14% round 28px)" }}
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
          style={{ background: "black", opacity: 0.5 }}
        />
      </div>
    </section>
  );
}
