import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "obsidian" | "cobalt";

const KEY = "maco-theme";

const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "obsidian",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("obsidian");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY) as Theme | null;
    if (stored === "obsidian" || stored === "cobalt") setThemeState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      window.localStorage.setItem(KEY, t);
    } catch {
      /* storage unavailable */
    }
  };

  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
