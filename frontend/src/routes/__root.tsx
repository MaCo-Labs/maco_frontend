import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/components/theme";
import { LayoutProvider } from "@/components/layout-mode";
import { Header, Footer } from "@/components/chrome";
import { EdgeNav } from "@/components/nav/edge-nav";
import { Cursor } from "@/components/motion/cursor";
import { Preloader } from "@/components/preloader";
import { ScrollRuntimeProvider } from "@/components/scroll-runtime-provider";
import { skipToMain } from "@/lib/skip-to-main";
import { site } from "@/content/maco";

function NotFoundComponent() {
  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <p className="label">Error / 404</p>
      <h1 className="display-hero mt-6">404</h1>
      <p className="mt-6 max-w-md text-muted">
        This route is not part of the MaCo system. It may have moved, or it never existed.
      </p>
      <div className="mt-10">
        <Link to="/" className="btn-line">
          Back to index <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <p className="label">Error / Runtime</p>
      <h1 className="display-lg mt-6 max-w-2xl">This page didn't load.</h1>
      <p className="mt-6 max-w-md text-muted">
        Something failed on our side. Try again, or go back to the index.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="btn-solid"
        >
          Try again
        </button>
        <a href="/" className="btn-line">
          Index
        </a>
      </div>
    </div>
  );
}

const SITE_TITLE = "MaCo — Software & IT solutions";
const SITE_DESCRIPTION =
  "MaCo builds and maintains software that carries operational weight: client platforms, web development, app development and long-term support.";
