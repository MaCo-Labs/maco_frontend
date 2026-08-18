import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type BlurTextProps = {
  text: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  delay?: number;
  stepDuration?: number;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  disabled?: boolean;
};

/**
 * React Bits Blur Text — free component pattern (motion-based).
 * Text is always readable: opacity never goes to 0. Blur animates as enhancement.
 */
export function BlurText({
  text,
  animateBy = "words",
  direction = "top",
  delay = 200,
  stepDuration = 0.35,
  threshold = 0.1,
  rootMargin = "0px",
  className = "",
  disabled = false,
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [animateIn, setAnimateIn] = useState(disabled || reduced);

  useEffect(() => {
    if (disabled || reduced) {
      setAnimateIn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const run = () => setAnimateIn(true);

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      run();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [disabled, reduced, threshold, rootMargin]);

  const units = animateBy === "letters" ? text.split("") : text.split(/(\s+)/);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {units.map((unit, i) => {
        if (!unit) return null;
        const isSpace = /^\s+$/.test(unit);
        if (isSpace) return unit;

        return (
          <motion.span
            key={`${unit}-${i}`}
            initial={false}
            animate={
              animateIn
                ? { opacity: 1, filter: "blur(0px)", y: 0 }
                : {
                    opacity: 1,
                    filter: "blur(6px)",
                    y: direction === "top" ? -6 : 6,
                  }
            }
            transition={{
              duration: stepDuration,
              delay: (i * delay) / 1000,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: "inline-block" }}
          >
            {unit}
          </motion.span>
        );
      })}
    </span>
  );
}
