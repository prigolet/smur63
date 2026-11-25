/* Service worker de l'aide-mémoire SMUR 63, version 2.12 (empreinte 4dedca2996). Tout le site est mis en cache à l'installation ;
   les pages se servent d'abord depuis le cache (hors ligne) puis se mettent à jour en arrière-plan ; aucun rechargement forcé. */
var CACHE = "smur63-2.12-4dedca2996";
var FICHIERS = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-512-maskable.png", "./icons/apple-touch-icon.png"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FICHIERS); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  var req = e.request; if (req.method !== "GET") return;
  var url = new URL(req.url);
  var police = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== self.location.origin && !police) return;
  var cle = req.mode === "navigate" ? "./index.html" : req;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(cle).then(function (enCache) {
      var reseau = fetch(req).then(function (rep) { if (rep && (rep.ok || rep.type === "opaque")) c.put(cle, rep.clone()); return rep; }).catch(function () { return enCache; });
      return enCache || reseau;
    });
  }));
});
