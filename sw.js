const VERSION = 'v2.0.0';
const VENDOR = 'vendor-v2';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/apple-touch-icon.png',
  'js/ui.js', 'js/image.js', 'js/av.js', 'js/docs.js', 'js/imgfx.js', 'js/ai.js', 'js/midi-core.js', 'js/stems.js',
  'js/views/convert.js', 'js/views/image.js', 'js/views/audio.js', 'js/views/midi.js', 'js/views/md.js', 'js/views/settings.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('shell-' + VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => (k.startsWith('shell-') && k !== 'shell-' + VERSION) || (k.startsWith('vendor-') && k !== VENDOR)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // AI models & runtimes from CDNs: keep a copy so they work offline after first use
  if (/(^|\.)staticimgly\.com$|^cdn\.jsdelivr\.net$/.test(url.hostname)) {
    e.respondWith(caches.open('ai-models-v1').then(async (c) => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      if (res.ok) c.put(e.request, res.clone());
      return res;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  if (url.pathname.includes('/vendor/')) {
    // Engines: cache-first, saved the first time they're used, then work offline.
    e.respondWith(caches.open(VENDOR).then(async (c) => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      if (res.ok) c.put(e.request, res.clone());
      return res;
    }));
    return;
  }
  // App shell: network first so updates show up, cached copy when offline.
  e.respondWith(fetch(e.request).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open('shell-' + VERSION).then((c) => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))));
});
