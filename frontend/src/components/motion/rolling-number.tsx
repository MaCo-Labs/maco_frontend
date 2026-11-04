import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * A count whose digits roll up like an odometer when scrolled into view. The
 * markup's resting state is the real number, so SSR and reduced motion show it
 * directly; only the JS "armed" state parks the columns at 0 first.
 */
export function RollingNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) {
      setArmed(false);
      return;
    }
    setArmed(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setArmed(false);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <span ref={ref} className="rolling-number" data-armed={armed || undefined}>
      <span className="sr-only">{value}</span>
      {[...value].map((digit, i) => (
        <span key={i} aria-hidden="true" className="rolling-window">
          <span
            className="rolling-column"
            style={{ transform: `translateY(${Number(digit) * -10}%)` }}
          >
            {"0123456789".split("").map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
