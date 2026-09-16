import { Link } from "@tanstack/react-router";

/**
 * Route-local 404 for a $slug detail page (services/products/work). Without
 * a route's own notFoundComponent, TanStack Router's not-found boundary
 * bubbles to __root.tsx's — which caps head-tag computation at the root
 * match (load-matches.js's headMaxIndex), so the route's own head() (its
 * "X not found" title + noindex meta) never runs and a bad slug silently
 * renders the *site's* title/OG on what is still correctly a 404 status.
 * Giving each dynamic route this component keeps the not-found boundary
 * local, so its head() actually executes.
 */
export function NotFoundSection({
  label,
  backTo,
  backLabel,
}: {
  label: string;
  backTo: string;
  backLabel: string;
}) {
  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <p className="label">Error / 404</p>
      <h1 className="display-hero mt-6">{label}</h1>
      <p className="mt-6 max-w-md text-muted">
        This page doesn't exist. It may have moved, or it never existed.
      </p>
      <div className="mt-10">
        <Link to={backTo} className="btn-line">
          {backLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
