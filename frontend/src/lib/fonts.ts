/**
 * Cobalt's three faces (Michroma/Tenor Sans/Krona One), loaded only when
 * Cobalt is the active theme — Obsidian's set (Unbounded/Jost/Agdasima)
 * stays in `__root.tsx`'s static eager `<link>` since Obsidian is the
 * default for a first-time visitor. Previously both full sets loaded
 * eagerly for everyone regardless of active theme; one was always wasted,
 * render-blocking bytes.
 *
 * Two call sites intentionally share this exact href/id:
 *  - `__root.tsx`'s pre-paint bootstrap script carries a HARDCODED copy of
 *    this same URL/id (an inline `<script>` can't import a module) so a
 *    returning Cobalt visitor's font request starts before first paint,
 *    same anti-FOUC shape as the data-theme stamp right next to it. If
 *    this href ever changes, that copy must change with it.
 *  - `ThemeProvider.setTheme()` calls `ensureCobaltFonts()` directly, so an
 *    in-session Obsidian -> Cobalt toggle starts the font fetch the
 *    instant the switch is requested, well before the radial wipe (0.7s)
 *    finishes covering the viewport.
 */
export const COBALT_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Michroma&family=Tenor+Sans&family=Krona+One&display=swap";
const COBALT_LINK_ID = "maco-cobalt-fonts";

export function ensureCobaltFonts(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(COBALT_LINK_ID)) return;
  const link = document.createElement("link");
  link.id = COBALT_LINK_ID;
  link.rel = "stylesheet";
  link.href = COBALT_FONTS_HREF;
  document.head.appendChild(link);
}
