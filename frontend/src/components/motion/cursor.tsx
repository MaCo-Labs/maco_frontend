import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getScrollRuntime } from "@/lib/scroll-runtime";
import { groundAt, SECTION_SELECTOR } from "@/lib/ground";

/** The set `Magnetic` also gates on. Extended with an explicit
 *  `data-cursor` escape hatch for elements that need a specific state
 *  (`"media"`, `"torch"`) the tag alone can't express — `.closest()` finds
 *  whichever of these is nearest, so an explicit `data-cursor` on an outer
 *  wrapper wins over a plain `<a>`/`<button>` inside it. */
const CURSOR_SELECTOR = "a, button, [role='button'], input, textarea, select, [data-cursor]";

/** Resolve a delegated-event target to one of the cursor's states. Adding
 *  a new hoverable state is a `data-cursor="…"` attribute on that
 *  element, not a new branch here — the semantic-class-hook shape
 *  `docs/references/minhpham/NOTES.md` studied and recommended
 *  generalizing WORK's cursor-follow into (ROADMAP item 6 /
 *  `PHASE-2-MOTION-PLAN.md` item 2d), minus the class-per-state
 *  machinery: one attribute, one lookup.
 *
 * Tag alone isn't enough: TanStack Router's `<Link>` renders `<a>` for
 * every internal route, including CTAs styled with MaCo's existing
 * `.btn-solid`/`.btn-line` button classes (`site.tagline`'s "Start a
 * project", the contact form submit, every layout-nav CTA) — treating
 * every `<a>` as the small "link" dot would shrink those exactly where a
 * visitor expects the bigger, more confident "action" ring. Checking for
 * those two classes is the same signal the CSS itself already uses to
 * tell a button-shaped link from a plain text one; no new taxonomy. */
function resolveState(hit: Element): string {
  const explicit = hit.getAttribute("data-cursor");
  if (explicit) return explicit;
  if (hit.tagName === "BUTTON" || hit.getAttribute("role") === "button") return "action";
  if (hit.classList.contains("btn-solid") || hit.classList.contains("btn-line")) return "action";
  return hit.tagName === "A" ? "link" : "action";
}

/**
 * A restrained custom cursor — no trailing dot, no cursor-hiding of the OS
 * pointer outside an explicit opt-in zone (it sits alongside the real
 * cursor, not instead of it). `AI_HANDOFF.md` #8 flags custom-cursor work
 * as previously-reverted and needing its own live go/no-go before
 * shipping; this one is scoped deliberately small to survive that bar:
 *
 * - Fine pointer only (`(pointer: fine)`, the same query `Magnetic` gates
 *   on) — never rendered at all on touch, not just hidden by CSS.
 * - Fully disabled under reduced motion — no element, no listener, no
 *   ticker entry. A cursor that follows the pointer is exactly the kind
 *   of motion that setting exists to turn off.
 * - Theme/ground-aware by construction, not by a second lookup table: the
 *   same delegated `onOver` that resolves cursor STATE also copies
 *   whatever `[data-ground]` the hit target sits under onto the cursor
 *   element itself, and CSS paints from `var(--text)` — the same token
 *   `[data-ground="paper"|"deep"]` already remaps for every section
 *   (styles.css). Obsidian paper -> near-black ring, Obsidian deep ->
 *   near-white, Cobalt paper -> Cobalt blue, Cobalt deep -> near-white.
 *   Zero new state, zero per-section rule. 2026-09-01: `onOut` used to
 *   just delete the ground attribute, so the ring painted whatever
 *   `:root`'s OWN (paper) `--text` resolved to the instant nothing was
 *   hovered — confirmed live as a wrong-colour ring over a deep section
 *   with no hoverable directly under the pointer. `tick()` now falls back
 *   to `groundAt(grounds, py)` (`lib/ground.ts`, the same resolver
 *   EdgeNav's dot coloring uses) every frame a hover isn't overriding it,
 *   so the two can never independently disagree about what "the ground
 *   here" means.
 * - Scales/paints per state via event DELEGATION (`pointerover`/
 *   `pointerout` on `document`, checking `.closest()`), not per-element
 *   listeners — this component mounts once in `__root.tsx` for the app's
 *   lifetime and never remounts on a route change, so a fixed list of
 *   targets captured at mount would go stale the moment a visitor
 *   navigates. Delegation stays correct for whatever's in the DOM at the
 *   moment the pointer crosses it.
 * - Position is written with `gsap.quickSetter` inside a lerp on
 *   `gsap.ticker` (the same rAF loop Lenis itself runs on —
 *   `scroll-runtime.ts`) rather than a per-`pointermove` GSAP tween or
 *   React state — a quickSetter is a plain function call, the cheapest
 *   way GSAP has to write a value every frame, and a trailing lerp
 *   (rather than 1:1 tracking) is what makes it read as a physical ring
 *   with a little give, not a pixel glued to the OS pointer.
 * - Doesn't fight `Magnetic`: that component moves the BUTTON toward the
 *   pointer with its own spring; this one only ever moves itself. Same
 *   pointer, two independent reactions, never the same element.
 */
