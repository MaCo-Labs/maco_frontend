import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { site, services } from "@/content/maco";

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
    const data = Object.fromEntries(new FormData(form).entries());
    const api = import.meta.env["VITE_API_BASE_URL"];

    setState("sending");
    setError("");

    // Posts to the Django endpoint (POST /api/v1/contact/) when configured.
    if (!api) {
      setState("sent");
      return;
    }

    try {
      const res = await fetch(`${api}/api/v1/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "website" }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
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
            <h1 className="display-lg max-w-3xl">Tell us what has to work.</h1>
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

          <form onSubmit={onSubmit} className="lg:col-span-7 lg:col-start-6" noValidate={false}>
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

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                type="submit"
                disabled={state === "sending"}
                className="btn-solid disabled:opacity-50"
              >
                {state === "sending" ? "Sending…" : "Send enquiry"}
                <span aria-hidden="true">→</span>
              </button>

              <p
                aria-live="polite"
                className="font-mono text-[0.6875rem] uppercase tracking-[0.18em]"
              >
                {state === "sent" && (
                  <span style={{ color: "var(--accent)" }}>
                    Received — we'll reply to your email.
                  </span>
                )}
                {state === "error" && <span className="text-muted">Couldn't send: {error}</span>}
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
