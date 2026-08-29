import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

export type LayoutMode = "1" | "2" | "3";

const KEY = "maco-layout";

// Same reasoning as theme.tsx's own copy: useLayoutEffect no-ops on the
// server, so it falls back to useEffect there, but on the client it must
// stay useLayoutEffect so a stored override lands before first paint
// rather than one visible frame of layout 1 after it.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const LayoutCtx = createContext<{
  layout: LayoutMode;
  setLayout: (l: LayoutMode) => void;
}>({
  layout: "1",
  setLayout: () => {},
});

function parseLayout(v: string | null): LayoutMode | null {
  return v === "1" || v === "2" || v === "3" ? v : null;
}

/**
 * Layout-mode state — mirrors ThemeProvider's shape, kept as a separate
 * provider rather than folded into theme.tsx so that file's radial-wipe
 * logic stays uncluttered by an unrelated axis of state.
 *
 * `?layout=` in the URL is a non-persisting preview override (read here
 * AND in the pre-paint script in __root.tsx, which is what lets a mode be
 * screenshotted correctly on first paint before the switcher control
 * exists to set it any other way) — it wins over the stored value for
 * this load only; the stored value is untouched unless `setLayout` is
 * called explicitly.
 */
export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayoutState] = useState<LayoutMode>("1");

  useIsomorphicLayoutEffect(() => {
    const override = parseLayout(new URLSearchParams(window.location.search).get("layout"));
    if (override) {
      setLayoutState(override);
      return;
    }
    const stored = parseLayout(window.localStorage.getItem(KEY));
    if (stored) setLayoutState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-layout", layout);
  }, [layout]);

  const setLayout = (l: LayoutMode) => {
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      /* storage unavailable */
    }
    setLayoutState(l);
  };

  return <LayoutCtx.Provider value={{ layout, setLayout }}>{children}</LayoutCtx.Provider>;
}

export const useLayout = () => useContext(LayoutCtx);
