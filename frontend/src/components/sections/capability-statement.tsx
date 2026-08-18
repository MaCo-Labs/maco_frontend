import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const WORDS = [
  "SCHEMA",
  "ADMIN",
  "DEPLOYMENT",
  "SYSTEM",
  "FOUNDATION",
  "ARCHITECTURE",
  "OPERATIONS",
];

/**
 * CapabilityStatement — FULL-BLEED TYPOGRAPHIC EVENT.
 *
 * A cinematic, full-width editorial statement. Oversized crawl text breaks
 * out of the shell container. Scroll-triggered letter reveals. Dark inverted
 * stage to break the light-canvas sequence — the first visual surprise.
 */
export function CapabilityStatement() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  // Intersection observer for reveal trigger
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  // Cycle the kinetic word
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 1800);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "var(--surface-inverted)" }}
      aria-label="Core capability doctrine"
    >
      {/* Architectural grid on dark surface */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.98 0 0 / 5%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.98 0 0 / 5%) 1px, transparent 1px)",
          backgroundSize: "5rem 5rem",
        }}
      />

      {/* Oversized crawl text — bleeds edge to edge */}
      <div
        className="relative overflow-hidden border-b"
        style={{ borderColor: "var(--line-inverted)" }}
        aria-hidden="true"
      >
        <div
          className="flex whitespace-nowrap py-6 lg:py-8"
          style={
            reduced
              ? {}
              : { animation: "maco-crawl-ltr 28s linear infinite" }
          }
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="mr-24 font-display font-extrabold uppercase tracking-[-0.04em] select-none"
              style={{
                fontSize: "clamp(3.5rem, 9vw, 8rem)",
                color: "var(--text-inverted)",
                opacity: 0.08,
              }}
            >
              MaCo · Software & IT Solutions · Engineering · Systems ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Central statement */}
      <div className="shell relative z-10 py-20 lg:py-32">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-12">
          <span
            className="h-px flex-1 max-w-[3rem]"
            style={{ background: "var(--line-inverted)" }}
          />
          <span
            className="font-mono text-[0.625rem] tracking-[0.28em] uppercase"
            style={{ color: "var(--muted-inverted)" }}
          >
            01 — Doctrine
          </span>
        </div>

        {/* Main statement — animated word-by-word */}
        <h2
          className="font-display font-bold leading-[1.06] tracking-[-0.04em] max-w-6xl"
          style={{
            fontSize: "clamp(2.25rem, 5.5vw, 5rem)",
            color: "var(--text-inverted)",
          }}
        >
          {["We", "engineer", "the", "parts", "that", "stay:"].map(
            (word, i) => (
              <span
                key={word + i}
                className="inline-block mr-[0.32em]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(1.4em)",
                  transition: reduced
                    ? "none"
                    : `opacity 0.7s var(--ease-emphasis) ${i * 0.08}s, transform 0.7s var(--ease-emphasis) ${i * 0.08}s`,
                }}
              >
                {word}
              </span>
            )
          )}
          <br />
          {/* Kinetic cycling word */}
          <span
            className="inline-block relative"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(1.4em)",
              transition: reduced
                ? "none"
                : "opacity 0.7s var(--ease-emphasis) 0.5s, transform 0.7s var(--ease-emphasis) 0.5s",
            }}
          >
            <span
              className="inline-block"
              style={{
                color: "var(--accent-inverted)",
                borderBottom: "2px solid var(--accent-inverted)",
                paddingBottom: "0.08em",
              }}
            >
              <span
                key={wordIndex}
                style={{
                  display: "inline-block",
                  animation: reduced
                    ? "none"
                    : "maco-rise 0.35s var(--ease-emphasis) both",
                }}
              >
                {WORDS[wordIndex]}
              </span>
            </span>
            ,
          </span>
          {" "}
          {["the", "admin,", "the", "deployment", "path,"].map((word, i) => (
            <span
              key={word + i}
              className="inline-block mr-[0.32em]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(1.4em)",
                transition: reduced
                  ? "none"
                  : `opacity 0.7s var(--ease-emphasis) ${0.55 + i * 0.08}s, transform 0.7s var(--ease-emphasis) ${0.55 + i * 0.08}s`,
                color: "var(--muted-inverted)",
              }}
            >
              {word}
            </span>
          ))}
          <br />
          <span
            className="inline-block"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(1.4em)",
              transition: reduced
                ? "none"
                : "opacity 0.7s var(--ease-emphasis) 0.95s, transform 0.7s var(--ease-emphasis) 0.95s",
              color: "var(--muted-inverted)",
            }}
          >
            and the person who answers when it breaks.
          </span>
        </h2>

        {/* Metadata row */}
        <div
          className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t pt-6"
          style={{ borderColor: "var(--line-inverted)" }}
        >
          <p
            className="font-mono text-[0.6875rem] leading-relaxed max-w-sm"
            style={{ color: "var(--muted-inverted)" }}
          >
            Software survives on its foundation, not on its pitch deck.
            That foundation is what MaCo builds.
          </p>
          <div className="flex items-center gap-6">
            {["Websites", "Apps", "Platforms", "Support"].map((cap) => (
              <span
                key={cap}
                className="font-mono text-[0.6875rem] tracking-[0.18em] uppercase"
                style={{ color: "var(--muted-inverted)" }}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
