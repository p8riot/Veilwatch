"use strict";

const CACHE_NAME = "veilwatch-0.5.0-release";
const LEGACY_TRACKER_CACHE_PREFIXES = [
    `${String.fromCharCode(112, 109, 115)}-tracker-`,
    `${String.fromCharCode(97, 115, 115)}-profiler-`
];

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
    "./assets/cards/paranormal-tracker.png",
    "./assets/cards/affixer-matrix.png",
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
    "./trackers/paranormal-tracker/Index.html",
    "./trackers/paranormal-tracker/manifest.webmanifest",
    "./trackers/paranormal-tracker/service-worker.js",
    "./trackers/paranormal-tracker/TOS_Cheat_Sheet_QB.png",
    "./trackers/paranormal-tracker/icons/paranormal-tracker-192.png",
    "./trackers/paranormal-tracker/icons/paranormal-tracker-512.png",
    "./trackers/paranormal-tracker/icons/apple-touch-icon.png",
    "./trackers/affixer-matrix/GOlvl1.png",
    "./trackers/affixer-matrix/GOlvl123.gif",
    "./trackers/affixer-matrix/GOlvl2.png",
    "./trackers/affixer-matrix/GOlvl3.1.png",
    "./trackers/affixer-matrix/GOlvl3.2.png",
    "./trackers/affixer-matrix/GOlvl3listo.png",
    "./trackers/affixer-matrix/UV_1.1.webp",
    "./trackers/affixer-matrix/UV_1.2.webp",
    "./trackers/affixer-matrix/UV_1.3.webp",
    "./trackers/affixer-matrix/UV_1.webp",
    "./trackers/affixer-matrix/UV_2.1.webp",
    "./trackers/affixer-matrix/UV_2.2.webp",
    "./trackers/affixer-matrix/UV_2.3.webp",
    "./trackers/affixer-matrix/UV_2.webp",
    "./trackers/affixer-matrix/UV_3.1.webp",
    "./trackers/affixer-matrix/UV_3.2.webp",
    "./trackers/affixer-matrix/UV_3.webp",
    "./trackers/affixer-matrix/Writing_1.1.webp",
    "./trackers/affixer-matrix/Writing_1.2.webp",
    "./trackers/affixer-matrix/Writing_1.webp",
    "./trackers/affixer-matrix/Writing_2.2.webp",
    "./trackers/affixer-matrix/Writing_2.3.webp",
    "./trackers/affixer-matrix/Writing_2.4.webp",
    "./trackers/affixer-matrix/Writing_2.webp",
    "./trackers/affixer-matrix/Writing_3.1.webp",
    "./trackers/affixer-matrix/Writing_3.webp",
    "./trackers/affixer-matrix/cleanse.html",
    "./trackers/affixer-matrix/icons/app-192.png",
    "./trackers/affixer-matrix/icons/app-512.png",
    "./trackers/affixer-matrix/icons/apple-touch-icon.png",
    "./trackers/affixer-matrix/manifest.webmanifest",
    "./trackers/affixer-matrix/service-worker.js"
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
                .filter((key) => {
                    const legacyTrackerCache = LEGACY_TRACKER_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix));
                    return (key.startsWith("tos-all-in-one-") || key.startsWith("veilwatch-") || legacyTrackerCache) && key !== CACHE_NAME;
                })
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
        const isParanormalTrackerNavigation = requestUrl.pathname.endsWith("/trackers/paranormal-tracker/Index.html") ||
            requestUrl.pathname.endsWith("/trackers/paranormal-tracker/");
        const isAffixerMatrixNavigation = requestUrl.pathname.endsWith("/trackers/affixer-matrix/cleanse.html") ||
            requestUrl.pathname.endsWith("/trackers/affixer-matrix/");
        let fallback = "./index.html";
        if (isParanormalTrackerNavigation) fallback = "./trackers/paranormal-tracker/Index.html";
        if (isAffixerMatrixNavigation) fallback = "./trackers/affixer-matrix/cleanse.html";

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
