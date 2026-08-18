/**
 * Clears stale service workers / Workbox caches from other apps that
 * previously used localhost:5173 (they cause blank pages + main.jsx 404s).
 * Safe no-op when none exist.
 */
export function clearStaleServiceWorkers() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  void navigator.serviceWorker.getRegistrations().then((regs) => {
    for (const reg of regs) {
      void reg.unregister();
    }
  });

  if ("caches" in window) {
    void caches.keys().then((keys) => {
      for (const key of keys) {
        void caches.delete(key);
      }
    });
  }
}
