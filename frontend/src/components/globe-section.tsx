import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Hub } from "@/components/hero/MaCoGlobe";

const MaCoGlobe = lazy(() =>
  import("@/components/hero/MaCoGlobe").then((m) => ({ default: m.MaCoGlobe })),
);

const HOLD_MS = 5500;
const RESUME_AFTER_MS = 9000;

/** MaCo's real operational hubs. Kochi first: every arc starts from it. */
const HUBS: readonly (Hub & { region: string; zone: string })[] = [
  { name: "Kochi", region: "Kerala, India", zone: "Asia/Kolkata", lat: 9.9312, lng: 76.2673 },
  {
    name: "Bangalore",
    region: "Karnataka, India",
    zone: "Asia/Kolkata",
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    name: "Chennai",
    region: "Tamil Nadu, India",
    zone: "Asia/Kolkata",
    lat: 13.0827,
    lng: 80.2707,
  },
  { name: "Qatar", region: "Middle East", zone: "Asia/Qatar", lat: 25.3176, lng: 51.1887 },
  { name: "Dubai", region: "UAE", zone: "Asia/Dubai", lat: 25.2048, lng: 55.2708 },
];

const localTime = (zone: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: zone }).format(
    new Date(),
  );

/**
 * Hub list plus the dotted globe. The list is the real control: it works by
 * keyboard, and alone if WebGL is missing. The globe chunk loads only as the
 * section approaches, so it never competes with the page's first paint, and it
 * stays client-only because `three` has no business in the server render.
 */
export function GlobeSection({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const [failed, setFailed] = useState(false);
  const [times, setTimes] = useState<string[] | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const holdUntil = useRef(0);
  const inView = useRef(false);

  const hold = () => {
    holdUntil.current = performance.now() + RESUME_AFTER_MS;
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry?.isIntersecting ?? false;
        if (inView.current) setNear(true);
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setTimes(HUBS.map((h) => localTime(h.zone)));
    update();
    const clock = setInterval(update, 20000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const tour = setInterval(() => {
      if (!inView.current || document.hidden || performance.now() < holdUntil.current) return;
      setActive((a) => (a + 1) % HUBS.length);
    }, HOLD_MS);
    return () => clearInterval(tour);
  }, [reduced]);

  return (
    <div ref={rootRef} className="hub-globe">
      <div className="hub-globe-copy">{children}</div>
      <div className="hub-globe-visual" aria-hidden={failed || undefined}>
        {near && !failed && (
          <Suspense fallback={null}>
            <MaCoGlobe
              hubs={HUBS}
              active={active}
              reducedMotion={reduced}
              onPick={(i) => {
                hold();
                setActive(i);
              }}
              onInteract={hold}
              onFail={() => setFailed(true)}
            />
          </Suspense>
        )}
      </div>
      <ul className="hub-list" aria-label="MaCo operational hubs">
        {HUBS.map((hub, i) => (
          <li key={hub.name}>
            <button
              type="button"
              aria-pressed={active === i}
              className="hub-row"
              onClick={() => {
                hold();
                setActive(i);
              }}
              onFocus={hold}
            >
              <span className="hub-row-name">{hub.name}</span>
              <span className="hub-row-region">{hub.region}</span>
              <span className="hub-row-time">
                {times?.[i] && (
                  <>
                    <span className="sr-only">Local time </span>
                    {times[i]}
                  </>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
