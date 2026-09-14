/**
 * The four stops of MaCo's "Signal Rail" wayfinding system (item 6):
 * Scope (home / the problem) -> Model (services/capabilities) -> Build
 * (work, clients, products) -> Hand over (contact/support). Shared between
 * the desktop rail (`components/nav/signal-rail.tsx`) and the mobile pill
 * nav's phase dots (`chrome.tsx`) so the two can never disagree about which
 * stop a route belongs to.
 *
 * Not every route maps to a stop — `/about` is deliberately outside this
 * four-stop journey (the brief's own phase list names only Home, Services,
 * Work/Clients/Products and Contact), so `getActiveSignalStop` returns
 * `null` there and every dot renders unlit rather than a wrong guess.
 */
export const SIGNAL_RAIL_STOPS = [
  { id: "scope", label: "Scope", to: "/", prefixes: ["/"] as const },
  { id: "model", label: "Model", to: "/services", prefixes: ["/services"] as const },
  {
    id: "build",
    label: "Build",
    to: "/work",
    prefixes: ["/work", "/clients", "/products"] as const,
  },
  { id: "handover", label: "Hand over", to: "/contact", prefixes: ["/contact"] as const },
] as const;

export type SignalRailStop = (typeof SIGNAL_RAIL_STOPS)[number];

function matches(pathname: string, prefix: string): boolean {
  if (prefix === "/") return pathname === "/";
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

export function getActiveSignalStop(pathname: string): SignalRailStop["id"] | null {
  for (const stop of SIGNAL_RAIL_STOPS) {
    if (stop.prefixes.some((p) => matches(pathname, p))) return stop.id;
  }
  return null;
}
