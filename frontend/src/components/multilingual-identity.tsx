import { useCallback, useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useElementScrollProgress } from "@/hooks/use-scroll-progress";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScriptFontsWhenVisible } from "@/hooks/use-script-fonts";
import { CenterScriptTransition } from "@/components/multilingual/center-script-transition";
import { useCenterLanguageCycle } from "@/components/multilingual/use-center-language-cycle";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/**
 * Curated scripts — ONE NAME · MANY SCRIPTS.
 * Each peripheral glyph is visually distinct. Latin "MaCo" appears only at center.
 */
const SCRIPTS: readonly { text: string; lang: string }[] = [
  { text: "മാകോ", lang: "Malayalam" },
  { text: "மாகோ", lang: "Tamil" },
  { text: "మాకో", lang: "Telugu" },
  { text: "ಮಾಕೋ", lang: "Kannada" },
  { text: "माको", lang: "Hindi" },
  { text: "માકો", lang: "Gujarati" },
  { text: "ਮਾਕੋ", lang: "Punjabi" },
  { text: "মাকো", lang: "Bengali" },
  { text: "ମାକୋ", lang: "Odia" },
  { text: "ماكو", lang: "Arabic" },
  { text: "ماکو", lang: "Persian" },
  { text: "מאקו", lang: "Hebrew" },
  { text: "Мако", lang: "Russian" },
  { text: "Μάκο", lang: "Greek" },
  { text: "Մակո", lang: "Armenian" },
  { text: "მაკო", lang: "Georgian" },
  { text: "มาโก", lang: "Thai" },
  { text: "マコ", lang: "Japanese" },
  { text: "마코", lang: "Korean" },
  { text: "玛科", lang: "Chinese" },
];

const MOBILE_VISIBLE = 12;

/** Oval hive layout — symmetric ring around 50% / 50%. [x%, y%, layer, direction] */
const LAYOUT = [
  [50, 8, 1, 1],
  [32, 12, 0, -1],
  [68, 12, 0, 1],
  [18, 18, 2, 1],
  [82, 18, 2, -1],
  [40, 14, 1, 1],
  [60, 14, 1, -1],
  [10, 32, 0, 1],
  [90, 32, 0, -1],
  [14, 50, 1, 1],
  [86, 50, 1, -1],
  [12, 68, 2, -1],
  [88, 68, 2, 1],
  [22, 82, 0, 1],
  [78, 82, 0, -1],
  [36, 88, 1, 1],
  [64, 88, 1, -1],
  [50, 92, 2, 1],
  [26, 36, 1, -1],
  [74, 36, 1, 1],
] as const;

const SPEED = [46, 30, 18];
/** Shared anchor — center MaCo and surrounding converge target */
const CENTER: [number, number] = [50, 50];

type Item = { text: string; lang: string; x: number; y: number; layer: number; dir: number };

