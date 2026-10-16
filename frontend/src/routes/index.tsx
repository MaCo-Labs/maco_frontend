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
      { title: "MaCo — Software & IT solutions for products that need to work" },
      {
        name: "description",
        content:
          "MaCo is a software and IT solutions company. Web and app development, technical and software support, Bridge, our connected workspace, and Driver's Diary for HeadGreen.",
      },
      { property: "og:title", content: "MaCo — Software & IT solutions" },
      {
        property: "og:description",
        content:
          "Client platforms, operational software and long-term support. Selected work: Ananta Nethralaya, Al Afzah, Soorath Autos, HeadGreen.",
      },
      { property: "og:url", content: SITE_URL },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
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
