import { clients, site } from "@/content/maco";

/**
 * RECORD — clients and the company, deliberately at rest. Every section
 * performing is as tiring as none performing; this is the page's one
 * quiet beat. No scroll behaviour, no reveal animation.
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
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-8 sm:grid-cols-4">
            {clients.map((client) => (
              <a
                key={client.slug}
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-line p-5 transition-colors hover:border-text"
                style={{ background: "var(--surface-2)" }}
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
          </div>
        </div>

        <div>
          <p className="label">About</p>
          <p className="lead mt-8">{site.statement}</p>
          <p className="mt-6" style={{ color: "var(--muted)" }}>
            {site.category}, based in {site.location}. Working with clients across India and the
            Gulf.
          </p>
        </div>
      </div>
    </section>
  );
}
