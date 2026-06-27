const CACHE = 'presupuesto-v1';
const ASSETS = [
  '/Presupuesto/',
  '/Presupuesto/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
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
  // Firebase siempre online
  if (e.request.url.includes('firestore') || e.request.url.includes('firebase')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
