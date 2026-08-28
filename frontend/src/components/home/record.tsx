import { site } from "@/content/maco";
import { ScrubReveal } from "@/components/motion/scrub-reveal";

/**
 * RECORD — the company, deliberately at rest. Every section performing
 * is as tiring as none performing; this is the page's one quiet beat.
 *
 * Clients used to appear here too (a logo wall, alongside LogoReel four
 * slots earlier) — consolidated down to LogoReel as the single client
 * display 2026-08-28, so this section is About-only now: no more reason
 * for the two-column split, so it's a single narrow column instead.
 */
export function Record() {
  return (
    <section data-ground="deep" aria-label="About MaCo">
      <div className="shell cb-section max-w-2xl">
        <p className="label">About</p>
        <ScrubReveal as="p" hold className="lead mt-8">
          {site.statement}
        </ScrubReveal>
        <p className="mt-6" style={{ color: "var(--muted)" }}>
          {site.category}, based in {site.location}. Working with clients across India and the Gulf.
        </p>
      </div>
    </section>
  );
}
