import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function HeroScrollIndicator() {
  const reduced = useReducedMotion();

  return (
    <div
      className="hero-scroll-indicator pointer-events-none absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-3 lg:bottom-8"
      aria-hidden="true"
    >
      <span className="label" style={{ color: "var(--hero-muted)" }}>
        Scroll
      </span>
      <span className={`hero-scroll-line ${reduced ? "" : "hero-scroll-line--active"}`} />
    </div>
  );
}
