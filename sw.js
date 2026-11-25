// オフラインでも開けるようにするための仕組み。
// ネットにつながっているときは常に最新版を取りに行き、つながらないときは保存しておいた版を使う。
const CACHE = 'houshu-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/bunny-192.png',
  './icons/bunny-512.png',
  './icons/bunny-180.png',
  './icons/bunny-32.png'
];

self.addEventListener('install', e => {
  // 一時保存された古いファイルではなく、必ずサーバーから最新を取ってくる
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // 画面（HTML）はブラウザの一時保存を使わず、毎回サーバーに新しい版がないか確かめる
  const isPage = req.mode === 'navigate' || req.destination === 'document';
  e.respondWith(
    (isPage ? fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : fetch(req))
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
