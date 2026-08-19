import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { site, services } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";

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

  const field =
    "w-full border-b border-line bg-transparent py-3 text-base outline-none transition-colors placeholder:text-muted focus:border-text";

  return (
    <>
      <section className="rule-b">
        <div className="shell grid gap-8 py-16 lg:grid-cols-12 lg:py-24">
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

      <section>
        <div className="shell grid gap-14 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="lg:col-span-4">
            <p className="label">Direct</p>
            <a
              href={`mailto:${site.contact_email}`}
              className="link-draw mt-4 block font-display text-2xl tracking-[-0.03em]"
            >
              {site.contact_email}
            </a>
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
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="label">Name *</span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  className={field}
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="label">Email *</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  className={field}
                  placeholder="you@company.com"
                />
              </label>
              <label className="block">
                <span className="label">Company</span>
                <input
                  name="company"
                  autoComplete="organization"
                  className={field}
                  placeholder="Organisation"
                />
              </label>
              <label className="block">
                <span className="label">Phone</span>
                <input name="phone" autoComplete="tel" className={field} placeholder="+91" />
              </label>
              <label className="block">
                <span className="label">Service interest</span>
                <select
                  name="service_interest"
                  className={field}
                  style={{ color: "var(--text)" }}
                  defaultValue=""
                >
                  <option value="" style={{ background: "var(--surface)" }}>
                    Select
                  </option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug} style={{ background: "var(--surface)" }}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="label">Budget range</span>
                <select
                  name="budget_range"
                  className={field}
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
              </label>
            </div>

            <label className="mt-8 block">
              <span className="label">Message *</span>
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
                {state === "sent" && (
                  <span style={{ color: "var(--accent)" }}>
                    Received — we'll reply to your email.
                  </span>
                )}
                {state === "error" && (
                  <span className="text-muted">
                    Couldn't send: {error}. Email {site.contact_email} instead.
                  </span>
                )}
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
