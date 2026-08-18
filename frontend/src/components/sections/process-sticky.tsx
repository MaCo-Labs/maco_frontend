import { useCallback, useEffect, useRef, useState } from "react";
import { process } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Step accent colors — each phase has its own visual identity */
const STEP_ACCENTS: Record<string, string> = {
  A: "oklch(0.6 0.12 264)",  // Cobalt — Scope
  B: "oklch(0.55 0.14 160)", // Emerald — Model
  C: "oklch(0.58 0.14 50)",  // Amber — Build
  D: "oklch(0.62 0.1 320)",  // Violet — Handover
};

/**
 * ProcessSticky — THE METHOD SPATIAL ENGINE.
 *
 * Each delivery phase has its own color accent and sculptural letter.
 * The stage uses a dark atmospheric surface to make the sequential
 * phases feel like chapters in a process document.
 * Vertical datum progress line tracks scroll in real time.
 */
export function ProcessSticky() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const update = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const view = window.innerHeight;
    const p = Math.min(1, Math.max(0, (view - rect.top) / (rect.height - view)));
    setScrollProgress(p);
    const idx = Math.min(process.length - 1, Math.floor(p * process.length * 0.99));
    setActive((prev) => (prev === idx ? prev : idx));
  }, []);

  useEffect(() => {
    if (reduced) return;
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reduced, update]);

  if (reduced) return <StaticProcess />;

  const total = process.length;
  const currentStep = process[active];
  const activeAccent = STEP_ACCENTS[currentStep.step] ?? "var(--accent)";

  return (
    <section
      ref={stageRef}
      className="process-sticky relative rule-b"
      style={{ height: `${total * 100}vh`, background: "var(--bg)" }}
      aria-label="How MaCo works"
    >
      <div
        className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {/* Architectural header */}
        <header
          className="z-20 flex items-center justify-between border-b px-6 py-4 lg:px-12"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-5">
            <span
              className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.22em] uppercase font-bold"
              style={{ color: activeAccent, transition: "color 0.7s" }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  background: activeAccent,
                  boxShadow: `0 0 6px ${activeAccent}`,
                  transition: "background 0.7s, box-shadow 0.7s",
                }}
              />
              05 — Delivery Methodology
            </span>
            <span className="hidden sm:inline-block font-mono text-[0.5625rem] tracking-[0.22em] text-muted uppercase">
              // Phase [{currentStep.step}] [{String(active + 1).padStart(2, "0")}/
              {String(total).padStart(2, "0")}]
            </span>
          </div>

          <span className="font-mono text-[0.5625rem] tracking-[0.2em] text-muted uppercase hidden sm:inline-block">
            Scroll to progress methodology
          </span>
        </header>

        {/* Ambient micro-grid */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
            backgroundSize: "5rem 5rem",
            opacity: 0.04,
          }}
        />

        {/* Central stage */}
        <div className="shell relative z-10 my-auto grid items-center gap-12 lg:grid-cols-12 lg:gap-16 py-8">
          {/* Left: Big letter + content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[0.5625rem] font-bold tracking-[0.22em] uppercase"
                style={{ color: activeAccent, transition: "color 0.7s" }}
              >
                PHASE 0{active + 1} //
              </span>
              <span className="font-mono text-[0.5rem] text-muted tracking-widest uppercase">
                {currentStep.title} STAGE
              </span>
            </div>

            <div className="relative mt-5 flex items-center" aria-hidden="true">
              {/* Giant sculptural step glyph */}
              <span
                className="select-none font-display font-extrabold leading-none transition-all duration-700"
                style={{
                  fontSize: "clamp(7rem, 18vw, 15rem)",
                  color: activeAccent,
                  opacity: 0.12,
                  transition: "color 0.7s, opacity 0.7s",
                }}
              >
                {currentStep.step}
              </span>
              <div className="absolute left-0 ml-[clamp(4.5rem,11vw,10rem)] pr-8">
                <h3
                  key={currentStep.step}
                  className="font-display font-bold tracking-[-0.045em]"
                  style={{
                    fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
                    animation: reduced ? "none" : "maco-rise 0.5s var(--ease-emphasis) both",
                  }}
                >
                  {currentStep.title}
                </h3>
                <p
                  key={`body-${currentStep.step}`}
                  className="mt-4 max-w-lg text-base sm:text-lg leading-relaxed text-muted"
                  style={{
                    animation: reduced ? "none" : "maco-rise 0.6s var(--ease-emphasis) both",
                  }}
                >
                  {currentStep.body}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Process sequence rail */}
          <div
            className="lg:col-span-5 border-t lg:border-t-0 lg:border-l pt-8 lg:pt-0 lg:pl-10"
            style={{ borderColor: "var(--line)" }}
          >
            <p className="font-mono text-[0.5625rem] tracking-[0.2em] uppercase font-bold text-muted mb-5">
              Delivery Sequence
            </p>
            <ol className="flex flex-col divide-y divide-line border-y border-line" aria-hidden="true">
              {process.map((p, i) => {
                const isCurrent = i === active;
                const isCompleted = i < active;
                const stepAccent = STEP_ACCENTS[p.step] ?? "var(--accent)";
                return (
                  <li
                    key={p.step}
                    className="flex items-center justify-between py-4 px-3 transition-all duration-500"
                    style={{
                      background: isCurrent ? `${stepAccent}08` : "transparent",
                      borderLeft: isCurrent ? `2px solid ${stepAccent}` : "2px solid transparent",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="font-display font-extrabold text-2xl leading-none transition-colors duration-500"
                        style={{
                          color: isCurrent
                            ? stepAccent
                            : isCompleted
                              ? "var(--text)"
                              : "var(--line)",
                        }}
                      >
                        {p.step}
                      </span>
                      <span
                        className="font-display font-semibold text-base tracking-tight"
                        style={{
                          color: isCurrent
                            ? "var(--text)"
                            : isCompleted
                              ? "var(--muted)"
                              : "var(--line)",
                        }}
                      >
                        {p.title}
                      </span>
                    </div>
                    <span
                      className="font-mono text-[0.5rem] uppercase tracking-wider"
                      style={{
                        color: isCurrent ? stepAccent : "var(--line)",
                      }}
                    >
                      {isCurrent ? "ACTIVE" : isCompleted ? "PASS" : "—"}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Progress laser bar */}
        <div
          className="relative z-20 w-full border-t"
          style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        >
          <div
            className="h-[2px] transition-all duration-300"
            style={{
              width: `${Math.max(2, scrollProgress * 100)}%`,
              background: activeAccent,
              boxShadow: `0 0 8px ${activeAccent}`,
              transition: "width 0.3s, background 0.7s, box-shadow 0.7s",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function StaticProcess() {
  return (
    <section className="rule-b py-16 lg:py-24 bg-bg" aria-label="How MaCo works">
      <div className="shell">
        <div className="flex items-end justify-between border-b border-line pb-6">
          <div>
            <p className="font-mono text-[0.625rem] tracking-[0.22em] uppercase text-accent font-bold">
              05 — Delivery Methodology
            </p>
            <h2
              className="font-display font-bold tracking-[-0.04em] mt-3"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
            >
              The Four Steps
            </h2>
          </div>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => {
            const accent = STEP_ACCENTS[p.step] ?? "var(--accent)";
            return (
              <div
                key={p.step}
                className="border bg-surface p-6 sm:p-8"
                style={{
                  borderColor: "var(--line)",
                  borderTop: `3px solid ${accent}`,
                }}
              >
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: accent }}
                >
                  PHASE 0{i + 1}
                </span>
                <div
                  className="font-display text-5xl font-extrabold mt-3 leading-none"
                  style={{ color: accent, opacity: 0.4 }}
                >
                  {p.step}
                </div>
                <h3 className="font-display text-xl font-bold mt-4">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
