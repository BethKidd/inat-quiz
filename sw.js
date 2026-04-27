const CACHE = 'inat-quiz-v4';
const ASSETS = ['/inat-quiz/index.html', '/inat-quiz/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for API calls, cache first for app shell
  if (e.request.url.includes('api.inaturalist.org') ||
      e.request.url.includes('openai.com') ||
      e.request.url.includes('wikipedia.org')) {
    return; // Let API calls go straight to network
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
