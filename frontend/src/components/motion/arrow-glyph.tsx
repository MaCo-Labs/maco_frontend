/**
 * The site's one CTA arrow — replaces the bare `→` character every call to
 * action used, so the mark can move: the shaft draws out to full length and
 * the head steps forward while the link or button around it is hovered.
 *
 * Hover is read off the ancestor in CSS (`a:hover` / `button:hover`, see
 * styles.css) rather than a Tailwind `group` class, so no call site has to
 * opt in — the 15 places that previously rendered the raw glyph swap one
 * span for one element and inherit the behaviour.
 *
 * At rest the shaft is short but present, not absent: a resting chevron
 * reads as "more" where a CTA needs to read as "go", so the hover extends
 * an arrow rather than completing one.
 */
export function ArrowGlyph() {
  return (
    <svg
      className="arrow-glyph"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="arrow-glyph-shaft"
        d="M4 12h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="arrow-glyph-head"
        d="m10 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
