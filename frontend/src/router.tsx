import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Lenis owns scroll position (real window.scrollTo, see
    // scroll-runtime-provider.tsx's route-change reset) — leaving this on
    // meant TanStack Router's own window.scrollTo call and Lenis's reset
    // were two owners of the same value racing on every navigation.
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
