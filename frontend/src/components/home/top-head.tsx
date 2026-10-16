import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Magnetic } from "@/components/motion/magnetic";
import { Safari } from "@/components/media/safari";
import { Iphone } from "@/components/media/iphone";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import "./studio.css";

const websiteExamples = [
  {
    title: "Ananta Nethralaya",
    note: "A digital home for an eye clinic",
    src: "/media/work/ananta-nethralaya/1.webp",
    url: "anantanethralaya.org",
    to: "/work/$slug",
    slug: "ananta-nethralaya",
  },
  {
    title: "Al Afzah",
    note: "A website for a Qatar-based construction company",
    src: "/media/work/al-afzah/1.webp",
    url: "al-afzahgroup.com",
    to: "/work/$slug",
    slug: "al-afzah",
  },
  {
    title: "Soorath Autos",
    note: "A digital showroom for a pre-owned car dealership",
    src: "/media/work/soorath-autos/1.webp",
    url: "soorathautos.in",
    to: "/work/$slug",
    slug: "soorath-autos",
  },
  {
    title: "HeadGreen",
    note: "A website for corporate EV mobility",
    src: "/media/work/headgreen/2.webp",
    url: "headgreen.in",
    to: "/work/$slug",
    slug: "headgreen",
  },
] as const;
const mobileExamples = [
  {
    title: "Driver’s Diary",
    note: "A fleet operations platform, built for HeadGreen",
    src: "/media/products/drivers-diary/interface.webp",
    url: "",
    to: "/products/$slug",
    slug: "drivers-diary",
  },
  {
    title: "Bridge mobile",
    note: "Our connected workspace, on the move · Demo shown",
    src: "/media/bridge/tour-mobile.webp",
    url: "",
    to: "/products/$slug",
    slug: "bridge",
  },
] as const;
const builds = [
  { label: "Websites", examples: websiteExamples },
  {
    label: "Business software",
    examples: [
      {
        title: "Bridge",
        note: "Our connected workspace · Demo shown",
        src: "/media/bridge/tour-board.webp",
        url: "Bridge / Demo workspace",
        to: "/products/$slug",
        slug: "bridge",
      },
    ],
  },
  { label: "Mobile platforms", examples: mobileExamples },
] as const;

