/**
 * Resolves a CSS custom property (e.g. "--text") to concrete [r,g,b] in
 * 0..1, honouring whatever `data-ground`/`data-theme` context `contextEl`
 * sits inside.
 *
 * The design tokens in styles.css are OKLCH, and modern browsers now
 * preserve that as the *computed* value of a color property (they no
 * longer collapse it to rgb()) — so `getComputedStyle(...).color` can come
 * back as the literal string "oklch(0.34 0.15 264)". Rather than hand-roll
 * an OKLCH→sRGB conversion that would silently drift the moment a token in
 * styles.css changes, this hands that string to Canvas2D — which parses
 * any CSS color syntax, oklch included — and reads back the sRGB bytes it
 * actually rasterized. One tiny offscreen canvas, reused across calls.
 */

let probe: HTMLDivElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

function ensureProbe(): void {
  if (!probe) {
    probe = document.createElement("div");
    probe.style.position = "absolute";
    probe.style.width = "0";
    probe.style.height = "0";
    probe.style.opacity = "0";
    probe.style.pointerEvents = "none";
    probe.setAttribute("aria-hidden", "true");
  }
  if (!ctx) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    ctx = canvas.getContext("2d", { willReadFrequently: true });
  }
}

export function readCssColorRGB(contextEl: Element, varName: string): [number, number, number] {
  ensureProbe();
  if (!probe || !ctx) return [0, 0, 0];

  contextEl.appendChild(probe);
  probe.style.color = `var(${varName})`;
  const resolved = getComputedStyle(probe).color;
  contextEl.removeChild(probe);

  try {
    ctx.fillStyle = resolved;
  } catch {
    return [0, 0, 0];
  }
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [(data[0] ?? 0) / 255, (data[1] ?? 0) / 255, (data[2] ?? 0) / 255];
}
