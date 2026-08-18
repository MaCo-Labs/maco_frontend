import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { products, type Product } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * ProductsSection — FLAGSHIP PRODUCT SURFACES.
 *
 * Bridge receives a full-bleed, dark inverted treatment — it feels like
 * opening the actual application. Driver's Diary is an editorial horizontal
 * card with a clean operational aesthetic.
 *
 * Bridge: dark stage, simulated UI chrome, live status indicator, feature
 * matrix with animated highlight on hover.
 * Driver's Diary: compact, restrained, supported product.
 */
export function ProductsSection() {
  const reduced = useReducedMotion();
  const bridge = products.find((p) => p.slug === "bridge");
  const driversDiary = products.find((p) => p.slug === "drivers-diary");

  return (
    <section className="relative bg-bg" aria-label="Products">
      {/* Bridge Flagship — dark, immersive */}
      {bridge && <BridgeFlagshipStage product={bridge} reduced={reduced} />}

      {/* Driver's Diary — light, compact */}
      {driversDiary && (
        <div
          className="border-t"
          style={{ borderColor: "var(--line)" }}
        >
          <DriverDiaryStage product={driversDiary} reduced={reduced} />
        </div>
      )}
    </section>
  );
}

function BridgeFlagshipStage({
  product,
  reduced,
}: {
  product: Product;
  reduced: boolean;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [spotlight, setSpotlight] = useState<{ x: number; y: number; opacity: number }>({
    x: 50, y: 50, opacity: 0,
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduced) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const handlePointerMove = (e: ReactPointerEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, opacity: 1 });
  };

  const handlePointerLeave = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden"
      style={{ background: "var(--surface-inverted)" }}
    >
      {/* Micro-grid field */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.98 0 0 / 4%) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.98 0 0 / 4%) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      {/* Pointer glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        aria-hidden="true"
        style={{
          opacity: spotlight.opacity * 0.7,
          background: `radial-gradient(600px circle at ${spotlight.x}% ${spotlight.y}%, oklch(0.55 0.14 264 / 15%), transparent 65%)`,
        }}
      />

      {/* Top datum */}
      <div
        className="h-px w-full"
        style={{ background: "var(--line-inverted)" }}
        aria-hidden="true"
      />

      <div className="shell relative z-10 py-20 lg:py-28">
        {/* Section eyebrow */}
        <div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b pb-8"
          style={{ borderColor: "var(--line-inverted)" }}
        >
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(2rem)",
              transition: reduced
                ? "none"
                : "opacity 0.7s var(--ease-emphasis), transform 0.7s var(--ease-emphasis)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  background: "var(--accent-inverted)",
                  animation: reduced ? "none" : "pulse 2s infinite",
                }}
              />
              <span
                className="font-mono text-[0.625rem] tracking-[0.22em] uppercase font-bold"
                style={{ color: "var(--accent-inverted)" }}
              >
                03 — Products & Platforms
              </span>
            </div>
            <h2
              className="font-display font-bold tracking-[-0.04em] mt-4"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
                color: "var(--text-inverted)",
              }}
            >
              Software we engineered
              <br />
              <span style={{ color: "var(--muted-inverted)" }}>and own.</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase shrink-0"
            style={{
              color: "var(--muted-inverted)",
              borderBottom: "1px solid var(--line-inverted)",
              paddingBottom: "2px",
            }}
          >
            All products catalog →
          </Link>
        </div>

        {/* Bridge flagship grid */}
        <div
          className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16 items-start"
          style={{
            opacity: visible ? 1 : 0,
            transition: reduced
              ? "none"
              : "opacity 0.8s var(--ease-emphasis) 0.2s",
          }}
        >
          {/* Left: Identity */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            {/* Live status bar */}
            <div
              className="flex items-center justify-between border px-5 py-3"
              style={{ borderColor: "var(--line-inverted)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-emerald-400"
                  style={{ animation: reduced ? "none" : "pulse 2s infinite" }}
                />
                <span
                  className="font-mono text-[0.5625rem] tracking-[0.2em] uppercase"
                  style={{ color: "var(--muted-inverted)" }}
                >
                  PRODUCTION LIVE
                </span>
              </div>
              <span
                className="font-mono text-[0.5625rem] tracking-[0.2em] uppercase"
                style={{ color: "var(--muted-inverted)" }}
              >
                MACO OWNED
              </span>
            </div>

            <div>
              <span
                className="font-mono text-[0.625rem] tracking-[0.2em] uppercase"
                style={{ color: "var(--muted-inverted)" }}
              >
                Flagship Product // 01
              </span>
              <h3
                className="font-display font-extrabold tracking-[-0.05em] mt-2"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  color: "var(--text-inverted)",
                  lineHeight: 1,
                }}
              >
                {product.title}
              </h3>
              <p
                className="mt-5 text-base leading-relaxed"
                style={{ color: "var(--muted-inverted)" }}
              >
                {product.positioning}
              </p>
            </div>

            <div
              className="border-l-2 pl-4 py-2"
              style={{ borderColor: "oklch(0.55 0.14 264)" }}
            >
              <p
                className="font-mono text-[0.5625rem] tracking-[0.18em] uppercase mb-1"
                style={{ color: "var(--muted-inverted)" }}
              >
                Core Problem Solved
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--text-inverted)" }}
              >
                {product.problem}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="border px-5 py-3 font-mono text-[0.625rem] tracking-[0.2em] uppercase font-bold transition-all duration-300"
                style={{
                  borderColor: "var(--accent-inverted)",
                  color: "var(--accent-inverted)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "oklch(0.98 0 0 / 8%)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                Product overview →
              </Link>
              <a
                href={product.live_url}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[0.625rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-70"
                style={{
                  color: "var(--muted-inverted)",
                  borderBottom: "1px solid var(--line-inverted)",
                  paddingBottom: "2px",
                }}
              >
                Launch live app ↗
              </a>
            </div>
          </div>

          {/* Right: Capability matrix */}
          <div className="lg:col-span-7">
            <div
              className="flex items-center justify-between border-b pb-3"
              style={{ borderColor: "var(--line-inverted)" }}
            >
              <span
                className="font-mono text-[0.5625rem] tracking-[0.2em] uppercase font-bold"
                style={{ color: "var(--text-inverted)" }}
              >
                Platform Capabilities
              </span>
              <span
                className="font-mono text-[0.5625rem] tracking-widest uppercase"
                style={{ color: "var(--muted-inverted)" }}
              >
                Select module
              </span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {product.features.map((f, i) => {
                const isSelected = i === activeFeature;
                return (
                  <div
                    key={f.title}
                    onClick={() => setActiveFeature(i)}
                    className="cursor-pointer border p-5 transition-all duration-300"
                    style={{
                      borderColor: isSelected
                        ? "oklch(0.55 0.14 264)"
                        : "var(--line-inverted)",
                      background: isSelected
                        ? "oklch(0.55 0.14 264 / 12%)"
                        : "oklch(0.98 0 0 / 2%)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-[0.5625rem] font-bold tracking-[0.2em] uppercase"
                        style={{
                          color: isSelected
                            ? "oklch(0.75 0.1 264)"
                            : "var(--muted-inverted)",
                        }}
                      >
                        MODULE [{String(i + 1).padStart(2, "0")}]
                      </span>
                      {isSelected && (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: "oklch(0.55 0.14 264)" }}
                        />
                      )}
                    </div>
                    <h4
                      className="font-display text-lg tracking-[-0.02em] font-semibold mt-2"
                      style={{ color: "var(--text-inverted)" }}
                    >
                      {f.title}
                    </h4>
                    <p
                      className="text-xs leading-relaxed mt-2"
                      style={{ color: "var(--muted-inverted)" }}
                    >
                      {f.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Tech stack */}
            <div
              className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4"
              style={{ borderColor: "var(--line-inverted)" }}
            >
              <span
                className="font-mono text-[0.5625rem] tracking-[0.18em] uppercase"
                style={{ color: "var(--muted-inverted)" }}
              >
                Architecture:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.technologies.map((t) => (
                  <span
                    key={t}
                    className="border px-2.5 py-1 font-mono text-[0.5rem] tracking-[0.14em] uppercase"
                    style={{
                      borderColor: "var(--line-inverted)",
                      color: "var(--muted-inverted)",
                      background: "oklch(0.98 0 0 / 3%)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom datum */}
      <div
        className="h-px w-full"
        style={{ background: "var(--line-inverted)" }}
        aria-hidden="true"
      />
    </div>
  );
}

function DriverDiaryStage({
  product,
  reduced,
}: {
  product: Product;
  reduced: boolean;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [spotlight, setSpotlight] = useState<{ x: number; y: number; opacity: number }>({
    x: 50, y: 50, opacity: 0,
  });

  useEffect(() => {
    const el = cardRef.current;
    if (!el || reduced) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const handlePointerMove = (e: ReactPointerEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      opacity: 1,
    });
  };

  const handlePointerLeave = () =>
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden bg-bg"
      style={{
        opacity: visible ? 1 : 0,
        transition: reduced ? "none" : "opacity 0.8s var(--ease-emphasis)",
      }}
    >
      {/* Pointer spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-400"
        aria-hidden="true"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(450px circle at ${spotlight.x}% ${spotlight.y}%, oklch(0.5 0.14 140 / 8%), transparent 70%)`,
        }}
      />

      <div className="shell relative z-10 py-16 lg:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5 mb-10" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.5625rem] font-bold tracking-[0.2em] uppercase text-accent">
              SUPPORTING PLATFORM // 02
            </span>
            <span className="h-3 w-px bg-line" />
            <span className="font-mono text-[0.5625rem] tracking-[0.16em] uppercase text-muted">
              Built for HeadGreen Mobility
            </span>
          </div>
          <span className="font-mono text-[0.5625rem] tracking-[0.16em] uppercase text-muted">
            OPERATIONAL PWA
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <h3
              className="font-display font-bold tracking-[-0.04em]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)" }}
            >
              {product.title}
            </h3>
            <p className="mt-5 text-base leading-relaxed text-muted">
              {product.short_description}
            </p>
            <p className="mt-3 text-sm text-muted">{product.positioning}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="btn-solid text-xs py-2.5 px-4"
              >
                Case overview →
              </Link>
              <a
                href={product.live_url}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-line text-xs py-2.5 px-4"
              >
                Live app ↗
              </a>
            </div>
          </div>

          <div
            className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-line pt-8 lg:pt-0 lg:pl-10"
          >
            <p className="font-mono text-[0.5625rem] tracking-[0.2em] uppercase font-bold text-muted mb-5">
              Operational Features
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {product.features.map((f, i) => (
                <li
                  key={f.title}
                  className="border border-line bg-surface-2/60 p-4 transition-colors hover:border-line-strong"
                >
                  <span className="font-mono text-[0.5rem] text-accent font-bold">
                    0{i + 1}
                  </span>
                  <p className="font-display text-sm font-semibold mt-1">{f.title}</p>
                  <p className="text-xs text-muted mt-1 leading-snug">{f.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
