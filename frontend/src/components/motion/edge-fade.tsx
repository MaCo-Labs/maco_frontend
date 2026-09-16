type EdgeFadeProps = { position: "top" | "bottom" };

/**
 * Soft fade + blur at a scrollable panel's edge, so cut-off content reads as
 * continuing rather than clipped. Reads `--bg` off its own scope like every
 * other themed surface here, so it needs no colour prop and stays correct
 * in both Obsidian and Cobalt without a per-theme branch.
 */
export function EdgeFade({ position }: EdgeFadeProps) {
  const isTop = position === "top";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 z-10 h-16"
      style={{
        [isTop ? "top" : "bottom"]: 0,
        background: isTop
          ? "linear-gradient(to bottom, var(--bg), transparent)"
          : "linear-gradient(to top, var(--bg), transparent)",
        maskImage: isTop
          ? "linear-gradient(to bottom, black, transparent)"
          : "linear-gradient(to top, black, transparent)",
        WebkitBackdropFilter: "blur(4px)",
        backdropFilter: "blur(4px)",
      }}
    />
  );
}
