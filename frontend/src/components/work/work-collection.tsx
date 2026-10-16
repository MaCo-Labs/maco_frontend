import { Link } from "@tanstack/react-router";
import { projects } from "@/content/maco";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import "./work.css";

/** Real project images; no parallel WebGL canvases or automatic slide changes. */
export function WorkCollection({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="work-collection">
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
              data-cursor="link"
            >
              <div className="work-project-image">
                {cover ? (
                  <>
                    <img
                      src={cover}
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
