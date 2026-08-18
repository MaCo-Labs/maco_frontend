import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const TICKER_WORDS = [
  "START A PROJECT",
  "BRIEF US",
  "SEND THE PROBLEM",
  "BUILD SOMETHING REAL",
  "START A PROJECT",
  "BRIEF US",
  "SEND THE PROBLEM",
  "BUILD SOMETHING REAL",
];

/**
 * CTABanner — THE GRAND CLOSING STATEMENT.
 *
 * Full-bleed dark inverted finale. Oversized kinetic type, animated
 * background field, magnetic CTA button, and a scrolling ticker that
 * runs across the full width like a news-wire. The screen-filling dark
 * creates a cinematic contrast after the light sections above.
 */
export function CTABanner() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const btnRef = useRef<HTMLAnchorElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [magnetPos, setMagnetPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setMagnetPos({ x, y });
  };

  const handlePointerLeave = () => {
    setMagnetPos({ x: 0, y: 0 });
    setHovering(false);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "var(--surface-inverted)" }}
      aria-label="Start a project with MaCo"
    >
      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 120%, oklch(0.3 0.08 250 / 22%) 0%, transparent 70%)",
        }}
      />

      {/* Micro-grid field */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.98 0 0 / 4%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.98 0 0 / 4%) 1px, transparent 1px)",
          backgroundSize: "3.5rem 3.5rem",
        }}
      />

      {/* Top edge datum line */}
      <div
        className="h-px w-full"
        style={{ background: "var(--line-inverted)" }}
        aria-hidden="true"
      />

      {/* Scrolling ticker — runs full width */}
      <div
        className="overflow-hidden border-b"
        style={{ borderColor: "var(--line-inverted)" }}
        aria-hidden="true"
      >
        <div
          className="flex items-center gap-0 py-4 whitespace-nowrap"
          style={
            reduced
              ? {}
              : { animation: "maco-crawl-rtl 30s linear infinite" }
          }
        >
          {TICKER_WORDS.map((w, i) => (
            <span
              key={i}
              className="font-mono text-[0.6875rem] tracking-[0.28em] uppercase px-10"
              style={{ color: "var(--muted-inverted)" }}
            >
              {w}
              <span className="mx-10" style={{ color: "oklch(0.98 0 0 / 18%)" }}>
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Central content */}
      <div className="shell relative z-10 py-20 lg:py-32">
        {/* Section index */}
        <div className="flex items-center gap-3 mb-14">
          <span
            className="font-mono text-[0.625rem] tracking-[0.28em] uppercase"
            style={{ color: "var(--muted-inverted)" }}
          >
            07 — Next Step
          </span>
          <span
            className="h-px flex-1 max-w-[4rem]"
            style={{ background: "var(--line-inverted)" }}
          />
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "var(--accent-inverted)", animation: reduced ? "none" : "pulse 2s infinite" }}
          />
        </div>

        {/* Oversized heading */}
        <h2
          className="font-display font-extrabold tracking-[-0.05em] leading-[0.95]"
          style={{
            fontSize: "clamp(3.5rem, 9vw, 9rem)",
            color: "var(--text-inverted)",
          }}
        >
          {["Brief", "us", "on", "your"].map((word, i) => (
            <span
              key={word}
              className="inline-block mr-[0.22em]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(1.2em)",
                transition: reduced
                  ? "none"
                  : `opacity 0.8s var(--ease-emphasis) ${i * 0.1}s, transform 0.8s var(--ease-emphasis) ${i * 0.1}s`,
              }}
            >
              {word}
            </span>
          ))}
          <br />
          {["next", "system."].map((word, i) => (
            <span
              key={word}
              className="inline-block mr-[0.22em]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(1.2em)",
                transition: reduced
                  ? "none"
                  : `opacity 0.8s var(--ease-emphasis) ${0.42 + i * 0.1}s, transform 0.8s var(--ease-emphasis) ${0.42 + i * 0.1}s`,
                color:
                  word === "system."
                    ? "var(--muted-inverted)"
                    : "var(--text-inverted)",
              }}
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Body + CTA row */}
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p
              className="text-lg leading-relaxed max-w-md"
              style={{
                color: "var(--muted-inverted)",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(1.2em)",
                transition: reduced
                  ? "none"
                  : "opacity 0.8s var(--ease-emphasis) 0.65s, transform 0.8s var(--ease-emphasis) 0.65s",
              }}
            >
              Send the problem, the technical constraint, and the delivery
              timeline. We reply with engineered scope, not a generic sales deck.
            </p>

            {/* Three data points */}
            <div
              className="mt-10 flex flex-wrap items-center gap-10"
              style={{
                opacity: visible ? 1 : 0,
                transition: reduced
                  ? "none"
                  : "opacity 0.8s var(--ease-emphasis) 0.8s",
              }}
            >
              {[
                { v: "4", l: "Products Deployed" },
                { v: "5", l: "Service Disciplines" },
                { v: "2+", l: "Years Engineering" },
              ].map(({ v, l }) => (
                <div key={l}>
                  <p
                    className="font-display font-extrabold text-[2.5rem] leading-none tracking-[-0.04em]"
                    style={{ color: "var(--text-inverted)" }}
                  >
                    {v}
                  </p>
                  <p
                    className="font-mono text-[0.625rem] tracking-[0.18em] uppercase mt-1"
                    style={{ color: "var(--muted-inverted)" }}
                  >
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="lg:col-span-6 flex flex-col items-start lg:items-end gap-6"
            style={{
              opacity: visible ? 1 : 0,
              transition: reduced
                ? "none"
                : "opacity 0.8s var(--ease-emphasis) 0.9s",
            }}
          >
            {/* Primary CTA */}
            <Link
              ref={btnRef}
              to="/contact"
              onPointerMove={handlePointerMove}
              onPointerEnter={() => setHovering(true)}
              onPointerLeave={handlePointerLeave}
              style={{
                transform: `translate3d(${magnetPos.x}px, ${magnetPos.y}px, 0)`,
                transition: "transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)",
                background: hovering
                  ? "var(--text-inverted)"
                  : "oklch(0.98 0 0 / 0%)",
                border: "1.5px solid var(--accent-inverted)",
                color: hovering
                  ? "var(--surface-inverted)"
                  : "var(--text-inverted)",
                padding: "1.1rem 2.8rem",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase" as const,
                display: "inline-block",
              }}
            >
              Start a Project →
            </Link>

            {/* Secondary */}
            <Link
              to="/work"
              className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase"
              style={{
                color: "var(--muted-inverted)",
                borderBottom: "1px solid var(--line-inverted)",
                paddingBottom: "2px",
              }}
            >
              View selected work ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom oversized text crawl */}
      <div
        className="border-t overflow-hidden"
        style={{ borderColor: "var(--line-inverted)" }}
        aria-hidden="true"
      >
        <div
          className="flex whitespace-nowrap py-5 lg:py-7"
          style={
            reduced
              ? {}
              : { animation: "maco-crawl-ltr 38s linear infinite" }
          }
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="mr-24 font-display font-extrabold uppercase tracking-[-0.04em] select-none"
              style={{
                fontSize: "clamp(3rem, 7vw, 6.5rem)",
                color: "var(--text-inverted)",
                opacity: 0.05,
              }}
            >
              SOLUTIONS · TECHNOLOGY · GROWTH · MACO ·&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