/** MaCo-wide introduction, with controlled rotation of real work in each category. */
export function TopHead() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [examples, setExamples] = useState([0, 0, 0]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const uid = useId();
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerX, { stiffness: 180, damping: 26 });
  const rotateY = useSpring(pointerY, { stiffness: 180, damping: 26 });
  const collection = builds[active]!;
  const example = examples[active] ?? 0;
  const project = collection.examples[example]!;
  const exampleCount = collection.examples.length;
  function selectCategory(index: number) {
    setActive(index);
  }
  useEffect(() => {
    const host = showcaseRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(host);
    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);
  useEffect(() => {
    if (reduced || hovered || focused || !visible || !pageVisible) return;
    const timer = window.setTimeout(() => {
      setExamples((previous) =>
        previous.map((value, i) => (i === active ? (value + 1) % exampleCount : value)),
      );
      setActive((previous) => (previous + 1) % builds.length);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [active, example, exampleCount, reduced, hovered, focused, visible, pageVisible]);
  const screen = (
    <AnimatePresence initial={false}>
      <motion.img
        key={project.src}
        src={project.src}
        alt={
          active === 0
            ? project.title + " homepage designed and developed by MaCo"
            : active === 1
              ? "Bridge project board showing fictional demo tasks"
              : project.title + " mobile interface"
        }
        className="studio-hero-screen"
        style={{ objectFit: active === 2 ? "contain" : "cover" }}
        loading="eager"
        fetchPriority={active === 0 && example === 0 ? "high" : "auto"}
        decoding="async"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.4 }}
      />
    </AnimatePresence>
  );
  function track(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 5);
    pointerY.set(((event.clientX - rect.left) / rect.width - 0.5) * 7);
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % builds.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + builds.length) % builds.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = builds.length - 1;
    else return;
    event.preventDefault();
    selectCategory(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }
  return (
    <section data-ground="deep" aria-label="Introduction" className="studio-hero">
      <div className="shell studio-hero-shell">
        <div className="studio-hero-grid">
          <div className="studio-hero-copy">
            <p className="studio-hero-eyebrow">MaCo — Software & digital experiences</p>
            <h1>
              Built around
              <br />
              <span>your business.</span>
            </h1>
            <p className="studio-hero-lead">
              From the first impression to the systems your team runs on. We design, build and
              support the digital side of your business.
            </p>
            <div className="studio-hero-actions">
              <Magnetic>
                <Link to="/contact" className="btn-solid">
                  Start a project <span aria-hidden="true">↗</span>
                </Link>
              </Magnetic>
              <Link to="/work" className="studio-text-link">
                Explore our work <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="studio-hero-location">
              Based in Kochi. Working across India and the Middle East.
            </p>
          </div>
          <div
            className="studio-hero-showcase"
            ref={showcaseRef}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setHovered(true);
            }}
            onPointerLeave={() => setHovered(false)}
            onFocusCapture={(event) => {
              setFocused(event.target.matches(":focus-visible"));
            }}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
            }}
          >
            <div className="studio-hero-showcase-label">
              <span>MaCo in practice</span>
            </div>
            <div
              id={uid + "-panel"}
              role="tabpanel"
              aria-labelledby={uid + "-tab-" + active}
              tabIndex={0}
              className="studio-hero-stage"
              onPointerMove={track}
              onPointerLeave={() => {
                pointerX.set(0);
                pointerY.set(0);
              }}
            >
              <motion.div
                className="studio-hero-desk"
                style={{
                  rotateX: reduced ? 0 : rotateX,
                  rotateY: reduced ? 0 : rotateY,
                  transformPerspective: 1200,
                }}
              >
                <div className="studio-hero-back-window" aria-hidden="true">
                  <Safari
                    src="/media/bridge/tour-board.webp"
                    url="Bridge / Demo workspace"
                    fit="cover"
                  />
                </div>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active}
                    className={
                      "studio-hero-main-window" + (active === 2 ? " studio-hero-main-phone" : "")
                    }
                    initial={reduced ? false : { opacity: 0, y: 18, rotate: 1 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: reduced ? 0 : -12 }}
                    transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {active === 2 ? (
                      <Iphone screenColor={project.slug === "bridge" ? "#f5f6f8" : "#10121c"}>
                        {screen}
                      </Iphone>
                    ) : (
                      <Safari url={project.url}>{screen}</Safari>
                    )}
                  </motion.div>
                </AnimatePresence>
                {active !== 2 && (
                  <div className="studio-hero-phone-companion" aria-hidden="true">
                    <Iphone
                      screenColor={example % 2 ? "#f5f6f8" : "#10121c"}
                      src={mobileExamples[example % mobileExamples.length]!.src}
                    />
                  </div>
                )}
              </motion.div>
            </div>
            <div
              className="studio-hero-project-caption"
              aria-live={reduced ? "polite" : "off"}
              aria-atomic="true"
            >
              <div>
                <strong>{project.title}</strong>
                <p>{project.note}</p>
              </div>
              <Link
                to={project.to}
                params={{ slug: project.slug }}
                aria-label={"Explore " + project.title}
              >
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div
              className="studio-hero-media-tabs"
              role="tablist"
              aria-label="Explore MaCo’s work"
              ref={tabsRef}
            >
              {builds.map((build, i) => (
                <button
                  key={build.label}
                  type="button"
                  role="tab"
                  id={uid + "-tab-" + i}
                  aria-selected={active === i}
                  aria-controls={uid + "-panel"}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => {
                    selectCategory(i);
                  }}
                  onKeyDown={(event) => keyboard(event, i)}
                >
                  <span>0{i + 1}</span>
                  {build.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="studio-hero-footer">
          <p>One team. From idea to everyday use.</p>
          <div>
            <Link to="/services/$slug" params={{ slug: "business-software" }}>
              Business Software <span aria-hidden="true">↗</span>
            </Link>
            <Link to="/services/$slug" params={{ slug: "digital-solutions" }}>
              Digital Solutions <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-nav-hint hero-nav-hint-left" aria-hidden="true">
        <span className="label">Menu</span>
        <span className="hero-nav-hint-chevron" />
      </div>
      <div className="hero-nav-hint hero-nav-hint-right" aria-hidden="true">
        <span className="label">Menu</span>
        <span className="hero-nav-hint-chevron" />
      </div>
    </section>
  );
}
