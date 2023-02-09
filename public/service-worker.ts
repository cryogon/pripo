importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

// self.addEventListener("install", (event: any) => {
//   console.log("Service worker installed");
//   // event.waitUntil(async () => {
//   //   const cache = await caches.open("pwa-assets");
//   //   return cache.addAll(urlToCache);
//   // });
// });
// self.addEventListener("activate", (event) => {
//   console.log("Service worker activated");
// });

workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst()
);
