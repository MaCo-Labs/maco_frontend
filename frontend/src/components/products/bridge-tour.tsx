import { useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useOverlayMenu } from "@/hooks/use-overlay-menu";
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
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  useOverlayMenu({ open, setOpen, panelRef, triggerRef });
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
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="bridge-reel-button"
        >
          <span aria-hidden="true">▷</span> Watch the film
        </button>
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
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-film-title`}
            className="bridge-film"
            data-ground="deep"
            data-lenis-prevent
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <button
              type="button"
              className="bridge-film-close"
              aria-label="Close Bridge film"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <h2 id={`${uid}-film-title`} className="sr-only">
              Bridge: Tasks. Sorted.
            </h2>
            <video
              controls
              playsInline
              autoPlay
              muted
              preload="metadata"
              poster="/media/bridge/teaser-poster.jpg"
            >
              <source src="/media/bridge/teaser.mp4" type="video/mp4" />
              Your browser does not support video.{" "}
              <a href="/media/bridge/teaser.mp4">Open the Bridge film</a>.
            </video>
            <p>Bridge by MaCo. Illustrative product film.</p>
          </div>,
          document.body,
        )}
    </div>
  );
}
