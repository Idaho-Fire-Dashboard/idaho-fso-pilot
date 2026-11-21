/* Idaho FSO Resource Coordination - home-screen app helper.
   Pages: always fetched fresh from the network (no stale versions); the last
   copy is kept only so the app can still open with no signal.
   Data from other sites (Apps Script, NWS, maps) is never cached here. */
var CACHE = 'fso-app-v1';
var OFFLINE = '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title>'
  + '<body style="margin:0;font:16px system-ui,sans-serif;background:#0f1d2e;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:24px">'
  + '<div><h1 style="font-size:20px">No connection</h1><p>Idaho FSO has not been opened on this device with a connection yet. Connect and try again.</p></div>';
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(['manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png']); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('fso-app-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.indexOf(new URL('./', location).pathname) !== 0) return;
  if (r.mode === 'navigate') {
    var key = new URL('./', location).href;
    e.respondWith(fetch(r, { cache: 'no-cache' }).then(function (res) {
      if (res.ok && u.pathname === new URL(key).pathname) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(key, cp); }); }
      return res;
    }).catch(function () {
      return caches.match(key).then(function (m) { return m || new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }); });
    }));
    return;
  }
  if (/\/(icons\/|manifest\.webmanifest)/.test(u.pathname)) {
    e.respondWith(caches.match(r).then(function (m) {
      var net = fetch(r).then(function (res) { if (res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); } return res; });
      return m || net;
    }));
  }
});
