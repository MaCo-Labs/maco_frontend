import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { BridgeFilms } from "./bridge-films";
import { Safari } from "@/components/media/safari";
import { Iphone } from "@/components/media/iphone";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import "./products.css";

const views = [
  {
    title: "Your workspace",
    image: "/media/bridge/tour-home.webp",
    caption: "A clear view of tasks, priorities and the work that needs your attention.",
  },
  {
    title: "Project boards",
    image: "/media/bridge/tour-board.webp",
    caption: "Move work forward with visible ownership, task status and a shared project view.",
  },
  {
    title: "On the move",
    image: "/media/bridge/tour-mobile.webp",
    caption: "The same workspace, sized for the moments you are away from your desk.",
  },
] as const;

export function BridgeTour({ compact = false }: { compact?: boolean }) {
  const [view, setView] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [offscreen, setOffscreen] = useState(true);
  const [hiddenTab, setHiddenTab] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry?.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    const onVisibility = () => setHiddenTab(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % views.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + views.length) % views.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = views.length - 1;
    else return;
    event.preventDefault();
    setView(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  // Keyboard focus holds the view still; a mouse click on a dot doesn't, or a
  // single click would stop the tour until the visitor clicked elsewhere.
  function onFocus(event: FocusEvent<HTMLDivElement>) {
    if (event.target.matches(":focus-visible")) setFocused(true);
  }
  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  }

  const paused = hovered || focused || offscreen || hiddenTab || filmOpen;

  return (
    <div
      ref={rootRef}
      className={`bridge-tour ${compact ? "bridge-tour-compact" : ""}`}
      data-paused={paused || undefined}
      data-reduced={reduced || undefined}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className="bridge-tour-toolbar">
        <p className="bridge-tour-title" aria-hidden="true">
          {views[view]!.title}
        </p>
        <div ref={tabsRef} role="tablist" aria-label="Explore Bridge" className="bridge-steps">
          {views.map((item, i) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-label={item.title}
              aria-selected={view === i}
              aria-controls={`${uid}-panel`}
              tabIndex={view === i ? 0 : -1}
              className="bridge-step"
              onClick={() => setView(i)}
              onKeyDown={(event) => keyboard(event, i)}
            >
              <span className="bridge-step-track">
                {view === i && (
                  <span
                    className="bridge-step-fill"
                    onAnimationEnd={() => setView((v) => (v + 1) % views.length)}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${view}`}
        tabIndex={0}
        className="bridge-tour-stage"
        data-mobile={view === 2 || undefined}
      >
        {view === 2 ? (
          <div className="bridge-phone-stage">
            <Iphone
              className="bridge-iphone"
              src={views[view]!.image}
              alt="Bridge mobile dashboard showing a fictional demo workspace"
            />
          </div>
        ) : (
          <Safari
            src={views[view]!.image}
            alt={
              "Bridge " + views[view]!.title.toLowerCase() + " showing a fictional demo workspace"
            }
            url="Bridge / Demo workspace"
            screenAspectRatio={3 / 2}
          />
        )}
      </div>
      <div className="bridge-tour-caption">
        <p>{views[view]!.caption}</p>
        <span>Demo workspace shown</span>
      </div>
      <BridgeFilms onOpenChange={setFilmOpen} />
    </div>
  );
}
