import { useId, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Media } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useOverlayMenu } from "@/hooks/use-overlay-menu";
import { EASE_EMPHASIS } from "@/lib/motion";

/**
 * Fullscreen expansion for a `ProductVideo` frame. Mounts its own
 * `<video>` against `media.feature` (the higher-res, audio-bearing encode
 * — see `scripts/build-media.mjs`) rather than promoting the scrub's own
 * element, which stays `aria-hidden`/`muted`/silent by design. Never
 * fetched until `open` is true, so the heavy encode costs nothing on
 * scroll.
 *
 * Scroll lock, Escape-to-close, and the Tab focus trap all come from
 * `useOverlayMenu` — the same hook the nav overlays use, not
 * video-specific in any way.
 */
export function VideoLightbox({
  media,
  alt,
  open,
  setOpen,
  triggerRef,
}: {
  media: Media;
  alt: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const reduced = useReducedMotion();
  const titleId = useId();
  useOverlayMenu({ open, setOpen, panelRef, triggerRef });

  const feature = media.feature ?? media.video;
  if (!feature) return null;

  const transition = reduced ? { duration: 0 } : { duration: 0.35, ease: EASE_EMPHASIS };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="video-lightbox"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          data-lenis-prevent
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-10"
          style={{
            background: "color-mix(in oklab, var(--bg) 8%, black 92%)",
            overscrollBehavior: "contain",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition }}
          exit={{ opacity: 0, transition }}
        >
          <h2 id={titleId} className="sr-only">
            {alt}
          </h2>
          <video
            ref={videoRef}
            aria-labelledby={titleId}
            controls
            playsInline
            autoPlay={!reduced}
            loop
            muted={muted}
            poster={media.poster}
            width={media.width}
            height={media.height}
            className="max-h-full max-w-full rounded-lg"
          >
            <source src={feature.webm} type="video/webm" />
            <source src={feature.mp4} type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="label absolute right-16 top-4 px-3 py-2 lg:right-20 lg:top-6"
            style={{
              background: "color-mix(in oklab, var(--bg) 72%, transparent)",
              color: "var(--text)",
              backdropFilter: "blur(6px)",
            }}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close video"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full lg:right-6 lg:top-6"
            style={{
              background: "color-mix(in oklab, var(--bg) 72%, transparent)",
              color: "var(--text)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