export function Cursor() {
  const capable = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const active = capable && !reduced;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Signals "a real cursor element exists" to CSS (styles.css uses it to
    // hide the OS pointer inside the torch zone only — see that rule's own
    // comment for why it's gated on this rather than just `[data-cursor]`
    // existing in the DOM). Removed on cleanup so a coarse-pointer or
    // reduced-motion visitor, who never runs this effect at all, never
    // gets a hidden OS pointer with nothing drawn to replace it.
    document.documentElement.setAttribute("data-cursor-active", "1");

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;

      const setX = rt.gsap.quickSetter(el, "x", "px");
      const setY = rt.gsap.quickSetter(el, "y", "px");
      let px = window.innerWidth / 2;
      let py = window.innerHeight / 2;
      let tx = px;
      let ty = py;
      let shown = false;
      // Explicit precedence over the per-frame fallback below — set by
      // onOver when the hovered element sits under a [data-ground]
      // ancestor (more precise than a y-sample, since the hovered element
      // IS the ground), cleared by onOut so the very next tick falls back
      // to reading the cursor's own position instead of holding a stale
      // value.
      let hoveredGround: string | null = null;

      const onMove = (e: PointerEvent) => {
        tx = e.clientX;
        ty = e.clientY;
        if (!shown) {
          shown = true;
          px = tx;
          py = ty;
          el.style.opacity = "1";
        }
      };
      const tick = () => {
        px += (tx - px) * 0.25;
        py += (ty - py) * 0.25;
        setX(px);
        setY(py);
        // Queried fresh every tick, not cached at effect setup — this
        // component mounts once in __root.tsx and never remounts on
        // navigation, so a `grounds` snapshot taken once would go stale
        // the moment a visitor client-navigates (the exact race
        // chrome.tsx's ground-sync ticker hit and fixed the same way —
        // see its own comment for the full story). A `querySelectorAll`
        // over a ~15-element page, once per frame, is the same order of
        // cost the ticker already pays to sample section geometry.
        // `SECTION_SELECTOR`, not the bare `[data-ground]` attribute —
        // this cursor element ITSELF carries `data-ground` a few lines
        // below, so the bare selector would match the cursor's own
        // current (fixed, pointer-following) position as a candidate
        // "section," a real bug caught live: the cursor happening to sit
        // near chrome.tsx's y=48 header sample point fed that effect the
        // cursor's OWN ground back, unrelated to the section actually
        // behind the header.
        const grounds = [...document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)];
        // `el.dataset["ground"]` doubles as its own sticky fallback — a
        // momentary no-match gap (see groundAt's own doc comment, lib/
        // ground.ts) holds the cursor's last tone instead of flashing.
        const prev = el.dataset["ground"] === "deep" ? "deep" : "paper";
        el.dataset["ground"] = hoveredGround ?? groundAt(grounds, py, prev);
      };
      const onOver = (e: PointerEvent) => {
        const hit = e.target instanceof Element ? e.target.closest(CURSOR_SELECTOR) : null;
        if (!hit) return;
        el.dataset["state"] = resolveState(hit);
        hoveredGround = hit.closest("[data-ground]")?.getAttribute("data-ground") ?? null;
        // Optional short word/phrase (§15-19's "VIEW" / "EXPLORE") — read
        // straight off the hit target rather than a second lookup table, CSS
        // renders it via `content: attr(data-label)` (styles.css).
        const label = hit.getAttribute("data-cursor-label");
        if (label) el.dataset["label"] = label;
        else delete el.dataset["label"];
      };
      const onOut = (e: PointerEvent) => {
        const selector = CURSOR_SELECTOR;
        const hit = e.target instanceof Element ? e.target.closest(selector) : null;
        if (!hit) return;
        // Moving between two children of the SAME hoverable (e.g. a
        // button's label span -> its icon span) fires pointerout with an
        // interactive target even though the pointer never actually left
        // it — checking relatedTarget (what's being entered) against the
        // same .closest() lookup is what stops the ring collapsing and
        // re-growing on every child boundary crossed inside one target.
        const next = e.relatedTarget instanceof Element ? e.relatedTarget.closest(selector) : null;
        if (next === hit) return;
        delete el.dataset["state"];
        hoveredGround = null;
        delete el.dataset["label"];
      };
      const onLeaveWindow = () => {
        el.style.opacity = "0";
        shown = false;
      };

      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);
      document.addEventListener("pointerleave", onLeaveWindow);
      rt.gsap.ticker.add(tick);

      cleanup = () => {
        rt.gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
        document.removeEventListener("pointerleave", onLeaveWindow);
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
      document.documentElement.removeAttribute("data-cursor-active");
    };
  }, [active]);

  if (!active) return null;

  return <div ref={ref} aria-hidden="true" className="maco-cursor" style={{ opacity: 0 }} />;
}
