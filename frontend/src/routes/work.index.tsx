import { useState, type CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { projects } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Stagger } from "@/components/motion/stagger";
import { MorphSlider } from "@/components/media/morph-slider";
import { useSectionHandoff } from "@/hooks/use-section-handoff";
import { PageOutro } from "@/components/inner/page-outro";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Work — Client projects delivered by MaCo" },
      {
        name: "description",
        content:
          "Case studies from MaCo: Ananta Nethralaya, Al Afzah Group, Soorath Autos and HeadGreen.",
      },
      { property: "og:title", content: "Work — MaCo" },
      {
        property: "og:description",
        content:
          "Real client work across healthcare, construction, automotive retail and EV mobility.",
      },
    ],
  }),
  component: WorkIndex,
});

const HANDOFF_PAIRS = [["Projects", "Start a project", "sheet"]] as const;

function WorkIndex() {
  // Hover-driven shared media stage (desktop only — the stage itself is
  // `hidden lg:block`, so this state is a harmless no-op on touch/narrow
  // viewports rather than needing its own pointer-type gate). Defaults to
  // the first project so the stage never renders empty before any hover.
  const [active, setActive] = useState(0);
  const activeProject = projects[active] ?? projects[0]!;
  const gallery = activeProject.gallery?.length
    ? activeProject.gallery
    : activeProject.media
      ? [activeProject.media.poster]
      : [];

  useSectionHandoff(HANDOFF_PAIRS);

  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell grid gap-8 page-intro lg:grid-cols-12">
          <p className="label lg:col-span-3">Index / Client work</p>
          <div className="lg:col-span-9">
            <LineReveal as="h1" className="display-lg max-w-3xl">
              Four clients. <span style={{ color: "var(--muted)" }}>Four different problems.</span>
            </LineReveal>
            <ScrubReveal as="p" hold className="mt-8 max-w-xl text-muted">
              Client work is kept separate from MaCo-owned products. Everything below was delivered
              for an organisation outside MaCo and is live in public.
            </ScrubReveal>
          </div>
        </div>
      </section>

      <section data-ground="paper" aria-label="Projects">
        <div className="shell py-10 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Stagger as="div" className="lg:col-span-7" gap={0.05} band={0.3}>
              {projects.map((p, i) => (
                <article
                  key={p.slug}
                  className="stagger-item index-row"
                  style={{ "--i": i } as CSSProperties}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <Link
                    to="/work/$slug"
                    params={{ slug: p.slug }}
                    className="relative z-[1] block py-8"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <p className="label">
                        {p.index} / {p.sector}
                      </p>
                      {p.brand && (
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center border border-line p-1.5"
                          style={{
                            background: "var(--surface-2)",
                            borderRadius: "var(--radius-chip)",
                          }}
                        >
                          <img
                            src={p.brand.src}
                            alt=""
                            width={p.brand.width}
                            height={p.brand.height}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <h2 className="display-md mt-3 link-draw">{p.title}</h2>
                    <p className="mt-4 max-w-xl text-base leading-snug text-muted">
                      {p.short_description}
                    </p>
                  </Link>
                </article>
              ))}
            </Stagger>

            <div className="hidden lg:col-span-5 lg:block">
              <div className="sticky top-28">
                <div
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: "4 / 3",
                    borderRadius: "var(--radius-card)",
                    background: "var(--surface-2)",
                  }}
                >
                  {gallery.length > 0 ? (
                    <MorphSlider
                      key={activeProject.slug}
                      items={gallery.map((src) => ({ image: src }))}
                      radius={0}
                      autoplay={gallery.length > 1}
                      loop
                      showControls={false}
                      showIndicators={gallery.length > 1}
                    />
                  ) : (
                    activeProject.brand && (
                      <div className="absolute inset-0 grid place-items-center p-12">
                        <img
                          src={activeProject.brand.src}
                          alt=""
                          width={activeProject.brand.width}
                          height={activeProject.brand.height}
                          loading="lazy"
                          decoding="async"
                          className="max-h-32 w-auto max-w-full object-contain"
                        />
                      </div>
                    )
                  )}
                </div>
                <p className="mt-4 text-sm text-muted">
                  {activeProject.client} — {activeProject.short_description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Magnetic>
                    <Link
                      to="/work/$slug"
                      params={{ slug: activeProject.slug }}
                      className="btn-line"
                    >
                      Case study
                    </Link>
                  </Magnetic>
                  {activeProject.external_url && (
                    <Magnetic>
                      <a
                        href={activeProject.external_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn-line"
                      >
                        Visit site ↗
                      </a>
                    </Magnetic>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageOutro
        ariaLabel="Start a project"
        heading="Your problem could be next."
        body="Every project on this page started as a working call, not a pitch deck. Tell us what breaks."
        cta={{ label: "Start a project", to: "/contact" }}
      />
    </>
  );
}
