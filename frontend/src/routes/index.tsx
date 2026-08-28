import { createFileRoute } from "@tanstack/react-router";
import { TopHead } from "@/components/home/top-head";
import { EvidenceExpand } from "@/components/home/evidence-expand";
import { Overview } from "@/components/home/overview";
import { FeatureAccordion } from "@/components/home/feature-accordion";
import { LogoReel } from "@/components/home/logo-reel";
import { FeaturedWork, ProductSummary } from "@/components/home/summary";
import { Identity } from "@/components/home/identity";
import { Record } from "@/components/home/record";
import { Faq } from "@/components/home/faq";
import { Outro } from "@/components/home/outro";
import { GroundHandoff } from "@/components/home/ground-handoff";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MaCo — Software & IT solutions for products that need to work" },
      {
        name: "description",
        content:
          "MaCo is a software and IT solutions company. Web and app development, technical and software support, plus our own products: Driver's Diary and Bridge.",
      },
      { property: "og:title", content: "MaCo — Software & IT solutions" },
      {
        property: "og:description",
        content:
          "Client platforms, operational software and long-term support. Selected work: Ananta Nethralaya, Al Afzah, Soorath Autos, HeadGreen.",
      },
    ],
  }),
  component: Home,
});

/**
 * Twelve-slot Cuberto-parity structure (docs/REFACTOR_PLAN.md §12, plan
 * "Cuberto-parity homepage rebuild", 2026-08-28). Section order, spacing
 * rhythm and ground alternation are cloned from cuberto.com's own
 * homepage (measured in docs/references/cuberto/skillui/); every colour,
 * typeface and word is MaCo's. The eleven aria-labels are unchanged from
 * the previous architecture — only which component renders each one, and
 * in what order — so scripts/shoot.mjs needed reordering, not renaming.
 */
function Home() {
  return (
    <>
      {/* 1. TOPHEAD — headline, subtext, entry action */}
      <TopHead />

      {/* 2. PREVIEW — showreel, unchanged from the prior architecture */}
      <EvidenceExpand />

      {/* 3. OVERVIEW — positioning + counted figures */}
      <Overview />

      {/* 4. FEATURE — every capability, one accordion */}
      <FeatureAccordion />

      {/* 5. LOGOREEL — client logos, continuous drift */}
      <LogoReel />

      {/* 6. SUMMARY (inverse) — featured client work */}
      <FeaturedWork />

      {/* 7. SUMMARY — MaCo's own products */}
      <ProductSummary />

      {/* 8. OVERVIEW (2nd) — identity, now on paper ground */}
      <Identity />

      {/* 9. SUMMARY (inverse) — clients + company record, now deep ground */}
      <Record />

      {/* 10. FAQ (inverse) — the four-step method, as an accordion */}
      <Faq />

      {/* 11. OUTRO — final statement + intake */}
      <Outro />

      {/* Cross-section continuity — renders nothing itself */}
      <GroundHandoff />
    </>
  );
}
