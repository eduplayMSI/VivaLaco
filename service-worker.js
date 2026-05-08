const CACHE_NAME = 'viva-laco-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/saudacoes.js',
  './js/app.js',
  './js/db.js',
  './js/accessibility.js',
  './js/voice.js',
  './js/agora.js',
  './js/media-utils.js',
  './js/rotina.js',
  './js/familia.js',
  './js/historia.js',
  './js/confuso.js',
  './js/cuidador.js',
  './manifest.json',
  'assets/icons/icon-72x72.png',
  'assets/icons/icon-96x96.png',
  'assets/icons/icon-128x128.png',
  'assets/icons/icon-144x144.png',
  'assets/icons/icon-152x152.png',
  'assets/icons/icon-192x192.png',
  'assets/icons/icon-384x384.png',
  'assets/icons/icon-512x512.png',
  '/assets/icons/microfone.png',
  '/assets/wallpaper-normal.jpg',
  '/assets/wallpaper-highcontrast.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});