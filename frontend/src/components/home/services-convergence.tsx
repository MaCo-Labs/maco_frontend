import { useRef, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { services, getProject, getProduct, type Service } from "@/content/maco";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { RuleDraw } from "@/components/motion/rule-draw";
import { useScrollScene } from "@/hooks/use-scroll-scene";
import { clamp01, smootherstep } from "@/lib/motion";

/** How long the pin lasts, as a multiple of `reach()` — tuned so the
 *  convergence itself (0 -> CONVERGE_END) and the detail reveal that
 *  follows (CONVERGE_END -> 1) each get a comfortable scroll distance
 *  without the section running long relative to its ten siblings. */
const PIN_RATIO = 2.6;
/** Progress fraction at which the cards finish locking into place and the
 *  detail reveal (--d) begins. */
const CONVERGE_END = 0.55;

/**
 * CAPABILITY — the services convergence. Replaces the previous ARIA
 * tablist (click/arrow-key to swap between one visible service at a time)
 * with both services presented at once: two cards fly in from opposite
 * edges and lock into a centred, slightly rotated stack as the section
 * pins, then their capability lists, evidence chips and CTAs reveal in
 * place. Nothing is ever hidden behind a selection, so there is no tab
 * role, no `aria-selected`, no keyboard router to maintain — DOM order is
 * simply `services[0]` then `services[1]`, both fully present.
 *
 * Desktop (lg+): `<ServicesStage>` pins and drives `--c` (convergence,
 * 0 = off-stage, 1 = locked) and `--d` (detail reveal, 0..1) on itself;
 * every card and detail row reads them via the `converge-card` /
 * `converge-detail` utilities in styles.css, so the whole section costs
 * two `setProperty` calls per scroll frame regardless of how much content
 * each card holds.
 *
 * Mobile (<lg): `<ServicesStack>` — a plain vertical `ScrubReveal` +
 * `Stagger` composition, no pin, no `--c`/`--d`/`--reach`. Both mount
 * unconditionally, split by Tailwind breakpoint (`lg:hidden` /
 * `hidden lg:block`), never by a `useMediaQuery` state flip — see
 * work-sequence.tsx's doc comment for the mount-order race that pattern
 * caused the last time it was tried on a pinned section.
 */
export function ServicesConvergence() {
  return (
    <section data-ground="paper" className="rule-t" aria-label="Capabilities">
      <div className="lg:hidden">
        <ServicesStack />
      </div>
      <div className="hidden lg:block">
        <ServicesStage />
      </div>
    </section>
  );
}

function ServicesStack() {
  return (
    <div className="shell py-20 md:py-28">
      <ScrubReveal hold>
        <p className="label">Capability</p>
        <h2 className="display-lg mt-3 max-w-2xl" style={{ color: "var(--text)" }}>
          Two things MaCo builds.
        </h2>
      </ScrubReveal>

      <div className="mt-12 space-y-16">
        {services.map((service) => (
          <ServiceCardContent key={service.slug} service={service} />
        ))}
      </div>
    </div>
  );
}

function ServiceCardContent({ service }: { service: Service }) {
  return (
    <article>
      <ScrubReveal hold className="flex items-baseline gap-4 border-b border-line pb-5">
        <span className="label">{service.index}</span>
        <h3 className="display-md" style={{ color: "var(--text)" }}>
          {service.title}
        </h3>
      </ScrubReveal>

      <p className="lead mt-6">{service.short_description}</p>

      <div className="relative mt-8 pt-8">
        <RuleDraw className="absolute top-0 left-0 h-px w-full" />
        <Stagger as="ul" className="space-y-5" gap={0.12} band={0.4}>
          {service.capabilities.map((c, i) => (
            <li key={c.title} className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <p className="font-display text-lg" style={{ color: "var(--text)" }}>
                {c.title}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {c.description}
              </p>
            </li>
          ))}
        </Stagger>
      </div>

      {service.evidence.length > 0 && (
        <div className="relative mt-8 pt-6">
          <RuleDraw className="absolute top-0 left-0 h-px w-full" />
          <p className="label mb-3">Evidence</p>
          <Stagger as="div" className="flex flex-wrap gap-2" gap={0.2} band={0.5} rise="0.5rem">
            {service.evidence.map((slug, i) => {
              const project = getProject(slug);
              const product = getProduct(slug);
              const title = project?.title ?? product?.title;
              if (!title) return null;
              return (
                <Link
                  key={slug}
                  to={project ? "/work/$slug" : "/products/$slug"}
                  params={{ slug }}
                  className="stagger-item link-draw label border border-line px-3 py-1.5"
                  style={{ color: "var(--text)", "--i": i } as CSSProperties}
                >
                  {title}
                </Link>
              );
            })}
          </Stagger>
        </div>
      )}

      <Link to="/services/$slug" params={{ slug: service.slug }} className="btn-line mt-8">
        More on {service.title} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

function ServicesStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useScrollScene((rt) => {
    const stage = stageRef.current;
    if (!stage) return;

    // The single source of truth for how far a card travels — read by
    // BOTH `end` (how long the pin lasts) and --reach (how far each card
    // moves), so the two can never disagree. See work-sequence.tsx's
    // `distance()` for the bug this pattern exists to prevent.
    const reach = () => {
      const card = cardRefs.current[0];
      const cardW = card ? card.getBoundingClientRect().width : stage.clientWidth * 0.42;
      return Math.round(stage.clientWidth / 2 + cardW / 2 + 48);
    };
    const applyReach = () => stage.style.setProperty("--reach", `${reach()}px`);

    const mm = rt.gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      applyReach();
      const trigger = rt.ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => "+=" + Math.round(reach() * PIN_RATIO),
        pin: true,
        anticipatePin: 1,
        scrub: 0.3,
        invalidateOnRefresh: true,
        onRefresh: applyReach,
        onUpdate: (self) => {
          const p = self.progress;
          // Two writes per frame for the entire section. Every per-card
          // transform is a calc() off these (converge-card /
          // converge-detail in styles.css), running on the compositor —
          // the same trick WorkPanel uses for its opacity.
          stage.style.setProperty("--c", String(clamp01(smootherstep(p / CONVERGE_END))));
          stage.style.setProperty("--d", String(clamp01((p - CONVERGE_END) / (1 - CONVERGE_END))));
        },
      });
      return () => trigger.kill();
    });
  }, []);

  return (
    <div
      ref={stageRef}
      // data-ground repeated here, not just on the outer <section>: once
      // GSAP pins this div (position:fixed), it paints independently of
      // its parent — background doesn't inherit in CSS. See
      // work-sequence.tsx's matching comment for the bug this avoids.
      data-ground="paper"
      className="relative z-[41] flex h-screen items-center overflow-hidden"
    >
      <div className="shell w-full">
        <ScrubReveal hold>
          <p className="label">Capability</p>
        </ScrubReveal>

        <div className="relative mt-10 grid min-h-[26rem] place-items-center">
          {services.map((service, i) => (
            <div
              key={service.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="converge-card col-start-1 row-start-1 w-full max-w-xl border border-line bg-bg p-8 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.28)] lg:p-10"
              style={
                {
                  "--side": i === 0 ? -1 : 1,
                  "--rest-tilt": i === 0 ? "-2.5deg" : "2deg",
                  zIndex: i + 1,
                } as CSSProperties
              }
            >
              <div className="flex items-baseline gap-4 border-b border-line pb-5">
                <span className="label">{service.index}</span>
                <h3 className="display-md" style={{ color: "var(--text)" }}>
                  {service.title}
                </h3>
              </div>

              <p className="lead mt-6 text-base lg:text-lg">{service.short_description}</p>

              <ul className="mt-6 space-y-4">
                {service.capabilities.map((c, ci) => (
                  <li
                    key={c.title}
                    className="converge-detail"
                    style={{ "--i": ci } as CSSProperties}
                  >
                    <p className="font-display text-base" style={{ color: "var(--text)" }}>
                      {c.title}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                      {c.description}
                    </p>
                  </li>
                ))}
              </ul>

              {service.evidence.length > 0 && (
                <div
                  className="converge-detail mt-6 flex flex-wrap gap-2"
                  style={{ "--i": service.capabilities.length } as CSSProperties}
                >
                  {service.evidence.map((slug) => {
                    const project = getProject(slug);
                    const product = getProduct(slug);
                    const title = project?.title ?? product?.title;
                    if (!title) return null;
                    return (
                      <Link
                        key={slug}
                        to={project ? "/work/$slug" : "/products/$slug"}
                        params={{ slug }}
                        className="link-draw label border border-line px-3 py-1.5"
                        style={{ color: "var(--text)" }}
                      >
                        {title}
                      </Link>
                    );
                  })}
                </div>
              )}

              <div
                className="converge-detail mt-6"
                style={{ "--i": service.capabilities.length + 1 } as CSSProperties}
              >
                <Link to="/services/$slug" params={{ slug: service.slug }} className="btn-line">
                  More on {service.title} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
