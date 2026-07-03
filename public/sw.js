// ─── SERVICE WORKER ───────────────────────────────────────────────────────────
// Archivo: public/sw.js
// Cache-first para assets, Network-first para datos de Supabase
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_NAME = 'alabanza-pwa-v1';
const DATA_CACHE = 'alabanza-data-v1';

// Assets que se cachean al instalar
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── Install: pre-cachear assets estáticos ────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Algunos assets no se pudieron cachear:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: limpiar caches viejos ──────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando...');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== DATA_CACHE)
          .map((k) => {
            console.log('[SW] Borrando cache viejo:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: estrategia híbrida ─────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar chrome-extension y no-GET
  if (!request.url.startsWith('http') || request.method !== 'GET') return;

  // ── Supabase API → Network-first, fallback a caché ──────────────────────
  if (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.io')) {
    event.respondWith(networkFirstWithCache(request, DATA_CACHE));
    return;
  }

  // ── YouTube embeds → Network only (no cachear) ───────────────────────────
  if (url.hostname.includes('youtube.com') || url.hostname.includes('ytimg.com')) {
    event.respondWith(fetch(request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // ── Assets estáticos → Cache-first ───────────────────────────────────────
  event.respondWith(cacheFirstWithNetwork(request, CACHE_NAME));
});

// Cache-first: sirve desde caché, va a red si no está
async function cacheFirstWithNetwork(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok && response.status < 400) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Si falla la red y no hay caché, devolver offline page
    const offlinePage = await cache.match('/index.html');
    return offlinePage || new Response('Sin conexión', { status: 503 });
  }
}

// Network-first: intenta red, si falla usa caché
async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request.clone());
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Sin conexión', offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ── Background Sync: procesar cola offline cuando vuelve la red ──────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-changes') {
    console.log('[SW] Background sync iniciado');
    event.waitUntil(notifyClientsToFlush());
  }
});

async function notifyClientsToFlush() {
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach((client) => client.postMessage({ type: 'FLUSH_QUEUE' }));
}

// ── Push notifications (preparado para futuro) ───────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Alabanza PWA', {
      body: data.body || 'Tienes cambios pendientes',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      data: data.url || '/',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

// ── Mensaje desde la app ──────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'GET_VERSION') {
    event.source.postMessage({ type: 'VERSION', version: CACHE_NAME });
  }
});
