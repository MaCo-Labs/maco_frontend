import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Delay in ms after enter */
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

/**
 * L1/L2 section motion — opacity + slight rise on enter.
 * Disabled under prefers-reduced-motion.
 */
export function MotionSection({
  children,
  className = "",
  style,
  delay = 0,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible || reduced ? "none" : "translate3d(0, 1.25rem, 0)",
        transition: reduced
          ? undefined
          : `opacity 0.85s var(--ease-emphasis) ${delay}ms, transform 0.85s var(--ease-emphasis) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
