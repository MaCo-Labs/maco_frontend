import { useEffect, useState } from "react";
import { UPCOMING_SITES } from "@/lib/upcoming-sites";

/** One request per slug per page load, however many components ask. */
const checks = new Map<string, Promise<boolean>>();

function check(slug: string) {
  let pending = checks.get(slug);
  if (!pending) {
    pending = fetch(`/api/site-live?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? (r.json() as Promise<{ live: boolean }>) : { live: false }))
      .then((r) => r.live === true)
      .catch(() => false);
    checks.set(slug, pending);
  }
  return pending;
}

/** The site's URL once it has launched; undefined until then, or if it has none. */
export function useLiveSite(slug: string): string | undefined {
  const [live, setLive] = useState(false);
  const site = UPCOMING_SITES[slug];
  useEffect(() => {
    if (!site) return;
    let current = true;
    void check(slug).then((isLive) => {
      if (current) setLive(isLive);
    });
    return () => {
      current = false;
    };
  }, [slug, site]);
  return site && live ? site.url : undefined;
}
