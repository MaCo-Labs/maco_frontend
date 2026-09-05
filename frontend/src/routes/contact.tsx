import { createFileRoute } from "@tanstack/react-router";
import { useState, type CSSProperties, type FormEvent } from "react";
import { site, services } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Stagger } from "@/components/motion/stagger";
import { useSectionHandoff } from "@/hooks/use-section-handoff";
import { PageOutro } from "@/components/inner/page-outro";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MaCo — Brief us on your project" },
      {
        name: "description",
        content:
          "Send MaCo the problem, the constraint and the deadline. We reply with scope. Email hello@maco.dev or use the enquiry form.",
      },
      { property: "og:title", content: "Contact — MaCo" },
      {
        property: "og:description",
        content: "Start a project with MaCo. Scope first, sales deck never.",
      },
    ],
  }),
  component: ContactPage,
});

const budgets = ["Under ₹1L", "₹1L – ₹5L", "₹5L – ₹15L", "₹15L+", "Not decided"];

const HANDOFF_PAIRS = [["Contact form", "More ways to reach us", "sheet"]] as const;

type State = "idle" | "sending" | "sent" | "error";

function ContactPage() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const api = import.meta.env["VITE_API_BASE_URL"];

    setState("sending");
    setError("");

    if (!api) {
      setState("error");
      setError("Contact isn't wired up in this environment — email us directly instead.");
      return;
    }

    const fd = new FormData(form);
    const str = (key: string) => (fd.get(key) as string | null)?.trim() ?? "";

    // service_interest is a SlugRelatedField server-side — omit it entirely
    // when nothing was chosen rather than sending "", which the API would
    // reject as an unknown slug.
    const serviceInterest = str("service_interest");
    const payload: Record<string, unknown> = {
      name: str("name"),
      email: str("email"),
      company: str("company"),
      phone: str("phone"),
      budget_range: str("budget_range"),
      message: str("message"),
      // FormData reports a checked checkbox as "on", not a boolean — the API
      // needs a real boolean.
      consent: fd.get("consent") === "on",
      source: "website",
      // Honeypot — real visitors never see or fill this field.
      website: str("website"),
    };
    if (serviceInterest) payload["service_interest"] = serviceInterest;

    try {
      const res = await fetch(`${api}/api/v1/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const detail =
          body && typeof body === "object"
            ? Object.values(body as Record<string, unknown>)
                .flat()
                .join(" ")
            : "";
        throw new Error(detail || `Request failed (${res.status})`);
      }
      form.reset();
      setState("sent");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  useSectionHandoff(HANDOFF_PAIRS);

  const field =
    "w-full border-b border-line bg-transparent py-3 text-base outline-none transition-colors placeholder:text-muted focus:border-text";
  const select = `${field} appearance-none pr-6`;

  return (
    <>
      <section data-ground="paper" aria-label="Introduction" className="rule-b">
        <div className="shell grid gap-8 page-intro lg:grid-cols-12">
          <p className="label lg:col-span-3">Index / Contact</p>
          <div className="lg:col-span-9">
            <LineReveal as="h1" className="display-lg max-w-3xl">
              Tell us what has to work.
            </LineReveal>
            <p className="mt-8 max-w-xl text-muted">
              The useful brief is three lines: what breaks today, what it must do instead, and when.
              Everything else we can figure out together.
            </p>
          </div>
        </div>
      </section>

      <section data-ground="paper" aria-label="Contact form">
        <div className="shell grid gap-14 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="lg:col-span-4">
            <p className="label">Direct</p>
            <a
              href={`mailto:${site.contact_email}`}
              className="link-draw mt-4 block font-display text-2xl tracking-[-0.03em]"
            >
              {site.contact_email}
            </a>
            <p className="mt-8 label">Call</p>
            <ul className="mt-3 space-y-1.5">
              {site.phones.map((p) => (
                <li key={p.label}>
                  <a
                    href={`tel:${p.number.replace(/[^+\d]/g, "")}`}
                    className="link-draw text-muted hover:text-text"
                  >
                    {p.number}
                  </a>{" "}
                  <span className="text-muted">— {p.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 label">Based in</p>
            <p className="mt-3 text-muted">{site.location}</p>
            <p className="mt-8 label">Response</p>
            <p className="mt-3 max-w-xs text-muted">
              Enquiries are read by the people who would do the work. Expect a reply within two
              working days.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="relative lg:col-span-7 lg:col-start-6"
            noValidate={false}
          >
            {state === "sent" ? (
              <div
                className="border border-line px-8 py-12"
                style={{ background: "var(--surface)" }}
              >
                <p className="label" style={{ color: "var(--accent)" }}>
                  Received
                </p>
                <p className="display-md mt-4 max-w-md">
                  We'll reply to your email within two working days.
                </p>
                <p className="mt-4 text-muted">
                  Something else on your mind meanwhile?{" "}
                  <a href={`mailto:${site.contact_email}`} className="link-draw text-text">
                    Email us directly
                  </a>
                  .
                </p>
                <Magnetic className="mt-8 inline-block">
                  <button type="button" onClick={() => setState("idle")} className="btn-line">
                    Send another enquiry
                  </button>
                </Magnetic>
              </div>
            ) : (
              <fieldset disabled={state === "sending"} className="contents">
                <Stagger as="div" className="grid gap-8 sm:grid-cols-2" gap={0.1} band={0.35}>
                  <label className="stagger-item group block" style={{ "--i": 0 } as CSSProperties}>
                    <span className="label transition-colors group-focus-within:text-text">
                      Name *
                    </span>
                    <input
                      required
                      name="name"
                      autoComplete="name"
                      className={field}
                      placeholder="Your name"
                    />
                  </label>
                  <label className="stagger-item group block" style={{ "--i": 1 } as CSSProperties}>
                    <span className="label transition-colors group-focus-within:text-text">
                      Email *
                    </span>
                    <input
                      required
                      type="email"
                      name="email"
                      autoComplete="email"
                      className={field}
                      placeholder="you@company.com"
                    />
                  </label>
                  <label className="stagger-item group block" style={{ "--i": 2 } as CSSProperties}>
                    <span className="label transition-colors group-focus-within:text-text">
                      Company
                    </span>
                    <input
                      name="company"
                      autoComplete="organization"
                      className={field}
                      placeholder="Organisation"
                    />
                  </label>
                  <label className="stagger-item group block" style={{ "--i": 3 } as CSSProperties}>
                    <span className="label transition-colors group-focus-within:text-text">
                      Phone
                    </span>
                    <input name="phone" autoComplete="tel" className={field} placeholder="+91" />
                  </label>
                  <label className="stagger-item group block" style={{ "--i": 4 } as CSSProperties}>
                    <span className="label transition-colors group-focus-within:text-text">
                      Service interest
                    </span>
                    <span className="relative block">
                      <select
                        name="service_interest"
                        className={select}
                        style={{ color: "var(--text)" }}
                        defaultValue=""
                      >
                        <option value="" style={{ background: "var(--surface)" }}>
                          Select
                        </option>
                        {services.map((s) => (
                          <option
                            key={s.slug}
                            value={s.slug}
                            style={{ background: "var(--surface)" }}
                          >
                            {s.title}
                          </option>
                        ))}
                      </select>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted"
                      >
                        ▾
                      </span>
                    </span>
                  </label>
                  <label className="stagger-item group block" style={{ "--i": 5 } as CSSProperties}>
                    <span className="label transition-colors group-focus-within:text-text">
                      Budget range
                    </span>
                    <span className="relative block">
                      <select
                        name="budget_range"
                        className={select}
                        style={{ color: "var(--text)" }}
                        defaultValue=""
                      >
                        <option value="" style={{ background: "var(--surface)" }}>
                          Select
                        </option>
                        {budgets.map((b) => (
                          <option key={b} value={b} style={{ background: "var(--surface)" }}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted"
                      >
                        ▾
                      </span>
                    </span>
                  </label>
                </Stagger>

                <label className="group mt-8 block">
                  <span className="label transition-colors group-focus-within:text-text">
                    Message *
                  </span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className={`${field} resize-none`}
                    placeholder="What breaks today, what it must do instead, and by when."
                  />
                </label>

                <label className="mt-8 flex items-start gap-3 text-sm text-muted">
                  <input
                    required
                    type="checkbox"
                    name="consent"
                    className="mt-1 accent-[var(--accent)]"
                  />
                  <span>
                    I consent to MaCo storing these details in order to respond to this enquiry.
                  </span>
                </label>

                {/* Honeypot — hidden from sighted users and screen readers; bots that
                autofill every field trip it, and the API marks that submission spam. */}
                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
                >
                  <label>
                    Leave this field empty
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <Magnetic>
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="btn-solid disabled:opacity-50"
                    >
                      {state === "sending" ? "Sending…" : "Send enquiry"}
                      <span aria-hidden="true">→</span>
                    </button>
                  </Magnetic>

                  <p aria-live="polite" className="label">
                    {state === "error" && (
                      <span style={{ color: "var(--accent)" }}>
                        Couldn't send: {error}. Email {site.contact_email} instead.
                      </span>
                    )}
                  </p>
                </div>
              </fieldset>
            )}
          </form>
        </div>
      </section>

      <PageOutro
        ariaLabel="More ways to reach us"
        eyebrow="Not ready yet"
        heading="See what shipped before you brief us."
        body="Every claim on this site traces to a real, live project. Read the case studies first if that's useful."
        cta={{ label: "See the case studies", to: "/work" }}
      />
    </>
  );
}
