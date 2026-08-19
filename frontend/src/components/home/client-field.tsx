import { useRef, type CSSProperties } from "react";
import { clients, type Client } from "@/content/maco";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * Hand-authored scatter targets for the 4 real clients — asymmetric, not
 * randomly generated (nothing to gain from runtime randomization at n=4).
 * tx/ty are unitless numbers consumed as vw/vh by the .client-tile utility
 * (styles.css) so the scatter scales with viewport size; rot is degrees.
 */
const SCATTER: readonly { tx: number; ty: number; rot: number }[] = [
  { tx: -20, ty: -12, rot: -7 },
  { tx: 18, ty: -16, rot: 5 },
  { tx: -16, ty: 14, rot: 4 },
  { tx: 22, ty: 12, rot: -5 },
];

/**
 * CLIENTS — new section between WORK and CAPABILITY. Scroll-scrubbed (not
 * pinned) stack -> scatter of the same 4 client logos WORK's plates and
 * RECORD's wall already show — accepted repetition, not a defect (see the
 * design spec's content-reality section). Desktop-only past the
 * scatter/float/magnetic treatment; below `lg`, a static 2x2 grid mirrors
 * RECORD's own logo-wall layout, so nothing is gated behind an effect
 * that can't run everywhere.
 *
 * Pin-free by design: no ScrollTrigger `pin: true` anywhere in this file.
 * A pinned section can never be the outgoing side of a GroundHandoff pair
 * (see ground-handoff.tsx's doc comment) — staying pin-free keeps that
 * door open even though this spec doesn't give CLIENTS one yet.
 */
export function ClientField() {
  return (
    <section data-ground="paper" className="rule-t" aria-label="Who we work with">
      <div className="shell py-24 md:py-32">
        <ScrubReveal hold>
          <p className="label">Clients</p>
          <h2 className="display-lg mt-3 max-w-2xl" style={{ color: "var(--text)" }}>
            Four companies who trusted us with production software.
          </h2>
        </ScrubReveal>
      </div>

      <div className="lg:hidden">
        <ClientGrid />
      </div>
      <div className="hidden lg:block">
        <ClientScatter />
      </div>
    </section>
  );
}

function ClientGrid() {
  return (
    <div className="shell pb-24">
      <div className="grid grid-cols-2 gap-4">
        {clients.map((client) => (
          <ClientCard key={client.slug} client={client} />
        ))}
      </div>
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  return (
    <a
      href={client.website}
      target="_blank"
      rel="noopener noreferrer"
      className="flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-line p-5 transition-all hover:-translate-y-1 hover:border-text"
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
          className="h-12 w-auto max-w-full object-contain"
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
  );
}

function ClientScatter() {
  const stageRef = useRef<HTMLDivElement>(null);
  const floatRefs = useRef<Array<HTMLDivElement | null>>([]);

  useScrollScene((rt) => {
    const stage = stageRef.current;
    if (!stage) return;

    rt.gsap.fromTo(
      stage,
      { "--scatter": 0 },
      {
        "--scatter": 1,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      },
    );

    // Ambient float — a separate tween on a separate element per tile
    // (see client-tile's own doc comment in styles.css for why): each
    // tile's own scroll-driven scatter transform lives on the OUTER
    // element (.client-tile, driven by the ScrollTrigger above); this
    // float targets the INNER element, so the two transforms compose
    // across nested elements instead of one clobbering the other.
    floatRefs.current.forEach((el, i) => {
      if (!el) return;
      rt.gsap.to(el, {
        y: "+=10",
        duration: 2.6 + (i % 3) * 0.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
    });
  }, []);

  return (
    <div ref={stageRef} className="relative mx-auto h-[60vh] max-w-5xl px-6">
      {clients.map((client, i) => (
        <div
          key={client.slug}
          className="client-tile"
          style={
            {
              "--tx": SCATTER[i]?.tx ?? 0,
              "--ty": SCATTER[i]?.ty ?? 0,
              "--rot": SCATTER[i]?.rot ?? 0,
            } as CSSProperties
          }
        >
          <div
            ref={(el) => {
              floatRefs.current[i] = el;
            }}
          >
            <Magnetic className="block p-6 -m-6">
              <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-xl border border-line p-4 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.3)] md:h-32 md:w-32"
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
                    className="h-10 w-auto max-w-full object-contain"
                  />
                ) : (
                  <span className="label text-center" style={{ color: "var(--text)" }}>
                    {client.name}
                  </span>
                )}
              </a>
            </Magnetic>
          </div>
        </div>
      ))}
    </div>
  );
}
