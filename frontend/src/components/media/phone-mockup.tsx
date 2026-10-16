import { useEffect, useRef, useState } from "react";
import type { Media } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { autoplayAllowed } from "@/components/media/product-video";
import { Iphone } from "@/components/media/iphone";

/** Real device capture in the Magic UI iPhone frame. Playback stops offscreen. */
export function PhoneMockup({ screen, className = "" }: { screen: Media; className?: string }) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [armed, setArmed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userStarted, setUserStarted] = useState(false);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting && autoplayAllowed(reduced)) setArmed(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [reduced]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      const canPlay =
        visible &&
        !paused &&
        document.visibilityState === "visible" &&
        (userStarted || autoplayAllowed(reduced));
      if (canPlay) video.play().catch(() => setPaused(true));
      else video.pause();
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [armed, visible, paused, reduced, userStarted]);
  return (
    <div
      ref={hostRef}
      className={"phone-mockup " + className}
      style={{ flexDirection: "column", alignItems: "center", gap: "1rem" }}
    >
      <Iphone screenColor="#10121c" className="phone-mockup-frame" style={{ maxWidth: "17.5rem" }}>
        <img
          src={screen.poster}
          alt={screen.alt}
          width={screen.width}
          height={screen.height}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-contain"
        />
        {screen.video && armed && (
          <video
            ref={videoRef}
            aria-hidden="true"
            tabIndex={-1}
            muted
            loop
            playsInline
            preload="metadata"
            poster={screen.poster}
            width={screen.width}
            height={screen.height}
            className="absolute inset-0 size-full object-contain"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={screen.video.webm} type="video/webm" />
            <source src={screen.video.mp4} type="video/mp4" />
          </video>
        )}
      </Iphone>
      {screen.video && (
        <button
          type="button"
          className="btn-line !min-h-11 !px-4 !py-2 !text-xs"
          onClick={() => {
            if (playing) setPaused(true);
            else {
              setUserStarted(true);
              setArmed(true);
              setPaused(false);
            }
          }}
          aria-label={playing ? "Pause product walkthrough" : "Play product walkthrough"}
        >
          {playing ? "Pause walkthrough" : "Play walkthrough"}
          <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
        </button>
      )}
    </div>
  );
}
