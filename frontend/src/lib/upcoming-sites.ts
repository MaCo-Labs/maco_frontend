/**
 * Client sites MaCo has built that aren't live yet, by project/client slug. The
 * marker is text only the real site contains, so a parked or holding page on
 * the same domain doesn't count as launched.
 */
export const UPCOMING_SITES: Record<string, { url: string; marker: string }> = {
  ozone: { url: "https://www.ozonefitout.com/", marker: "ozone fitout" },
};

/** True only if the site answers on its own domain with its own content. */
export async function siteIsLive(
  site: { url: string; marker: string },
  timeoutMs = 4000,
): Promise<boolean> {
  try {
    const response = await fetch(site.url, {
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return false;
    if (new URL(response.url).hostname !== new URL(site.url).hostname) return false;
    return (await response.text()).toLowerCase().includes(site.marker);
  } catch {
    return false;
  }
}
