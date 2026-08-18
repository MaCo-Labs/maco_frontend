/**
 * MaCo mark — logo-derived geometry.
 * Two stacked rails (M) with a cut block (C). Reacts to hover and theme.
 */

export function Mark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="1" y="1" width="30" height="30" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 24V9l4.5 7L16 9v15" stroke="currentColor" strokeWidth="2.2" />
      <path d="M25 11a5.5 5.5 0 0 0 0 11" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-[-0.04em] md:text-xl ${className}`}
      style={{ color: "var(--text)" }}
      aria-label="MaCo — Solutions. Technology. Growth."
    >
      <Mark size={28} className="shrink-0" />
      <span>MaCo</span>
    </span>
  );
}

export { MaCoSystemField, SystemField } from "@/components/system-field";
