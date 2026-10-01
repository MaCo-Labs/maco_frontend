import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { site, process, principles, services, origin, team } from "@/content/maco";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { GlobeSection } from "@/components/globe-section";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Stagger } from "@/components/motion/stagger";
import { ProcessStroke } from "@/components/motion/process-stroke";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Auto-cycle interval — mirrors Vengeance UI's Team Reveal Grid default
 *  (`rotationInterval: 2800`), the one thing worth taking from that
 *  component: a stateful "active member" the grid cycles through when
 *  idle, not just a per-card `:hover` reveal. */
const TEAM_ROTATION_MS = 2800;

function TeamGrid({ people }: { people: typeof team }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const pausedRef = useRef(false);

  useEffect(() => {
    if (reduced || people.length < 2) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setActive((i) => (i + 1) % people.length);
    }, TEAM_ROTATION_MS);
    return () => clearInterval(id);
  }, [reduced, people.length]);

  return (
    // Pause/resume lives on this wrapper, not per-card: clearing on a
    // card's own mouseleave fires before the next card's mouseenter,
    // which would drop the highlight to nothing for a frame between two
    // adjacent cards instead of reading as one continuous hand-off.
    <div className="lg:col-span-9" onMouseLeave={() => (pausedRef.current = false)}>
      <Stagger
        as="div"
        className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4"
        style={{ background: "var(--line)" }}
        gap={0.06}
        band={0.3}
      >
        {people.map((person, i) => {
          const isActive = active === i;
          return (
            <div
              key={person.slug}
              tabIndex={0}
              className="stagger-item p-6 outline-none"
              style={{ background: "var(--bg)", "--i": i } as CSSProperties}
              onMouseEnter={() => {
                pausedRef.current = true;
                setActive(i);
              }}
              onFocus={() => {
                pausedRef.current = true;
                setActive(i);
              }}
            >
              <div
                className={`flex aspect-[4/5] items-center justify-center bg-[var(--surface-2)] transition-[filter] duration-400 ease-[var(--ease-emphasis)] ${
                  isActive ? "contrast-125 brightness-105" : ""
                }`}
              >
                {person.portrait ? (
                  <img
                    src={person.portrait.poster}
                    alt={person.portrait.alt}
                    width={person.portrait.width}
                    height={person.portrait.height}
                    className="h-full w-full object-cover grayscale"
                    loading="lazy"
                  />
                ) : (
                  <span className="font-display text-3xl tracking-[-0.02em] text-muted">
                    {initials(person.name)}
                  </span>
                )}
              </div>
              <p className="mt-4 font-display text-lg tracking-[-0.02em]">{person.name}</p>
              <p className="mt-1 text-sm text-muted">{person.role}</p>
              <p
                className={`mt-3 overflow-hidden text-sm text-muted transition-[max-height,opacity] duration-400 ease-[var(--ease-emphasis)] ${
                  isActive ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {person.bio}
              </p>
            </div>
          );
        })}
      </Stagger>
    </div>
  );
}

/** slug -> initials, for the founder-card fallback (no portraits exist
 *  yet). Typographic, not a fake-avatar image — the honest stand-in per
 *  design-taste-frontend's guidance on invented headshots. */
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MaCo — How we build and maintain software" },
      {
        name: "description",
        content:
          "MaCo is a software and IT solutions company based in Kochi, Kerala. How we scope, model, build and hand over software.",
      },
      { property: "og:title", content: "About — MaCo" },
      {
        property: "og:description",
        content:
          "A software and IT solutions company that treats maintenance as part of the product.",
      },
      { property: "og:url", content: absoluteUrl("/about") },
      {
        "script:ld+json": breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/about") }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell py-16 lg:py-24">
          <p className="label">Index / About</p>
          <LineReveal as="h1" className="display-lg mt-6 max-w-3xl">
            A software company that stays{" "}
            <span style={{ color: "var(--muted)" }}>after the launch post.</span>
          </LineReveal>
          <p className="mt-8 max-w-2xl text-lg leading-snug">{site.statement}</p>
          <p className="mt-5 max-w-2xl text-muted">
            We work across two sides of the same discipline: websites and platforms for clients, and
            products we own and operate ourselves. The second keeps the first honest — we run
            software in production, so we build for the version of it that exists two years from
            now.
          </p>
        </div>
      </section>

      <section data-ground="paper" aria-label="Origin" className="rule-b">
        <div className="shell grid gap-8 py-16 lg:grid-cols-12 lg:py-24">
          <p className="label lg:col-span-3">{origin.eyebrow}</p>
          <div className="lg:col-span-9">
            <LineReveal as="h2" mode="words" className="display-lg max-w-3xl">
              {origin.heading}
            </LineReveal>
            <p className="mt-8 max-w-2xl text-lg leading-snug text-muted">{origin.body}</p>
          </div>
        </div>
      </section>

      <section data-ground="paper" aria-label="Method" className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Method</p>
          <Stagger
            as="div"
            className="relative grid gap-px lg:col-span-9 sm:grid-cols-2"
            style={{ background: "var(--line)" }}
            gap={0.1}
            band={0.35}
          >
            <ProcessStroke />
            {process.map((p, i) => (
              <div
                key={p.step}
                className="stagger-item p-8"
                style={{ background: "var(--bg)", "--i": i } as CSSProperties}
              >
                <span className="font-display text-4xl" style={{ color: "var(--accent)" }}>
                  {p.step}
                </span>
                <h2 className="mt-5 font-display text-xl">{p.title}</h2>
                <p className="mt-3 text-sm text-muted">{p.body}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section data-ground="paper" aria-label="Principles" className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Principles</p>
          <Stagger as="ul" className="lg:col-span-9" gap={0.1} band={0.35}>
            {principles.map((line, i) => (
              <li
                key={line}
                className="stagger-item rule-t flex gap-6 py-5"
                style={{ "--i": i } as CSSProperties}
              >
                <span className="label pt-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="max-w-2xl text-lg leading-snug">{line}</span>
              </li>
            ))}
            <li className="rule-t" />
          </Stagger>
        </div>
      </section>

      <section data-ground="paper" aria-label="Team" className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Team</p>
          <TeamGrid people={team} />
        </div>
      </section>

      <section data-ground="paper" aria-label="Contact MaCo">
        <div className="shell grid gap-10 py-14 lg:grid-cols-12 lg:items-center lg:py-20">
          <div className="lg:col-span-5">
            <p className="label">Where we are</p>
            <p className="display-md mt-6">{site.location}</p>
            <p className="mt-6 max-w-xl text-muted">
              Working with clients in India and the Middle East across {services.length} service
              lines.
            </p>
            <Magnetic className="mt-8 inline-block">
              <Link to="/contact" className="btn-solid">
                Contact MaCo <span aria-hidden="true">→</span>
              </Link>
            </Magnetic>
          </div>
          <div className="lg:col-span-7">
            <GlobeSection
              label="Operational hubs"
              description="Kochi, Bangalore, Chennai, Qatar and Dubai — where MaCo works."
            />
          </div>
        </div>
      </section>
    </>
  );
}
