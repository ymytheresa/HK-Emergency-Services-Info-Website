// Service Worker for Hong Kong Emergency Services Guide
// Provides offline functionality for emergency situations

const CACHE_NAME = 'hk-emergency-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/styles.css',
  '/assets/app.js',
  '/assets/data.js',
  '/assets/lang.js',
  '/assets/site-config.js',
  '/assets/icon.png',
  '/hospitals/queen-mary-hospital.html',
  '/hospitals/gleneagles-hospital.html',
  // Add key hospital pages for offline access
  'https://fonts.googleapis.com/css2?family=Noto+Sans+HK:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});