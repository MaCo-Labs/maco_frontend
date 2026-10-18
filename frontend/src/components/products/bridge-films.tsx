import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { bridgeFilms } from "@/content/maco";
import { useOverlayMenu } from "@/hooks/use-overlay-menu";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Film = (typeof bridgeFilms)[number];

function FilmPlayer({ film }: { film: Film }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) videoRef.current?.pause();
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  return (
    <div className="bridge-cinema-screen">
      <video
        ref={videoRef}
        controls
        playsInline
        autoPlay={!reduced}
        preload="metadata"
        poster={film.poster}
        aria-label={`Bridge film: ${film.title}`}
        onError={() => setFailed(true)}
        src={film.src}
      >
        Your browser does not support video. <a href={film.src}>Open the film</a>.
      </video>
      {failed && (
        <p role="status" className="bridge-cinema-error">
          The film could not load. <a href={film.src}>Open the video directly</a>.
        </p>
      )}
    </div>
  );
}

/** Posters are the only media loaded before a deliberate film selection. */
export function BridgeFilms() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const uid = useId();
  const film = bridgeFilms[selected]!;
  useOverlayMenu({ open, setOpen, panelRef, triggerRef });

  function watch(event: MouseEvent<HTMLButtonElement>, index: number) {
    triggerRef.current = event.currentTarget;
    setSelected(index);
    setOpen(true);
  }

  return (
    <>
      <div className="bridge-film-library" role="group" aria-label="Bridge films">
        <div className="bridge-film-library-heading">
          <p>Bridge, in motion.</p>
          <span>Three short films</span>
        </div>
        <div className="bridge-film-picks">
          {bridgeFilms.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="bridge-film-pick"
              onClick={(event) => watch(event, index)}
              aria-haspopup="dialog"
              aria-label={`Watch ${item.title} ${item.duration}`}
            >
              <img src={item.poster} alt="" width={360} height={640} loading="lazy" />
              <span className="bridge-film-pick-copy">
                <span className="bridge-film-pick-title">{item.title}</span>
                <span className="bridge-film-pick-duration">
                  <span aria-hidden="true">▷</span> {item.duration}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-title`}
            className="bridge-cinema"
            data-ground="deep"
            data-lenis-prevent
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <button
              type="button"
              className="bridge-film-close"
              aria-label="Close Bridge films"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <div className="bridge-cinema-layout">
              <FilmPlayer key={film.id} film={film} />
              <div className="bridge-cinema-copy">
                <p className="bridge-cinema-subject">Bridge films / {film.subject}</p>
                <h2 id={`${uid}-title`}>{film.title}</h2>
                <p className="bridge-cinema-description">{film.description}</p>
                <div
                  className="bridge-cinema-playlist"
                  role="group"
                  aria-label="Choose a Bridge film"
                >
                  {bridgeFilms.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected === index}
                      onClick={() => {
                        setSelected(index);
                        panelRef.current?.scrollTo({ top: 0, behavior: "instant" });
                      }}
                    >
                      <img src={item.poster} alt="" width={360} height={640} />
                      <span>
                        <span className="bridge-cinema-film-title">{item.title}</span>
                        <span className="bridge-cinema-film-meta">
                          {selected === index ? "Selected" : item.subject}
                        </span>
                      </span>
                      <span className="bridge-cinema-duration">{item.duration}</span>
                    </button>
                  ))}
                </div>
                <p className="bridge-cinema-note">{film.note}</p>
                <details className="bridge-cinema-transcript" key={film.id}>
                  <summary>Read the film</summary>
                  <p>Instrumental soundtrack. On-screen story:</p>
                  {film.transcript.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </details>
                {film.credit && (
                  <p className="bridge-cinema-credit">
                    <a href={film.credit.href} target="_blank" rel="noopener noreferrer">
                      {film.credit.text}
                    </a>{" "}
                    <a href={film.credit.license} target="_blank" rel="noopener noreferrer">
                      License
                    </a>
                    .
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
