import { createFileRoute } from "@tanstack/react-router";
import { siteIsLive, UPCOMING_SITES } from "@/lib/upcoming-sites";

/**
 * Has an upcoming client site launched? Checked on the server, since a browser
 * can't read another domain's page, and only ever for the fixed list in
 * UPCOMING_SITES. Cached at the CDN, so visitors never wait on the other site.
 */
export const Route = createFileRoute("/api/site-live")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const slug = new URL(request.url).searchParams.get("slug") ?? "";
        const site = Object.hasOwn(UPCOMING_SITES, slug) ? UPCOMING_SITES[slug] : undefined;
        const live = site ? await siteIsLive(site) : false;
        return Response.json(
          { live },
          {
            headers: {
              "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
            },
          },
        );
      },
    },
  },
});
