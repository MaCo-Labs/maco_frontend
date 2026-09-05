import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getScrollRuntime } from "@/lib/scroll-runtime";
import { ensureCobaltFonts } from "@/lib/fonts";

export type Theme = "obsidian" | "cobalt";

type Origin = { x: number; y: number };

const KEY = "maco-theme";

// useLayoutEffect no-ops on the server (React warns if called during SSR),
// so it must fall back to useEffect there — but on the client it must stay
// useLayoutEffect: it runs after the hydration commit but before the browser
// paints, so a returning Cobalt visitor's localStorage correction lands
// before first paint instead of one visible Obsidian-tinted frame after it.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const ThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme, origin?: Origin) => void;
}>({
  theme: "obsidian",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("obsidian");
  const [wipe, setWipe] = useState<(Origin & { theme: Theme }) | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<{ kill: () => void } | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const stored = window.localStorage.getItem(KEY) as Theme | null;
    if (stored === "obsidian" || stored === "cobalt") setThemeState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Radial reveal: an overlay tinted with the INCOMING theme's --bg grows
  // from the toggle's click point; the real `data-theme` swap (and its
  // reflow) is deferred to the tween's end, once the overlay already
  // covers the viewport with matching color — so the flip underneath is
  // invisible, and the visible motion is purely the circle's growth.
  useEffect(() => {
    if (!wipe) return;
    const el = overlayRef.current;
    let cancelled = false;

    // A new click mid-wipe (rapid double-toggle) replaces `wipe` before this
    // one's tween finishes — kill it first so its `onComplete` can never fire
    // late and clear the newer wipe's state out from under it.
    tweenRef.current?.kill();
    tweenRef.current = null;

    getScrollRuntime().then((rt) => {
      if (cancelled) return;
      if (!rt || !el) {
        setThemeState(wipe.theme);
        setWipe(null);
        return;
      }
      const radius = Math.hypot(window.innerWidth, window.innerHeight);
      tweenRef.current = rt.gsap.fromTo(
        el,
        { clipPath: `circle(0px at ${wipe.x}px ${wipe.y}px)` },
        {
          clipPath: `circle(${radius}px at ${wipe.x}px ${wipe.y}px)`,
          duration: 0.7,
          ease: "power2.out",
          onComplete: () => {
            tweenRef.current = null;
            setThemeState(wipe.theme);
            setWipe(null);
          },
        },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [wipe]);

  const setTheme = (t: Theme, origin?: Origin) => {
    try {
      window.localStorage.setItem(KEY, t);
    } catch {
      /* storage unavailable */
    }
    // Start the fetch the instant a Cobalt switch is requested, not after
    // the wipe reveals it — the radial wipe still takes 0.7s to cover the
    // viewport, plenty of headroom for the stylesheet to resolve first.
    if (t === "cobalt") ensureCobaltFonts();
    if (origin && !reduced) {
      setWipe({ theme: t, x: origin.x, y: origin.y });
    } else {
      setThemeState(t);
    }
  };

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
      {wipe && (
        <div
          ref={overlayRef}
          data-theme={wipe.theme}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[100]"
          style={{ background: "var(--bg)" }}
        />
      )}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
