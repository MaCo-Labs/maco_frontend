import type { CSSProperties } from "react";
import { clients, site } from "@/content/maco";
import { RakingSurface } from "@/components/motion/raking-surface";
import { Stagger } from "@/components/motion/stagger";
import { RuleDraw } from "@/components/motion/rule-draw";
import { LineReveal } from "@/components/motion/line-reveal";

/**
 * RECORD — clients and the company, deliberately at rest. Every section
 * performing is as tiring as none performing; this is the page's one
 * quiet beat — but "at rest" still has to be ARRIVED at: the logo wall
 * settles onto its grid with a low-amplitude Stagger (opacity + a small
 * scale, not a rise — the correct amplitude for a section that shouldn't
 * become a performance), one shared RakingSurface lights the whole tile
 * grid in a single pass, and that's the entire motion budget here.
 *
 * The client list became a logo wall once real brand assets existed —
 * bordered tiles on --surface-2 (a step darker than bare --bg) rather
 * than pure white, partly for edge definition and partly because one
 * client mark (Soorath, a bright yellow) reads poorly floating on pure
 * white; the deeper tile lifts every logo's contrast without any
 * per-logo special-casing.
 */
export function Record() {
  return (
    <section data-ground="paper" className="rule-t" aria-label="Clients and company">
      <div className="shell grid gap-14 py-24 md:py-32 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <div>
          <p className="label">Clients</p>
          <div className="relative mt-8 pt-8">
            <RuleDraw className="absolute top-0 left-0 h-px w-full" />
            <RakingSurface className="rounded-none">
              <Stagger
                as="div"
                className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                gap={0.15}
                band={0.5}
                rise="1rem"
              >
                {clients.map((client, i) => (
                  <a
                    key={client.slug}
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stagger-item group flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-line p-5 transition-all hover:-translate-y-1 hover:border-text"
                    style={{ background: "var(--surface-2)", "--i": i } as CSSProperties}
                  >
                    {client.brand ? (
                      <img
                        src={client.brand.src}
                        alt={client.name}
                        width={client.brand.width}
                        height={client.brand.height}
                        loading="lazy"
                        decoding="async"
                        className="h-12 w-auto max-w-full object-contain transition-transform group-hover:scale-105"
                        style={{
                          // A uniform, subtle edge on every mark — not a
                          // per-logo fix, but it does the most work for the
                          // one that needs it (a bright yellow mark has
                          // little natural contrast against any light tile).
                          filter:
                            "drop-shadow(0 1px 1px color-mix(in oklab, var(--text) 18%, transparent))",
                        }}
                      />
                    ) : (
                      <span className="font-display text-lg" style={{ color: "var(--text)" }}>
                        {client.name}
                      </span>
                    )}
                    <span className="label text-center" style={{ color: "var(--muted)" }}>
                      {client.industry}
                    </span>
                  </a>
                ))}
              </Stagger>
            </RakingSurface>
          </div>
        </div>

        <div>
          <p className="label">About</p>
          <LineReveal as="p" mode="scrub" className="lead mt-8">
            {site.statement}
          </LineReveal>
          <p className="mt-6" style={{ color: "var(--muted)" }}>
            {site.category}, based in {site.location}. Working with clients across India and the
            Gulf.
          </p>
        </div>
      </div>
    </section>
  );
}
