"use strict";

const CACHE_NAME = "veilwatch-0.4.0-release";
const APP_SHELL = [
    "./",
    "./index.html",
    "./app-config.js",
    "./css/styles.css",
    "./js/storage.js",
    "./js/notes.js",
    "./js/backup.js",
    "./js/tracker-host.js",
    "./js/knowledge-data.js",
    "./js/search.js",
    "./js/app.js",
    "./manifest.webmanifest",
    "./assets/the-other-side-home.png",
    "./assets/cards/pms-tracker.png",
    "./assets/cards/ass-profiler.png",
    "./assets/cards/encyclopedia.png",
    "./assets/utility/field-tools.png",
    "./assets/utility/reference.png",
    "./assets/utility/search.png",
    "./assets/utility/notes.png",
    "./assets/utility/maps.png",
    "./assets/utility/settings.png",
    "./assets/utility/wiki.png",
    "./assets/icons/app-192.png",
    "./assets/icons/app-512.png",
    "./assets/icons/apple-touch-icon.png",
    "./trackers/pms/Index.html",
    "./trackers/pms/manifest.webmanifest",
    "./trackers/pms/service-worker.js",
    "./trackers/pms/TOS_Cheat_Sheet_QB.png",
    "./trackers/pms/icons/pms-192.png",
    "./trackers/pms/icons/pms-512.png",
    "./trackers/pms/icons/apple-touch-icon.png",
    "./trackers/ass/GOlvl1.png",
    "./trackers/ass/GOlvl123.gif",
    "./trackers/ass/GOlvl2.png",
    "./trackers/ass/GOlvl3.1.png",
    "./trackers/ass/GOlvl3.2.png",
    "./trackers/ass/GOlvl3listo.png",
    "./trackers/ass/UV_1.1.webp",
    "./trackers/ass/UV_1.2.webp",
    "./trackers/ass/UV_1.3.webp",
    "./trackers/ass/UV_1.webp",
    "./trackers/ass/UV_2.1.webp",
    "./trackers/ass/UV_2.2.webp",
    "./trackers/ass/UV_2.3.webp",
    "./trackers/ass/UV_2.webp",
    "./trackers/ass/UV_3.1.webp",
    "./trackers/ass/UV_3.2.webp",
    "./trackers/ass/UV_3.webp",
    "./trackers/ass/Writing_1.1.webp",
    "./trackers/ass/Writing_1.2.webp",
    "./trackers/ass/Writing_1.webp",
    "./trackers/ass/Writing_2.2.webp",
    "./trackers/ass/Writing_2.3.webp",
    "./trackers/ass/Writing_2.4.webp",
    "./trackers/ass/Writing_2.webp",
    "./trackers/ass/Writing_3.1.webp",
    "./trackers/ass/Writing_3.webp",
    "./trackers/ass/cleanse.html",
    "./trackers/ass/icons/app-192.png",
    "./trackers/ass/icons/app-512.png",
    "./trackers/ass/icons/apple-touch-icon.png",
    "./trackers/ass/manifest.webmanifest",
    "./trackers/ass/service-worker.js"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys
                .filter((key) => (key.startsWith("tos-all-in-one-") || key.startsWith("veilwatch-")) && key !== CACHE_NAME)
                .map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    if (event.request.mode === "navigate") {
        const isPmsNavigation = requestUrl.pathname.endsWith("/trackers/pms/Index.html") ||
            requestUrl.pathname.endsWith("/trackers/pms/");
        const isAssNavigation = requestUrl.pathname.endsWith("/trackers/ass/cleanse.html") ||
            requestUrl.pathname.endsWith("/trackers/ass/");
        let fallback = "./index.html";
        if (isPmsNavigation) fallback = "./trackers/pms/Index.html";
        if (isAssNavigation) fallback = "./trackers/ass/cleanse.html";

        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request).then((cached) => cached || caches.match(fallback)))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) {
                return cached;
            }

            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return response;
                }

                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                return response;
            });
        })
    );
});
