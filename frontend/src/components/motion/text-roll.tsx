import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE_EMPHASIS } from "@/lib/motion";

const STAGGER = 0.028;

/**
 * TextRoll — per-character roll on hover: the current label spins away
 * upward while its replacement rises in from below, staggered outward
 * from the centre. Splitting into <span> chars removes the string from
 * the accessibility tree, so the wrapper carries `role="text"` + the real
 * label via `aria-label` (Safari/VoiceOver's documented pattern for
 * decorative character-level markup) — a screen reader hears one word,
 * never 5 single-letter spans.
 *
 * Reduced motion renders the label as plain text with no split and no
 * hover transform: nothing to opt out of, nothing to revert.
 */
export function TextRoll({ children, className = "" }: { children: string; className?: string }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  const chars = children.split("");
  const mid = (chars.length - 1) / 2;

  return (
    <motion.span
      initial="rest"
      whileHover="hovered"
      role="text"
      aria-label={children}
      className={`relative inline-block overflow-hidden align-bottom ${className}`}
    >
      <span aria-hidden="true" className="block">
        {chars.map((c, i) => (
          <RollChar key={i} delay={STAGGER * Math.abs(i - mid)} from={0} to="-100%">
            {c}
          </RollChar>
        ))}
      </span>
      <span aria-hidden="true" className="absolute inset-0 block">
        {chars.map((c, i) => (
          <RollChar key={i} delay={STAGGER * Math.abs(i - mid)} from="100%" to={0}>
            {c}
          </RollChar>
        ))}
      </span>
    </motion.span>
  );
}

function RollChar({
  children,
  delay,
  from,
  to,
}: {
  children: ReactNode;
  delay: number;
  from: number | string;
  to: number | string;
}) {
  return (
    <motion.span
      variants={{ rest: { y: from }, hovered: { y: to } }}
      transition={{ ease: EASE_EMPHASIS, duration: 0.4, delay }}
      className="inline-block"
    >
      {children === " " ? " " : children}
    </motion.span>
  );
}
