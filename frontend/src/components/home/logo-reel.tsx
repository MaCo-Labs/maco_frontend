import type { CSSProperties } from "react";
import { clients, type Client } from "@/content/maco";
import { ScrubReveal } from "@/components/motion/scrub-reveal";

/**
 * CLIENTS — `section#brands.cb-logoreel`. A continuous horizontal drift
 * of client logo cards, each on Cuberto's measured `border-radius: 7.2px`
 * (`--radius-chip`), edges masked so cards enter and leave rather than
 * being cut off mid-card.
 *
 * Replaces `client-field.tsx` (a scroll-scrubbed scatter field with a
 * separate mobile grid). A reel says "these are our clients" in one
 * glance at any viewport width and needs no breakpoint fork, which is the
 * whole reason Cuberto uses one here.
 *
 * The track is rendered twice and translated -50%, which is what makes
 * the loop seamless — the second copy is `aria-hidden` so a screen reader
 * hears four clients, not eight. It is CSS-only (`cb-reel` in styles.css,
 * matching Cuberto's own pure-CSS motion): no ScrollTrigger, no rAF, and
 * it stops dead under `prefers-reduced-motion`.
 *
 * The two-copy -50% loop only reads as seamless while the visible window
 * is narrower than one copy: 4 cards x (w-72 288px + mx-3 24px) = 1248px.
 * `.cb-reel-mask` (styles.css) caps at 76rem for exactly this reason — do
 * not remove that max-width without re-deriving the bound, or the seam
 * becomes visible above ~1248px and a client logo appears to duplicate.
 *
 * Each card carries its `client.industry` under the mark — this is now
 * the ONLY client display on the page (Record's logo wall was
 * consolidated in here 2026-08-28), so it needed to carry the one thing
 * that wall showed and this reel didn't.
 */
export function LogoReel() {
  const track = [...clients, ...clients];

  return (
    <section data-ground="paper" aria-label="Who we work with">
      <div className="cb-section">
        <div className="shell">
          <ScrubReveal hold>
            <p className="label">Clients</p>
            <h2 className="display-lg mt-3 max-w-2xl" style={{ color: "var(--text)" }}>
              Companies who trusted us with production software.
            </h2>
          </ScrubReveal>
        </div>

        <div className="cb-reel-mask mt-10 overflow-x-hidden py-2 md:mt-14">
          <ul className="cb-reel" style={{ "--reel-n": clients.length } as CSSProperties}>
            {track.map((client, i) => (
              <li key={i} aria-hidden={i >= clients.length ? "true" : undefined}>
                <LogoCard client={client} interactive={i < clients.length} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function LogoCard({ client, interactive }: { client: Client; interactive: boolean }) {
  const inner = (
    <div className="flex flex-col items-center gap-3">
      {client.brand ? (
        <img
          src={client.brand.src}
          alt={interactive ? client.name : ""}
          width={client.brand.width}
          height={client.brand.height}
          loading="lazy"
          decoding="async"
          className="h-14 w-auto max-w-full object-contain"
        />
      ) : (
        <span className="font-display text-lg" style={{ color: "var(--text)" }}>
          {client.name}
        </span>
      )}
      <span className="label" style={{ color: "var(--muted)" }}>
        {client.industry}
      </span>
    </div>
  );

  const className =
    "mx-3 flex h-36 w-56 items-center justify-center border border-line px-8 transition-[transform,border-color] hover:-translate-y-1 hover:border-text md:h-44 md:w-72";
  const style: CSSProperties = {
    background: "var(--surface-2)",
    borderRadius: "var(--radius-chip)",
  };

  // The duplicated half is inert: not a link, not focusable, not in the
  // accessibility tree — it exists purely so the translate loop has
  // something to show while the first half wraps around.
  if (!interactive) {
    return (
      <div className={className} style={style}>
        {inner}
      </div>
    );
  }

  return (
    <a
      href={client.website}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {inner}
    </a>
  );
}
