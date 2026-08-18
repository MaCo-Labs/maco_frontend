import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  text: string;
  latin?: boolean;
};

/**
 * Center identity transition — blur resolve, no glyph scrambling.
 * Latin uses display font; scripts use project script fallbacks.
 */
export function CenterScriptTransition({ text, latin = false }: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <span
        style={{
          fontFamily: latin ? "var(--font-display)" : "var(--font-script-fallback)",
        }}
      >
        {text}
      </span>
    );
  }

  return (
    <motion.span
      key={text}
      initial={{ opacity: 0.35, filter: "blur(10px)", y: 8 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "inline-block",
        fontFamily: latin ? "var(--font-display)" : "var(--font-script-fallback)",
      }}
    >
      {text}
    </motion.span>
  );
}
