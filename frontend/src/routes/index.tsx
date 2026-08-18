import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero";
import { CapabilityStatement } from "@/components/sections/capability-statement";
import { SignatureSystemSection } from "@/components/signature-system-section";
import { WorkStrip } from "@/components/sections/work-strip";
import { ProductsSection } from "@/components/sections/products-section";
import { MultilingualIdentity } from "@/components/multilingual-identity";
import { ServiceVocabulary } from "@/components/sections/service-vocabulary";
import { ClientsTicker } from "@/components/sections/clients-ticker";
import { ProcessSticky } from "@/components/sections/process-sticky";
import { CTABanner } from "@/components/sections/cta-banner";

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
      {/* 00 — Hero: The Monument */}
      <Hero />

      {/* 01 — Capability Statement */}
      <CapabilityStatement />

      {/* 02 — Signature System with Living SystemField */}
      <SignatureSystemSection />

      {/* 03 — Selected Work Cinema Rail */}
      <WorkStrip />

      {/* 04 — Products & Platforms (Bridge Flagship & Driver's Diary) */}
      <ProductsSection />

      {/* 05 — Multilingual Identity Hive */}
      <MultilingualIdentity />

      {/* 06 — Services Capability Vocabulary Console */}
      <ServiceVocabulary />

      {/* 07 — Client Partnerships Marquee */}
      <ClientsTicker />

      {/* 08 — Delivery Methodology (A→B→C→D) */}
      <ProcessSticky />

      {/* 09 — Final Closing Statement & CTA */}
      <CTABanner />
    </>
  );
}
