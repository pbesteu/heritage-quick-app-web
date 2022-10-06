

const cacheName = 'heritage_in_v03';

const cachedFiles = [
  '/public/images/background.jpg',
  '/public/images/logo.png',
  '/public/images/placeholder.jpg'
];


self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching content');
    await cache.addAll(cachedFiles);
  })());
});


self.addEventListener('fetch', (e) => {
  // Check if this is a navigation request
  if (e.request.mode === 'navigate') {
    // Open the cache
    e.respondWith(caches.open(cacheName).then((cache) => {
      // Go to the network first
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      return fetch(e.request.url).then((fetchedResponse) => {
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, fetchedResponse.clone());
        return fetchedResponse;
      }).catch(() => {
        // If the network is unavailable, get from the cache
        return cache.match(e.request.url);
      });
    }));
  } else {
    return;
  }
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }));
  }));
});