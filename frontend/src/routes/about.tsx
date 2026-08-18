import { createFileRoute, Link } from "@tanstack/react-router";
import { site, process, services } from "@/content/maco";
import { SystemField } from "@/components/mark";
import { GlobeSection } from "@/components/globe-section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MaCo — How we build and maintain software" },
      {
        name: "description",
        content:
          "MaCo is a software and IT solutions company based in Kochi, Kerala. How we scope, model, build and hand over software.",
      },
      { property: "og:title", content: "About — MaCo" },
      {
        property: "og:description",
        content:
          "A software and IT solutions company that treats maintenance as part of the product.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="rule-b">
        <div className="shell grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-8">
            <p className="label">Index / About</p>
            <h1 className="display-lg mt-6 max-w-3xl">
              A software company that stays{" "}
              <span style={{ color: "var(--muted)" }}>after the launch post.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-snug">{site.statement}</p>
            <p className="mt-5 max-w-2xl text-muted">
              We work across two sides of the same discipline: websites and platforms for clients,
              and products we own and operate ourselves. The second keeps the first honest — we run
              software in production, so we build for the version of it that exists two years from
              now.
            </p>
          </div>
          <div className="hidden lg:col-span-4 lg:block">
            <SystemField className="border-t border-l border-line" />
          </div>
        </div>
      </section>

      <section className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Method</p>
          <div
            className="grid gap-px lg:col-span-9 sm:grid-cols-2"
            style={{ background: "var(--line)" }}
          >
            {process.map((p) => (
              <div key={p.step} className="p-8" style={{ background: "var(--bg)" }}>
                <span className="font-display text-4xl" style={{ color: "var(--accent)" }}>
                  {p.step}
                </span>
                <h2 className="mt-5 font-display text-xl">{p.title}</h2>
                <p className="mt-3 text-sm text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rule-b">
        <div className="shell grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
          <p className="label lg:col-span-3">Principles</p>
          <ul className="lg:col-span-9">
            {[
              "Model the data before designing the screen.",
              "Ship an admin the client's own team can operate.",
              "No invented metrics, no invented clients, no invented testimonials.",
              "Small releases beat annual rewrites.",
              "Accessibility and reduced motion are requirements, not polish.",
            ].map((line, i) => (
              <li key={line} className="rule-t flex gap-6 py-5">
                <span className="label pt-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="max-w-2xl text-lg leading-snug">{line}</span>
              </li>
            ))}
            <li className="rule-t" />
          </ul>
        </div>
      </section>

      <section>
        <div className="shell grid gap-10 py-14 lg:grid-cols-12 lg:items-center lg:py-20">
          <div className="lg:col-span-5">
            <p className="label">Where we are</p>
            <p className="display-md mt-6">{site.location}</p>
            <p className="mt-6 max-w-xl text-muted">
              Working with clients in India and the Gulf across {services.length} service lines.
            </p>
            <Link to="/contact" className="btn-solid mt-8">
              Contact MaCo <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="lg:col-span-7">
            <GlobeSection
              label="Connected systems"
              description="An abstract view of linked systems and regions — visual context, not a map of offices or claimed reach."
            />
          </div>
        </div>
      </section>
    </>
  );
}
