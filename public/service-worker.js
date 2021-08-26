const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/db.js",
  "/index.js",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache";

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", function(event)  {
  if (
    event.request.url.includes("/api/")
  ) {
    event.respondWith(caches.open(RUNTIME_CACHE).then(cache => {
      return fetch(event.request).then(response => {
        if (response.status === 200) {
          cache.put(event.request.url, response.clone())
        }
      return response;
      }).catch(error => {
        console.log(cache)
        return cache.match(event.request)
      }); 
    }).catch(err => console.log(err)));
    return;
  }

  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response
        } else if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/")
        }
      })
    }) 
  );
});
