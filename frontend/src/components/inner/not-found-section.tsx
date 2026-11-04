import { Link } from "@tanstack/react-router";
import { CommandHint } from "@/components/command-menu";
import { ParticleMark } from "@/components/inner/particle-mark";

/**
 * Route-local 404 for a $slug detail page (services/products/work). Without
 * a route's own notFoundComponent, TanStack Router's not-found boundary
 * bubbles to __root.tsx's — which caps head-tag computation at the root
 * match (load-matches.js's headMaxIndex), so the route's own head() (its
 * "X not found" title + noindex meta) never runs and a bad slug silently
 * renders the *site's* title/OG on what is still correctly a 404 status.
 * Giving each dynamic route this component keeps the not-found boundary
 * local, so its head() actually executes.
 *
 * Also the root 404's body, so both share the particle mark.
 */
export function NotFoundSection({
  label,
  backTo,
  backLabel,
  message = "This page doesn't exist. It may have moved, or it never existed.",
}: {
  label: string;
  backTo: string;
  backLabel: string;
  message?: string;
}) {
  return (
    <section data-ground="deep" aria-label="Page not found">
      <div className="shell grid min-h-[80vh] items-center gap-12 py-32 lg:grid-cols-2">
        <div>
          <p className="label">Error / 404</p>
          <h1 className="display-hero mt-6">{label}</h1>
          <p className="mt-6 max-w-md text-muted">{message}</p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link to={backTo} className="btn-line">
              {backLabel} <span aria-hidden="true">→</span>
            </Link>
            <CommandHint />
          </div>
        </div>
        <ParticleMark className="h-56 lg:h-[26rem]" />
      </div>
    </section>
  );
}
