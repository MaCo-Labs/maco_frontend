import type { Media } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * A real phone chassis around a looping screen recording — for products
 * that are mobile-only (a PWA with no desktop surface), where a flat
 * screenshot in a card doesn't read as "this is a phone app." The chassis
 * is a fixed graphite device, deliberately independent of the site's
 * light/dark ground (a phone mockup depicts a physical object, not site
 * chrome).
 *
 * The video is an always-on ambient loop (muted, autoplay, no controls) —
 * unlike `ProductVideo`'s conservative opt-in policy (poster + tap-to-play,
 * gated on pointer type/viewport/save-data), which exists for a full-size
 * "here's a recording, click if you want it" demo. A tiny device-screen
 * animation is closer to a moving photograph than a video a visitor
 * chooses to watch, so it just plays — except under reduced-motion, where
 * it never mounts and the poster frame stands in as a static screen.
 */
export function PhoneMockup({ screen, className = "" }: { screen: Media; className?: string }) {
  const reduced = useReducedMotion();
  const { width, height } = screen;

  return (
    <div className={`phone-mockup ${className}`}>
      <div className="phone-mockup__device">
        <div className="phone-mockup__notch" aria-hidden="true" />
        <div className="phone-mockup__screen">
          <img
            src={screen.poster}
            alt=""
            aria-hidden="true"
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {screen.video && !reduced && (
            <video
              aria-hidden="true"
              tabIndex={-1}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              poster={screen.poster}
              width={width}
              height={height}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={screen.video.webm} type="video/webm" />
              <source src={screen.video.mp4} type="video/mp4" />
            </video>
          )}
          <p className="sr-only">{screen.alt}</p>
        </div>
      </div>
    </div>
  );
}
