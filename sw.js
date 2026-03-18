const CACHE_NAME = 'koyomi-muji-v2';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon-192.PNG',
  './icon-512.PNG',
  'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/openseadragon.min.js'
];

// インストール時にファイルをキャッシュ
self.addEventListener('install', function(event) {

  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// 追加：新しいバージョンになったら、古いキャッシュを削除
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // 現在の CACHE_NAME（v2）以外の古いキャッシュを見つけたら消す
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除しました:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// ネットワークリクエストの処理（キャッシュがあればそれを返す）
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // キャッシュから返す
        }
        return fetch(event.request); // ネットワークから取得
      })
  );
});
