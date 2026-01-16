/// <reference lib="webworker" />

// Extend self so Workbox can inject the precache manifest
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
};

import { precacheAndRoute } from "workbox-precaching";

// REQUIRED for `strategies: "injectManifest"`
precacheAndRoute(self.__WB_MANIFEST);

// --- PUSH HANDLER WITH STRONG LOGGING / FALLBACKS ---

self.addEventListener("push", (event) => {
  console.log("[sw] push event received", event);

  event.waitUntil(
    (async () => {
      try {
        if (!event.data) {
          console.log("[sw] push event but no data");
        }

        // Log raw text to avoid JSON issues
        const raw = event.data ? event.data.text() : "";
        console.log("[sw] raw push data:", raw);

        let payload: any = {};
        if (raw) {
          try {
            payload = JSON.parse(raw);
          } catch (err) {
            console.error("[sw] failed to parse JSON, using raw as body", err);
            payload = { title: "Push (raw)", body: raw };
          }
        }

        const title = payload.title || "New Notification";
        const options: NotificationOptions = {
          body: payload.body ?? "",
          icon: "/pwa-192x192.png",
          badge: "/pwa-192x192.png",
          data: { url: payload.url || "/" },
        };

        console.log("[sw] showing notification:", { title, options });

        await self.registration.showNotification(title, options);
        console.log("[sw] notification shown");
      } catch (err) {
        console.error("[sw] error in push handler:", err);
      }
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("[sw] notificationclick", event);
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(self.clients.openWindow(targetUrl));
});