// Interim social-share image: the Bridge capture poster (1280x660, see
// scripts/build-media.mjs) — not a purpose-built 1200x630 card. Flagged in
// PROJECT_STATUS.md as a follow-up once real OG art exists. No canonical/
// og:url/sitemap.xml yet either — no production domain exists to anchor
// them to, and a wrong canonical is worse than none (see PROJECT_STATUS.md).
const OG_IMAGE = { url: "/media/bridge/poster.jpg", width: 1280, height: 660 };

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: "MaCo" },
      { name: "theme-color", content: "#fafafa" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: site.tagline },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: site.name },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: OG_IMAGE.url },
      { property: "og:image:width", content: String(OG_IMAGE.width) },
      { property: "og:image:height", content: String(OG_IMAGE.height) },
      { property: "og:image:alt", content: SITE_TITLE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: site.tagline },
      { name: "twitter:image", content: OG_IMAGE.url },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          description: site.statement,
          email: site.contact_email,
          telephone: site.phones[0]?.number,
          address: { "@type": "PostalAddress", addressLocality: site.location },
        },
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        // Obsidian only — the default theme for a first-time visitor.
        // Cobalt's set (Michroma/Tenor Sans/Krona One) loads on demand:
        // synchronously from the pre-paint script below for a returning
        // Cobalt visitor, or from ThemeProvider.setTheme() (lib/fonts.ts)
        // on an in-session switch. Loading both sets here unconditionally
        // meant one was always wasted, render-blocking bytes.
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&family=Jost:ital,wght@0,100..900;1,100..900&family=Agdasima:wght@400;700&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="obsidian" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Runs before paint — reads the stored theme so Cobalt users never
            see an Obsidian flash before hydration corrects it. Also stamps
            the stored (or `?layout=` preview-overridden) layout mode, so a
            layout-2/3 visitor never sees a layout-1 chrome flash either —
            same anti-FOUC shape as theme, see layout-mode.tsx.
            Last, decides whether the preloader should skip itself (reduced
            motion, or already shown once this session) — matchMedia only,
            not the full ?motion= override resolver (lib/motion.ts): the
            asymmetric risk of the two ways this heuristic can be wrong
            favors the simpler check. Worst case with matchMedia-only is the
            loader silently not showing when the full resolver would have
            allowed it — the page just loads instantly, which is harmless.
            The other direction (animating for someone who explicitly wants
            reduced motion) is the one that actually matters, and matchMedia
            alone already catches it. If sessionStorage itself is blocked,
            skip outright rather than risk a loader that can never confirm
            it's already run.
            The same block also injects Cobalt's font stylesheet — a
            hardcoded copy of lib/fonts.ts's COBALT_FONTS_HREF/id, since an
            inline bootstrap script can't import a module — the instant a
            stored Cobalt theme is found, so the font request starts before
            first paint instead of after hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("maco-theme");if(t==="obsidian"||t==="cobalt"){document.documentElement.setAttribute("data-theme",t);}if(t==="cobalt"&&!document.getElementById("maco-cobalt-fonts")){var f=document.createElement("link");f.id="maco-cobalt-fonts";f.rel="stylesheet";f.href="https://fonts.googleapis.com/css2?family=Michroma&family=Tenor+Sans&family=Krona+One&display=swap";document.head.appendChild(f);}}catch(e){}try{var lp=new URLSearchParams(window.location.search).get("layout");var l=(lp==="1"||lp==="2"||lp==="3")?lp:localStorage.getItem("maco-layout");if(l==="1"||l==="2"||l==="3"){document.documentElement.setAttribute("data-layout",l);}}catch(e){}try{var r=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;var s=sessionStorage.getItem("maco-preloaded");if(r||s){document.documentElement.setAttribute("data-preload","skip");}}catch(e){document.documentElement.setAttribute("data-preload","skip");}})();`,
          }}
        />
        {/* Runs before hydration — kills hijacking Workbox SWs from other localhost:5173 apps */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(!('serviceWorker'in navigator))return;navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister()});});if('caches'in window){caches.keys().then(function(k){k.forEach(function(n){caches.delete(n)});});}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        {/* Runs after body content parses, before hydration — same anti-FOUC
            family as the theme/layout/preload script above, but this one
            needs the page's own `[data-ground]` sections to already exist in
            the DOM, so it has to sit after `{children}`, not in `<head>`.
            chrome.tsx's <Header> ships `data-over="paper"` as its static JSX
            default and only corrects it once its ScrollTrigger ticker comes
            online (an async scroll-runtime import + a gsap.ticker frame) —
            confirmed live as a ~600ms flash to paper-toned chrome on every
            reload that lands on a `deep`-ground hero, since a hard reload
            skips the preloader that would otherwise have covered it. This
            samples the same y-coordinates chrome.tsx's own `applyGround`
            does (lib/ground.ts's `groundAt`, inlined here since a bootstrap
            script can't import a module) so first paint already shows the
            correct chrome tone; the React ticker takes over immediately
            after mount and keeps it live from there. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var els=document.querySelectorAll('section[data-ground],footer[data-ground]');function groundAt(y){for(var i=0;i<els.length;i++){var r=els[i].getBoundingClientRect();if(r.top<=y&&r.bottom>=y){var g=els[i].getAttribute('data-ground');if(g==='deep'||g==='paper')return g;}}return 'paper';}var top=groundAt(48);var mid=groundAt(window.innerHeight/2);var header=document.querySelector('header.chrome-adaptive');var pill=document.querySelector('[data-mobile-pill-nav]');var trig=document.querySelector('[data-nav-trigger-overlay]');var edge=document.querySelector('[data-edge-nav]');if(header)header.setAttribute('data-over',top);if(pill)pill.setAttribute('data-over',top);if(trig)trig.setAttribute('data-over',top);if(edge)edge.setAttribute('data-over',mid);document.documentElement.setAttribute('data-ground-now',mid);}catch(e){}})();`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // Dynamic import keeps this client-only
    void import("@/lib/clear-service-workers").then((m) => m.clearStaleServiceWorkers());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LayoutProvider>
          <ScrollRuntimeProvider />
          <Preloader />
          <a
            href="#main"
            onClick={skipToMain}
            // z-[48]: above the layout-nav trigger overlay (z-[47], chrome.tsx)
            // — that overlay paints opaque in layout mode 2 across exactly
            // where this focus state lands (top-left), so anything lower
            // renders the focused link invisible behind it.
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[48] focus:bg-surface focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <Cursor />
          <Header />
          <EdgeNav />
          <main id="main">
            <Outlet />
          </main>
          <Footer />
        </LayoutProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
