const CACHE_NAME = "chitta-v1"
const STATIC_CACHE = "chitta-static-v1"
const DYNAMIC_CACHE = "chitta-dynamic-v1"

const STATIC_ASSETS = ["/", "/emotional-mapping", "/chat", "/interventions", "/insights", "/manifest.json"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Never cache or intervene on Next.js internal assets. Serving stale
  // `_next` chunks is a common cause of ChunkLoadError when the build
  // changes but the SW serves an old file. Let those requests go
  // directly to the network.
  if (event.request.url.includes("/_next/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If it's a navigation request and network fails, fallback to cached root
        if (event.request.mode === "navigate") {
          return caches.match("/")
        }
      }),
    )

    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/")
          }
        })
    }),
  )
})

// Background sync for data synchronization
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-emotional-data") {
    event.waitUntil(syncEmotionalData())
  }
})

async function syncEmotionalData() {
  try {
    // This would sync local data with server when online
    console.log("Syncing emotional data...")
    // Implementation would depend on backend API
  } catch (error) {
    console.error("Failed to sync data:", error)
  }
}
