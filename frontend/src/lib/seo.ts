/** Canonical production origin — single source for canonical links, OG/Twitter
 *  URLs and JSON-LD @id values, so the host is never re-typed (or mistyped)
 *  per route. www is the preferred host: http/apex/non-www already 301 to it
 *  at the edge (verified against production), so this just has to match. */
export const SITE_URL = "https://www.maco.codes";

export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/** @id anchors for the JSON-LD entity graph (__root.tsx) — referenced by
 *  page-level Service/SoftwareApplication/BreadcrumbList blocks via
 *  `provider`/`publisher` so every page ties back to the same Organization
 *  instead of restating it. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export interface Crumb {
  name: string;
  path: string;
}

/** BreadcrumbList JSON-LD for a page — real site hierarchy only, never
 *  invented. Pass the page's ancestors including itself. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** A case study as a schema.org CreativeWork made by MaCo. */
export function caseStudyJsonLd(p: {
  title: string;
  description: string;
  path: string;
  image?: string | undefined;
  sector: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${p.title} case study`,
    description: p.description,
    url: absoluteUrl(p.path),
    about: p.sector,
    creator: { "@id": ORGANIZATION_ID },
    ...(p.image ? { image: absoluteUrl(p.image) } : {}),
  };
}

/** og:image and twitter:image together, for pages with their own real picture. */
export function socialImage(path: string | undefined) {
  if (!path) return [];
  const url = absoluteUrl(path);
  return [
    { property: "og:image", content: url },
    { name: "twitter:image", content: url },
  ];
}