export function MultilingualIdentity() {
  const sectionRef = useScriptFontsWhenVisible<HTMLElement>();
  const progress = useElementScrollProgress(sectionRef);
  const reduced = useReducedMotion();
  const { centerText, centerLang, centerLatin, cycleActive } = useCenterLanguageCycle(
    sectionRef,
    reduced,
  );

  const items = useMemo<Item[]>(
    () =>
      SCRIPTS.map((s, i) => {
        const slot = LAYOUT[i];
        if (!slot) return null;
        const [x, y, layer, dir] = slot;
        return { ...s, x, y, layer, dir };
      }).filter((item): item is Item => item !== null),
    [],
  );
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const onMove = useCallback(
    (e: ReactPointerEvent) => {
      if (reduced || window.matchMedia("(pointer: coarse)").matches) {
        setPointer(null);
        return;
      }
      const r = sectionRef.current?.getBoundingClientRect();
      if (!r) return;
      setPointer({ x: e.clientX - r.left, y: e.clientY - r.top });
    },
    [reduced, sectionRef],
  );

  const p = reduced ? 1 : progress;

  const appear = reduced ? 1 : smootherstep(clamp01((p - 0.02) / 0.22));
  const travel = reduced ? 1 : smootherstep(clamp01((p - 0.18) / 0.55));
  const converge = reduced ? 1 : smootherstep(clamp01((p - 0.55) / 0.24));
  const dominate = reduced ? 1 : smootherstep(clamp01((p - 0.78) / 0.2));
  const resolve = reduced ? 1 : clamp01((p - 0.94) / 0.06);

  const centerScale = 1 + dominate * 0.55 + resolve * 0.12;
  const centerTrack = resolve * -0.05;
  const legendOpacity = 0.45 + resolve * 0.55;

  return (
    <section
      ref={sectionRef}
      className="rule-b relative overflow-hidden"
      onPointerMove={onMove}
      onPointerLeave={() => setPointer(null)}
      aria-labelledby="maco-identity-heading"
    >
      <p className="sr-only">
        MaCo in many scripts: {items.map((i) => i.lang).join(", ")}; plus Latin-script languages
        (English, Spanish, French, German, Italian, Portuguese) where the brand remains MaCo. One
        brand name across writing systems — not translations.
      </p>

      <div className="shell py-20 lg:py-28">
        <p className="label">Global identity / 01</p>
        <h2 id="maco-identity-heading" className="display-lg mt-6 max-w-3xl">
          One name.
          <br />
          <span style={{ color: "var(--muted)" }}>Many scripts.</span>
        </h2>

        <div
          data-maco-script-field
          className="relative mt-14 min-h-[24rem] md:min-h-[30rem] lg:min-h-[36rem]"
          style={{ fontFamily: "var(--font-script-fallback)" }}
        >
          {items.map((item, i) => {
            const travelPx = travel * item.dir * SPEED[item.layer] * 1;
            const ix = item.x + (CENTER[0] - item.x) * converge;
            const iy = item.y + (CENTER[1] - item.y) * converge;
            const baseOpacity = appear * (1 - dominate * 0.85) * (0.45 + item.layer * 0.18);
            const scale = 1 - dominate * 0.22;

            const isActiveMatch =
              cycleActive && !centerLatin && (item.text === centerText || item.lang === centerLang);

            let prox = 0;
            if (pointer) {
              const field = sectionRef.current?.querySelector<HTMLElement>(
                "[data-maco-script-field]",
              );
              const fieldRect = field?.getBoundingClientRect();
              const fieldW = fieldRect?.width ?? sectionRef.current?.clientWidth ?? 1;
              const fieldH = fieldRect?.height ?? 1;
              const px = (ix / 100) * fieldW;
              const py = (iy / 100) * fieldH;
              const dx = pointer.x - px;
              const dy = pointer.y - py;
              const d = Math.sqrt(dx * dx + dy * dy);
              prox = Math.max(0, 1 - d / 170);
            }

            const hiddenOnMobile = i >= MOBILE_VISIBLE;
            const opacity = baseOpacity + prox * 0.3 + (isActiveMatch ? 0.35 : 0);
            const itemScale = scale + prox * 0.06 + (isActiveMatch ? 0.05 : 0);

            return (
              <span
                key={`${item.lang}-${item.text}`}
                aria-hidden="true"
                className={`absolute select-none whitespace-nowrap font-[family-name:var(--font-script-fallback)] transition-[opacity,transform] duration-500 ${
                  item.layer === 2
                    ? "text-lg sm:text-xl md:text-2xl"
                    : item.layer === 0
                      ? "text-xl sm:text-2xl md:text-3xl"
                      : "text-2xl sm:text-3xl md:text-4xl"
                } ${hiddenOnMobile ? "hidden sm:block" : ""}`}
                style={{
                  left: `${ix}%`,
                  top: `${iy}%`,
                  transform: `translate(-50%, -50%) translate3d(${travelPx}px, ${travelPx * 0.28}px, 0) scale(${itemScale})`,
                  opacity: isActiveMatch
                    ? Math.min(1, opacity)
                    : opacity * (cycleActive ? 0.72 : 1),
                  letterSpacing: prox > 0.3 || isActiveMatch ? "0.04em" : "0",
                  color: isActiveMatch ? "var(--text)" : "var(--muted)",
                  willChange: "transform, opacity",
                }}
              >
                {item.text}
              </span>
            );
          })}

          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div
              className="maco-center-identity flex flex-col items-center text-center"
              style={{
                transform: reduced ? undefined : `scale(${centerScale})`,
                letterSpacing: `${centerTrack}em`,
                transformOrigin: "center center",
              }}
            >
              <div
                className="flex min-h-[clamp(3.5rem,11vw,6.5rem)] w-full items-center justify-center overflow-hidden"
                aria-hidden="true"
              >
                <p className="w-full text-center font-bold leading-none tracking-[-0.045em] text-[clamp(3rem,10vw,7rem)]">
                  <CenterScriptTransition text={centerText} latin={centerLatin} />
                </p>
              </div>
              <p
                className="mt-4 font-mono text-[0.625rem] tracking-[0.22em] uppercase text-muted"
                style={{ opacity: legendOpacity }}
                aria-hidden="true"
              >
                One name · Many scripts
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
