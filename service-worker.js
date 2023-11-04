const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

const cacheOnly = async (request) => {
  // リクエストとマッチするキャッシュがあるかを確認する。
  const responseFromCache = await caches.match(request);

  if (responseFromCache) {
    // キャッシュからレスポンスを返す
    return responseFromCache;
  } else {
    // エラーレスポンスを返す
    return new Response("Not match in caches", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

// Service Workerがアクティベートされるときに呼ばれるイベント
// インストール後に呼ばれる
self.addEventListener("activate", (event) => {
  console.log("activate");
});

// Service Workerがインストールされるときに呼ばれるイベント
self.addEventListener("install", (event) => {
  console.log("install");
  event.waitUntil(
    addResourcesToCache([
      "./",
      "./index.html",
      "./app.js",
      "./images/spring.jpg",
      "./images/summer.jpg",
    ])
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheOnly(event.request));
});
