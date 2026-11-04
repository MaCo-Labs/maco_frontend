import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";
import { TopHead } from "@/components/home/top-head";
import { Overview } from "@/components/home/overview";
import { FeatureAccordion } from "@/components/home/feature-accordion";
import { LogoReel } from "@/components/home/logo-reel";
import { FeaturedWork, ProductSummary } from "@/components/home/summary";
import { Identity } from "@/components/home/identity";
import { Faq } from "@/components/home/faq";
import { Outro } from "@/components/home/outro";
import { GroundHandoff } from "@/components/home/ground-handoff";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Software Company in Kochi, Kerala | Custom Software — MaCo" },
      {
        name: "description",
        content:
          "MaCo is a software company in Kochi, Kerala: custom software, CRM, task management, websites and e-commerce, for businesses in India and the Middle East.",
      },
      { property: "og:title", content: "Software Company in Kochi, Kerala | MaCo" },
      {
        property: "og:description",
        content:
          "Custom software, websites and long-term support. Work includes Ananta Nethralaya, Al Afzah, Soorath Autos and HeadGreen, plus our own product, Bridge.",
      },
      { property: "og:url", content: SITE_URL },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      // The hero's first screen, usually the page's LCP element.
      {
        rel: "preload",
        as: "image",
        href: "/media/work/ananta-nethralaya/1.webp",
        fetchPriority: "high",
      },
    ],
  }),
  component: Home,
});

/** Product-led opening, real client evidence and an interactive product tour. */
function Home() {
  return (
    <>
      <TopHead />

      <Overview />

      <FeatureAccordion />

      <LogoReel />

      <FeaturedWork />

      <ProductSummary />

      <Identity />

      <Faq />

      <Outro />

      <GroundHandoff />
    </>
  );
}
