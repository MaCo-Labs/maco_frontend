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
  console.error(error);
  const router = useRouter();
  useEffect(() => {}, [error]);

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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MaCo — Software & IT solutions" },
      {
        name: "description",
        content:
          "MaCo builds and maintains software that carries operational weight: client platforms, web development, app development and long-term support.",
      },
      { name: "author", content: "MaCo" },
      { property: "og:title", content: "MaCo — Software & IT solutions" },
      {
        property: "og:description",
        content: "Software and IT solutions for products that need to work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&family=Jost:ital,wght@0,100..900;1,100..900&family=Agdasima:wght@400;700&family=Michroma&family=Tenor+Sans&family=Krona+One&display=swap",
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
            it's already run. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("maco-theme");if(t==="obsidian"||t==="cobalt"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}try{var lp=new URLSearchParams(window.location.search).get("layout");var l=(lp==="1"||lp==="2"||lp==="3")?lp:localStorage.getItem("maco-layout");if(l==="1"||l==="2"||l==="3"){document.documentElement.setAttribute("data-layout",l);}}catch(e){}try{var r=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;var s=sessionStorage.getItem("maco-preloaded");if(r||s){document.documentElement.setAttribute("data-preload","skip");}}catch(e){document.documentElement.setAttribute("data-preload","skip");}})();`,
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
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-4 focus:py-2"
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
