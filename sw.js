/* Gence Saha Raporu - offline önbellek
   Strateji: önbellekten aç, arka planda güncelle (stale-while-revalidate).
   Uygulama sinyalsiz yerde de anında açılır; internet varken sessizce
   yeni sürümü indirir ve bir sonraki açılışta onu kullanır. */

const CACHE = "gence-saha-raporu";
const DOSYALAR = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(DOSYALAR))
      .catch(() => null)          // bir dosya eksikse kurulum yine de tamamlansın
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  if (new URL(r.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const kayitli = await cache.match(r, { ignoreSearch: true });

      const agdan = fetch(r).then(cevap => {
        if (cevap && cevap.status === 200 && cevap.type === "basic") {
          cache.put(r, cevap.clone());
        }
        return cevap;
      }).catch(() => null);

      if (kayitli) return kayitli;                    // offline: anında aç

      const taze = await agdan;
      if (taze) return taze;

      // ne önbellekte ne ağda: gezinme isteğini ana sayfaya düşür
      if (r.mode === "navigate") {
        const ana = await cache.match("./index.html");
        if (ana) return ana;
      }
      return new Response("Çevrimdışı ve önbellekte kayıt yok.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    })
  );
});
