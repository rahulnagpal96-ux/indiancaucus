/* Indian Caucus service worker — offline shell + installability + web push */
const CACHE = 'ic-cache-v1'
const PRECACHE = [
  '/offline.html',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/android-chrome-192.png',
  '/logo.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  // Never cache API calls — always hit the network for live data (payments, etc.)
  if (url.pathname.startsWith('/api/')) return

  // Page navigations: network-first, fall back to a cached offline page.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline.html')))
    return
  }

  // Static assets: serve from cache, refresh in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((resp) => {
          if (resp && resp.status === 200 && resp.type === 'basic') {
            const copy = resp.clone()
            caches.open(CACHE).then((c) => c.put(request, copy))
          }
          return resp
        })
        .catch(() => cached)
      return cached || network
    })
  )
})

/* ── Web Push ── */
self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data ? event.data.json() : {} } catch (e) { data = { body: event.data && event.data.text() } }
  const title = data.title || 'Indian Caucus'
  const options = {
    body: data.body || '',
    icon: '/android-chrome-192.png',
    badge: '/favicon-32x32.png',
    data: { url: data.url || '/dashboard' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/dashboard'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(target) && 'focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow(target)
    })
  )
})
