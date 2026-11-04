import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useScrollScene } from "@/hooks/use-scroll-scene";
import { projects } from "@/content/maco";
import { responsiveWork } from "@/lib/responsive-image";
import { CardTilt } from "@/components/motion/card-tilt";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import "./work.css";

const WORK_SIZES = "(max-width: 767px) 92vw, 58vw";

/** Real project images; no parallel WebGL canvases or automatic slide changes. */
export function WorkCollection({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const rootRef = useRef<HTMLDivElement>(null);

  // Each image opens out of a smaller window while the picture drifts inside
  // it. Scrubbed, so it reverses; without the runtime the images simply sit
  // at rest, uncropped.
  useScrollScene((rt) => {
    rootRef.current?.querySelectorAll<HTMLElement>(".work-project-image").forEach((plate) => {
      const scrollTrigger = {
        trigger: plate,
        start: "top 96%",
        end: "top 45%",
        scrub: 0.6,
      };
      rt.gsap.fromTo(
        plate,
        { clipPath: "inset(10% 7% 10% 7% round 2.5rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 1.6rem)", ease: "none", scrollTrigger },
      );
      rt.gsap.fromTo(
        plate.querySelectorAll("img"),
        { scale: 1.16, yPercent: -3 },
        { scale: 1, yPercent: 0, ease: "none", scrollTrigger: { ...scrollTrigger } },
      );
    });
  }, []);

  return (
    <div ref={rootRef} className="work-collection">
      {projects.map((project) => {
        const cover = project.gallery?.[0] ?? project.media?.poster;
        const second = project.gallery?.[1];
        return (
          <ScrubReveal
            as="article"
            key={project.slug}
            hold
            rise="1rem"
            className={"work-project" + (!cover ? " work-project-brand" : "")}
          >
            <Link
              to="/work/$slug"
              params={{ slug: project.slug }}
              className="work-project-link"
              data-cursor="media"
              data-cursor-label="View"
            >
              <CardTilt>
                <div
                  className="work-project-image"
                  style={{ viewTransitionName: `work-${project.slug}` }}
                >
                  {cover ? (
                    <>
                      <img
                        src={cover}
                        {...responsiveWork(cover, WORK_SIZES)}
                        alt={project.title + " website designed and developed by MaCo"}
                        width={1440}
                        height={900}
                        loading="lazy"
                        decoding="async"
                        className="work-image-primary"
                      />
                      {second && (
                        <img
                          src={second}
                          {...responsiveWork(second, WORK_SIZES)}
                          alt=""
                          aria-hidden="true"
                          width={1440}
                          height={900}
                          loading="lazy"
                          decoding="async"
                          className="work-image-secondary"
                        />
                      )}
                    </>
                  ) : project.brand ? (
                    <img
                      src={project.brand.src}
                      alt={project.brand.alt}
                      width={project.brand.width}
                      height={project.brand.height}
                      loading="lazy"
                      decoding="async"
                      className="work-brand-mark"
                    />
                  ) : null}
                  <span className="work-project-open" aria-hidden="true">
                    ↗
                  </span>
                  <span className="work-project-medium">
                    {cover ? "Website / Development" : "Brand / Print design"}
                  </span>
                </div>
              </CardTilt>
              <div className="work-project-caption">
                <p className="work-project-sector">
                  <span>{project.index}</span>
                  {project.sector}
                </p>
                <Heading>{project.title}</Heading>
                <p className="work-project-description">{project.short_description}</p>
                <span className="work-project-read">
                  View project <span aria-hidden="true">↗</span>
                </span>
              </div>
            </Link>
          </ScrubReveal>
        );
      })}
    </div>
  );
}
