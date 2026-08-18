import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

type ScrambledTextProps = {
  text: string;
  className?: string;
  duration?: number;
  speed?: number;
  disabled?: boolean;
};

/**
 * React Bits Scrambled Text — free component pattern.
 * Decrypt-style reveal for brand script cycling in the multilingual section.
 */
export function ScrambledText({
  text,
  className = "",
  duration = 900,
  speed = 28,
  disabled = false,
}: ScrambledTextProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (disabled || reduced) {
      setDisplay(text);
      return;
    }

    startRef.current = undefined;
    const tick = (now: number) => {
      if (startRef.current === undefined) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      const revealed = Math.floor(progress * text.length);

      const scrambled = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealed) return text[i];
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? char;
        })
        .join("");

      setDisplay(scrambled);

      if (progress < 1) {
        frameRef.current = window.setTimeout(() => requestAnimationFrame(tick), speed);
      } else {
        setDisplay(text);
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) window.clearTimeout(frameRef.current);
    };
  }, [text, duration, speed, disabled, reduced]);

  return <span className={className}>{display}</span>;
}
