import { useEffect, useRef } from "react";

const SCRIPT_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;600&family=Noto+Sans:wght@400;600&family=Noto+Sans+Armenian:wght@400;600&family=Noto+Sans+Bengali:wght@400;600&family=Noto+Sans+Devanagari:wght@400;600&family=Noto+Sans+Georgian:wght@400;600&family=Noto+Sans+Gujarati:wght@400;600&family=Noto+Sans+Gurmukhi:wght@400;600&family=Noto+Sans+Hebrew:wght@400;600&family=Noto+Sans+JP:wght@400;600&family=Noto+Sans+KR:wght@400;600&family=Noto+Sans+Kannada:wght@400;600&family=Noto+Sans+Malayalam:wght@400;600&family=Noto+Sans+Oriya:wght@400;600&family=Noto+Sans+SC:wght@400;600&family=Noto+Sans+Tamil:wght@400;600&family=Noto+Sans+Telugu:wght@400;600&family=Noto+Sans+Thai:wght@400;600&display=swap";

const LINK_ID = "maco-script-fonts";

function injectScriptFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(LINK_ID)) return;
  const link = document.createElement("link");
  link.id = LINK_ID;
  link.rel = "stylesheet";
  link.href = SCRIPT_FONTS_HREF;
  link.media = "print";
  link.onload = () => {
    link.media = "all";
  };
  document.head.appendChild(link);
}

/**
 * Loads multilingual script fonts when the observed node nears the viewport.
 * Keeps critical brand fonts in __root for LCP.
 */
export function useScriptFontsWhenVisible<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          injectScriptFonts();
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
