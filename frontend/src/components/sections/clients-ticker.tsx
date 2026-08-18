import { useEffect, useRef, useState } from "react";
import { clients } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * ClientsTicker — AMBIENT VERIFICATION STRIP.
 *
 * No section header box. No generic white card. Just a raw,
 * editorial, full-bleed tape of real client names scrolling
 * at two different speeds — creating a layered spatial depth.
 * Light, restrained, ambient. Not a hero. Just evidence.
 */
export function ClientsTicker() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  // Two separate rails at different speeds
  const rail1 = [...clients, ...clients, ...clients, ...clients];
  const rail2 = [...clients].reverse().concat([...clients].reverse(), [...clients].reverse(), [...clients].reverse());

  return (
    <section
      ref={sectionRef}
      className="rule-b relative overflow-hidden bg-bg"
      aria-label="Clients"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      {/* Editorial label — left-aligned, no heading box */}
      <div
        className="shell flex items-center gap-4 mb-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(1rem)",
          transition: reduced ? "none" : "opacity 0.7s var(--ease-emphasis), transform 0.7s var(--ease-emphasis)",
        }}
      >
        <span
          className="inline-block h-px"
          style={{ width: "3rem", background: "var(--line-strong)" }}
        />
        <p className="font-mono text-[0.625rem] tracking-[0.28em] uppercase text-muted">
          06 — Client Partnerships
        </p>
        <span className="font-mono text-[0.625rem] text-muted">·</span>
        <p className="font-mono text-[0.625rem] tracking-[0.18em] uppercase text-muted">
          Verified record
        </p>
      </div>

      {/* Statement line */}
      <div
        className="shell mb-10"
        style={{
          opacity: visible ? 1 : 0,
          transition: reduced ? "none" : "opacity 0.7s var(--ease-emphasis) 0.15s",
        }}
      >
        <p
          className="font-display font-bold tracking-[-0.03em] text-text"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
        >
          Organizations that rely on MaCo.
        </p>
      </div>

      {/* Rail 1 — moves left slowly */}
      <div className="overflow-hidden mb-px border-y border-line">
        <div
          className="flex items-center whitespace-nowrap py-5 gap-0"
          style={reduced ? {} : { animation: "maco-crawl-ltr 22s linear infinite" }}
          aria-hidden="true"
        >
          {rail1.map((c, i) => (
            <span key={`r1-${i}`} className="flex items-center shrink-0">
              <span
                className="font-display font-bold tracking-[-0.02em] px-8 select-none"
                style={{
                  fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                  color: "var(--text)",
                }}
              >
                {c.name}
              </span>
              <span
                className="text-muted select-none shrink-0"
                style={{ fontSize: "0.5rem" }}
              >
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Rail 2 — moves right, smaller / muted */}
      <div className="overflow-hidden border-b border-line">
        <div
          className="flex items-center whitespace-nowrap py-3 gap-0"
          style={reduced ? {} : { animation: "maco-crawl-rtl 34s linear infinite" }}
          aria-hidden="true"
        >
          {rail2.map((c, i) => (
            <span key={`r2-${i}`} className="flex items-center shrink-0">
              <span
                className="font-mono tracking-[0.18em] uppercase px-8 select-none text-muted"
                style={{ fontSize: "0.625rem" }}
              >
                {c.industry}
              </span>
              <span className="text-line select-none shrink-0 text-[0.4rem]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Real list for a11y */}
      <ul className="sr-only">
        {clients.map((c) => (
          <li key={c.slug}>{c.name} — {c.industry}</li>
        ))}
      </ul>
    </section>
  );
}
