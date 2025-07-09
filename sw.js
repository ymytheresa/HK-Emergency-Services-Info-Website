// Service Worker for Hong Kong Emergency Services Guide
// Provides offline functionality for emergency situations

const CACHE_NAME = 'hk-emergency-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/styles.css',
  '/assets/icon.png',
  '/manifest.json',
  '/hospitals/queen-mary-hospital.html',
  '/hospitals/gleneagles-hospital.html',
  '/hospitals/princess-margaret-hospital.html',
  '/hospitals/union-hospital.html',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+HK:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Cache files individually to avoid failures if some don't exist
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.log('Failed to cache:', url, err);
            });
          })
        );
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        // Only fetch if it's a valid HTTP/HTTPS request
        if (event.request.url.startsWith('http')) {
          return fetch(event.request).catch(() => {
            // Return a basic response for failed fetches
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
        }
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