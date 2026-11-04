import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/mark";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const REACH = 95;

type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number };

/**
 * The MaCo mark as dots. They gather into the logo when it first scrolls into
 * view, part around the pointer and spring home; a press or tap sends a
 * shockwave. Plain 2D canvas with its own rAF, which stops once every dot has
 * settled or the mark leaves the screen. Still `<Mark>` under reduced motion.
 * Own rAF rather than gsap.ticker because 404s make this eager, and GSAP stays
 * behind the scroll runtime's lazy import.
 */
export function ParticleMark({ className = "h-[26rem]" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);
  const live = mounted && !reduced && !failed;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cx = canvas?.getContext("2d");
    if (!live || !canvas || !cx) return;

    let dots: Dot[] = [];
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let inView = false;
    let settled = false;
    let gatherStart = 0;
    const logo = new Image();

    const wake = () => {
      settled = false;
      if (!frame && inView) frame = requestAnimationFrame(tick);
    };

    function build() {
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;
      if (!W || !H || !logo.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      cx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = Math.min((W * 0.92) / logo.naturalWidth, (H * 0.92) / logo.naturalHeight);
      const w = logo.naturalWidth * scale;
      const h = logo.naturalHeight * scale;
      const step = Math.max(4, Math.round(w / 80));
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.drawImage(logo, (W - w) / 2, (H - h) / 2, w, h);
      const { data } = o.getImageData(0, 0, W, H);
      const first = dots.length === 0;
      dots = [];
      for (let y = 0; y < H; y += step)
        for (let x = 0; x < W; x += step)
          if (data[(y * W + x) * 4 + 3]! > 128)
            dots.push({
              hx: x,
              hy: y,
              // Scattered on first build; gathers when scrolled into view.
              x: first ? Math.random() * W : x,
              y: first ? Math.random() * H : y,
              vx: 0,
              vy: 0,
            });
      wake();
    }

    function tick(now: number) {
      frame = 0;
      if (!inView) return;
      if (!gatherStart) gatherStart = now;
      // Soft at first, so the logo condenses rather than snaps together.
      const pull = 0.012 + 0.033 * Math.min(1, (now - gatherStart) / 1400);
      cx!.clearRect(0, 0, canvas!.clientWidth, canvas!.clientHeight);
      cx!.fillStyle = getComputedStyle(canvas!).color;
      let moving = pointer !== null;
      for (const d of dots) {
        if (pointer) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < REACH) {
            const f = (1 - dist / REACH) * 2.4;
            d.vx += (dx / dist) * f;
            d.vy += (dy / dist) * f;
          }
        }
        d.vx = (d.vx + (d.hx - d.x) * pull) * 0.84;
        d.vy = (d.vy + (d.hy - d.y) * pull) * 0.84;
        d.x += d.vx;
        d.y += d.vy;
        const off = Math.hypot(d.x - d.hx, d.y - d.hy);
        if (off > 0.05 || Math.abs(d.vx) + Math.abs(d.vy) > 0.05) moving = true;
        const lift = Math.min(1, off / 40);
        cx!.globalAlpha = 0.55 + lift * 0.45;
        cx!.beginPath();
        cx!.arc(d.x, d.y, 1.7 + lift * 0.9, 0, Math.PI * 2);
        cx!.fill();
      }
      cx!.globalAlpha = 1;
      settled = !moving;
      if (!settled) frame = requestAnimationFrame(tick);
    }

    const point = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer = point(e);
      wake();
    };
    const onLeave = () => {
      pointer = null;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      const at = point(e);
      for (const d of dots) {
        const dx = d.x - at.x;
        const dy = d.y - at.y;
        const dist = Math.hypot(dx, dy) || 1;
        const f = 14 * Math.max(0, 1 - dist / 400);
        d.vx += (dx / dist) * f;
        d.vy += (dy / dist) * f;
      }
      wake();
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);

    logo.onload = build;
    logo.onerror = () => setFailed(true);
    logo.src = "/logo-mark.png";
    const resize = new ResizeObserver(build);
    resize.observe(canvas);
    const view = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) wake();
      },
      { threshold: 0.25 },
    );
    view.observe(canvas);
    // Asleep dots wouldn't otherwise pick up a theme switch's colour.
    const theme = new MutationObserver(wake);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelAnimationFrame(frame);
      theme.disconnect();
      view.disconnect();
      resize.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
    };
  }, [live]);

  return (
    <div
      className={`relative grid w-full place-items-center ${className}`}
      style={{ color: "var(--text)" }}
    >
      {live ? (
        // Absolute: an in-flow canvas sizes from its own width/height attributes,
        // which would push past this box and grow with every resize.
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      ) : (
        <Mark size={220} />
      )}
    </div>
  );
}
