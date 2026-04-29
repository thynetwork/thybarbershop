/* ============================================================
   ThyBarberShop service worker
   - Pre-caches the app shell.
   - Network-first for HTML, cache-first for static assets and
     fonts/images, stale-while-revalidate for QR + profile photos.
   - Offline fallback: /offline (calendar/clients/upcoming work
     because they were network-fetched while online).
   - Push notifications for booking events.
   ============================================================ */

const VERSION = 'tbs-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;
const IMAGE_CACHE = `${VERSION}-images`;
const HTML_CACHE  = `${VERSION}-html`;

const SHELL_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS).catch(() => undefined))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

function isHTMLRequest(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

function isFontOrAsset(url) {
  return /\/_next\/static\//.test(url) || /fonts\.gstatic\.com/.test(url) || /fonts\.googleapis\.com/.test(url);
}

function isImage(url) {
  return /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(url) || /\/icons\//.test(url) || /barber-qr-codes/.test(url);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // HTML — network-first, fall back to cache, then offline page.
  if (isHTMLRequest(request)) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(HTML_CACHE);
          cache.put(request, fresh.clone()).catch(() => undefined);
          return fresh;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match('/offline');
          if (offline) return offline;
          return new Response('You are offline · reconnect to continue', {
            status: 503, headers: { 'Content-Type': 'text/plain' },
          });
        }
      })()
    );
    return;
  }

  // Static JS/CSS/fonts — cache-first.
  if (isFontOrAsset(url.href)) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((res) => {
        const copy = res.clone();
        caches.open(ASSET_CACHE).then((c) => c.put(request, copy)).catch(() => undefined);
        return res;
      }).catch(() => caches.match(request)))
    );
    return;
  }

  // Images (icons, profile photos, QR codes) — stale-while-revalidate.
  if (isImage(url.href)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(IMAGE_CACHE);
        const cached = await cache.match(request);
        const networkPromise = fetch(request).then((res) => {
          if (res.ok) cache.put(request, res.clone()).catch(() => undefined);
          return res;
        }).catch(() => cached);
        return cached || networkPromise;
      })()
    );
    return;
  }

  // Default: try network, fall back to cache.
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

/* ── Push notifications ─────────────────────────────────────── */

const NOTIF_DEFAULTS = {
  icon: '/icons/icon-192.png',
  badge: '/icons/favicon-32.png',
  vibrate: [120, 60, 120],
};

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); } catch { payload = { title: 'ThyBarberShop', body: event.data.text() }; }
  const title = payload.title || 'ThyBarberShop';
  const options = {
    ...NOTIF_DEFAULTS,
    body: payload.body || '',
    tag: payload.tag,
    data: { url: payload.url || '/', ...payload.data },
    actions: payload.actions,
    requireInteraction: payload.requireInteraction || false,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data && event.notification.data.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      const open = clientsArr.find((c) => c.url.includes(target));
      if (open) return open.focus();
      return self.clients.openWindow(target);
    })
  );
});
