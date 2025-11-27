// Service Worker for KanataAnime - Optimized Caching Strategy
const CACHE_VERSION = 'v1.1.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// Cache limits and expiration times
const CACHE_LIMITS = {
  api: 100,        // Max API responses to cache
  images: 200,     // Max images to cache
  runtime: 50,     // Max runtime resources
};

const CACHE_EXPIRY = {
  api: 24 * 60 * 60 * 1000,      // 24 hours for API
  images: 30 * 24 * 60 * 60 * 1000,  // 30 days for images
  static: 7 * 24 * 60 * 60 * 1000,   // 7 days for static assets
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll([
        '/',
        '/manifest.json',
      ]);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete old versions of caches
            return cacheName.startsWith('static-') ||
                   cacheName.startsWith('api-') ||
                   cacheName.startsWith('images-') ||
                   cacheName.startsWith('runtime-');
          })
          .filter((cacheName) => {
            // Keep current version caches
            return cacheName !== STATIC_CACHE &&
                   cacheName !== API_CACHE &&
                   cacheName !== IMAGE_CACHE &&
                   cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Check if cache entry is expired
function isExpired(response, maxAge) {
  if (!response) return true;

  const cachedTime = response.headers.get('sw-cached-time');
  if (!cachedTime) return true;

  const age = Date.now() - parseInt(cachedTime, 10);
  return age > maxAge;
}

// Helper: Add timestamp to cached response
function addTimestamp(response) {
  const clonedResponse = response.clone();
  const headers = new Headers(clonedResponse.headers);
  headers.set('sw-cached-time', Date.now().toString());

  return clonedResponse.blob().then((body) => {
    return new Response(body, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers: headers,
    });
  });
}

// Helper: Limit cache size
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    // Delete oldest entries (first in = first out)
    const deleteCount = keys.length - maxItems;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Strategy 1: Cache First for images and fonts
  if (
    /\.(png|jpg|jpeg|svg|gif|webp|avif|ico|woff|woff2|ttf|eot)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        if (cachedResponse && !isExpired(cachedResponse, CACHE_EXPIRY.images)) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = await addTimestamp(networkResponse);
            cache.put(request, responseToCache);
            limitCacheSize(IMAGE_CACHE, CACHE_LIMITS.images);
          }
          return networkResponse;
        } catch (error) {
          // Return cached version even if expired when offline
          if (cachedResponse) return cachedResponse;
          throw error;
        }
      })
    );
    return;
  }

  // Strategy 2: Cache First for JS and CSS bundles (with version check)
  if (/\.(js|css)$/i.test(url.pathname) && url.origin === location.origin) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        if (cachedResponse && !isExpired(cachedResponse, CACHE_EXPIRY.static)) {
          // Fetch in background to update cache
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              addTimestamp(networkResponse).then((response) => {
                cache.put(request, response);
              });
            }
          }).catch(() => {});

          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = await addTimestamp(networkResponse);
            cache.put(request, responseToCache);
          }
          return networkResponse;
        } catch (error) {
          if (cachedResponse) return cachedResponse;
          throw error;
        }
      })
    );
    return;
  }

  // Strategy 3: Network First for API calls (with expiry check)
  if (
    url.hostname === 'backend.ryzumi.vip' ||
    url.hostname === 'www.sankavollerei.com' ||
    url.pathname.includes('/api/')
  ) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        try {
          const networkResponse = await fetch(request, {
            // Add timeout for API requests
            signal: AbortSignal.timeout(15000)
          });

          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = await addTimestamp(networkResponse);
            cache.put(request, responseToCache);
            limitCacheSize(API_CACHE, CACHE_LIMITS.api);
          }
          return networkResponse;
        } catch (error) {
          console.log('[SW] Network request failed, trying cache:', url.href);
          const cachedResponse = await cache.match(request);

          // Return cached response even if expired when offline
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', url.href);
            return cachedResponse;
          }

          throw error;
        }
      })
    );
    return;
  }

  // Strategy 4: Network First for navigation requests (HTML pages)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/');
      })
    );
    return;
  }

  // Strategy 5: Runtime cache for everything else
  event.respondWith(
    caches.open(RUNTIME_CACHE).then(async (cache) => {
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = await addTimestamp(networkResponse);
          cache.put(request, responseToCache);
          limitCacheSize(RUNTIME_CACHE, CACHE_LIMITS.runtime);
        }
        return networkResponse;
      } catch (error) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;
        throw error;
      }
    })
  );
});

// Message event - handle cache clearing and updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[SW] Service Worker loaded successfully');
