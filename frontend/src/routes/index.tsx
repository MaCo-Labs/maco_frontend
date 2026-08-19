import { createFileRoute } from "@tanstack/react-router";
import { OpenLogo } from "@/components/home/open-logo";
import { WorkingSurface } from "@/components/home/working-surface";
import { EvidenceExpand } from "@/components/home/evidence-expand";
import { PortfolioGrid } from "@/components/home/portfolio-grid";
import { ServicesConvergence } from "@/components/home/services-convergence";
import { ProductStory } from "@/components/home/product-story";
import { Identity } from "@/components/home/identity";
import { MethodLine } from "@/components/home/method-line";
import { Record } from "@/components/home/record";
import { CloseIntake } from "@/components/home/close-intake";
import { GroundHandoff } from "@/components/home/ground-handoff";
import { ScrollThread } from "@/components/home/scroll-thread";

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

function Home() {
  return (
    <>
      {/* OPEN — the brand alone: mark + "MaCo" */}
      <OpenLogo />

      {/* SURFACE — the promise, the proof row, Bridge in motion (merges the old hero + CLAIM) */}
      <WorkingSurface />

      {/* EVIDENCE — cinematic scroll-expand, Bridge in motion */}
      <EvidenceExpand />

      {/* WORK, CAPABILITY, PRODUCTS share one drawn thread (ScrollThread) —
          the wrapper carries no transform of its own, so it's safe as an
          ancestor of CAPABILITY's pin. */}
      <div className="relative">
        {/* WORK — four real client projects, as a two-column grid */}
        <PortfolioGrid />

        {/* CAPABILITY — services convergence */}
        <ServicesConvergence />

        {/* PRODUCTS — Bridge + Driver's Diary */}
        <ProductStory />

        <ScrollThread />
      </div>

      {/* IDENTITY — one name, many scripts */}
      <Identity />

      {/* METHOD — A→B→C→D, launch is not the finish line */}
      <MethodLine />

      {/* RECORD — clients + company, deliberate rest */}
      <Record />

      {/* CLOSE — intake + final statement */}
      <CloseIntake />

      {/* Cross-section continuity — renders nothing itself */}
      <GroundHandoff />
    </>
  );
}
