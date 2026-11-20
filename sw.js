const CACHE = 'treino-v20';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'manifest.json', 'icon.svg'];

// Pede sempre ao servidor se o arquivo mudou. Sem isso, o celular reaproveita a versão
// antiga por até 10 minutos (cache do GitHub Pages).
const fresh = req => req.mode === 'navigate'
  ? new Request(req.url, { cache: 'no-cache' })
  : new Request(req, { cache: 'no-cache' });

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'no-cache' })))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Rede primeiro, cache como reserva: atualizações chegam e o app funciona offline na academia.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // Vídeos não entram no cache do app: são grandes e usam requisições parciais.
  if (e.request.headers.has('range') || e.request.destination === 'video' || e.request.url.includes('/videos/')) return;
  e.respondWith(
    fetch(fresh(e.request))
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request))
  );
});
