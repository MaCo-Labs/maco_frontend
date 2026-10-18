import { useId, useRef, useState, type KeyboardEvent } from "react";
import { BridgeFilms } from "./bridge-films";
import { Safari } from "@/components/media/safari";
import { Iphone } from "@/components/media/iphone";
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
  const tabsRef = useRef<HTMLDivElement>(null);
  const uid = useId();
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
  return (
    <div className={`bridge-tour ${compact ? "bridge-tour-compact" : ""}`}>
      <div className="bridge-tour-toolbar">
        <div ref={tabsRef} role="tablist" aria-label="Explore Bridge" className="bridge-tour-tabs">
          {views.map((item, i) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={view === i}
              aria-controls={`${uid}-panel`}
              tabIndex={view === i ? 0 : -1}
              onClick={() => setView(i)}
              onKeyDown={(event) => keyboard(event, i)}
            >
              {item.title}
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
      <BridgeFilms />
    </div>
  );
}
