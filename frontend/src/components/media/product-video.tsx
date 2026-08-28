import { useEffect, useRef, useState } from "react";
import type { Media } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Priority = "high" | "auto" | "low";

type Props = {
  media: Media;
  /** LCP hint on the poster. "high" only if this instance is the LCP candidate. */
  priority?: Priority;
  objectFit?: "cover" | "contain";
  /** Radius on the <video>/<img> themselves — a transformed ancestor's
   *  border-radius does not reliably clip <video> in every engine. */
  radius?: string;
  className?: string;
};

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

function autoplayAllowed(reduced: boolean): boolean {
  if (reduced) return false;
  if (typeof window === "undefined") return false;
  if (!window.matchMedia("(pointer: fine)").matches) return false; // no touch-primary
  if (!window.matchMedia("(min-width: 768px)").matches) return false; // no small screens
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /^(slow-2g|2g)$/.test(conn.effectiveType)) return false;
  return true;
}

/**
 * A real product recording, poster-first. The <picture> is the only thing
 * on the critical path — the <video> is a progressive enhancement over it,
 * never fetched (preload="none", no <source> at all) until it is armed by
 * either scrolling into view on a capable device, or a user pressing play.
 *
 * Never autoplays on touch-primary devices, narrow viewports, saveData, or
 * a throttled connection — those get the poster plus an explicit control.
 * Under prefers-reduced-motion, same thing: poster + control, no autoplay.
 */
export function ProductVideo({
  media,
  priority = "auto",
  objectFit = "cover",
  radius,
  className = "",
}: Props) {
  const { width, height } = media;
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [auto, setAuto] = useState(false);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userWants, setUserWants] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const evaluate = () => setAuto(autoplayAllowed(reduced));
    evaluate();
    const mqs = [window.matchMedia("(pointer: fine)"), window.matchMedia("(min-width: 768px)")];
    mqs.forEach((m) => m.addEventListener("change", evaluate));
    return () => mqs.forEach((m) => m.removeEventListener("change", evaluate));
  }, [reduced]);

  // Arm (start fetching) generously before it's on screen; play only when
  // it's meaningfully visible. Two thresholds on one observer is enough
  // here — the fetch/play gap this section needs isn't large.
  useEffect(() => {
    const el = hostRef.current;
    if (!el || !media.video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && auto) setArmed(true);
        setVisible(entry.intersectionRatio >= 0.35);
      },
      { rootMargin: "300px 0px", threshold: [0, 0.35, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [auto, media.video]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== "visible") videoRef.current?.pause();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const wantsPlay = (auto || userWants) && visible && !blocked;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !armed) return;
    if (wantsPlay) {
      if (el.paused) {
        el.play().catch(() => setBlocked(true));
      }
    } else if (!el.paused) {
      el.pause();
    }
  }, [armed, wantsPlay]);

  const arm = () => {
    setArmed(true);
    setUserWants(true);
    setBlocked(false);
  };

  const showControl = !media.video || !playing;

  return (
    <div ref={hostRef} data-media="video" className={`absolute inset-0 ${className}`}>
      <picture>
        {media.poster.endsWith(".jpg") && (
          <>
            <source srcSet={media.poster.replace(/\.jpg$/, ".avif")} type="image/avif" />
            <source srcSet={media.poster.replace(/\.jpg$/, ".webp")} type="image/webp" />
          </>
        )}
        <img
          src={media.poster}
          alt={media.video ? "" : media.alt}
          aria-hidden={media.video ? "true" : undefined}
          width={width}
          height={height}
          decoding="async"
          loading={priority === "low" ? "lazy" : "eager"}
          fetchPriority={priority}
          className="absolute inset-0 h-full w-full"
          style={{
            objectFit,
            borderRadius: radius,
            opacity: playing ? 0 : 1,
            transition: "opacity 0.3s var(--ease-standard)",
          }}
        />
      </picture>

      {media.video && (
        <video
          ref={videoRef}
          aria-hidden="true"
          tabIndex={-1}
          muted
          playsInline
          loop
          preload="none"
          disablePictureInPicture
          width={width}
          height={height}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedData={() => document.dispatchEvent(new CustomEvent("maco:media-ready"))}
          onError={() => {
            setPlaying(false);
            setBlocked(true);
          }}
          className="absolute inset-0 h-full w-full"
          style={{ objectFit, borderRadius: radius }}
        >
          {armed && <source src={media.video.webm} type="video/webm" />}
          {armed && <source src={media.video.mp4} type="video/mp4" />}
        </video>
      )}

      {media.video && showControl && (
        <button
          type="button"
          onPointerDown={arm}
          onClick={arm}
          className="absolute inset-0 grid place-items-center"
          style={{ borderRadius: radius }}
        >
          <span className="sr-only">
            {blocked ? "Play the recording (autoplay was blocked)" : "Play the recording"}
          </span>
          <span
            aria-hidden="true"
            className="grid h-14 w-14 place-items-center rounded-full text-lg"
            style={{
              background: "color-mix(in oklab, var(--bg) 72%, transparent)",
              border: "1px solid var(--line-strong)",
              color: "var(--text)",
              backdropFilter: "blur(6px)",
            }}
          >
            ▶
          </span>
        </button>
      )}

      {media.video && playing && (
        <button
          type="button"
          onClick={() => {
            setUserWants(false);
            videoRef.current?.pause();
          }}
          className="label absolute bottom-3 right-3 px-2 py-1"
          style={{
            background: "color-mix(in oklab, var(--bg) 60%, transparent)",
            color: "var(--text)",
          }}
        >
          Pause
        </button>
      )}

      {media.note && (
        <span
          className="label absolute bottom-3 left-3 right-3 px-2 py-1"
          style={{
            background: "color-mix(in oklab, var(--bg) 72%, transparent)",
            color: "var(--muted)",
            backdropFilter: "blur(6px)",
          }}
        >
          {media.note}
        </span>
      )}

      <p className="sr-only">{media.alt}</p>
    </div>
  );
}
