import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { responsiveWork } from "@/lib/responsive-image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import "./work.css";

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;
const VISIBLE_BEHIND = 3;

/** Hover or focus opens a screen; its neighbours give way on a falloff. */
function GalleryAccordion({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="case-accordion">
      {images.map((src, i) => {
        const distance = Math.abs(i - open);
        return (
          <button
            key={src}
            type="button"
            aria-label={`${title} website, screen ${i + 1} of ${images.length}`}
            aria-pressed={i === open}
            className="case-accordion-panel"
            style={{ flexGrow: distance === 0 ? 8 : distance === 1 ? 1.4 : 0.7 }}
            onPointerEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
          >
            <img src={src} alt="" width={1400} height={662} decoding="async" />
          </button>
        );
      })}
    </div>
  );
}

/** A stack in depth: swipe or tap the front screen and it goes to the back. */
function GalleryStack({ images, title }: { images: string[]; title: string }) {
  const [front, setFront] = useState(0);
  const next = () => setFront((f) => (f + 1) % images.length);
  return (
    <div>
      <div className="case-stack">
        {images.map((src, i) => {
          const depth = (i - front + images.length) % images.length;
          const isFront = depth === 0;
          return (
            <motion.button
              key={src}
              type="button"
              tabIndex={isFront ? 0 : -1}
              aria-hidden={!isFront}
              aria-label={`${title} website, screen ${i + 1} of ${images.length}. Show the next screen.`}
              className="case-stack-card"
              style={{ zIndex: images.length - depth }}
              initial={false}
              animate={{
                y: depth * -14,
                scale: 1 - depth * 0.06,
                opacity: depth > VISIBLE_BEHIND ? 0 : 1,
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
              drag={isFront ? "x" : false}
              dragSnapToOrigin
              dragElastic={0.7}
              onDragEnd={(_, info) => {
                if (
                  Math.abs(info.offset.x) > SWIPE_DISTANCE ||
                  Math.abs(info.velocity.x) > SWIPE_VELOCITY
                )
                  next();
              }}
              onTap={() => isFront && next()}
            >
              <img
                src={src}
                {...responsiveWork(src, "92vw")}
                alt=""
                width={1400}
                height={662}
                draggable={false}
                decoding="async"
              />
            </motion.button>
          );
        })}
      </div>
      <p className="label case-stack-count" aria-live="polite">
        {front + 1} / {images.length}
      </p>
    </div>
  );
}

/** Reduced-motion phone view: every screen in a plain native swipe strip. */
function GalleryStrip({ images, title }: { images: string[]; title: string }) {
  return (
    <div className="case-strip" tabIndex={0} role="group" aria-label={`${title} screens`}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          {...responsiveWork(src, "88vw")}
          alt={`${title} website, screen ${i + 1} of ${images.length}`}
          width={1400}
          height={662}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}

/**
 * A case study's real screenshots: accordion for a fine pointer, swipeable
 * stack for touch. Input type is only known after mount, so the server renders
 * the first screen in the same box and nothing jumps.
 */
export function CaseGallery({
  images,
  title,
  slug,
  className = "",
}: {
  images: string[];
  title: string;
  /** Pairs this gallery with its card in WorkCollection for the route morph. */
  slug: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  useEffect(() => setMounted(true), []);

  return (
    <div
      className={`case-gallery ${className}`}
      data-reduced={reduced || undefined}
      style={{ viewTransitionName: `work-${slug}` }}
    >
      {!mounted ? (
        <img
          src={images[0]}
          alt={`${title} website`}
          width={1400}
          height={662}
          className="case-gallery-first"
        />
      ) : fine ? (
        <GalleryAccordion images={images} title={title} />
      ) : reduced ? (
        <GalleryStrip images={images} title={title} />
      ) : (
        <GalleryStack images={images} title={title} />
      )}
    </div>
  );
}
