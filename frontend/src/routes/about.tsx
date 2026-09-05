import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { site, process, principles, services, origin, team } from "@/content/maco";
import { GlobeSection } from "@/components/globe-section";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Stagger } from "@/components/motion/stagger";

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
    ],
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
            className="grid gap-px lg:col-span-9 sm:grid-cols-2"
            style={{ background: "var(--line)" }}
            gap={0.1}
            band={0.35}
          >
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
          <Stagger
            as="div"
            className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4"
            style={{ background: "var(--line)" }}
            gap={0.06}
            band={0.3}
          >
            {team.map((person, i) => (
              <div
                key={person.slug}
                tabIndex={0}
                className="stagger-item group p-6 outline-none"
                style={{ background: "var(--bg)", "--i": i } as CSSProperties}
              >
                <div className="flex aspect-[4/5] items-center justify-center bg-[var(--surface-2)] transition-[filter] duration-400 ease-[var(--ease-emphasis)] group-hover:contrast-125 group-hover:brightness-105 group-focus-within:contrast-125 group-focus-within:brightness-105">
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
                <p className="mt-3 max-h-0 overflow-hidden text-sm text-muted opacity-0 transition-[max-height,opacity] duration-400 ease-[var(--ease-emphasis)] group-hover:max-h-20 group-hover:opacity-100 group-focus-within:max-h-20 group-focus-within:opacity-100">
                  {person.bio}
                </p>
              </div>
            ))}
          </Stagger>
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
