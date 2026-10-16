import { useEffect, useId, useRef, useState } from "react";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import "./case-story.css";

type Chapter = readonly [string, string];

/** A readable case-study spine; the complete story stays in the document. */
export function CaseStory({ chapters }: { chapters: readonly Chapter[] }) {
  const [active, setActive] = useState(0);
  const host = useRef<HTMLElement>(null);
  const uid = useId().replaceAll(":", "");
  useEffect(() => {
    const sections = host.current?.querySelectorAll<HTMLElement>("[data-chapter]");
    if (!sections) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset["chapter"]));
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={host} data-ground="paper" aria-label="Project story" className="rule-b">
      <div className="shell case-story">
        <nav aria-label="Case study chapters" className="case-story-nav">
          <p className="label">Inside the project</p>
          {chapters.map(([title], index) => (
            <a
              key={title}
              href={"#" + uid + "-" + index}
              aria-current={active === index ? "location" : undefined}
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {title}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <div className="case-story-chapters">
          {chapters.map(([title, body], index) => (
            <article
              key={title}
              id={uid + "-" + index}
              data-chapter={index}
              className="case-story-chapter"
            >
              <ScrubReveal hold as="div">
                <p className="label">{String(index + 1).padStart(2, "0")} / Project story</p>
                <h2 className="display-md">{title}</h2>
                <p className="case-story-body">{body}</p>
              </ScrubReveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
