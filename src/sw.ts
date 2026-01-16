/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("push", (event) => {
  if (!event.data) {
    console.log("Push event but no data");
    return;
  }

  const payload = event.data.json();

  const title = payload.title || "New Notification";
  const options: NotificationOptions = {
    body: payload.body,
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    data: { url: payload.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(self.clients.openWindow(targetUrl));
});
